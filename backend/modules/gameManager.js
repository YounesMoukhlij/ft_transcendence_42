// Game Manager for Remote 1v1 Ping Pong Games

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 12; // Increased from 8 for faster gameplay
const BALL_SPEED = 5; // Restored to original for faster, more exciting gameplay
const WINNING_SCORE = 5;

class GameManager {
  constructor(db, usersSocket) {
    this.db = db;
    this.usersSocket = usersSocket;
    this.matchmakingQueue = [];
    this.gameRooms = new Map();
    this.gameLoops = new Map();
    this.pendingInvitations = new Map(); // friendId -> { from: userId, roomCode: string }
    this.rematchRequests = new Map(); // roomCode -> { from: userId, to: userId }
    this.acceptedChallenges = new Map(); // challengeId -> { inviterId: userId, acceptorId: userId, inviterReady: false, acceptorReady: false }

    // Tournament management
    this.tournaments = new Map(); // tournamentId -> Tournament object
    this.tournamentJoinRequests = new Map(); // tournamentId -> Map<requestId, JoinRequest>
    this.tournamentInvites = new Map(); // userId -> Array<TournamentInvite>
    this.randomOpponentQueue = new Map(); // userId -> { tournamentId, playerInfo }
    this.creatingFinalMatch = new Set(); // tournamentId -> Set of tournamentIds currently creating final match (prevents race conditions)
    this.finalMatchReady = new Map(); // tournamentId -> Set<playerId> - tracks which players are ready for final match
    this.tournamentObservers = new Map(); // tournamentId -> Set<playerId> - eliminated hosts who can still watch
  }

  // Generate unique room code
  generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Initialize game state
  initializeGameState(player1, player2, tournamentContext = null) {
    const gameState = {
      player1: {
        id: player1.id,
        username: player1.username,
        avatar: player1.avatar || null,  // Include avatar in gameState for frontend syncing
        y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        score: 0,
        customization: player1.customization || {}
      },
      player2: {
        id: player2.id,
        username: player2.username,
        avatar: player2.avatar || null,  // Include avatar in gameState for frontend syncing
        y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        score: 0,
        customization: player2.customization || {}
      },
      ball: {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
        dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
        dy: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED
      }
    };

    // Add tournament context if provided (for tournament matches)
    if (tournamentContext) {
      gameState.tournamentId = tournamentContext.tournamentId;
      gameState.matchId = tournamentContext.matchId;
      gameState.round = tournamentContext.round;
      gameState.matchNumber = tournamentContext.matchNumber;
    }

    return gameState;
  }

  // Add player to matchmaking queue
  addToMatchmakingQueue(player) {
    // Check if player is already in queue
    const existingIndex = this.matchmakingQueue.findIndex(p => p.id === player.id);
    if (existingIndex !== -1) {
      return { error: 'Already in matchmaking queue' };
    }

    // Check if player is already in a game
    const existingRoom = this.findRoomByPlayer(player.id);
    if (existingRoom) {
      return { error: 'Already in a game' };
    }

    this.matchmakingQueue.push(player);

    // Try to match players
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift();
      const player2 = this.matchmakingQueue.shift();
      return this.createGameRoom(player1, player2);
    }

    return { status: 'searching' };
  }

  // Remove player from matchmaking queue
  removeFromMatchmakingQueue(playerId) {
    const index = this.matchmakingQueue.findIndex(p => p.id === playerId);
    if (index !== -1) {
      this.matchmakingQueue.splice(index, 1);
      return true;
    }
    return false;
  }

  // Create game room
  // GUARD: This function should not be called for finished tournament matches
  createGameRoom(player1, player2, tournamentContext = null) {
    // If this is a tournament match, verify it's not already finished
    if (tournamentContext) {
      const tournament = this.tournaments.get(tournamentContext.tournamentId);
      if (tournament && tournament.bracket) {
        const match = tournament.bracket.find(m => m.id === tournamentContext.matchId);
        if (match && match.status === 'finished') {
          console.error(`[createGameRoom] ERROR: Attempted to create room for finished match ${tournamentContext.matchId}`);
          throw new Error(`Cannot create room for finished match ${tournamentContext.matchId}`);
        }
      }
    }
    const roomCode = this.generateRoomCode();
    const gameState = this.initializeGameState(player1, player2, tournamentContext);

    // CRITICAL: Ensure we have the latest valid sockets from usersSocket map
    // This prevents stale sockets from being stored in the room
    const freshP1Socket = this.usersSocket.get(player1.id.toString());
    const freshP2Socket = this.usersSocket.get(player2.id.toString());

    // Use fresh socket if available and open, otherwise use provided socket
    const validP1Socket = (freshP1Socket && freshP1Socket.readyState === 1) ? freshP1Socket : player1.socket;
    const validP2Socket = (freshP2Socket && freshP2Socket.readyState === 1) ? freshP2Socket : player2.socket;

    // Validate both sockets before creating room
    if (!validP1Socket || validP1Socket.readyState !== 1) {
      console.error(`[createGameRoom] ERROR: Player1 (${player1.id}) socket is invalid:`, {
        hasSocket: !!validP1Socket,
        readyState: validP1Socket?.readyState,
        hasFreshSocket: !!freshP1Socket,
        freshReadyState: freshP1Socket?.readyState
      });
    }

    if (!validP2Socket || validP2Socket.readyState !== 1) {
      console.error(`[createGameRoom] ERROR: Player2 (${player2.id}) socket is invalid:`, {
        hasSocket: !!validP2Socket,
        readyState: validP2Socket?.readyState,
        hasFreshSocket: !!freshP2Socket,
        freshReadyState: freshP2Socket?.readyState
      });
    }

    const room = {
      id: roomCode,
      historySaved: false,
      historySavedAt: null,
      player1: {
        id: player1.id,
        username: player1.username,
        avatar: player1.avatar || null,  // Store avatar in room for reference
        socket: validP1Socket, // Use validated socket
        customization: player1.customization || {}
      },
      player2: {
        id: player2.id,
        username: player2.username,
        avatar: player2.avatar || null,  // Store avatar in room for reference
        socket: validP2Socket, // Use validated socket
        customization: player2.customization || {}
      },
      gameState,
      tournamentContext: tournamentContext || null, // Store tournament context in room
      lastUpdate: Date.now(),
      startTime: Date.now(), // Track when game started for duration calculation
      createdAt: Date.now(), // Track when room was created to prevent immediate disconnects
      paddleDirections: {
        player1: 'stop',
        player2: 'stop'
      },
      // Statistics tracking
      stats: {
        // Rally tracking (consecutive touches without scoring)
        currentRally: 0,
        longestRally: 0,
        totalRallies: [],
        totalTouches: 0,

        // Ball speed tracking
        maxBallSpeed: 0,

        // Player touches
        player1Touches: 0,
        player2Touches: 0,

        // Point streaks
        player1CurrentStreak: 0,
        player2CurrentStreak: 0,
        player1MaxStreak: 0,
        player2MaxStreak: 0,

        // Leading time tracking
        player1LeadingStart: null,
        player2LeadingStart: null,
        player1LeadingTime: 0,
        player2LeadingTime: 0,

        // Previous scores for detecting score changes
        previousPlayer1Score: 0,
        previousPlayer2Score: 0
      }
    };

    this.gameRooms.set(roomCode, room);
    this.startGameLoop(roomCode);

    // Notify both players using validated sockets
    const p1Notified = this.sendToPlayer(validP1Socket, {
      type: 'matchFound',
      payload: {
        roomCode,
        players: [
          { id: player1.id, username: player1.username },
          { id: player2.id, username: player2.username }
        ]
      }
    });

    const p2Notified = this.sendToPlayer(validP2Socket, {
      type: 'matchFound',
      payload: {
        roomCode,
        players: [
          { id: player1.id, username: player1.username },
          { id: player2.id, username: player2.username }
        ]
      }
    });

    if (!p1Notified || !p2Notified) {
      console.warn(`[createGameRoom] Failed to notify one or both players:`, {
        player1Notified: p1Notified,
        player2Notified: p2Notified,
        player1Id: player1.id,
        player2Id: player2.id,
        roomCode
      });
    }

    return { roomCode, gameState };
  }

  // Find room by player ID
  findRoomByPlayer(playerId) {
    const playerIdStr = String(playerId);
    for (const [roomCode, room] of this.gameRooms.entries()) {
      if (String(room.player1.id) === playerIdStr || String(room.player2.id) === playerIdStr) {
        return { roomCode, room };
      }
    }
    return null;
  }

  // Handle paddle movement
  handlePaddleMove(playerId, direction) {
    const found = this.findRoomByPlayer(playerId);
    if (!found) {

      console.warn(`[handlePaddleMove] Player ${playerId} not found in any room`);
      return;
    }

    const { room, roomCode } = found;
    const matchId = room.tournamentContext?.matchId;
    const isMatch1 = matchId === 1;
    const isMatch2 = matchId === 2;
    const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : null);

    // CRITICAL: Update paddle direction atomically to prevent race conditions
    // This ensures paddle direction is set before the next game loop iteration
    const playerIdStr = String(playerId);
    if (String(room.player1.id) === playerIdStr) {
      room.paddleDirections.player1 = direction;
      
    } else if (String(room.player2.id) === playerIdStr) {
      room.paddleDirections.player2 = direction;
      
    } else {
      console.warn(`[handlePaddleMove] Player ${playerId} not found in room ${roomCode}`);
    }
  }

  // Update paddle positions based on directions
  updatePaddles(room) {
    const { paddleDirections, gameState } = room;

    // Update player1 paddle
    if (paddleDirections.player1 === 'up') {
      gameState.player1.y = Math.max(0, gameState.player1.y - PADDLE_SPEED);
    } else if (paddleDirections.player1 === 'down') {
      gameState.player1.y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.player1.y + PADDLE_SPEED);
    }

    // Update player2 paddle
    if (paddleDirections.player2 === 'up') {
      gameState.player2.y = Math.max(0, gameState.player2.y - PADDLE_SPEED);
    } else if (paddleDirections.player2 === 'down') {
      gameState.player2.y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.player2.y + PADDLE_SPEED);
    }
  }

  // Update ball physics
  updateBall(gameState, room) {
    const { ball } = gameState;
    const stats = room.stats;

    // Calculate current ball speed (magnitude of velocity vector)
    // Speed in pixels per frame, convert to pixels per second (60 FPS)
    const speedPixelsPerFrame = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    const speedPixelsPerSecond = speedPixelsPerFrame * 60;

    // Convert to approximate m/s (assuming ~100 pixels = 1 meter for a ping pong table)
    // A standard ping pong table is ~2.74m x 1.525m, our game is 800x600 pixels
    // So approximately: 800 pixels ≈ 2.74m, therefore 1 pixel ≈ 0.003425m
    const pixelsToMeters = 0.003425;
    const speedMetersPerSecond = speedPixelsPerSecond * pixelsToMeters;

    if (speedMetersPerSecond > stats.maxBallSpeed) {
      stats.maxBallSpeed = speedMetersPerSecond;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > GAME_HEIGHT) {
      ball.dy = -ball.dy;
      ball.y = Math.max(BALL_RADIUS, Math.min(GAME_HEIGHT - BALL_RADIUS, ball.y));
    }

    // Paddle collision - Left paddle (player1)
    if (ball.x - BALL_RADIUS < 10 + PADDLE_WIDTH &&
        ball.x - BALL_RADIUS > 10 &&
        ball.y > gameState.player1.y &&
        ball.y < gameState.player1.y + PADDLE_HEIGHT) {
      ball.dx = -ball.dx * 1.02; // Speed increase
      ball.x = 10 + PADDLE_WIDTH + BALL_RADIUS;

      // Track touch and rally
      stats.player1Touches++;
      stats.currentRally++;
      stats.totalTouches++;
    }

    // Paddle collision - Right paddle (player2)
    if (ball.x + BALL_RADIUS > GAME_WIDTH - PADDLE_WIDTH - 10 &&
        ball.x + BALL_RADIUS < GAME_WIDTH - 10 &&
        ball.y > gameState.player2.y &&
        ball.y < gameState.player2.y + PADDLE_HEIGHT) {
      ball.dx = -ball.dx * 1.02; // Speed increase
      ball.x = GAME_WIDTH - PADDLE_WIDTH - 10 - BALL_RADIUS;

      // Track touch and rally
      stats.player2Touches++;
      stats.currentRally++;
      stats.totalTouches++;
    }

    // Scoring
    let ballReset = false;
    if (ball.x + BALL_RADIUS < 0) {
      // Ball passed left paddle - player2 scores
      gameState.player2.score++;
      ballReset = true;
    } else if (ball.x - BALL_RADIUS > GAME_WIDTH) {
      // Ball passed right paddle - player1 scores
      gameState.player1.score++;
      ballReset = true;
    }

    if (ballReset) {
      // End of rally - save rally length and reset
      if (stats.currentRally > 0) {
        stats.totalRallies.push(stats.currentRally);
        if (stats.currentRally > stats.longestRally) {
          stats.longestRally = stats.currentRally;
        }
        stats.currentRally = 0;
      }

      ball.x = GAME_WIDTH / 2;
      ball.y = GAME_HEIGHT / 2;
      ball.dx = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
      ball.dy = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
    }
  }

  // Check for winner
  checkWinner(gameState) {
    if (gameState.player1.score >= WINNING_SCORE) {
      return gameState.player1.username;
    } else if (gameState.player2.score >= WINNING_SCORE) {
      return gameState.player2.username;
    }
    return null;
  }

  // Start game loop for a room
  startGameLoop(roomCode) {
    const interval = setInterval(() => {
      try {
        const room = this.gameRooms.get(roomCode);
        if (!room) {
          clearInterval(interval);
          this.gameLoops.delete(roomCode);
          return;
        }

        // CRITICAL: Get fresh socket references to handle reconnections
        // Check usersSocket map for updated sockets before checking readyState
        const freshP1Socket = this.usersSocket.get(room.player1.id.toString());
        const freshP2Socket = this.usersSocket.get(room.player2.id.toString());

        // Update room sockets if we found fresher ones
        if (freshP1Socket && freshP1Socket.readyState === 1) {
          room.player1.socket = freshP1Socket;
        }
        if (freshP2Socket && freshP2Socket.readyState === 1) {
          room.player2.socket = freshP2Socket;
        }

        // Check if sockets are still connected (using updated references)
        // Handle null sockets (player left but guard blocked processing)
        const p1SocketValid = room.player1.socket && room.player1.socket.readyState === 1;
        const p2SocketValid = room.player2.socket && room.player2.socket.readyState === 1;

        // CRITICAL FIX: For tournament matches in MIN_ROOM_AGE period, skip disconnect check entirely
        // This prevents premature game termination during initial room setup
        let shouldCheckDisconnect = true;
        if (room.tournamentContext) {
          const roomAge = Date.now() - (room.gameStartedAt || room.createdAt || room.startTime || 0);
          const MIN_ROOM_AGE = 10000; // 10 seconds
          if (roomAge < MIN_ROOM_AGE) {
            shouldCheckDisconnect = false;
          }
        }

        if (shouldCheckDisconnect && (!p1SocketValid || !p2SocketValid)) {
          // One or both players disconnected - end game with quitter as loser
          clearInterval(interval);
          this.gameLoops.delete(roomCode);


          // Determine who quit and who won
          let winnerId, loserId, winnerUsername, loserUsername;
          let disconnectedPlayer = null;
          let connectedPlayer = null;

          if (!p1SocketValid) {
            // Player1 disconnected - Player2 wins
            disconnectedPlayer = room.player1;
            connectedPlayer = room.player2;
            winnerId = room.player2.id;
            loserId = room.player1.id;
            winnerUsername = room.player2.username;
            loserUsername = room.player1.username;
            // Set final scores: winner gets WINNING_SCORE, loser gets current score
            // CRITICAL: Set to a high value to ensure frontend detects winner (frontend checks for >= 10)
            const finalWinningScore = Math.max(WINNING_SCORE, 10); // Use at least 10 for frontend detection
            room.gameState.player2.score = finalWinningScore;
          } else if (!p2SocketValid) {
            // Player2 disconnected - Player1 wins
            disconnectedPlayer = room.player2;
            connectedPlayer = room.player1;
            winnerId = room.player1.id;
            loserId = room.player2.id;
            winnerUsername = room.player1.username;
            loserUsername = room.player2.username;
            // Set final scores: winner gets WINNING_SCORE, loser gets current score
            // CRITICAL: Set to a high value to ensure frontend detects winner (frontend checks for >= 10)
            const finalWinningScore = Math.max(WINNING_SCORE, 10); // Use at least 10 for frontend detection
            room.gameState.player1.score = finalWinningScore;
          } else {
            // Both disconnected - shouldn't happen, but handle gracefully
            this.gameRooms.delete(roomCode);
            return;
          }

          // Notify connected player that opponent quit and they won
          // CRITICAL: Always send gameOver message, even if socket seems closed (might be stale reference)
          if (connectedPlayer && connectedPlayer.socket) {
            const gameOverPayload = {
              winner: winnerUsername,
              winnerId: winnerId,
              reason: 'opponentQuit',
              message: `${loserUsername} quit the game. You win!`,
              finalScore: {
                player1: room.gameState.player1.score,
                player2: room.gameState.player2.score
              },
              finalGameState: {
                ...room.gameState,
                matchId: room.tournamentContext?.matchId,
                round: room.tournamentContext?.round,
                roomCode: roomCode
              }
            };



            const sent = this.sendToPlayer(connectedPlayer.socket, {
              type: 'gameOver',
              payload: gameOverPayload
            });



            // For tournament matches, also send opponentLeft message to show animation
            if (room.tournamentContext) {
              this.sendToPlayer(connectedPlayer.socket, {
                type: 'opponentLeft',
                data: {
                  message: 'The other player has left the game, you win!',
                  matchId: room.tournamentContext.matchId
                }
              });
            }
          } else {

          }

          // Save game history with quitter as loser
          this.saveGameHistory(room, true); // Pass true to indicate disconnect

          // Award XP: Winner gets 500, Loser gets 200 (for remote games)
          this.awardXP(winnerId, loserId, 500, 200, 'casual');

          // CRITICAL: For tournament matches, automatically report match result
          // This ensures the tournament advances when a player disconnects


          if (room.tournamentContext) {
            const tournamentId = room.tournamentContext.tournamentId;
            const matchId = room.tournamentContext.matchId;

            // Get winner player object (with all required fields: id, name, avatar, username)
            const winnerPlayer = {
              id: winnerId,
              name: winnerUsername,
              username: winnerUsername,
              avatar: connectedPlayer.avatar || null
            };



            

            // Automatically report match result to tournament system
            try {
              const matchResult = this.handleMatchResult(tournamentId, matchId, winnerPlayer, winnerId);


             
            } catch (error) {

              console.error(`[startGameLoop] Error reporting tournament match result:`, error);
            }
          } else {

          }

          // Remove room
          this.gameRooms.delete(roomCode);

          return;
        }

        // Update paddles - ALWAYS update regardless of disconnect checks
        this.updatePaddles(room);

        // Track leading time
        const stats = room.stats;
        const now = Date.now();
        const p1Score = room.gameState.player1.score;
        const p2Score = room.gameState.player2.score;

        // Track point streaks
        if (p1Score > stats.previousPlayer1Score) {
          // Player1 scored
          stats.player1CurrentStreak++;
          stats.player2CurrentStreak = 0;
          if (stats.player1CurrentStreak > stats.player1MaxStreak) {
            stats.player1MaxStreak = stats.player1CurrentStreak;
          }
        } else if (p2Score > stats.previousPlayer2Score) {
          // Player2 scored
          stats.player2CurrentStreak++;
          stats.player1CurrentStreak = 0;
          if (stats.player2CurrentStreak > stats.player2MaxStreak) {
            stats.player2MaxStreak = stats.player2CurrentStreak;
          }
        }

        // Track leading time
        if (p1Score > p2Score) {
          // Player1 is leading
          if (!stats.player1LeadingStart) {
            stats.player1LeadingStart = now;
          }
          if (stats.player2LeadingStart) {
            // Player2 was leading, add to their time
            stats.player2LeadingTime += (now - stats.player2LeadingStart) / 1000; // Convert to seconds
            stats.player2LeadingStart = null;
          }
        } else if (p2Score > p1Score) {
          // Player2 is leading
          if (!stats.player2LeadingStart) {
            stats.player2LeadingStart = now;
          }
          if (stats.player1LeadingStart) {
            // Player1 was leading, add to their time
            stats.player1LeadingTime += (now - stats.player1LeadingStart) / 1000; // Convert to seconds
            stats.player1LeadingStart = null;
          }
        } else {
          // Tied - stop tracking leading time
          if (stats.player1LeadingStart) {
            stats.player1LeadingTime += (now - stats.player1LeadingStart) / 1000;
            stats.player1LeadingStart = null;
          }
          if (stats.player2LeadingStart) {
            stats.player2LeadingTime += (now - stats.player2LeadingStart) / 1000;
            stats.player2LeadingStart = null;
          }
        }

        // Update previous scores
        stats.previousPlayer1Score = p1Score;
        stats.previousPlayer2Score = p2Score;

        // Update ball
        this.updateBall(room.gameState, room);

        // Check for winner AFTER updating ball (so we catch the scoring point)
        const winner = this.checkWinner(room.gameState);
        if (winner) {
          // ALWAYS broadcast final game state when winner is detected
          // This ensures clients receive the final state with score 10, regardless of frame count
          this.broadcastGameState(roomCode, room.gameState);

          // Stop the loop immediately after broadcasting
          clearInterval(interval);
          this.gameLoops.delete(roomCode);

          // Notify players with game over (include final state)
          const gameOverPayload = {
            winner: winner,
            finalScore: {
              player1: room.gameState.player1.score,
              player2: room.gameState.player2.score
            },
            finalGameState: room.gameState // Include final state so client can display it
          };

          // Verify sockets are still valid before sending gameOver
          const p1SocketValid = room.player1.socket && room.player1.socket.readyState === 1;
          const p2SocketValid = room.player2.socket && room.player2.socket.readyState === 1;

          // Try to update stale sockets before sending
          if (!p1SocketValid) {
            const updatedSocket = this.usersSocket.get(room.player1.id.toString());
            if (updatedSocket && updatedSocket.readyState === 1) {
              room.player1.socket = updatedSocket;
              
            }
          }

          if (!p2SocketValid) {
            const updatedSocket = this.usersSocket.get(room.player2.id.toString());
            if (updatedSocket && updatedSocket.readyState === 1) {
              room.player2.socket = updatedSocket;
              
            }
          }

          // Send gameOver message to both players
          const p1Sent = this.sendToPlayer(room.player1.socket, {
            type: 'gameOver',
            payload: gameOverPayload
          });

          const p2Sent = this.sendToPlayer(room.player2.socket, {
            type: 'gameOver',
            payload: gameOverPayload
          });

          // Log if sending failed
          if (!p1Sent) {
            console.warn(`[startGameLoop] Failed to send gameOver to player1 (${room.player1.id}) in room ${roomCode}`);
          }
          if (!p2Sent) {
            console.warn(`[startGameLoop] Failed to send gameOver to player2 (${room.player2.id}) in room ${roomCode}`);
          }

          // Send one final gameState update AFTER gameOver to ensure clients have the final state
          // This helps if gameOver message is missed or delayed over network
          // Use a small delay to ensure gameOver is sent first
          setTimeout(() => {
            const finalRoom = this.gameRooms.get(roomCode);
            if (finalRoom) {
              
              this.broadcastGameState(roomCode, finalRoom.gameState);
            }
          }, 100); // 100ms delay to ensure gameOver is sent first

          // Save game history
          this.saveGameHistory(room, false);

          // Award XP: Winner gets 500, Loser gets 200 (for remote games)
          const winnerId = winner === room.player1.username ? room.player1.id : room.player2.id;
          const loserId = winner === room.player1.username ? room.player2.id : room.player1.id;
          this.awardXP(winnerId, loserId, 500, 200, 'casual');

          // CRITICAL: For tournament matches, automatically report match result
          // This ensures Round 2 is created immediately when both Round 1 matches finish
          if (room.tournamentContext) {
            const tournamentId = room.tournamentContext.tournamentId;
            const matchId = room.tournamentContext.matchId;

            // Get winner player object (with all required fields: id, name, avatar, username)
            const winnerPlayer = winner === room.player1.username
              ? {
                  id: room.player1.id,
                  name: room.player1.username,
                  username: room.player1.username,
                  avatar: room.player1.avatar || null
                }
              : {
                  id: room.player2.id,
                  name: room.player2.username,
                  username: room.player2.username,
                  avatar: room.player2.avatar || null
                };

            
              
            // Automatically report match result to tournament system
            // This ensures Round 2 is created immediately when both Round 1 matches finish
            try {
              const matchResult = this.handleMatchResult(tournamentId, matchId, winnerPlayer, winnerId);
             
            } catch (error) {
              console.error(`[startGameLoop] Error reporting tournament match result:`, error);
            }
          }

          // For tournament matches, clean up room after result is reported to avoid stale rooms
          if (room.tournamentContext) {
            const interval = this.gameLoops.get(roomCode);
            if (interval) {
              clearInterval(interval);
              this.gameLoops.delete(roomCode);
            }
            this.gameRooms.delete(roomCode);
          } else {
            // Keep room for rematch option in non-tournament games
            return;
          }

          return;
        }

        // Broadcast game state every frame (60 FPS) for smooth movement
        // This provides smoother updates for ball and paddle movement
        this.broadcastGameState(roomCode, room.gameState);
      } catch (error) {
        console.error('Error in game loop for room', roomCode, ':', error);
        // Don't stop the loop on error, just log it
      }
    }, 1000 / 60); // 60 FPS for physics and broadcasting

    this.gameLoops.set(roomCode, interval);
  }

  // Broadcast game state to both players
  broadcastGameState(roomCode, gameState) {
    const room = this.gameRooms.get(roomCode);
    if (!room) {
      console.warn(`[broadcastGameState] Room ${roomCode} not found`);
      return;
    }

    // Check if this is Match 1, Match 2, or Final Match (Round 2)
    const matchId = room.tournamentContext?.matchId;
    const round = room.tournamentContext?.round;
    const isMatch1 = matchId === 1;
    const isMatch2 = matchId === 2;
    const isFinalMatch = round === 2;
    const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : (isFinalMatch ? 'FINAL MATCH (Round 2)' : null));

    // CRITICAL: Get fresh socket references right before sending to avoid race conditions
    // This ensures we always use the latest socket, even if player reconnected
    // Always check for updated sockets from usersSocket map FIRST (handles reconnections)
    const freshP1Socket = this.usersSocket.get(room.player1.id.toString());
    const freshP2Socket = this.usersSocket.get(room.player2.id.toString());

    // Use fresh socket if available and open, otherwise fall back to stored socket
    let player1Socket = (freshP1Socket && freshP1Socket.readyState === 1) ? freshP1Socket : room.player1.socket;
    let player2Socket = (freshP2Socket && freshP2Socket.readyState === 1) ? freshP2Socket : room.player2.socket;

    // Update room sockets if we found fresher ones that are open
    if (freshP1Socket && freshP1Socket.readyState === 1) {
      if (room.player1.socket !== freshP1Socket) {
        room.player1.socket = freshP1Socket;
       
      }
    }

    if (freshP2Socket && freshP2Socket.readyState === 1) {
      if (room.player2.socket !== freshP2Socket) {
        room.player2.socket = freshP2Socket;
      
      }
    }

    // Build gameState message with tournament context if available
    const gameStateMessage = {
      type: 'gameState',
      payload: gameState,
      roomCode: roomCode, // Include roomCode for frontend verification
      timestamp: Date.now() // Add timestamp to detect out-of-order messages
    };

    // Add tournament context to message if room has tournament context
    if (room.tournamentContext) {
      gameStateMessage.tournamentId = room.tournamentContext.tournamentId;
      gameStateMessage.matchId = room.tournamentContext.matchId;
      gameStateMessage.round = room.tournamentContext.round;
      gameStateMessage.matchNumber = room.tournamentContext.matchNumber;
    }

    // CRITICAL: Validate sockets RIGHT BEFORE sending (not earlier) to avoid race conditions
    const p1SocketValid = player1Socket && player1Socket.readyState === 1;
    const p2SocketValid = player2Socket && player2Socket.readyState === 1;

    if (!p1SocketValid || !p2SocketValid) {
      if (matchLabel) {
        console.error(`[broadcastGameState] ${matchLabel} ERROR: Invalid sockets:`, {
          player1Valid: p1SocketValid,
          player2Valid: p2SocketValid,
          player1ReadyState: player1Socket?.readyState,
          player2ReadyState: player2Socket?.readyState,
          player1Id: room.player1.id,
          player2Id: room.player2.id
        });
      } else {
        console.warn(`[broadcastGameState] Invalid sockets in room ${roomCode}:`, {
          player1Valid: p1SocketValid,
          player2Valid: p2SocketValid,
          player1ReadyState: player1Socket?.readyState,
          player2ReadyState: player2Socket?.readyState
        });
      }
    }

    // CRITICAL: Send to both players simultaneously using the validated sockets
    // This ensures both players receive the same gameState at the same time
    const p1Sent = p1SocketValid ? this.sendToPlayer(player1Socket, gameStateMessage) : false;
    const p2Sent = p2SocketValid ? this.sendToPlayer(player2Socket, gameStateMessage) : false;

    // For Match 1, Match 2, and Final Match: Log synchronization verification periodically
    if ((isMatch1 || isMatch2 || isFinalMatch) && p1Sent && p2Sent) {
      // Log every 60th broadcast (approximately once per second) to verify continuous sync
      if (Math.random() < 0.016) {
        console.log(`[broadcastGameState] ${matchLabel} SYNC VERIFIED:`, {
          timestamp: gameStateMessage.timestamp,
          player1Score: gameState.player1?.score,
          player2Score: gameState.player2?.score,
          ballX: gameState.ball?.x?.toFixed(2),
          ballY: gameState.ball?.y?.toFixed(2),
          player1Y: gameState.player1?.y?.toFixed(2),
          player2Y: gameState.player2?.y?.toFixed(2),
          bothPlayersReceived: true,
          roomCode: roomCode
        });
      }
    }

    // If both failed, the game loop will detect disconnected sockets on next iteration
    if (!p1Sent && !p2Sent) {
      if (matchLabel) {
        console.error(`[broadcastGameState] ${matchLabel} ERROR: Failed to send game state to BOTH players`);
      } else {
        console.warn(`[broadcastGameState] Failed to send game state to both players in room ${roomCode}`);
      }
    } else if (!p1Sent) {
      if (matchLabel) {
        console.error(`[broadcastGameState] ${matchLabel} ERROR: Failed to send to player1 (${room.player1.id})`);
      } else {
        console.warn(`[broadcastGameState] Failed to send game state to player1 (${room.player1.id}) in room ${roomCode}`);
      }
    } else if (!p2Sent) {
      if (matchLabel) {
        console.error(`[broadcastGameState] ${matchLabel} ERROR: Failed to send to player2 (${room.player2.id})`);
      } else {
        console.warn(`[broadcastGameState] Failed to send game state to player2 (${room.player2.id}) in room ${roomCode}`);
      }
    } else {
      // Log successful broadcast for Match 1, Match 2, and Final Match more frequently with sync verification
      if ((isMatch1 || isMatch2 || isFinalMatch) && Math.random() < 0.1) { // 10% chance = roughly 6 times per second at 60 FPS
        console.log(`[broadcastGameState] ${matchLabel} SYNC: ✓ Both players received gameState`, {
          timestamp: gameStateMessage.timestamp,
          player1Id: room.player1.id,
          player2Id: room.player2.id,
          player1Score: gameState.player1?.score,
          player2Score: gameState.player2?.score,
          ballX: gameState.ball?.x?.toFixed(2),
          ballY: gameState.ball?.y?.toFixed(2),
          player1Y: gameState.player1?.y?.toFixed(2),
          player2Y: gameState.player2?.y?.toFixed(2),
          matchId: gameStateMessage.matchId,
          round: gameStateMessage.round,
          roomCode: roomCode
        });
      } else if (!isMatch1 && !isMatch2) {
        // Log successful broadcast periodically (every 60 frames = ~1 second) to verify it's working
        if (Math.random() < 0.016) { // ~1% chance = roughly once per second at 60 FPS
          console.log(`[broadcastGameState] Successfully broadcasting game state for room ${roomCode}`);
        }
      }
    }
  }


  // Send message to player
  sendToPlayer(socket, message) {
    if (!socket) {
      console.warn('[sendToPlayer] Socket is null or undefined');
      return false;
    }

    if (socket.readyState === 1) { // WebSocket.OPEN
      try {
        const messageStr = JSON.stringify(message);
        socket.send(messageStr);
        return true;
      } catch (error) {
        console.error('[sendToPlayer] Error sending message:', error);
        return false;
      }
    } else {
      // Socket not open - log for debugging with more details
      console.warn('[sendToPlayer] Attempted to send message to closed socket:', {
        readyState: socket.readyState,
        readyStateText: socket.readyState === 0 ? 'CONNECTING' :
                       socket.readyState === 1 ? 'OPEN' :
                       socket.readyState === 2 ? 'CLOSING' :
                       socket.readyState === 3 ? 'CLOSED' : 'UNKNOWN',
        messageType: message.type
      });
      return false;
    }
  }

  // Remove player from room (called when player explicitly quits or disconnects)
  removePlayer(roomCode, playerId) {
    const room = this.gameRooms.get(roomCode);
    if (!room) {

      // Room not found - this can happen if:
      // 1. Room was already deleted (opponent already left)
      // 2. Room never existed (invalid roomCode)
      // For tournament matches, check if player is in an active match and process it

      // Search through all tournaments to find an active match for this player
      for (const [tournamentId, tournament] of this.tournaments.entries()) {
        if (!tournament.bracket) continue;

        // Find active match (status === 'playing') where this player is participating
        const activeMatch = tournament.bracket.find(m =>
          m.status === 'playing' &&
          m.player1 && m.player2 &&
          (m.player1.id?.toString() === playerId.toString() ||
           m.player1.id === playerId ||
           m.player2.id?.toString() === playerId.toString() ||
           m.player2.id === playerId)
        );

        if (activeMatch) {
          // Found an active match for this player

          // CRITICAL: Check if match room was recently created to prevent premature match completion
          // If we have a roomCode, check if the room was created recently
          if (activeMatch.roomCode) {
            const matchRoom = this.gameRooms.get(activeMatch.roomCode);
            if (matchRoom) {
              const roomAge = Date.now() - (matchRoom.createdAt || matchRoom.startTime || 0);
              const MIN_ROOM_AGE = 10000; // 10 seconds
              if (roomAge < MIN_ROOM_AGE) {
                
                return; // Exit early - don't process as match result
              }
            } else {
              // Room doesn't exist - it was likely deleted by the first player leaving
              // For final matches (round 2), check if match was recently started
              if (activeMatch.round === 2 && activeMatch.status === 'playing') {
                const MIN_MATCH_AGE = 10000; // 10 seconds
                const matchAge = activeMatch.startedAt ? Date.now() - activeMatch.startedAt : Infinity;

                if (matchAge < MIN_MATCH_AGE) {
                
                  return; // Exit early - don't process as match result
                }
              }
            }
          }

          // Determine winner (opponent) and loser (this player)
          const isPlayer1 = activeMatch.player1.id?.toString() === playerId.toString() || activeMatch.player1.id === playerId;
          const winner = isPlayer1 ? activeMatch.player2 : activeMatch.player1;
          const quitter = isPlayer1 ? activeMatch.player1 : activeMatch.player2;

          // Get winner socket to send gameOver message
          const winnerSocket = this.usersSocket.get(winner.id?.toString() || winner.id_user?.toString());

          // Send gameOver to winner if socket is available
          if (winnerSocket && winnerSocket.readyState === 1) {
            const gameOverPayload = {
              winner: winner.username || winner.name,
              winnerId: winner.id || winner.id_user,
              reason: 'opponentQuit',
              message: `${quitter.username || quitter.name} quit the game. You win!`,
              finalScore: {
                player1: isPlayer1 ? 0 : 10,
                player2: isPlayer1 ? 10 : 0
              }
              // NOTE: Do NOT send finalGameState when room is not found
              // The frontend should handle opponentQuit without updating game state scores
              // This prevents premature game completion based on score checks
            };

            this.sendToPlayer(winnerSocket, {
              type: 'gameOver',
              payload: gameOverPayload,
              matchId: activeMatch.id,
              round: activeMatch.round
            });

            // Also send opponentLeft for tournament matches
            this.sendToPlayer(winnerSocket, {
              type: 'opponentLeft',
              data: {
                message: 'The other player has left the game, you win!',
                matchId: activeMatch.id
              },
              matchId: activeMatch.id
            });
          }

          // Process match result
          const winnerPlayer = {
            id: winner.id || winner.id_user,
            name: winner.username || winner.name,
            username: winner.username || winner.name,
            avatar: winner.avatar || null
          };

          try {
            const matchResult = this.handleMatchResult(tournamentId, activeMatch.id, winnerPlayer, winner.id || winner.id_user);

            // if (matchResult.error) {
            //   console.error(`[removePlayer] Failed to report tournament match result for active match:`, matchResult.error);
            // } else {
            //   console.log(`[removePlayer] Successfully processed active tournament match result for match ${activeMatch.id}`);
            // }

            // CRITICAL: Disconnect quitter from tournament socket
            // They should no longer receive tournament updates
            const quitterId = (quitter.id?.toString() || quitter.id_user?.toString());

            // Track eliminated player
            if (!this.eliminatedPlayers) {
              this.eliminatedPlayers = new Map();
            }
            if (!this.eliminatedPlayers.has(tournamentId)) {
              this.eliminatedPlayers.set(tournamentId, new Set());
            }
            this.eliminatedPlayers.get(tournamentId).add(quitterId);

            const quitterSocket = this.usersSocket.get(quitterId);
            if (quitterSocket) {
              this.sendToPlayer(quitterSocket, {
                type: 'tournamentEliminated',
                data: {
                  tournamentId: tournamentId,
                  matchId: activeMatch.id,
                  message: 'You have left the tournament match. You will no longer receive tournament updates.'
                }
              });
              // console.log(`[removePlayer] Disconnected quitter ${quitterId} from tournament ${tournamentId} after leaving match`);
            }
          } catch (error) {
            console.error(`[removePlayer] Error reporting tournament match result for active match:`, error);
          }

          return; // Match processed, exit
        }
      }

      // No active match found - room was likely already processed or never existed

      return;
    }

    // CRITICAL: Prevent processing match result if player leaves immediately after room creation
    // This prevents final match from being skipped if a player accidentally leaves
    const roomAge = Date.now() - (room.createdAt || room.startTime || 0);
    const MIN_ROOM_AGE = 10000; // 10 seconds - minimum time before processing leave as match result (increased for final match)

    if (room.tournamentContext && roomAge < MIN_ROOM_AGE) {
      // console.log(`[removePlayer] Player ${playerId} left tournament room ${roomCode} too soon (${roomAge}ms < ${MIN_ROOM_AGE}ms). Not processing as match result to prevent skipping. Game will continue until minimum time has passed.`);
      // CRITICAL: Don't delete the room or stop the game loop when guard blocks
      // The game loop will naturally detect the disconnected socket and handle it after minimum time
      // This prevents the game from pausing for the remaining player
      // Just mark the player's socket as disconnected by setting it to null
      if (room.player1.id === playerId) {
        room.player1.socket = null;
      } else if (room.player2.id === playerId) {
        room.player2.socket = null;
      }
      // The game loop will detect the null socket and handle it naturally
      return; // Exit early - don't process as match result
    }

    // CRITICAL: For tournament matches, only process match result if score has reached winning score
    // This prevents the match from ending prematurely when a player leaves before reaching the winning score
    if (room.tournamentContext) {
      const currentP1Score = room.gameState.player1.score;
      const currentP2Score = room.gameState.player2.score;
      const hasReachedWinningScore = currentP1Score >= WINNING_SCORE || currentP2Score >= WINNING_SCORE;

      if (!hasReachedWinningScore) {
        // Score hasn't reached winning score yet - don't process as match result
        // Mark the player as disconnected and let the game loop handle it naturally
        // console.log(`[removePlayer] Player ${playerId} left tournament room ${roomCode} but score (${currentP1Score}-${currentP2Score}) hasn't reached winning score (${WINNING_SCORE}). Not processing as match result.`);
        // Mark the player's socket as disconnected by setting it to null
        if (room.player1.id === playerId) {
          room.player1.socket = null;
        } else if (room.player2.id === playerId) {
          room.player2.socket = null;
        }
        // The game loop will detect the null socket and handle it naturally
        // It will end the game when the score reaches the winning score, or when the disconnected socket is detected after minimum time
        return; // Exit early - don't process as match result
      }
    }

    // Stop game loop
    const loop = this.gameLoops.get(roomCode);
    if (loop) {
      clearInterval(loop);
      this.gameLoops.delete(roomCode);
    }

    // Determine winner and loser
    const quitter = room.player1.id === playerId ? room.player1 : room.player2;
    const winner = room.player1.id === playerId ? room.player2 : room.player1;

    // Set final scores: winner gets WINNING_SCORE, quitter gets current score
    // CRITICAL: Set to a high value to ensure frontend detects winner (frontend checks for >= 10)
    // But also ensure it matches the actual winning score for consistency
    const finalWinningScore = Math.max(WINNING_SCORE, 10); // Use at least 10 for frontend detection
    if (room.player1.id === playerId) {
      room.gameState.player2.score = finalWinningScore;
    } else {
      room.gameState.player1.score = finalWinningScore;
    }

    // Notify opponent that they won because opponent quit
    // CRITICAL: Get fresh socket reference to handle reconnections
    // Use usersSocket map to get the most up-to-date socket
    const freshWinnerSocket = this.usersSocket.get(winner.id.toString());
    const winnerSocket = (freshWinnerSocket && freshWinnerSocket.readyState === 1) ? freshWinnerSocket : winner.socket;

    if (winner && winnerSocket && winnerSocket.readyState === 1) {
      const gameOverPayload = {
        winner: winner.username,
        winnerId: winner.id,
        reason: 'opponentQuit',
        message: `${quitter.username} quit the game. You win!`,
        finalScore: {
          player1: room.gameState.player1.score,
          player2: room.gameState.player2.score
        },
        finalGameState: {
          ...room.gameState,
          matchId: room.tournamentContext?.matchId,
          round: room.tournamentContext?.round,
          roomCode: roomCode
        }
      };

      const sent = this.sendToPlayer(winnerSocket, {
        type: 'gameOver',
        payload: gameOverPayload
      });

      // For tournament matches, also send opponentLeft message to show animation
      if (room.tournamentContext) {
        this.sendToPlayer(winnerSocket, {
          type: 'opponentLeft',
          data: {
            message: 'The other player has left the game, you win!',
            matchId: room.tournamentContext.matchId
          }
        });
      }
    } else {
      console.warn(`[removePlayer] Cannot send gameOver - winner socket not available (roomCode: ${roomCode}, winnerId: ${winner?.id})`);
    }

    // Save game history with quitter as loser
    this.saveGameHistory(room, true); // Pass true to indicate disconnect

    // Award XP: Winner gets 500, Loser gets 200 (for remote games)
    this.awardXP(winner.id, quitter.id, 500, 200, 'casual');

    // CRITICAL: For tournament matches, automatically report match result
    // This ensures the tournament advances when a player disconnects


    if (room.tournamentContext) {
      const tournamentId = room.tournamentContext.tournamentId;
      const matchId = room.tournamentContext.matchId;

      // Get winner player object (with all required fields: id, name, avatar, username)
      const winnerPlayer = {
        id: winner.id,
        name: winner.username,
        username: winner.username,
        avatar: winner.avatar || null
      };



      // console.log(`[removePlayer] Tournament match finished due to disconnect - automatically reporting result:`, {
      //   tournamentId,
      //   matchId,
      //   winner: winnerPlayer.name,
      //   quitter: quitter.username,
      //   round: room.tournamentContext.round
      // });

      // Automatically report match result to tournament system
      try {
        const matchResult = this.handleMatchResult(tournamentId, matchId, winnerPlayer, winner.id);

        if (matchResult.error) {
          console.error(`[removePlayer] Failed to report tournament match result:`, matchResult.error);
        } else {
          console.log(`[removePlayer] Successfully reported tournament match result for match ${matchId}`);
        }
      } catch (error) {

        console.error(`[removePlayer] Error reporting tournament match result:`, error);
      }
    } else {

    }

    // Remove room
    this.gameRooms.delete(roomCode);

  }

  // Handle friend invitation
  sendFriendInvitation(fromUserId, fromUsername, friendId, customization) {
    const friendSocket = this.usersSocket.get(friendId.toString());

    if (!friendSocket) {
      return { error: 'Friend is not online' };
    }

    const roomCode = this.generateRoomCode();
    // Store invitation with friendId (acceptor) as key
    this.pendingInvitations.set(friendId.toString(), {
      from: fromUserId, // inviter
      fromUsername,
      roomCode,
      customization,
      timestamp: Date.now()
    });

    // Send invitation to friend
    this.sendToPlayer(friendSocket, {
      type: 'gameInvitation',
      payload: {
        from: {
          id: fromUserId,
          username: fromUsername
        },
        roomCode,
        customization
      }
    });

    return { roomCode };
  }

  // Accept friend invitation
  // acceptorId: the user who is accepting (the one who received the invitation)
  // inviterId: the user who sent the invitation
  acceptFriendInvitation(acceptorId, inviterId, acceptorUsername, acceptorSocket, acceptorCustomization) {
    // Find invitation - it's stored with acceptorId as key
    const invitation = this.pendingInvitations.get(acceptorId.toString());
    if (!invitation) {
      return { error: 'Invitation not found or expired' };
    }

    // Verify the invitation is from the correct inviter
    if (invitation.from !== inviterId) {
      return { error: 'Invalid invitation' };
    }

    // Remove from pending
    this.pendingInvitations.delete(acceptorId.toString());

    // Get inviter socket
    const inviterSocket = this.usersSocket.get(inviterId.toString());
    if (!inviterSocket) {
      return { error: 'Inviter is no longer online' };
    }

    // Get inviter username from database
    const getUserStmt = this.db.prepare('SELECT username FROM users WHERE id_user = ?');
    const inviterUser = getUserStmt.get(inviterId);
    if (!inviterUser) {
      return { error: 'Inviter not found' };
    }

    // Create game room
    const player1 = {
      id: inviterId,
      username: inviterUser.username,
      socket: inviterSocket,
      customization: invitation.customization
    };

    const player2 = {
      id: acceptorId,
      username: acceptorUsername,
      socket: acceptorSocket,
      customization: acceptorCustomization
    };

    return this.createGameRoom(player1, player2);
  }

  // Decline friend invitation
  declineFriendInvitation(friendId) {
    const invitation = this.pendingInvitations.get(friendId);
    if (!invitation) return;

    const inviterSocket = this.usersSocket.get(invitation.from.toString());
    if (inviterSocket) {
      this.sendToPlayer(inviterSocket, {
        type: 'gameInvitationDeclined',
        payload: {
          friendId
        }
      });
    }

    this.pendingInvitations.delete(friendId);
  }

  // Handle rematch request
  requestRematch(roomCode, playerId) {
    const room = this.gameRooms.get(roomCode);
    if (!room) {
      return { error: 'Room not found' };
    }

    const opponent = room.player1.id === playerId ? room.player2 : room.player1;
    if (!opponent) {
      return { error: 'Opponent not found' };
    }

    // Store rematch request
    this.rematchRequests.set(roomCode, {
      from: playerId,
      to: opponent.id
    });

    // Notify opponent
    this.sendToPlayer(opponent.socket, {
      type: 'rematch:offer'
    });

    return { success: true };
  }

  // Accept rematch
  acceptRematch(roomCode, playerId) {
    const room = this.gameRooms.get(roomCode);
    if (!room) {
      return { error: 'Room not found' };
    }

    const rematchRequest = this.rematchRequests.get(roomCode);
    // The player who RECEIVED the request (rematchRequest.to) should accept it
    if (!rematchRequest || rematchRequest.to !== playerId) {
      return { error: 'Invalid rematch request' };
    }

    // Reset game state
    const player1 = room.player1;
    const player2 = room.player2;
    room.gameState = this.initializeGameState(
      { id: player1.id, username: player1.username, customization: player1.customization },
      { id: player2.id, username: player2.username, customization: player2.customization }
    );
    room.paddleDirections = { player1: 'stop', player2: 'stop' };
    room.startTime = Date.now(); // Reset start time for rematch

    // Allow saving history for the rematch as a new match
    room.historySaved = false;
    room.historySavedAt = null;

    // Reset statistics for rematch
    room.stats = {
      currentRally: 0,
      longestRally: 0,
      totalRallies: [],
      totalTouches: 0,
      maxBallSpeed: 0,
      player1Touches: 0,
      player2Touches: 0,
      player1CurrentStreak: 0,
      player2CurrentStreak: 0,
      player1MaxStreak: 0,
      player2MaxStreak: 0,
      player1LeadingStart: null,
      player2LeadingStart: null,
      player1LeadingTime: 0,
      player2LeadingTime: 0,
      previousPlayer1Score: 0,
      previousPlayer2Score: 0
    };

    // Remove rematch request
    this.rematchRequests.delete(roomCode);

    // Restart game loop
    this.startGameLoop(roomCode);

    // Notify both players
    this.sendToPlayer(player1.socket, {
      type: 'rematch:start',
      payload: room.gameState
    });

    this.sendToPlayer(player2.socket, {
      type: 'rematch:start',
      payload: room.gameState
    });

    return { success: true };
  }

  // Decline rematch
  declineRematch(roomCode, playerId) {
    const room = this.gameRooms.get(roomCode);
    if (!room) return;

    const rematchRequest = this.rematchRequests.get(roomCode);
    if (rematchRequest) {
      const requesterSocket = this.usersSocket.get(rematchRequest.from.toString());
      if (requesterSocket) {
        this.sendToPlayer(requesterSocket, {
          type: 'rematch:declined'
        });
      }
      this.rematchRequests.delete(roomCode);
    }
  }

  // Award XP to winner and loser (only for remote games)
  awardXP(winnerId, loserId, winnerXP, loserXP, gameType = 'casual') {
    try {
      // Only award XP for remote games (casual type)
      if (gameType !== 'casual') {
        console.log(`[GameManager] Skipping XP award for game type: ${gameType}`);
        return;
      }

      // Award XP to winner
      const updateWinnerStmt = this.db.prepare('UPDATE users SET xp = xp + ? WHERE id_user = ?');
      updateWinnerStmt.run(winnerXP, winnerId);
      console.log(`[GameManager] Awarded ${winnerXP} XP to winner ${winnerId}`);

      // Award XP to loser
      const updateLoserStmt = this.db.prepare('UPDATE users SET xp = xp + ? WHERE id_user = ?');
      updateLoserStmt.run(loserXP, loserId);
      console.log(`[GameManager] Awarded ${loserXP} XP to loser ${loserId}`);
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  }

  // Save game history to database
  saveGameHistory(room, isDisconnect = false) {
    try {
      if (!room) return;

      // Idempotency: game loop and disconnect handlers can both attempt to persist.
      // Prevents duplicate rows when a player disconnects after a finished match.
      if (room.historySaved) {
        return;
      }
      room.historySaved = true;
      room.historySavedAt = Date.now();

      const stmt = this.db.prepare(`
        INSERT INTO game_history (
          user_win, user_lose, win_score, lose_score,
          type, tournament_id, game_date, duration,
          longest_rally, average_rally, ball_max_speed,
          touches_win, touches_lose,
          max_points_streak_win, max_points_streak_lose,
          max_leading_time_win, max_leading_time_lose,
          blockchain_hash
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const player1Score = room.gameState.player1.score;
      const player2Score = room.gameState.player2.score;
      const stats = room.stats;

      const winnerId = player1Score >= WINNING_SCORE
        ? room.player1.id
        : room.player2.id;

      const loserId = winnerId === room.player1.id
        ? room.player2.id
        : room.player1.id;

      const winScore = winnerId === room.player1.id ? player1Score : player2Score;
      const loseScore = winnerId === room.player1.id ? player2Score : player1Score;

      // Calculate game duration in seconds
      const duration = room.startTime
        ? Math.floor((Date.now() - room.startTime) / 1000)
        : null;

      // Finalize leading time tracking (add any remaining leading time)
      const now = Date.now();
      if (stats.player1LeadingStart) {
        stats.player1LeadingTime += (now - stats.player1LeadingStart) / 1000;
      }
      if (stats.player2LeadingStart) {
        stats.player2LeadingTime += (now - stats.player2LeadingStart) / 1000;
      }

      // Calculate average rally
      const averageRally = stats.totalRallies.length > 0
        ? stats.totalRallies.reduce((sum, r) => sum + r, 0) / stats.totalRallies.length
        : 0;

      // Get statistics for winner and loser
      const touchesWin = winnerId === room.player1.id ? stats.player1Touches : stats.player2Touches;
      const touchesLose = winnerId === room.player1.id ? stats.player2Touches : stats.player1Touches;
      const maxStreakWin = winnerId === room.player1.id ? stats.player1MaxStreak : stats.player2MaxStreak;
      const maxStreakLose = winnerId === room.player1.id ? stats.player2MaxStreak : stats.player1MaxStreak;
      const maxLeadingTimeWin = winnerId === room.player1.id ? stats.player1LeadingTime : stats.player2LeadingTime;
      const maxLeadingTimeLose = winnerId === room.player1.id ? stats.player2LeadingTime : stats.player1LeadingTime;

      // Convert ball speed to m/s (already calculated in updateBall)
      const ballMaxSpeedMetersPerSecond = stats.maxBallSpeed > 0
        ? Math.round(stats.maxBallSpeed * 100) / 100
        : null;

      // Determine if this is a tournament match
      const isTournamentMatch = room.tournamentContext !== null;
      const tournamentStringId = isTournamentMatch ? room.tournamentContext.tournamentId : null;
      const tournamentRound = isTournamentMatch ? room.tournamentContext.round : null;
      const gameType = isTournamentMatch ? 'tournament' : 'casual';

      // Get the database tournament ID from the tournament object
      let tournamentDbId = null;
      if (tournamentStringId) {
        const tournament = this.tournaments.get(tournamentStringId);
        tournamentDbId = tournament?.dbId || null;
      }

      stmt.run(
        winnerId,
        loserId,
        winScore,
        loseScore,
        gameType, // 'tournament' for tournament matches, 'casual' for regular games
        tournamentDbId, // tournament_id (NULL for casual games, database ID for tournament matches)
        new Date().toISOString(),
        duration,
        stats.longestRally || null,
        averageRally > 0 ? Math.round(averageRally * 100) / 100 : null, // Round to 2 decimal places
        ballMaxSpeedMetersPerSecond, // Ball max speed in m/s
        touchesWin || 0,
        touchesLose || 0,
        maxStreakWin || 0,
        maxStreakLose || 0,
        Math.floor(maxLeadingTimeWin), // Leading time in seconds
        Math.floor(maxLeadingTimeLose), // Leading time in seconds
        null // blockchain_hash (optional, NULL for now)
      );

      // Log player names for verification
      const winnerName = winnerId === room.player1.id ? room.player1.username : room.player2.username;
      const loserName = winnerId === room.player1.id ? room.player2.username : room.player1.username;
      const winnerAvatar = winnerId === room.player1.id ? room.player1.avatar : room.player2.avatar;
      const loserAvatar = winnerId === room.player1.id ? room.player2.avatar : room.player1.avatar;

      console.log(`Game history saved: Winner ${winnerId} (${winnerName}) (${winScore}-${loseScore}) vs Loser ${loserId} (${loserName})`);
      if (isTournamentMatch) {
        console.log(`Tournament Match: Tournament String ID ${tournamentStringId}, DB ID ${tournamentDbId}, Round ${tournamentRound}`);
        console.log(`Player Names: Winner=${winnerName} (Avatar: ${winnerAvatar || 'N/A'}), Loser=${loserName} (Avatar: ${loserAvatar || 'N/A'})`);
      }
      console.log(`Stats: Duration: ${duration}s, Longest Rally: ${stats.longestRally}, Avg Rally: ${averageRally.toFixed(2)}, Max Speed: ${ballMaxSpeedMetersPerSecond?.toFixed(2) || 0}m/s`);
      console.log(`Touches - Winner: ${touchesWin}, Loser: ${touchesLose}`);
      console.log(`Streaks - Winner: ${maxStreakWin}, Loser: ${maxStreakLose}`);
      console.log(`Leading Time - Winner: ${Math.floor(maxLeadingTimeWin)}s, Loser: ${Math.floor(maxLeadingTimeLose)}s`);
    } catch (error) {
      console.error('Error saving game history:', error);
      // If persistence failed, allow a retry from another path.
      if (room) {
        room.historySaved = false;
        room.historySavedAt = null;
      }
    }
  }

  // Cleanup expired invitations (older than 30 seconds)
  cleanupExpiredInvitations() {
    const now = Date.now();
    for (const [friendId, invitation] of this.pendingInvitations.entries()) {
      if (now - invitation.timestamp > 30000) {
        this.pendingInvitations.delete(friendId);
      }
    }

    // Also cleanup expired accepted challenges (older than 5 minutes)
    const CHALLENGE_EXPIRY = 5 * 60 * 1000; // 5 minutes
    for (const [challengeId, challenge] of this.acceptedChallenges.entries()) {
      if (now - challenge.timestamp > CHALLENGE_EXPIRY) {
        this.acceptedChallenges.delete(challengeId);
      }
    }

    // Cleanup expired random opponent queue entries (older than 2 minutes)
    const RANDOM_OPPONENT_EXPIRY = 2 * 60 * 1000; // 2 minutes
    for (const [key, entry] of this.randomOpponentQueue.entries()) {
      if (now - entry.timestamp > RANDOM_OPPONENT_EXPIRY) {
        this.randomOpponentQueue.delete(key);
      }
    }
  }

  // Cleanup disconnected players
  handlePlayerDisconnect(playerId) {


    // Remove from matchmaking
    this.removeFromMatchmakingQueue(playerId);

    // Remove from any rooms
    const found = this.findRoomByPlayer(playerId);


    if (found) {

      this.removePlayer(found.roomCode, playerId);

    }

    // Clean up pending invitations
    for (const [friendId, invitation] of this.pendingInvitations.entries()) {
      if (invitation.from === playerId) {
        this.pendingInvitations.delete(friendId);
      }
    }

    // Clean up accepted challenges where this player is involved
    for (const [challengeId, challenge] of this.acceptedChallenges.entries()) {
      if (challenge.inviterId === playerId || challenge.acceptorId === playerId) {
        this.acceptedChallenges.delete(challengeId);
      }
    }

    // Clean up tournament-related data

    this.handleTournamentDisconnect(playerId);

  }

  // ==================== TOURNAMENT MANAGEMENT ====================

  // Generate unique tournament ID
  generateTournamentId() {
    return `T${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  // Create a new tournament
  createTournament(hostId, hostInfo, playerCount, isPrivate, tournamentName) {
    const tournamentId = this.generateTournamentId();

    const tournament = {
      id: tournamentId,
      name: tournamentName || `${hostInfo.playerName}'s Tournament`,
      host: {
        id: hostId,
        name: hostInfo.playerName,
        avatar: hostInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
        color: hostInfo.color || '#3B82F6'
      },
      maxPlayers: playerCount,
      currentPlayers: 1,
      registeredPlayers: [{
        id: hostId,
        name: hostInfo.playerName,
        avatar: hostInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
        color: hostInfo.color || '#3B82F6'
      }],
      status: 'waiting',
      isPrivate: isPrivate || false,
      type: 'remote',
      playerCount: playerCount,
      bracket: null,
      createdAt: Date.now(),
      joinRequests: new Map() // requestId -> JoinRequest
    };

    this.tournaments.set(tournamentId, tournament);
    this.tournamentJoinRequests.set(tournamentId, new Map());

    // Save tournament to database
    try {
      const stmt = this.db.prepare(`
        INSERT INTO tournaments (name, host_id, status, player_count, is_private, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        tournament.name,
        hostId,
        'waiting',
        playerCount,
        isPrivate ? 1 : 0,
        new Date().toISOString()
      );
      const dbTournamentId = result.lastInsertRowid;
      console.log(`[createTournament] Tournament saved to database with ID: ${dbTournamentId}, name: ${tournament.name}`);

      // Store the database ID in the tournament object for later reference
      tournament.dbId = dbTournamentId;
    } catch (error) {
      console.error('[createTournament] Error saving tournament to database:', error);
    }

    return { tournament, tournamentId };
  }

  // Search for available tournaments (returns real-time data)
  searchTournaments(userId) {
    const availableTournaments = [];
    const now = Date.now();

    for (const [tournamentId, tournament] of this.tournaments.entries()) {
      // Skip if tournament is full or finished
      if (tournament.currentPlayers >= tournament.maxPlayers || tournament.status === 'finished') {
        continue;
      }

      // Skip if tournament is too old (older than 1 hour) and has no players
      if (tournament.currentPlayers === 1 && (now - tournament.createdAt) > 3600000) {
        continue;
      }

      // Skip if user is already in this tournament
      if (tournament.registeredPlayers.some(p => p.id === userId)) {
        continue;
      }

      // For private tournaments, only show if user has an invite
      if (tournament.isPrivate) {
        const invites = this.tournamentInvites.get(userId.toString()) || [];
        if (!invites.some(inv => inv.tournamentId === tournamentId)) {
          continue;
        }
      }

      // Return real-time tournament data
      availableTournaments.push({
        id: tournament.id,
        name: tournament.name,
        host: tournament.host,
        maxPlayers: tournament.maxPlayers,
        currentPlayers: tournament.currentPlayers,
        registeredPlayers: tournament.registeredPlayers,
        status: tournament.status,
        isPrivate: tournament.isPrivate,
        type: tournament.type,
        playerCount: tournament.playerCount
      });
    }

    // Sort by most recent first
    return availableTournaments.sort((a, b) => {
      const tournamentA = this.tournaments.get(a.id);
      const tournamentB = this.tournaments.get(b.id);
      if (!tournamentA || !tournamentB) return 0;
      return tournamentB.createdAt - tournamentA.createdAt;
    });
  }

  // Directly join a tournament (for public tournaments)
  joinTournament(tournamentId, playerId, playerInfo) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return { error: 'Tournament is full' };
    }

    // Check if player is already registered
    if (tournament.registeredPlayers.some(p => p.id === playerId)) {
      return { error: 'You are already registered in this tournament' };
    }

    // For private tournaments, require an invite
    if (tournament.isPrivate) {
      const invites = this.tournamentInvites.get(playerId.toString()) || [];
      if (!invites.some(inv => inv.tournamentId === tournamentId)) {
        return { error: 'You need an invitation to join this private tournament' };
      }
    }

    // Add player directly to tournament
    tournament.registeredPlayers.push({
      id: playerId,
      name: playerInfo.playerName,
      avatar: playerInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
      color: playerInfo.color || '#10B981'
    });
    tournament.currentPlayers++;

    // Notify the player that they joined
    const playerSocket = this.usersSocket.get(playerId.toString());
    if (playerSocket) {
      this.sendToPlayer(playerSocket, {
        type: 'tournamentJoined',
        data: {
          tournamentId: tournamentId,
          tournament: this.getTournamentData(tournament)
        }
      });
    }

    // Notify host that a player joined
    const hostSocket = this.usersSocket.get(tournament.host.id.toString());
    if (hostSocket) {
      this.sendToPlayer(hostSocket, {
        type: 'tournamentPlayerJoined',
        data: {
          tournamentId: tournamentId,
          player: {
            id: playerId,
            name: playerInfo.playerName,
            avatar: playerInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png'
          },
          currentPlayers: tournament.currentPlayers,
          maxPlayers: tournament.maxPlayers
        }
      });
    }

    // Broadcast tournament update to all players (including host and newly joined player)
    this.broadcastTournamentUpdate(tournament);

    return { success: true, tournament: this.getTournamentData(tournament) };
  }

  // Request to join a tournament (for private tournaments that require approval)
  requestJoinTournament(tournamentId, playerId, playerInfo) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return { error: 'Tournament is full' };
    }

    // Check if player is already registered
    if (tournament.registeredPlayers.some(p => p.id === playerId)) {
      return { error: 'You are already registered in this tournament' };
    }

    // Check if tournament is private and user has invite
    if (tournament.isPrivate) {
      const invites = this.tournamentInvites.get(playerId.toString()) || [];
      if (!invites.some(inv => inv.tournamentId === tournamentId)) {
        return { error: 'You need an invitation to join this tournament' };
      }
    }

    // Create join request
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const joinRequest = {
      id: requestId,
      player: {
        id: playerId,
        name: playerInfo.playerName,
        avatar: playerInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
        color: playerInfo.color || '#10B981'
      },
      tournamentId: tournamentId,
      status: 'pending',
      timestamp: Date.now()
    };

    const requests = this.tournamentJoinRequests.get(tournamentId);
    requests.set(requestId, joinRequest);

    // Notify host
    const hostSocket = this.usersSocket.get(tournament.host.id.toString());
    if (hostSocket) {
      this.sendToPlayer(hostSocket, {
        type: 'tournamentJoinRequest',
        data: {
          tournamentId: tournamentId,
          request: joinRequest
        }
      });
    }

    return { success: true, requestId };
  }

  // Approve a join request
  approveJoinRequest(tournamentId, requestId, hostId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Verify host
    if (tournament.host.id !== hostId) {
      return { error: 'Only the host can approve requests' };
    }

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return { error: 'Tournament is full' };
    }

    const requests = this.tournamentJoinRequests.get(tournamentId);
    const request = requests.get(requestId);
    if (!request || request.status !== 'pending') {
      return { error: 'Join request not found or already processed' };
    }

    // Add player to tournament
    tournament.registeredPlayers.push(request.player);
    tournament.currentPlayers++;

    // Update request status
    request.status = 'approved';
    requests.delete(requestId);

    // Notify the newly approved player with full tournament data
    const playerSocket = this.usersSocket.get(request.player.id.toString());
    if (playerSocket) {
      this.sendToPlayer(playerSocket, {
        type: 'tournamentJoinApproved',
        data: {
          tournamentId: tournamentId,
          tournament: this.getTournamentData(tournament)
        }
      });
    }

    // Notify host about the approval
    const hostSocket = this.usersSocket.get(tournament.host.id.toString());
    if (hostSocket) {
      this.sendToPlayer(hostSocket, {
        type: 'joinRequestApproved',
        data: {
          player: request.player
        }
      });
    }

    // Broadcast tournament update to all registered players
    // This ensures all players (including host) see the new player immediately
    this.broadcastTournamentUpdate(tournament);

    // Don't auto-start tournament - wait for host to customize and start
    // The tournament will be started when host sends startTournament action after customization

    return { success: true };
  }

  // Decline a join request
  declineJoinRequest(tournamentId, requestId, hostId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Verify host
    if (tournament.host.id !== hostId) {
      return { error: 'Only the host can decline requests' };
    }

    const requests = this.tournamentJoinRequests.get(tournamentId);
    const request = requests.get(requestId);
    if (!request) {
      return { error: 'Join request not found' };
    }

    // Update request status
    request.status = 'declined';
    requests.delete(requestId);

    // Notify the player
    const playerSocket = this.usersSocket.get(request.player.id.toString());
    if (playerSocket) {
      this.sendToPlayer(playerSocket, {
        type: 'tournamentJoinDeclined',
        data: {
          message: 'Your join request was declined',
          tournamentId: tournamentId
        }
      });
    }

    // Notify host
    const hostSocket = this.usersSocket.get(tournament.host.id.toString());
    if (hostSocket) {
      this.sendToPlayer(hostSocket, {
        type: 'joinRequestDeclined',
        data: {
          player: request.player
        }
      });
    }

    return { success: true };
  }

  // Invite a friend to tournament
  inviteToTournament(tournamentId, hostId, friendId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Verify host
    if (tournament.host.id !== hostId) {
      return { error: 'Only the host can invite players' };
    }

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return { error: 'Tournament is full' };
    }

    // Check if friend is already registered
    if (tournament.registeredPlayers.some(p => p.id === friendId)) {
      return { error: 'Friend is already registered in this tournament' };
    }

    // Add invite to in-memory map
    const friendInvites = this.tournamentInvites.get(friendId.toString()) || [];
    if (!friendInvites.some(inv => inv.tournamentId === tournamentId)) {
      friendInvites.push({
        tournamentId: tournamentId,
        tournamentName: tournament.name,
        host: tournament.host,
        timestamp: Date.now()
      });
      this.tournamentInvites.set(friendId.toString(), friendInvites);
    }

    // Create database notification (similar to game challenges)
    try {
      const title = "tournament invite";
      const notifyBody = `invited you to join a tournament`;

      // Get host's profile image
      const getHostStmt = this.db.prepare('SELECT profile_img, username FROM users WHERE id_user = ?');
      const hostUser = getHostStmt.get(hostId);

      // Calculate expiration time (15 minutes from now)
      const now = new Date();
      const expired = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
      const expiredStr = expired.toISOString().slice(0, 19).replace('T', ' ');

      // Insert notification into database
      // Note: tournamentId is stored in notifyBody as JSON or we can add a column
      // For now, we'll store it in notifyBody as a JSON string for tournament invites
      const notifyBodyWithTournamentId = JSON.stringify({
        message: notifyBody,
        tournamentId: tournamentId
      });
      const insertStmt = this.db.prepare(`
        INSERT INTO notification (getter_user, title, sender_user, notifyBody, expired)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertStmt.run(friendId, title, hostId, notifyBodyWithTournamentId, expiredStr);

      // Get the notification ID
      const getNotifyStmt = this.db.prepare(`
        SELECT notify_id FROM notification
        WHERE getter_user = ? AND sender_user = ? AND title = ?
        ORDER BY notify_id DESC LIMIT 1
      `);
      const notification = getNotifyStmt.get(friendId, hostId, title);

      // Send notify message to friend (for Navbar notification area)
      // Always try to send via WebSocket if friend is online
      // If offline, notification will be synced when they reconnect
      const friendSocket = this.usersSocket.get(friendId.toString());
      if (friendSocket && notification) {
        const notifyData = {
          getter_user: friendId,
          sender_user: hostId,
          sender_username: hostUser?.username || tournament.host.name,
          title: title,
          sender_profile_img: hostUser?.profile_img || tournament.host.avatar,
          notify_id: notification.notify_id,
          expired: expiredStr,
          tournamentId: tournamentId // Include tournamentId for acceptance
        };

        const sent = this.sendToPlayer(friendSocket, {
          type: 'notify',
          data: notifyData
        });

        if (sent) {
          console.log(`[GameManager] Tournament invite notification sent to friend ${friendId} via WebSocket`);
        } else {
          console.warn(`[GameManager] Failed to send tournament invite notification to friend ${friendId} (socket not open)`);
        }
      } else {
        if (!friendSocket) {
          console.log(`[GameManager] Friend ${friendId} is offline. Notification stored in database and will be synced on reconnect.`);
        }
        if (!notification) {
          console.error(`[GameManager] Failed to retrieve notification ID for tournament invite to friend ${friendId}`);
        }
      }
    } catch (error) {
      console.error('Error creating tournament invite notification:', error);
      // Continue even if notification creation fails
    }

    // Send tournamentInvite message (for tournament page)
    const friendSocket = this.usersSocket.get(friendId.toString());
    if (friendSocket) {
      this.sendToPlayer(friendSocket, {
        type: 'tournamentInvite',
        data: {
          tournamentId: tournamentId,
          tournament: this.getTournamentData(tournament),
          host: tournament.host
        }
      });
    }

    return { success: true };
  }

  // Accept tournament invite
  acceptTournamentInvite(tournamentId, playerId, playerInfo) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return { error: 'Tournament is full' };
    }

    // Check if player is already registered
    if (tournament.registeredPlayers.some(p => p.id === playerId)) {
      return { error: 'You are already registered in this tournament' };
    }

    // Remove invite
    const invites = this.tournamentInvites.get(playerId.toString()) || [];
    const filteredInvites = invites.filter(inv => inv.tournamentId !== tournamentId);
    this.tournamentInvites.set(playerId.toString(), filteredInvites);

    // Add player directly (no approval needed for invites)
    tournament.registeredPlayers.push({
      id: playerId,
      name: playerInfo.playerName,
      avatar: playerInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
      color: playerInfo.color || '#10B981'
    });
    tournament.currentPlayers++;

    // Notify player with full tournament data
    const playerSocket = this.usersSocket.get(playerId.toString());
    if (playerSocket) {
      this.sendToPlayer(playerSocket, {
        type: 'tournamentJoined',
        data: {
          tournamentId: tournamentId,
          tournament: this.getTournamentData(tournament)
        }
      });
    }

    // Broadcast tournament update to all players (including the newly joined player)
    // This ensures everyone has the latest state
    this.broadcastTournamentUpdate(tournament);

    // Don't auto-start tournament - wait for host to customize and start
    // The tournament will be started when host sends startTournament action after customization

    return { success: true, tournament: this.getTournamentData(tournament) };
  }

  // Decline tournament invite
  declineTournamentInvite(tournamentId, playerId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Remove invite from in-memory map
    const invites = this.tournamentInvites.get(playerId.toString()) || [];
    const filteredInvites = invites.filter(inv => inv.tournamentId !== tournamentId);
    this.tournamentInvites.set(playerId.toString(), filteredInvites);

    // Get player info for the message
    const getPlayerStmt = this.db.prepare('SELECT username FROM users WHERE id_user = ?');
    const player = getPlayerStmt.get(playerId);

    // Notify host that invitation was declined
    const hostSocket = this.usersSocket.get(tournament.host.id.toString());
    if (hostSocket && player) {
      this.sendToPlayer(hostSocket, {
        type: 'tournamentInviteDeclined',
        data: {
          tournamentId: tournamentId,
          playerId: playerId,
          playerName: player.username,
          message: `${player.username} declined your tournament invitation`
        }
      });
    }

    return { success: true };
  }

  // Find random opponent for tournament
  findRandomOpponent(tournamentId, hostId, playerInfo) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Verify host
    if (tournament.host.id !== hostId) {
      return { error: 'Only the host can find random opponents' };
    }

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return { error: 'Tournament is full' };
    }

    // IMPORTANT: Do NOT automatically add players without their consent
    // Only add tournament to queue to match with players who are ALSO actively searching
    // This ensures players must explicitly opt-in to be matched with tournaments
    const queueKey = `tournament-${tournamentId}`;

    // Check if already in queue
    if (this.randomOpponentQueue.has(queueKey)) {
      return { success: true, message: 'Already searching for random opponent...' };
    }

    // Add to queue for matching with players who are also searching
    this.randomOpponentQueue.set(queueKey, {
      tournamentId: tournamentId,
      playerInfo: playerInfo,
      timestamp: Date.now(),
      isTournamentSearch: true
    });

    // Try immediate match (only with players also in queue searching)
    this.tryMatchRandomOpponents();

    return { success: true, message: 'Searching for random opponent...' };
  }

  // Find an available player for tournament (not in any tournament or game)
  // Excludes host's friends - friends should only join via explicit invitation
  findAvailablePlayerForTournament(excludeTournamentId, hostId) {
    // Get all friends of the host to exclude them from random matching
    // Friends table is bidirectional: user_id-friend_id and friend_id-user_id are both valid
    const getFriendsStmt = this.db.prepare(`
      SELECT friend_id as friendId FROM friends WHERE user_id = ?
      UNION
      SELECT user_id as friendId FROM friends WHERE friend_id = ?
    `);
    const hostFriends = getFriendsStmt.all(hostId, hostId);
    const hostFriendIds = new Set(hostFriends.map(f => f.friendId));

    // Get all online users
    const onlineUserIds = Array.from(this.usersSocket.keys()).map(id => parseInt(id));

    // Filter out players who are:
    // 1. Already in a tournament
    // 2. In a game room
    // 3. In the matchmaking queue
    // 4. Friends of the host (friends should only join via explicit invitation)
    for (const userId of onlineUserIds) {
      // Skip if user is a friend of the host
      if (hostFriendIds.has(userId)) {
        continue;
      }

      // Check if player is in any tournament
      let isInTournament = false;
      for (const [tournamentId, tournament] of this.tournaments.entries()) {
        if (tournament.registeredPlayers.some(p => p.id === userId)) {
          isInTournament = true;
          break;
        }
      }
      if (isInTournament) continue;

      // Check if player is in a game room
      const inGame = this.findRoomByPlayer(userId);
      if (inGame) continue;

      // Check if player is in matchmaking queue
      const inQueue = this.matchmakingQueue.some(p => p.id === userId);
      if (inQueue) continue;

      // Found an available player (not a friend, not in tournament, not in game, not in queue)
      const getUserStmt = this.db.prepare('SELECT id_user, username FROM users WHERE id_user = ?');
      const user = getUserStmt.get(userId);
      if (user) {
        return { id: user.id_user, username: user.username };
      }
    }

    return null; // No available player found
  }












  // Try to match random opponents (called periodically or when new players join queue)
  // IMPORTANT: This method is currently disabled to prevent automatic player addition without consent.
  // Players can only join tournaments via:
  // 1. Explicit invitation (acceptTournamentInvite)
  // 2. Request to join + host approval (requestJoinTournament + approveJoinRequest)
  tryMatchRandomOpponents() {
    // DISABLED: Automatic matching removed to prevent players from being added without consent
    // The queue remains for potential future implementation where players can opt-in to random matching
    // For now, tournaments work on invite-only or request-to-join basis

    // Clean up stale queue entries (older than 5 minutes)
    const now = Date.now();
    const queueEntries = Array.from(this.randomOpponentQueue.entries());
    for (const [key, entry] of queueEntries) {
      if (entry.isTournamentSearch) {
        const tournament = this.tournaments.get(entry.tournamentId);
        // Remove if tournament doesn't exist, is full, or queue entry is stale
        if (!tournament ||
            tournament.currentPlayers >= tournament.maxPlayers ||
            (now - entry.timestamp) > 5 * 60 * 1000) {
          this.randomOpponentQueue.delete(key);
        }
      }
    }

    // No automatic matching - players must be invited or request to join
    return;
  }

  // Start tournament (create bracket)
  startTournament(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    if (tournament.currentPlayers !== tournament.maxPlayers) {
      return { error: 'Tournament is not full' };
    }

    // Create bracket (4 players: 2 semi-finals, 1 final)
    const bracket = this.createTournamentBracket(tournament.registeredPlayers);
    tournament.bracket = bracket;
    tournament.status = 'playing';

    // Update tournament status in database
    try {
      if (tournament.dbId) {
        const updateStmt = this.db.prepare('UPDATE tournaments SET status = ? WHERE id_tournament = ?');
        updateStmt.run('playing', tournament.dbId);
        console.log(`[startTournament] Tournament ${tournamentId} status updated to 'playing' in database`);
      }
    } catch (error) {
      console.error('[startTournament] Error updating tournament status in database:', error);
    }

    // Create game rooms for Round 1 matches and sync between players
    console.log(`[startTournament] Starting room creation for tournament ${tournamentId}`);
    console.log(`[startTournament] Bracket has ${bracket.length} matches`);
    console.log(`[startTournament] Available sockets: ${Array.from(this.usersSocket.keys()).join(', ')}`);

    for (const match of bracket) {
      // Process Round 1 matches (Match 1 and Match 2)
      // GUARD: Only create room if match is not already finished or playing
      if (match.round === 1 && (match.id === 1 || match.id === 2) && match.player1 && match.player2) {
        // Prevent creating room for already finished or playing matches
        if (match.status === 'finished') {
          console.log(`[startTournament] Skipping ${match.id === 1 ? 'MATCH 1' : 'MATCH 2'} - already finished`);
          continue;
        }
        if (match.status === 'playing' && match.roomCode) {
          console.log(`[startTournament] Skipping ${match.id === 1 ? 'MATCH 1' : 'MATCH 2'} - already playing with room ${match.roomCode}`);
          continue;
        }
        const isMatch1 = match.id === 1;
        const isMatch2 = match.id === 2;
        const matchLabel = isMatch1 ? 'MATCH 1' : 'MATCH 2';

        console.log(`[startTournament] ===== PROCESSING ${matchLabel} =====`);
        console.log(`[startTournament] ${matchLabel} - Player1 ID=${match.player1.id}, Player2 ID=${match.player2.id}`);
        console.log(`[startTournament] ${matchLabel} - Player1 Name=${match.player1.name}, Player2 Name=${match.player2.name}`);

        // Get player sockets from usersSocket map (try both string and number keys)
        const player1IdStr = match.player1.id.toString();
        const player2IdStr = match.player2.id.toString();
        const player1Socket = this.usersSocket.get(player1IdStr) || this.usersSocket.get(match.player1.id);
        const player2Socket = this.usersSocket.get(player2IdStr) || this.usersSocket.get(match.player2.id);

        // Check if both players are online (have active sockets)
        if (!player1Socket || !player2Socket) {
          console.error(`[startTournament] ${matchLabel} ERROR: Missing socket. Player1: ${!!player1Socket}, Player2: ${!!player2Socket}`);
          console.error(`[startTournament] Available socket keys: ${Array.from(this.usersSocket.keys()).join(', ')}`);
          continue; // Skip this match if players aren't online
        }

        // Verify sockets are open
        if (player1Socket.readyState !== 1 || player2Socket.readyState !== 1) {
          console.error(`[startTournament] ${matchLabel} ERROR: Socket not open. Player1 readyState=${player1Socket.readyState}, Player2 readyState=${player2Socket.readyState}`);
          continue;
        }

        console.log(`[startTournament] ${matchLabel}: Both sockets valid and open`);

        // Create player objects with required structure for createGameRoom
        // IMPORTANT: Include avatar and name for proper syncing
        const player1 = {
          id: match.player1.id,
          username: match.player1.name || match.player1.username,  // Bracket uses 'name', createGameRoom expects 'username'
          avatar: match.player1.avatar || null,  // Include avatar for syncing
          socket: player1Socket,
          customization: tournament.customization || {}
        };

        const player2 = {
          id: match.player2.id,
          username: match.player2.name || match.player2.username,
          avatar: match.player2.avatar || null,  // Include avatar for syncing
          socket: player2Socket,
          customization: tournament.customization || {}
        };

        console.log(`[startTournament] ${matchLabel}: Player data:`, {
          player1: { id: player1.id, username: player1.username, hasAvatar: !!player1.avatar },
          player2: { id: player2.id, username: player2.username, hasAvatar: !!player2.avatar }
        });

        try {
          // Create tournament context for Match 1 or Match 2
          const tournamentContext = {
            tournamentId: tournamentId,
            matchId: match.id, // Match 1 or Match 2
            round: 1,   // Round 1
            matchNumber: match.id
          };

          console.log(`[startTournament] ${matchLabel}: Creating game room with context:`, tournamentContext);

          // Create the game room with tournament context (this also starts the game loop and sends matchFound messages)
          const roomResult = this.createGameRoom(player1, player2, tournamentContext);

          if (!roomResult || !roomResult.roomCode) {
            console.error(`[startTournament] ${matchLabel} ERROR: Failed to create game room`);
            continue;
          }

          // Store roomCode in the match object for reference
          // GUARD: Only set status to 'playing' if match is not already finished
          if (match.status !== 'finished') {
            match.roomCode = roomResult.roomCode;
            match.status = 'playing';
          } else {
            console.error(`[startTournament] ERROR: Attempted to set match ${match.id} to playing, but it's already finished`);
            continue;
          }

          console.log(`[startTournament] ${matchLabel}: Room created successfully - RoomCode: ${roomResult.roomCode}`);
          console.log(`[startTournament] ${matchLabel}: Room stored in gameRooms: ${this.gameRooms.has(roomResult.roomCode)}`);
          console.log(`[startTournament] ${matchLabel}: Game loop started: ${this.gameLoops.has(roomResult.roomCode)}`);

          // Verify room structure for Match 1 or Match 2
          const createdRoom = this.gameRooms.get(roomResult.roomCode);
          if (createdRoom) {
            console.log(`[startTournament] ${matchLabel} VERIFICATION:`, {
              hasTournamentContext: !!createdRoom.tournamentContext,
              matchId: createdRoom.tournamentContext?.matchId,
              round: createdRoom.tournamentContext?.round,
              player1Id: createdRoom.player1.id,
              player2Id: createdRoom.player2.id,
              player1Username: createdRoom.player1.username,
              player2Username: createdRoom.player2.username,
              player1Avatar: createdRoom.player1.avatar || 'NOT SET',
              player2Avatar: createdRoom.player2.avatar || 'NOT SET',
              gameStatePlayer1Username: createdRoom.gameState.player1.username,
              gameStatePlayer2Username: createdRoom.gameState.player2.username,
              gameStatePlayer1Avatar: createdRoom.gameState.player1.avatar || 'NOT SET',
              gameStatePlayer2Avatar: createdRoom.gameState.player2.avatar || 'NOT SET',
              player1SocketValid: createdRoom.player1.socket?.readyState === 1,
              player2SocketValid: createdRoom.player2.socket?.readyState === 1,
              gameStateHasContext: !!(createdRoom.gameState.tournamentId && createdRoom.gameState.matchId),
              gameStateMatchId: createdRoom.gameState.matchId,
              gameStateRound: createdRoom.gameState.round
            });
          }

          // Send initial gameState to both players to ensure they're synced
          // The game loop will continue sending updates every frame
          console.log(`[startTournament] ${matchLabel}: Broadcasting initial gameState to both players`);
          this.broadcastGameState(roomResult.roomCode, roomResult.gameState);

          // Verify broadcast was successful
          console.log(`[startTournament] ${matchLabel}: Initial gameState broadcast completed`);

          console.log(`[startTournament] ✓✓✓ ${matchLabel} SUCCESS: Room ${roomResult.roomCode} - ${player1.username} vs ${player2.username} ✓✓✓`);
        } catch (error) {
          console.error(`[startTournament] ${matchLabel} ERROR:`, error);
        }
      }
    }

    // Broadcast tournament update
    this.broadcastTournamentUpdate(tournament);

    return { success: true, bracket };
  }

  // Create tournament bracket
  // STRICT: Remote tournaments must have exactly 3 matches (2 Round 1, 1 Round 2)
  createTournamentBracket(players) {
    const bracket = [];
    let matchId = 1;

    if (players.length === 4) {
      // Semi-finals (Round 1) - Match 1 and Match 2 run simultaneously
      bracket.push({
        id: matchId++, // Match 1
        round: 1,
        player1: players[0],
        player2: players[1],
        status: 'pending'
      });
      bracket.push({
        id: matchId++, // Match 2
        round: 1,
        player1: players[2],
        player2: players[3],
        status: 'pending'
      });
      // Final (Round 2) - Match 3 (only starts after both Round 1 matches finish)
      bracket.push({
        id: matchId++, // Match 3
        round: 2,
        status: 'pending'
      });
    }

    // VALIDATION: Ensure exactly 3 matches were created
    if (bracket.length !== 3) {
      console.error(`[createTournamentBracket] ERROR: Expected 3 matches, got ${bracket.length}`);
      throw new Error(`Invalid bracket: expected 3 matches, got ${bracket.length}`);
    }

    // VALIDATION: Verify match IDs are 1, 2, 3
    const matchIds = bracket.map(m => m.id).sort();
    if (matchIds[0] !== 1 || matchIds[1] !== 2 || matchIds[2] !== 3) {
      console.error(`[createTournamentBracket] ERROR: Invalid match IDs: ${matchIds.join(', ')}`);
      throw new Error(`Invalid bracket: match IDs must be 1, 2, 3`);
    }

    // VALIDATION: Verify Round 1 matches have players, Round 2 does not
    const round1Matches = bracket.filter(m => m.round === 1);
    const round2Matches = bracket.filter(m => m.round === 2);
    if (round1Matches.length !== 2 || round2Matches.length !== 1) {
      console.error(`[createTournamentBracket] ERROR: Invalid round distribution - Round 1: ${round1Matches.length}, Round 2: ${round2Matches.length}`);
      throw new Error(`Invalid bracket: must have 2 Round 1 matches and 1 Round 2 match`);
    }

    for (const match of round1Matches) {
      if (!match.player1 || !match.player2) {
        console.error(`[createTournamentBracket] ERROR: Round 1 match ${match.id} missing players`);
        throw new Error(`Invalid bracket: Round 1 match ${match.id} must have both players`);
      }
    }

    if (round2Matches[0].player1 || round2Matches[0].player2) {
      console.error(`[createTournamentBracket] ERROR: Round 2 match should not have players initially`);
      throw new Error(`Invalid bracket: Round 2 match should not have players initially`);
    }

    console.log(`[createTournamentBracket] ✓ Created bracket with exactly 3 matches: Match 1 (Round 1), Match 2 (Round 1), Match 3 (Round 2)`);
    return bracket;
  }

  // Handle match result and advance tournament
  handleMatchResult(tournamentId, matchId, winner, reportedByUserId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {

      return { error: 'Tournament not found' };
    }

    const bracket = tournament.bracket;
    if (!bracket) {

      return { error: 'Tournament bracket not found' };
    }

    // Find the match
    const match = bracket.find(m => m.id === matchId);
    if (!match) {

      return { error: 'Match not found' };
    }



    // GUARD: Verify the match is in progress - prevent replaying finished matches
    if (match.status === 'finished') {

      console.log(`[handleMatchResult] Match ${matchId} already finished, rejecting result report`);
      return { error: 'Match already finished' };
    }

    // GUARD: Prevent reporting result for matches that haven't started
    if (match.status === 'pending' && !match.roomCode) {

      console.log(`[handleMatchResult] Match ${matchId} has not started yet (no room), rejecting result report`);
      return { error: 'Match has not started yet' };
    }

    // Verify winner is one of the players in the match
    const winnerId = (winner.id || winner.id_user).toString();
    const player1Id = match.player1.id.toString();
    const player2Id = match.player2.id.toString();


    if (player1Id !== winnerId && player2Id !== winnerId) {

      return { error: 'Winner must be one of the match players' };
    }

    // Update match with winner
    match.winner = winner;
    match.status = 'finished';

    const matchLoserId = (player1Id === winnerId ? player2Id : player1Id).toString();

    console.log(`[handleMatchResult] Match ${matchId} finished. Winner: ${winner.name || winner.username}`);
    console.log(`[handleMatchResult] Match details:`, {
      matchId,
      round: match.round,
      status: match.status,
      hasWinner: !!match.winner,
      player1Id: match.player1?.id,
      player2Id: match.player2?.id
    });

    // Check if this is a Round 1 match
    if (match.round === 1) {
      // Check if both Round 1 matches are finished
      const round1Matches = bracket.filter(m => m.round === 1);
      console.log(`[handleMatchResult] Round 1 matches status:`, round1Matches.map(m => ({
        id: m.id,
        status: m.status,
        hasWinner: !!m.winner,
        winnerName: m.winner?.name || m.winner?.username
      })));

      const allRound1Finished = round1Matches.every(m => m.status === 'finished' && m.winner);
      console.log(`[handleMatchResult] All Round 1 matches finished? ${allRound1Finished}`);

      if (allRound1Finished) {
        const finalMatch = bracket.find(m => m.round === 2);
        const sortedSemis = round1Matches.sort((a, b) => a.id - b.id);
        const semi1 = sortedSemis[0];
        const semi2 = sortedSemis[1];

        // GUARD: Check if final match is already playing or finished
        if (finalMatch && (finalMatch.status === 'playing' || finalMatch.status === 'finished')) {
          console.log(`[handleMatchResult] Final match already ${finalMatch.status} for tournament ${tournamentId}, skipping`);
          return { success: true, bracket };
        }

        // GUARD: Check if final match is already set up and scheduled (status is 'pending' with players)
        // This means it was already scheduled by the first Round 1 match to finish
        if (finalMatch && finalMatch.status === 'pending' && finalMatch.player1 && finalMatch.player2) {
          // If creatingFinalMatch flag is set, the setTimeout is already scheduled, so skip
          if (this.creatingFinalMatch.has(tournamentId)) {
            console.log(`[handleMatchResult] Final match already set up and scheduled for tournament ${tournamentId}, skipping duplicate scheduling`);
            return { success: true, bracket };
          }

          // Final match is pending with players - this is expected
          // Players must manually click "Proceed to Final Match" button to create the room
          // DO NOT auto-create - it will be created via ensureFinalMatchRoom when both players are ready
          console.log(`[handleMatchResult] Final match is pending with players for tournament ${tournamentId}. Waiting for both players to click "Proceed to Final Match" button.`);
          return { success: true, bracket };
        }

        if (finalMatch && semi1?.winner && semi2?.winner) {
          // Set final match players but DO NOT auto-create the room
          // Players must manually click "Proceed to Final Match" button
          // This prevents the match from being skipped if a player leaves before they're ready
          finalMatch.player1 = semi1.winner;
          finalMatch.player2 = semi2.winner;
          finalMatch.status = 'pending';
          finalMatch.winner = null;
          finalMatch.roomCode = null; // No room yet - will be created when both players are ready

          console.log(`[handleMatchResult] Final match players set for tournament ${tournamentId}. Waiting for both players to click "Proceed to Final Match" button.`);
          // DO NOT auto-create final match room - it will be created via ensureFinalMatchRoom when both players are ready
        } else {
          console.error(`[handleMatchResult] ERROR: Missing final match or semi winners - cannot start final.`);
        }
      } else {
        console.log(`[handleMatchResult] Waiting for other Round 1 match to finish...`);
      }
    }

    // Final match (Round 2)
    if (match.round === 2) {
      console.log(`[handleMatchResult] Final match finished - declaring champion`);
      tournament.status = 'finished';
      tournament.champion = winner;

      // Update tournament in database
      try {
        if (tournament.dbId) {
          const updateStmt = this.db.prepare(`
            UPDATE tournaments
            SET status = ?, champion_id = ?, completed_at = ?
            WHERE id_tournament = ?
          `);
          updateStmt.run(
            'finished',
            winner.id || winner.id_user,
            new Date().toISOString(),
            tournament.dbId
          );
          console.log(`[handleMatchResult] Tournament ${tournamentId} updated in database with champion ${winner.name || winner.username}`);
        } else {
          console.warn(`[handleMatchResult] Tournament ${tournamentId} has no database ID, cannot update`);
        }
      } catch (error) {
        console.error('[handleMatchResult] Error updating tournament in database:', error);
      }

      // Clean up all tournament rooms
      const roomsToDelete = [];
      for (const [roomCode, room] of this.gameRooms.entries()) {
        if (room.tournamentContext && room.tournamentContext.tournamentId === tournamentId) {
          roomsToDelete.push(roomCode);
        }
      }
      for (const roomCode of roomsToDelete) {
        const gameLoop = this.gameLoops.get(roomCode);
        if (gameLoop) {
          clearInterval(gameLoop);
          this.gameLoops.delete(roomCode);
          console.log(`[handleMatchResult] Stopped game loop for tournament room ${roomCode}`);
        }
        this.gameRooms.delete(roomCode);
        console.log(`[handleMatchResult] Deleted tournament room ${roomCode} after final`);
      }

      // Broadcast tournament completion
      this.broadcastTournamentUpdate(tournament);
      for (const player of tournament.registeredPlayers) {
        const socket = this.usersSocket.get(player.id.toString());
        if (socket) {
          this.sendToPlayer(socket, {
            type: 'tournamentCompleted',
            data: {
              tournamentId,
              champion: tournament.champion,
              bracket
            }
          });
        }
      }

      // Clean up eliminated players tracking for this tournament
      if (this.eliminatedPlayers) {
        this.eliminatedPlayers.delete(tournamentId);
      }

      // Clean up disconnected players from registeredPlayers
      tournament.registeredPlayers = tournament.registeredPlayers.filter(p => !p.disconnected);

      return { success: true, bracket };
    }

    // Broadcast updated bracket to all players
    const broadcastLoserId = (player1Id === winnerId ? player2Id : player1Id).toString();

    // CRITICAL: Handle Round 1 elimination with special logic for host
    if (match.round === 1) {
      // Check if the loser is the tournament host
      const isHostLosing = tournament.host.id.toString() === broadcastLoserId;

      if (isHostLosing) {
        // TRANSFER HOST PRIVILEGES: Host loses match but tournament continues with new host
        console.log(`[handleMatchResult] Host ${broadcastLoserId} lost match ${matchId}, transferring host privileges`);

        // Initialize eliminated players tracking if needed
        if (!this.eliminatedPlayers) {
          this.eliminatedPlayers = new Map();
        }
        if (!this.eliminatedPlayers.has(tournamentId)) {
          this.eliminatedPlayers.set(tournamentId, new Set());
        }

        // Find remaining active players (not eliminated, not disconnected, AND not the old host)
        const activePlayers = tournament.registeredPlayers.filter(player => {
          const playerIdStr = player.id.toString();
          // Player is active if they're not eliminated, not disconnected, AND not the old host (who just lost)
          const isEliminated = this.eliminatedPlayers.get(tournamentId).has(playerIdStr);
          const isDisconnected = player.disconnected === true;
          const isOldHost = playerIdStr === broadcastLoserId;
          return !isEliminated && !isDisconnected && !isOldHost;
        });

        console.log(`[handleMatchResult] Found ${activePlayers.length} active players for host transfer: ${activePlayers.map(p => p.name || p.username).join(', ')}`);

        if (activePlayers.length > 0) {
          // Select new host: preferably the winner of this match, otherwise the first active player
          const winnerPlayer = activePlayers.find(p =>
            p.id.toString() === winnerId || p.id === winnerId
          );
          const newHost = winnerPlayer || activePlayers[0]; // Use first active player instead of random

          console.log(`[handleMatchResult] Transferring host from ${tournament.host.name} (${tournament.host.id}) to ${newHost.name} (${newHost.id})`);

          // Update tournament host
          tournament.host = {
            id: newHost.id,
            name: newHost.name,
            avatar: newHost.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
            color: newHost.color || '#3B82F6'
          };

          // Update host in database
          try {
            if (tournament.dbId) {
              const updateStmt = this.db.prepare('UPDATE tournaments SET host_id = ? WHERE id_tournament = ?');
              updateStmt.run(newHost.id, tournament.dbId);
              console.log(`[handleMatchResult] Updated tournament host in database: ${newHost.id}`);
            }
          } catch (error) {
            console.error('[handleMatchResult] Error updating tournament host in database:', error);
          }

          // Add old host to observers (they can still watch)
          if (!this.tournamentObservers) {
            this.tournamentObservers = new Map();
          }
          if (!this.tournamentObservers.has(tournamentId)) {
            this.tournamentObservers.set(tournamentId, new Set());
          }
          this.tournamentObservers.get(tournamentId).add(broadcastLoserId);

          // Broadcast host change to all players
          for (const player of tournament.registeredPlayers) {
            const socket = this.usersSocket.get(player.id.toString());
            if (socket) {
              this.sendToPlayer(socket, {
                type: 'tournamentHostChanged',
                data: {
                  tournamentId: tournamentId,
                  newHost: tournament.host,
                  reason: 'Previous host was eliminated'
                }
              });
            }
          }

          // Notify old host they lost but tournament continues
          const oldHostSocket = this.usersSocket.get(broadcastLoserId);
          if (oldHostSocket) {
            this.sendToPlayer(oldHostSocket, {
              type: 'tournamentEliminated',
              data: {
                tournamentId: tournamentId,
                matchId: matchId,
                message: 'You lost your match, but the tournament continues. You can watch as an observer.',
                isHostTransfer: true,
                newHost: newHost
              }
            });
          }

          // Notify new host about their promotion
          const newHostSocket = this.usersSocket.get(newHost.id.toString());
          if (newHostSocket) {
            this.sendToPlayer(newHostSocket, {
              type: 'becameTournamentHost',
              data: {
                tournamentId: tournamentId,
                message: 'You are now the tournament host!',
                reason: 'Previous host was eliminated'
              }
            });
          }

          // DO NOT add old host to eliminated players - they remain as observers
          console.log(`[handleMatchResult] Old host ${broadcastLoserId} remains as observer, new host: ${newHost.id}`);
        } else {
          // No active players left - cancel tournament as fallback
          const disconnectedCount = tournament.registeredPlayers.filter(p => p.disconnected).length;
          console.error(`[handleMatchResult] ERROR: No active players left after host elimination in tournament ${tournamentId}. Registered: ${tournament.registeredPlayers.length}, Eliminated: ${this.eliminatedPlayers.get(tournamentId).size}, Disconnected: ${disconnectedCount}`);
          // Fallback: cancel tournament
          this.cancelTournament(tournamentId, tournament.host.id);
          return { success: true, bracket };
        }
      } else {
        // Regular player elimination (not host)
        if (!this.eliminatedPlayers) {
          this.eliminatedPlayers = new Map();
        }
        if (!this.eliminatedPlayers.has(tournamentId)) {
          this.eliminatedPlayers.set(tournamentId, new Set());
        }
        this.eliminatedPlayers.get(tournamentId).add(broadcastLoserId);

        const loserSocket = this.usersSocket.get(broadcastLoserId);
        if (loserSocket) {
          // Send tournament elimination message to loser
          this.sendToPlayer(loserSocket, {
            type: 'tournamentEliminated',
            data: {
              tournamentId: tournamentId,
              matchId: matchId,
              message: 'You have been eliminated from the tournament. You will no longer receive tournament updates.'
            }
          });
          console.log(`[handleMatchResult] Disconnected loser ${broadcastLoserId} from tournament ${tournamentId} after Round 1 loss`);
        }
      }
    }

    this.broadcastTournamentUpdate(tournament);

    return { success: true, bracket };
  }

  // Create final match room (Round 2)
  createFinalMatchRoom(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    const finalMatch = tournament.bracket?.find(m => m.round === 2);
    if (!finalMatch) {
      return { error: 'Final match not found' };
    }

    if (!finalMatch.player1 || !finalMatch.player2) {
      return { error: 'Final match players not set yet' };
    }

    if (finalMatch.status === 'finished') {
      return { error: 'Final match already finished' };
    }

    if (finalMatch.status === 'playing' && finalMatch.roomCode) {
      // Clean up the creating flag since final match is already playing
      this.creatingFinalMatch.delete(tournamentId);
      return { success: true, roomCode: finalMatch.roomCode };
    }

    // Get player sockets
    const player1Socket = this.usersSocket.get(finalMatch.player1.id.toString()) || this.usersSocket.get(finalMatch.player1.id);
    const player2Socket = this.usersSocket.get(finalMatch.player2.id.toString()) || this.usersSocket.get(finalMatch.player2.id);

    if (!player1Socket || !player2Socket) {
      console.error(`[createFinalMatchRoom] ERROR: Missing socket for final. P1: ${!!player1Socket}, P2: ${!!player2Socket}`);
      return { error: 'Players not online for final match' };
    }

    if (player1Socket.readyState !== 1 || player2Socket.readyState !== 1) {
      console.error(`[createFinalMatchRoom] ERROR: Socket not open for final. P1: ${player1Socket.readyState}, P2: ${player2Socket.readyState}`);
      return { error: 'Sockets not open for final match' };
    }

    const player1 = {
      id: finalMatch.player1.id,
      username: finalMatch.player1.name || finalMatch.player1.username,
      avatar: finalMatch.player1.avatar || null,
      socket: player1Socket,
      customization: tournament.customization || {}
    };

    const player2 = {
      id: finalMatch.player2.id,
      username: finalMatch.player2.name || finalMatch.player2.username,
      avatar: finalMatch.player2.avatar || null,
      socket: player2Socket,
      customization: tournament.customization || {}
    };

    const tournamentContext = {
      tournamentId,
      matchId: finalMatch.id,
      round: 2,
      matchNumber: finalMatch.id
    };

    console.log(`[createFinalMatchRoom] Creating final match room for tournament ${tournamentId}`);

    const roomResult = this.createGameRoom(player1, player2, tournamentContext);
    if (!roomResult || !roomResult.roomCode) {
      console.error(`[createFinalMatchRoom] ERROR: Failed to create final match room`);
      return { error: 'Failed to create final match room' };
    }

    finalMatch.roomCode = roomResult.roomCode;
    finalMatch.status = 'playing';
    finalMatch.startedAt = Date.now(); // Track when final match started to prevent premature processing

    // Clean up the creating flag since final match is now successfully created
    this.creatingFinalMatch.delete(tournamentId);

    this.broadcastTournamentUpdate(tournament);
    return { success: true, roomCode: roomResult.roomCode };
  }


  // Get tournament data (sanitized for client)
  getTournamentData(tournament) {
    return {
      id: tournament.id,
      name: tournament.name,
      host: tournament.host,
      maxPlayers: tournament.maxPlayers,
      currentPlayers: tournament.currentPlayers,
      registeredPlayers: tournament.registeredPlayers,
      status: tournament.status,
      isPrivate: tournament.isPrivate,
      type: tournament.type,
      playerCount: tournament.playerCount,
      bracket: tournament.bracket
    };
  }

  // Broadcast tournament update to all registered players (including host)
  broadcastTournamentUpdate(tournament) {
    const tournamentData = this.getTournamentData(tournament);
    const sentTo = new Set(); // Track who we've sent to avoid duplicates

    // Track eliminated players (losers from Round 1) - they should NOT receive updates
    // We maintain a set of eliminated players per tournament
    if (!this.eliminatedPlayers) {
      this.eliminatedPlayers = new Map(); // tournamentId -> Set of eliminated player IDs
    }
    if (!this.eliminatedPlayers.has(tournament.id)) {
      this.eliminatedPlayers.set(tournament.id, new Set());
    }
    const eliminatedSet = this.eliminatedPlayers.get(tournament.id);

    // Track observers (eliminated hosts who can still watch)
    if (!this.tournamentObservers) {
      this.tournamentObservers = new Map(); // tournamentId -> Set of observer player IDs
    }
    if (!this.tournamentObservers.has(tournament.id)) {
      this.tournamentObservers.set(tournament.id, new Set());
    }
    const observerSet = this.tournamentObservers.get(tournament.id);

    // Send to all registered players (includes host) EXCEPT eliminated players
    for (const player of tournament.registeredPlayers) {
      if (sentTo.has(player.id)) continue; // Skip if already sent

      const playerIdStr = player.id.toString();

      // Skip eliminated players UNLESS they are observers (eliminated hosts)
      if (eliminatedSet.has(playerIdStr) && !observerSet.has(playerIdStr)) {
        console.log(`[broadcastTournamentUpdate] Skipping eliminated player ${playerIdStr} from tournament ${tournament.id} updates`);
        continue;
      }

      const socket = this.usersSocket.get(playerIdStr);
      if (socket) {
        const sent = this.sendToPlayer(socket, {
          type: 'tournamentUpdated',
          data: tournamentData
        });
        if (sent) {
          sentTo.add(player.id);
        } else {
          console.warn(`Failed to send tournament update to player ${player.id} (socket not open)`);
        }
      } else {
        console.warn(`Player ${player.id} not found in usersSocket map`);
      }
    }

    // Also ensure host gets update (in case host is not in registeredPlayers for some reason)
    if (!sentTo.has(tournament.host.id)) {
      const hostSocket = this.usersSocket.get(tournament.host.id.toString());
      if (hostSocket) {
        this.sendToPlayer(hostSocket, {
          type: 'tournamentUpdated',
          data: tournamentData
        });
      }
    }
  }

  // Cancel tournament (host only)
  cancelTournament(tournamentId, hostId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Verify host
    if (tournament.host.id !== hostId) {
      return { error: 'Only the host can cancel the tournament' };
    }

    // Notify all players (except host) that tournament is cancelled
    for (const player of tournament.registeredPlayers) {
      // Skip host - they're the one cancelling
      if (player.id === hostId) continue;

      const socket = this.usersSocket.get(player.id.toString());
      if (socket) {
        this.sendToPlayer(socket, {
          type: 'tournamentDisbanded',
          data: {
            tournamentId: tournamentId,
            reason: 'Tournament cancelled by host'
          }
        });
      }
    }

    // Clean up tournament data
    this.tournaments.delete(tournamentId);
    this.tournamentJoinRequests.delete(tournamentId);

    // Remove from random opponent queue
    for (const [key, entry] of this.randomOpponentQueue.entries()) {
      if (entry.isTournamentSearch && entry.tournamentId === tournamentId) {
        this.randomOpponentQueue.delete(key);
      }
    }

    // Remove tournament invites for this tournament
    for (const [playerId, invites] of this.tournamentInvites.entries()) {
      const filteredInvites = invites.filter(inv => inv.tournamentId !== tournamentId);
      if (filteredInvites.length === 0) {
        this.tournamentInvites.delete(playerId);
      } else {
        this.tournamentInvites.set(playerId, filteredInvites);
      }
    }

    return { success: true };
  }

  // Silent cleanup for completed tournaments (no user notifications)
  cleanupCompletedTournament(tournamentId, userId) {
    console.log(`[cleanupCompletedTournament] Starting cleanup for tournament ${tournamentId} by user ${userId}`);

    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      console.log(`[cleanupCompletedTournament] Tournament ${tournamentId} not found in active tournaments`);
      // Tournament might already be cleaned up, which is fine
      return { success: true };
    }

    console.log(`[cleanupCompletedTournament] Found tournament ${tournamentId} with status: ${tournament.status}`);

    // Allow any player to trigger cleanup (not just host)
    // This is called automatically after tournament completion

    // Clean up tournament data (same as cancelTournament)
    const wasDeleted = this.tournaments.delete(tournamentId);
    console.log(`[cleanupCompletedTournament] Tournament ${tournamentId} removed from active tournaments: ${wasDeleted}`);

    this.tournamentJoinRequests.delete(tournamentId);

    // Remove from random opponent queue
    let removedFromQueue = 0;
    for (const [key, entry] of this.randomOpponentQueue.entries()) {
      if (entry.isTournamentSearch && entry.tournamentId === tournamentId) {
        this.randomOpponentQueue.delete(key);
        removedFromQueue++;
      }
    }
    console.log(`[cleanupCompletedTournament] Removed ${removedFromQueue} entries from random opponent queue`);

    // Remove tournament invites for this tournament
    let cleanedInvites = 0;
    for (const [playerId, invites] of this.tournamentInvites.entries()) {
      const originalLength = invites.length;
      const filteredInvites = invites.filter(inv => inv.tournamentId !== tournamentId);
      if (filteredInvites.length !== originalLength) {
        cleanedInvites += (originalLength - filteredInvites.length);
        if (filteredInvites.length === 0) {
          this.tournamentInvites.delete(playerId);
        } else {
          this.tournamentInvites.set(playerId, filteredInvites);
        }
      }
    }
    console.log(`[cleanupCompletedTournament] Cleaned up ${cleanedInvites} tournament invites`);

    console.log(`[cleanupCompletedTournament] Successfully completed cleanup for tournament ${tournamentId}`);
    return { success: true };
  }

  // Leave tournament (non-host players only)
  leaveTournament(tournamentId, playerId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      return { error: 'Tournament not found' };
    }

    // Prevent host from using this method
    if (tournament.host.id === playerId) {
      return { error: 'Host cannot leave tournament. Use cancelTournament instead.' };
    }

    // Check if player is registered
    const playerIndex = tournament.registeredPlayers.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      return { error: 'You are not registered in this tournament' };
    }

    // Check if tournament has already started
    if (tournament.status === 'playing' || tournament.status === 'finished') {
      return { error: 'Cannot leave tournament that has already started' };
    }

    // Remove player from registeredPlayers
    tournament.registeredPlayers.splice(playerIndex, 1);
    tournament.currentPlayers--;

    // Remove player's tournament invites for this tournament
    const invites = this.tournamentInvites.get(playerId.toString()) || [];
    const filteredInvites = invites.filter(inv => inv.tournamentId !== tournamentId);
    if (filteredInvites.length === 0) {
      this.tournamentInvites.delete(playerId.toString());
    } else {
      this.tournamentInvites.set(playerId.toString(), filteredInvites);
    }

    // Notify the player that they've left
    const playerSocket = this.usersSocket.get(playerId.toString());
    if (playerSocket) {
      this.sendToPlayer(playerSocket, {
        type: 'tournamentLeft',
        data: {
          tournamentId: tournamentId,
          message: 'You have left the tournament'
        }
      });
    }

    // Broadcast tournament update to remaining players (including host)
    this.broadcastTournamentUpdate(tournament);

    // Get player info for host notification
    const getPlayerStmt = this.db.prepare('SELECT username FROM users WHERE id_user = ?');
    const player = getPlayerStmt.get(playerId);

    // Notify host that a player left
    const hostSocket = this.usersSocket.get(tournament.host.id.toString());
    if (hostSocket && player) {
      this.sendToPlayer(hostSocket, {
        type: 'tournamentPlayerLeft',
        data: {
          tournamentId: tournamentId,
          playerId: playerId,
          playerName: player.username,
          message: `${player.username} left the tournament`,
          currentPlayers: tournament.currentPlayers,
          maxPlayers: tournament.maxPlayers
        }
      });
    }

    return { success: true };
  }

  // Handle player socket reconnection (update socket reference in active game rooms)
  handlePlayerReconnect(playerId, newSocket) {
    if (!newSocket || newSocket.readyState !== 1) {
      console.warn(`[handlePlayerReconnect] New socket for player ${playerId} is not open (readyState: ${newSocket?.readyState})`);
      return false;
    }

    const found = this.findRoomByPlayer(playerId);
    if (found && found.room) {
      const matchId = found.room.tournamentContext?.matchId;
      const isMatch1 = matchId === 1;
      const isMatch2 = matchId === 2;
      const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : null);
      const oldSocket = found.room.player1.id === playerId ? found.room.player1.socket : found.room.player2.socket;
      const socketWasStale = !oldSocket || oldSocket.readyState !== 1;

      // CRITICAL: Atomically update socket to prevent race conditions
      if (found.room.player1.id === playerId) {
        found.room.player1.socket = newSocket;
        if (matchLabel) {
          console.log(`[handlePlayerReconnect] ${matchLabel}: Updated socket for player1 (${playerId}) in room ${found.roomCode}${socketWasStale ? ' (was stale)' : ''}`);
        } else {
          console.log(`[GameManager] Updated socket for player1 (${playerId}) in room ${found.roomCode}${socketWasStale ? ' (was stale)' : ''}`);
        }
      } else if (found.room.player2.id === playerId) {
        found.room.player2.socket = newSocket;
        if (matchLabel) {
          console.log(`[handlePlayerReconnect] ${matchLabel}: Updated socket for player2 (${playerId}) in room ${found.roomCode}${socketWasStale ? ' (was stale)' : ''}`);
        } else {
          console.log(`[GameManager] Updated socket for player2 (${playerId}) in room ${found.roomCode}${socketWasStale ? ' (was stale)' : ''}`);
        }
      }

      // Immediately send current game state to reconnected player to sync them
      // This ensures they get the latest state immediately after reconnecting
      if (socketWasStale) {
        this.broadcastGameState(found.roomCode, found.room.gameState);
        if (matchLabel) {
          if (matchLabel) {
            console.log(`[handlePlayerReconnect] ${matchLabel}: Sent current game state to reconnected player ${playerId}`);
          }
        } else {
          console.log(`[GameManager] Sent current game state to reconnected player ${playerId} in room ${found.roomCode}`);
        }
      }

      return true;
    }
    return false;
  }

  // Verify Match 1 synchronization (for testing)
  verifyMatch1Sync(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || !tournament.bracket) {
      return { error: 'Tournament or bracket not found' };
    }

    const match1 = tournament.bracket.find(m => m.id === 1 && m.round === 1);
    if (!match1 || !match1.roomCode) {
      return { error: 'Match 1 room not found' };
    }

    const room = this.gameRooms.get(match1.roomCode);
    if (!room) {
      return { error: 'Match 1 room not in gameRooms' };
    }

    const isMatch1 = room.tournamentContext && room.tournamentContext.matchId === 1;
    if (!isMatch1) {
      return { error: 'Room is not Match 1' };
    }

    // Get fresh socket references
    const p1Socket = this.usersSocket.get(room.player1.id.toString());
    const p2Socket = this.usersSocket.get(room.player2.id.toString());

    const verification = {
      roomCode: match1.roomCode,
      tournamentContext: {
        tournamentId: room.tournamentContext.tournamentId,
        matchId: room.tournamentContext.matchId,
        round: room.tournamentContext.round
      },
      players: {
        player1: {
          id: room.player1.id,
          username: room.player1.username,
          socketInRoom: !!room.player1.socket,
          socketInMap: !!p1Socket,
          socketValid: p1Socket?.readyState === 1,
          socketReadyState: room.player1.socket?.readyState
        },
        player2: {
          id: room.player2.id,
          username: room.player2.username,
          socketInRoom: !!room.player2.socket,
          socketInMap: !!p2Socket,
          socketValid: p2Socket?.readyState === 1,
          socketReadyState: room.player2.socket?.readyState
        }
      },
      gameState: {
        hasTournamentContext: !!(room.gameState.tournamentId && room.gameState.matchId),
        tournamentId: room.gameState.tournamentId,
        matchId: room.gameState.matchId,
        round: room.gameState.round,
        player1Score: room.gameState.player1.score,
        player2Score: room.gameState.player2.score,
        ballX: room.gameState.ball.x,
        ballY: room.gameState.ball.y
      },
      gameLoop: {
        isRunning: this.gameLoops.has(match1.roomCode)
      },
      synchronization: {
        bothSocketsValid: (p1Socket?.readyState === 1) && (p2Socket?.readyState === 1),
        roomSocketsMatchMap: (room.player1.socket === p1Socket) && (room.player2.socket === p2Socket),
        gameStateHasContext: !!(room.gameState.tournamentId && room.gameState.matchId),
        allChecksPassed: false
      }
    };

    // Calculate overall sync status
    verification.synchronization.allChecksPassed =
      verification.synchronization.bothSocketsValid &&
      verification.synchronization.gameStateHasContext &&
      verification.gameLoop.isRunning;

    console.log(`[verifyMatch1Sync] Match 1 Synchronization Status:`, JSON.stringify(verification, null, 2));

    return { success: true, verification };
  }

  // Handle game challenge decline message forwarding
  handleGameChallengeDecline(declinerId, declinerUsername, friendId) {
    const friendSocket = this.usersSocket.get(friendId.toString());
    if (friendSocket) {
      this.sendToPlayer(friendSocket, {
        type: 'game_challenge_declined',
        data: {
          declinedBy: declinerId,
          declinedByUsername: declinerUsername,
          friendId: friendId
        }
      });
      return true;
    }
    return false;
  }

  // Check and cancel expired tournaments (not full within 2 minutes)
  checkExpiredTournaments() {
    const now = Date.now();
    const TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes in milliseconds
    const tournamentsToCancel = [];

    for (const [tournamentId, tournament] of this.tournaments.entries()) {
      // Only check waiting tournaments that are not full
      if (tournament.status === 'waiting' && tournament.currentPlayers < tournament.maxPlayers) {
        const age = now - tournament.createdAt;

        // If tournament is older than 2 minutes and not full, mark for cancellation
        if (age >= TIMEOUT_MS) {
          tournamentsToCancel.push(tournamentId);
        }
      }
    }

    // Cancel expired tournaments
    for (const tournamentId of tournamentsToCancel) {
      const tournament = this.tournaments.get(tournamentId);
      if (!tournament) continue;

      // Notify all players (including host) that tournament timed out
      for (const player of tournament.registeredPlayers) {
        const socket = this.usersSocket.get(player.id.toString());
        if (socket) {
          this.sendToPlayer(socket, {
            type: 'tournamentDisbanded',
            data: {
              tournamentId: tournamentId,
              reason: 'Tournament timed out: Could not find enough players within 2 minutes'
            }
          });
        }
      }

      // Also notify host if they're not in registeredPlayers
      if (!tournament.registeredPlayers.some(p => p.id === tournament.host.id)) {
        const hostSocket = this.usersSocket.get(tournament.host.id.toString());
        if (hostSocket) {
          this.sendToPlayer(hostSocket, {
            type: 'tournamentCancelled',
            data: {
              tournamentId: tournamentId,
              message: 'Tournament timed out: Could not find enough players within 2 minutes'
            }
          });
        }
      }

      // Clean up tournament data
      this.tournaments.delete(tournamentId);
      this.tournamentJoinRequests.delete(tournamentId);

      // Remove from random opponent queue
      for (const [key, entry] of this.randomOpponentQueue.entries()) {
        if (entry.isTournamentSearch && entry.tournamentId === tournamentId) {
          this.randomOpponentQueue.delete(key);
        }
      }

      // Remove tournament invites for this tournament
      for (const [playerId, invites] of this.tournamentInvites.entries()) {
        const filteredInvites = invites.filter(inv => inv.tournamentId !== tournamentId);
        if (filteredInvites.length === 0) {
          this.tournamentInvites.delete(playerId);
        } else {
          this.tournamentInvites.set(playerId, filteredInvites);
        }
      }

      console.log(`[GameManager] Tournament ${tournamentId} cancelled due to timeout (not full within 2 minutes)`);
    }
  }

  // Start periodic cleanup tasks
  startPeriodicTasks() {
    // Cleanup expired invitations every 30 seconds
    setInterval(() => {
      this.cleanupExpiredInvitations();
    }, 30000);

    // Try to match random opponents for tournaments every 5 seconds
    setInterval(() => {
      this.tryMatchRandomOpponents();
    }, 5000);

    // Check for expired tournaments (not full within 2 minutes) every 10 seconds
    setInterval(() => {
      this.checkExpiredTournaments();
    }, 10000); // Check every 10 seconds

    // Periodic tournament state sync: Broadcast updates to keep all players synchronized
    // This ensures players see real-time updates even if they missed a message
    setInterval(() => {
      for (const [tournamentId, tournament] of this.tournaments.entries()) {
        // Only sync active tournaments (waiting or playing)
        if (tournament.status === 'waiting' || tournament.status === 'playing') {
          // Broadcast current state to all players every 15 seconds
          this.broadcastTournamentUpdate(tournament);
        }
      }
    }, 15000); // Sync every 15 seconds

    console.log('[GameManager] Periodic tasks started');
  }

  // Handle tournament player disconnect
  handleTournamentDisconnect(playerId) {


    // Check if player is in an active match BEFORE removing from tournament
    const foundRoom = this.findRoomByPlayer(playerId);


    // Remove from random opponent queue (check all entries)
    for (const [key, entry] of this.randomOpponentQueue.entries()) {
      if (entry.isTournamentSearch) {
        // Check if this tournament search is for a tournament this player hosts
        const tournament = this.tournaments.get(entry.tournamentId);
        if (tournament && tournament.host.id === playerId) {
          this.randomOpponentQueue.delete(key);
        }
      } else if (key === playerId.toString() || (entry.playerInfo && entry.playerInfo.playerId === playerId)) {
        this.randomOpponentQueue.delete(key);
      }
    }

    // Remove tournament invites
    this.tournamentInvites.delete(playerId.toString());

    // Find tournaments where player is registered
    for (const [tournamentId, tournament] of this.tournaments.entries()) {
      const playerIndex = tournament.registeredPlayers.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        // Handle disconnection based on tournament status
        if (tournament.status === 'waiting') {
          // For waiting tournaments, remove player completely
          tournament.registeredPlayers.splice(playerIndex, 1);
          tournament.currentPlayers--;
          console.log(`[handleTournamentDisconnect] Removed player ${playerId} from waiting tournament ${tournamentId}`);
        } else if (tournament.status === 'playing') {
          // For active tournaments, mark player as disconnected but keep in registeredPlayers
          // This allows tournament logic to continue with remaining active players
          const disconnectedPlayer = tournament.registeredPlayers[playerIndex];
          disconnectedPlayer.disconnected = true;
          disconnectedPlayer.disconnectedAt = Date.now();
          console.log(`[handleTournamentDisconnect] Marked player ${playerId} as disconnected in active tournament ${tournamentId}`);

          // If this player was in a match, handle match continuation
          if (tournament.bracket) {
            const activeMatch = tournament.bracket.find(m =>
              m.status === 'playing' &&
              m.player1 && m.player2 &&
              (m.player1.id?.toString() === playerId.toString() || m.player2.id?.toString() === playerId.toString())
            );

            if (activeMatch) {
              console.log(`[handleTournamentDisconnect] Player ${playerId} was in active match ${activeMatch.id}, match will continue with remaining player`);
              // The game loop will handle the disconnected player naturally
            }
          }
        } else {
          // For finished/completed tournaments, just remove them
          tournament.registeredPlayers.splice(playerIndex, 1);
          tournament.currentPlayers--;
          console.log(`[handleTournamentDisconnect] Removed player ${playerId} from finished tournament ${tournamentId}`);
        }

        // Clean up final match readiness tracking if player was waiting for final match
        if (this.finalMatchReady.has(tournamentId)) {
          const readySet = this.finalMatchReady.get(tournamentId);
          const playerIdStr = playerId.toString();
          if (readySet.has(playerIdStr)) {
            readySet.delete(playerIdStr);
            console.log(`[handleTournamentDisconnect] Removed player ${playerIdStr} from final match readiness for tournament ${tournamentId}`);
            // If Set is now empty, remove it
            if (readySet.size === 0) {
              this.finalMatchReady.delete(tournamentId);
            }
          }
        }

        // Clean up observers if player was an observer
        if (this.tournamentObservers?.has(tournamentId)) {
          const observerSet = this.tournamentObservers.get(tournamentId);
          const playerIdStr = playerId.toString();
          if (observerSet.has(playerIdStr)) {
            observerSet.delete(playerIdStr);
            console.log(`[handleTournamentDisconnect] Removed observer ${playerIdStr} from tournament ${tournamentId}`);
            // If Set is now empty, remove it
            if (observerSet.size === 0) {
              this.tournamentObservers.delete(tournamentId);
            }
          }
        }

        // If host disconnected, disband tournament (but not if tournament already completed)
        if (tournament.host.id === playerId && tournament.status !== 'finished' && tournament.status !== 'completed') {
          console.log(`[handleTournamentDisconnect] Host ${playerId} disconnected from active tournament ${tournamentId} - disbanding`);
          // Notify all players
          this.broadcastTournamentUpdate(tournament);
          for (const player of tournament.registeredPlayers) {
            const socket = this.usersSocket.get(player.id.toString());
            if (socket) {
              this.sendToPlayer(socket, {
                type: 'tournamentDisbanded',
                data: { tournamentId: tournamentId, reason: 'Host disconnected' }
              });
            }
          }
          // Remove tournament
          this.tournaments.delete(tournamentId);
          this.tournamentJoinRequests.delete(tournamentId);
          // Clean up final match readiness for this tournament
          this.finalMatchReady.delete(tournamentId);
        } else if (tournament.host.id === playerId && (tournament.status === 'finished' || tournament.status === 'completed')) {
          console.log(`[handleTournamentDisconnect] Host ${playerId} disconnected from completed tournament ${tournamentId} - silent cleanup`);
          // Tournament already completed, just clean up silently
          this.tournaments.delete(tournamentId);
          this.tournamentJoinRequests.delete(tournamentId);
          this.finalMatchReady.delete(tournamentId);
        } else {
          // Broadcast update
          this.broadcastTournamentUpdate(tournament);
        }
      }
    }
  }
}

export default GameManager;

