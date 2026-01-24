

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 12; 
const BALL_SPEED = 5; 
const WINNING_SCORE = 5;

class GameManager {
  constructor(db, usersSocket) {
    this.db = db;
    this.usersSocket = usersSocket;
    this.matchmakingQueue = [];
    this.gameRooms = new Map();
    this.gameLoops = new Map();
    this.pendingInvitations = new Map(); 
    this.rematchRequests = new Map(); 
    this.acceptedChallenges = new Map(); 
  }

  
  getExpiredTime(minutesFromNow = 5) {
    const now = new Date();
    const expired = new Date(now.getTime() + minutesFromNow * 60 * 1000);

    const pad = (n) => n.toString().padStart(2, '0');

    const year = expired.getFullYear().toString().slice(-2);
    const month = pad(expired.getMonth() + 1);
    const day = pad(expired.getDate());
    const hours = pad(expired.getHours());
    const minutes = pad(expired.getMinutes());
    const seconds = pad(expired.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  
  generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  
  initializeGameState(player1, player2) {
    const gameState = {
      player1: {
        id: player1.id,
        username: player1.username,
        avatar: player1.avatar || null,  
        y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        score: 0,
        customization: player1.customization || {}
      },
      player2: {
        id: player2.id,
        username: player2.username,
        avatar: player2.avatar || null,  
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

    return gameState;
  }

  
  addToMatchmakingQueue(player) {
    
    const existingIndex = this.matchmakingQueue.findIndex(p => p.id === player.id);
    if (existingIndex !== -1) {
      return { error: 'Already in matchmaking queue' };
    }

    
    const existingRoom = this.findRoomByPlayer(player.id);
    if (existingRoom) {
      return { error: 'Already in a game' };
    }

    this.matchmakingQueue.push(player);

    
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift();
      const player2 = this.matchmakingQueue.shift();
      return this.createGameRoom(player1, player2);
    }

    return { status: 'searching' };
  }

  
  removeFromMatchmakingQueue(playerId) {
    const index = this.matchmakingQueue.findIndex(p => p.id === playerId);
    if (index !== -1) {
      this.matchmakingQueue.splice(index, 1);
      return true;
    }
    return false;
  }

  
  createGameRoom(player1, player2) {
    const roomCode = this.generateRoomCode();
    const gameState = this.initializeGameState(player1, player2);

    
    
    const freshP1Socket = this.usersSocket.get(player1.id.toString());
    const freshP2Socket = this.usersSocket.get(player2.id.toString());

    
    const validP1Socket = (freshP1Socket && freshP1Socket.readyState === 1) ? freshP1Socket : player1.socket;
    const validP2Socket = (freshP2Socket && freshP2Socket.readyState === 1) ? freshP2Socket : player2.socket;

    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    

    const room = {
      id: roomCode,
      historySaved: false,
      historySavedAt: null,
      player1: {
        id: player1.id,
        username: player1.username,
        avatar: player1.avatar || null,  
        socket: validP1Socket, 
        customization: player1.customization || {}
      },
      player2: {
        id: player2.id,
        username: player2.username,
        avatar: player2.avatar || null,  
        socket: validP2Socket, 
        customization: player2.customization || {}
      },
      gameState,
      lastUpdate: Date.now(),
      startTime: Date.now(), 
      createdAt: Date.now(), 
      paddleDirections: {
        player1: 'stop',
        player2: 'stop'
      },
      
      stats: {
        currentRally: 0, 
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
      }
    };

    this.gameRooms.set(roomCode, room);
    this.startGameLoop(roomCode);

    
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

  
  findRoomByPlayer(playerId) {
    const playerIdStr = String(playerId);
    for (const [roomCode, room] of this.gameRooms.entries()) {
      if (String(room.player1.id) === playerIdStr || String(room.player2.id) === playerIdStr) {
        return { roomCode, room };
      }
    }
    return null;
  }

  
  handlePaddleMove(playerId, direction) {
    const found = this.findRoomByPlayer(playerId);
    if (!found) {

      console.warn(`[handlePaddleMove] Player ${playerId} not found in any room`);
      return;
    }

    const { room, roomCode } = found;

    
    
    const playerIdStr = String(playerId);
    if (String(room.player1.id) === playerIdStr) {
      room.paddleDirections.player1 = direction;
      
    } else if (String(room.player2.id) === playerIdStr) {
      room.paddleDirections.player2 = direction;
      
    } else {
      console.warn(`[handlePaddleMove] Player ${playerId} not found in room ${roomCode}`);
    }
  }

  
  updatePaddles(room) {
    const { paddleDirections, gameState } = room;

    
    if (paddleDirections.player1 === 'up') {
      gameState.player1.y = Math.max(0, gameState.player1.y - PADDLE_SPEED);
    } else if (paddleDirections.player1 === 'down') {
      gameState.player1.y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.player1.y + PADDLE_SPEED);
    }

    
    if (paddleDirections.player2 === 'up') {
      gameState.player2.y = Math.max(0, gameState.player2.y - PADDLE_SPEED);
    } else if (paddleDirections.player2 === 'down') {
      gameState.player2.y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, gameState.player2.y + PADDLE_SPEED);
    }
  }

  
  updateBall(gameState, room) {
    const { ball } = gameState;
    const stats = room.stats;

    
    ball.x += ball.dx;
    ball.y += ball.dy;

    
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > GAME_HEIGHT) {
      ball.dy = -ball.dy;
      ball.y = Math.max(BALL_RADIUS, Math.min(GAME_HEIGHT - BALL_RADIUS, ball.y));
    }

    
    if (ball.x - BALL_RADIUS < 10 + PADDLE_WIDTH &&
        ball.x - BALL_RADIUS > 10 &&
        ball.y > gameState.player1.y &&
        ball.y < gameState.player1.y + PADDLE_HEIGHT) {
      ball.dx = -ball.dx * 1.02; 
      ball.x = 10 + PADDLE_WIDTH + BALL_RADIUS;

      
      stats.player1Touches++;
      stats.totalTouches++;
      
      
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * 60 * 0.003425;
      if (speed > stats.maxBallSpeed) stats.maxBallSpeed = speed;
    }

    
    if (ball.x + BALL_RADIUS > GAME_WIDTH - PADDLE_WIDTH - 10 &&
        ball.x + BALL_RADIUS < GAME_WIDTH - 10 &&
        ball.y > gameState.player2.y &&
        ball.y < gameState.player2.y + PADDLE_HEIGHT) {
      ball.dx = -ball.dx * 1.02; 
      ball.x = GAME_WIDTH - PADDLE_WIDTH - 10 - BALL_RADIUS;

      
      stats.player2Touches++;
      stats.totalTouches++;
      
      
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * 60 * 0.003425;
      if (speed > stats.maxBallSpeed) stats.maxBallSpeed = speed;
    }

    
    let ballReset = false;
    if (ball.x + BALL_RADIUS < 0) {
      
      gameState.player2.score++;
      ballReset = true;
    } else if (ball.x - BALL_RADIUS > GAME_WIDTH) {
      
      gameState.player1.score++;
      ballReset = true;
    }

    if (ballReset) {
      
      stats.currentRally = 0;

      ball.x = GAME_WIDTH / 2;
      ball.y = GAME_HEIGHT / 2;
      ball.dx = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
      ball.dy = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
    }
  }

  
  checkWinner(gameState) {
    if (gameState.player1.score >= WINNING_SCORE) {
      return gameState.player1.username;
    } else if (gameState.player2.score >= WINNING_SCORE) {
      return gameState.player2.username;
    }
    return null;
  }

  
  startGameLoop(roomCode) {
    const interval = setInterval(() => {
      try {
        const room = this.gameRooms.get(roomCode);
        if (!room) {
          clearInterval(interval);
          this.gameLoops.delete(roomCode);
          return;
        }

        
        
        const freshP1Socket = this.usersSocket.get(room.player1.id.toString());
        const freshP2Socket = this.usersSocket.get(room.player2.id.toString());

        
        if (freshP1Socket && freshP1Socket.readyState === 1) {
          room.player1.socket = freshP1Socket;
        }
        if (freshP2Socket && freshP2Socket.readyState === 1) {
          room.player2.socket = freshP2Socket;
        }

        
        
        const p1SocketValid = room.player1.socket && room.player1.socket.readyState === 1;
        const p2SocketValid = room.player2.socket && room.player2.socket.readyState === 1;

        if (!p1SocketValid || !p2SocketValid) {
          
          clearInterval(interval);
          this.gameLoops.delete(roomCode);


          
          let winnerId, loserId, winnerUsername, loserUsername;
          let disconnectedPlayer = null;
          let connectedPlayer = null;

          if (!p1SocketValid) {
            
            disconnectedPlayer = room.player1;
            connectedPlayer = room.player2;
            winnerId = room.player2.id;
            loserId = room.player1.id;
            winnerUsername = room.player2.username;
            loserUsername = room.player1.username;
            
            
            const finalWinningScore = Math.max(WINNING_SCORE, 5); 
            room.gameState.player2.score = finalWinningScore;
          } else if (!p2SocketValid) {
            
            disconnectedPlayer = room.player2;
            connectedPlayer = room.player1;
            winnerId = room.player1.id;
            loserId = room.player2.id;
            winnerUsername = room.player1.username;
            loserUsername = room.player2.username;
            
            
            const finalWinningScore = Math.max(WINNING_SCORE, 5); 
            room.gameState.player1.score = finalWinningScore;
          } else {
            
            this.gameRooms.delete(roomCode);
            return;
          }

          
          
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
                roomCode: roomCode
              }
            };



            const sent = this.sendToPlayer(connectedPlayer.socket, {
              type: 'gameOver',
              payload: gameOverPayload
            });



          } else {

          }

          
          this.saveGameHistory(room, true); 

          
          this.awardXP(winnerId, loserId, 500, 200, 'casual');

          
          this.gameRooms.delete(roomCode);

          return;
        }

        
        this.updatePaddles(room);

        
        const stats = room.stats;
        const now = Date.now();
        const p1Score = room.gameState.player1.score;
        const p2Score = room.gameState.player2.score;

        
        if (p1Score > stats.previousPlayer1Score) {
          
          stats.player1CurrentStreak++;
          stats.player2CurrentStreak = 0;
          if (stats.player1CurrentStreak > stats.player1MaxStreak) {
            stats.player1MaxStreak = stats.player1CurrentStreak;
          }
        } else if (p2Score > stats.previousPlayer2Score) {
          
          stats.player2CurrentStreak++;
          stats.player1CurrentStreak = 0;
          if (stats.player2CurrentStreak > stats.player2MaxStreak) {
            stats.player2MaxStreak = stats.player2CurrentStreak;
          }
        }

        
        if (p1Score > p2Score) {
          
          if (!stats.player1LeadingStart) {
            stats.player1LeadingStart = now;
          }
          if (stats.player2LeadingStart) {
            
            stats.player2LeadingTime += (now - stats.player2LeadingStart) / 1000; 
            stats.player2LeadingStart = null;
          }
        } else if (p2Score > p1Score) {
          
          if (!stats.player2LeadingStart) {
            stats.player2LeadingStart = now;
          }
          if (stats.player1LeadingStart) {
            
            stats.player1LeadingTime += (now - stats.player1LeadingStart) / 1000; 
            stats.player1LeadingStart = null;
          }
        } else {
          
          if (stats.player1LeadingStart) {
            stats.player1LeadingTime += (now - stats.player1LeadingStart) / 1000;
            stats.player1LeadingStart = null;
          }
          if (stats.player2LeadingStart) {
            stats.player2LeadingTime += (now - stats.player2LeadingStart) / 1000;
            stats.player2LeadingStart = null;
          }
        }

        
        stats.previousPlayer1Score = p1Score;
        stats.previousPlayer2Score = p2Score;

        
        this.updateBall(room.gameState, room);

        
        const winner = this.checkWinner(room.gameState);
        if (winner) {
          
          
          this.broadcastGameState(roomCode, room.gameState);

          
          clearInterval(interval);
          this.gameLoops.delete(roomCode);

          
          const gameOverPayload = {
            winner: winner,
            finalScore: {
              player1: room.gameState.player1.score,
              player2: room.gameState.player2.score
            },
            finalGameState: room.gameState 
          };

          
          const p1SocketValid = room.player1.socket && room.player1.socket.readyState === 1;
          const p2SocketValid = room.player2.socket && room.player2.socket.readyState === 1;

          
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

          
          const p1Sent = this.sendToPlayer(room.player1.socket, {
            type: 'gameOver',
            payload: gameOverPayload
          });

          const p2Sent = this.sendToPlayer(room.player2.socket, {
            type: 'gameOver',
            payload: gameOverPayload
          });

          
          if (!p1Sent) {
            console.warn(`[startGameLoop] Failed to send gameOver to player1 (${room.player1.id}) in room ${roomCode}`);
          }
          if (!p2Sent) {
            console.warn(`[startGameLoop] Failed to send gameOver to player2 (${room.player2.id}) in room ${roomCode}`);
          }

          
          
          
          setTimeout(() => {
            const finalRoom = this.gameRooms.get(roomCode);
            if (finalRoom) {
              
              this.broadcastGameState(roomCode, finalRoom.gameState);
            }
          }, 100); 

          
          this.saveGameHistory(room, false);

          
          const winnerId = winner === room.player1.username ? room.player1.id : room.player2.id;
          const loserId = winner === room.player1.username ? room.player2.id : room.player1.id;
          this.awardXP(winnerId, loserId, 500, 200, 'casual');

          
          return;
        }

        
        
        this.broadcastGameState(roomCode, room.gameState);
      } catch (error) {
        console.log('Error in game loop for room', roomCode, ':', error);
        
      }
    }, 1000 / 60); 

    this.gameLoops.set(roomCode, interval);
  }

  
  broadcastGameState(roomCode, gameState) {
    const room = this.gameRooms.get(roomCode);
    if (!room) {
   
      return;
    }

    
    
    
    const freshP1Socket = this.usersSocket.get(room.player1.id.toString());
    const freshP2Socket = this.usersSocket.get(room.player2.id.toString());

    
    let player1Socket = (freshP1Socket && freshP1Socket.readyState === 1) ? freshP1Socket : room.player1.socket;
    let player2Socket = (freshP2Socket && freshP2Socket.readyState === 1) ? freshP2Socket : room.player2.socket;

    
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

    
    const gameStateMessage = {
      type: 'gameState',
      payload: gameState,
      roomCode: roomCode, 
      timestamp: Date.now() 
    };

    
    const p1SocketValid = player1Socket && player1Socket.readyState === 1;
    const p2SocketValid = player2Socket && player2Socket.readyState === 1;



    
    
    const p1Sent = p1SocketValid ? this.sendToPlayer(player1Socket, gameStateMessage) : false;
    const p2Sent = p2SocketValid ? this.sendToPlayer(player2Socket, gameStateMessage) : false;

    
  
  }


  
  sendToPlayer(socket, message) {
    if (!socket) {
      
      return false;
    }

    if (socket.readyState === 1) { 
      try {
        const messageStr = JSON.stringify(message);
        socket.send(messageStr);
        return true;
      } catch (error) {
        console.log('[sendToPlayer] Error sending message:', error);
        return false;
      }
    } else {
      
      
      
      
      
      
      
      
      
      return false;
    }
  }

  
  removePlayer(roomCode, playerId, isBack) {
    const room = this.gameRooms.get(roomCode);

    if (!room) {
      
      
      
      return;
    }

    
    const loop = this.gameLoops.get(roomCode);
    if (loop) {
      clearInterval(loop);
      this.gameLoops.delete(roomCode);
    }

    
    const quitter = room.player1.id === playerId ? room.player1 : room.player2;
    const winner = room.player1.id === playerId ? room.player2 : room.player1;

    
    
    
    const finalWinningScore = Math.max(WINNING_SCORE, 5); 
    if (room.player1.id === playerId) {
      room.gameState.player2.score = finalWinningScore;
    } else {
      room.gameState.player1.score = finalWinningScore;
    }

    
    
    
    const freshWinnerSocket = this.usersSocket.get(winner.id.toString());
    const winnerSocket = (freshWinnerSocket && freshWinnerSocket.readyState === 1) ? freshWinnerSocket : winner.socket;

    if (winner && winnerSocket && winnerSocket.readyState === 1) {
      const gameOverPayload = {
        winner: winner.username,
        winnerId: winner.id,
        reason: `${isBack ? 'opponentClickedOnBack' :'opponentQuit' }`,
        message: `${quitter.username} quit the game. You win!`,
        finalScore: {
          player1: room.gameState.player1.score,
          player2: room.gameState.player2.score
        },
        finalGameState: {
          ...room.gameState,
          roomCode: roomCode
        }
      };

      const sent = this.sendToPlayer(winnerSocket, {
        type: 'gameOver',
        payload: gameOverPayload
      });

    } else {
      console.log(`[removePlayer] Cannot send gameOver - winner socket not available (roomCode: ${roomCode}, winnerId: ${winner?.id})`);
    }

    
    this.saveGameHistory(room, true); 

    
    this.awardXP(winner.id, quitter.id, 500, 200, 'casual');

    
    this.gameRooms.delete(roomCode);

  }

  
  sendFriendInvitation(fromUserId, fromUsername, friendId, customization) {
    const roomCode = this.generateRoomCode();

    
    this.pendingInvitations.set(friendId.toString(), {
      from: fromUserId, 
      fromUsername,
      roomCode,
      customization,
      timestamp: Date.now()
    });

    
    try {
      
      const getUserStmt = this.db.prepare('SELECT profile_img FROM users WHERE id_user = ?');
      const userResult = getUserStmt.get(fromUserId);

      
      const expiredTime = this.getExpiredTime(5); 
      const insertStmt = this.db.prepare(`
        INSERT INTO notification (getter_user, title, sender_user, notifyBody, expired)
        VALUES (?, ?, ?, ?, ?)
      `);

      const insertResult = insertStmt.run(friendId, "game challenge", fromUserId, "game challenge", expiredTime);
      const notifyId = insertResult.lastInsertRowid;

      
      const friendSocket = this.usersSocket.get(friendId.toString());
      if (friendSocket) {
        
        const senderQuery = this.db.prepare("SELECT profile_img FROM users WHERE id_user = ?");
        const senderResult = senderQuery.get(fromUserId);

        
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

        
        friendSocket.send(JSON.stringify({
          type: "notify",
          data: {
            notify_id: notifyId,
            getter_user: friendId,
            sender_user: fromUserId,
            sender_username: fromUsername,
            title: "game challenge",
            sender_profile_img: senderResult?.profile_img,
            expired: expiredTime
          }
        }));
      }
    } catch (error) {
      console.log('Error creating game invitation notification:', error);
      
    }

    return { roomCode };
  }

  
  
  
  acceptFriendInvitation(acceptorId, inviterId, acceptorUsername, acceptorSocket, acceptorCustomization) {
    
    const invitation = this.pendingInvitations.get(acceptorId.toString());
    if (!invitation) {
      return { error: 'Invitation not found or expired' };
    }

    
    if (invitation.from !== inviterId) {
      return { error: 'Invalid invitation' };
    }

    
    this.pendingInvitations.delete(acceptorId.toString());

    
    const inviterSocket = this.usersSocket.get(inviterId.toString());
    if (!inviterSocket) {
      return { error: 'Inviter is no longer online' };
    }

    
    const getUserStmt = this.db.prepare('SELECT username FROM users WHERE id_user = ?');
    const inviterUser = getUserStmt.get(inviterId);
    if (!inviterUser) {
      return { error: 'Inviter not found' };
    }

    
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

  
  requestRematch(roomCode, playerId) {
    const room = this.gameRooms.get(roomCode);
    if (!room) {
      return { error: 'Room not found' };
    }

    const opponent = room.player1.id === playerId ? room.player2 : room.player1;
    if (!opponent) {
      return { error: 'Opponent not found' };
    }

    
    this.rematchRequests.set(roomCode, {
      from: playerId,
      to: opponent.id
    });

    
    this.sendToPlayer(opponent.socket, {
      type: 'rematch:offer'
    });

    return { success: true };
  }

  
  acceptRematch(roomCode, playerId) {
    const room = this.gameRooms.get(roomCode);
    if (!room) {
      return { error: 'Room not found' };
    }

    const rematchRequest = this.rematchRequests.get(roomCode);
    
    if (!rematchRequest || rematchRequest.to !== playerId) {
      return { error: 'Invalid rematch request' };
    }

    
    const player1 = room.player1;
    const player2 = room.player2;
    room.gameState = this.initializeGameState(
      { id: player1.id, username: player1.username, customization: player1.customization },
      { id: player2.id, username: player2.username, customization: player2.customization }
    );
    room.paddleDirections = { player1: 'stop', player2: 'stop' };
    room.startTime = Date.now(); 

    
    room.historySaved = false;
    room.historySavedAt = null;

    
    room.stats = {
      currentRally: 0,
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

    
    this.rematchRequests.delete(roomCode);

    
    this.startGameLoop(roomCode);

    
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

  
  awardXP(winnerId, loserId, winnerXP, loserXP, gameType = 'casual') {
    try {
      
      if (gameType !== 'casual') {
        
        return;
      }

      
      const updateWinnerStmt = this.db.prepare('UPDATE users SET xp = xp + ? WHERE id_user = ?');
      updateWinnerStmt.run(winnerXP, winnerId);
      

      
      const updateLoserStmt = this.db.prepare('UPDATE users SET xp = xp + ? WHERE id_user = ?');
      updateLoserStmt.run(loserXP, loserId);
      
    } catch (error) {
      console.log('Error awarding XP:', error);
    }
  }

  
  saveGameHistory(room, isDisconnect = false) {
    try {
      if (!room) return;

      
      
      if (room.historySaved) {
        return;
      }
      room.historySaved = true;
      room.historySavedAt = Date.now();

      const stmt = this.db.prepare(`
        INSERT INTO game_history (
          user_win, user_lose, win_score, lose_score,
          type, tournament_id, duration,
          total_touches, points_per_second, ball_max_speed,
          touches_win, touches_lose,
          max_points_streak_win, max_points_streak_lose,
          max_leading_time_win, max_leading_time_lose,
          blockchain_hash
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

      
      const duration = room.startTime
        ? Math.floor((Date.now() - room.startTime) / 1000)
        : null;

      
      const now = Date.now();
      if (stats.player1LeadingStart) {
        stats.player1LeadingTime += (now - stats.player1LeadingStart) / 1000;
      }
      if (stats.player2LeadingStart) {
        stats.player2LeadingTime += (now - stats.player2LeadingStart) / 1000;
      }

      
      const totalTouches = stats.totalTouches || (stats.player1Touches + stats.player2Touches);
      const totalPoints = winScore + loseScore;
      
      const pointsPerSecond = totalPoints > 0 ? Math.round((duration / totalPoints) * 100) / 100 : 0;

      
      const touchesWin = winnerId === room.player1.id ? stats.player1Touches : stats.player2Touches;
      const touchesLose = winnerId === room.player1.id ? stats.player2Touches : stats.player1Touches;
      const maxStreakWin = winnerId === room.player1.id ? stats.player1MaxStreak : stats.player2MaxStreak;
      const maxStreakLose = winnerId === room.player1.id ? stats.player2MaxStreak : stats.player1MaxStreak;
      const maxLeadingTimeWin = winnerId === room.player1.id ? stats.player1LeadingTime : stats.player2LeadingTime;
      const maxLeadingTimeLose = winnerId === room.player1.id ? stats.player2LeadingTime : stats.player1LeadingTime;

      
      const ballMaxSpeedMetersPerSecond = stats.maxBallSpeed > 0
        ? Math.round(stats.maxBallSpeed * 100) / 100
        : null;

      const gameType = 'casual';

      stmt.run(
        winnerId,
        loserId,
        winScore,
        loseScore,
        gameType, 
        null, 
        duration,
        totalTouches || 0, 
        pointsPerSecond || 0, 
        ballMaxSpeedMetersPerSecond, 
        touchesWin || 0,
        touchesLose || 0,
        maxStreakWin || 0,
        maxStreakLose || 0,
        Math.floor(maxLeadingTimeWin), 
        Math.floor(maxLeadingTimeLose), 
        null 
      );

      
      const winnerName = winnerId === room.player1.id ? room.player1.username : room.player2.username;
      const loserName = winnerId === room.player1.id ? room.player2.username : room.player1.username;
      const winnerAvatar = winnerId === room.player1.id ? room.player1.avatar : room.player2.avatar;
      const loserAvatar = winnerId === room.player1.id ? room.player2.avatar : room.player1.avatar;

      
      
      
      
      
    } catch (error) {
      console.log('Error saving game history:', error);
      
      if (room) {
        room.historySaved = false;
        room.historySavedAt = null;
      }
    }
  }

  
  cleanupExpiredInvitations() {
    const now = Date.now();
    for (const [friendId, invitation] of this.pendingInvitations.entries()) {
      if (now - invitation.timestamp > 30000) {
        this.pendingInvitations.delete(friendId);
      }
    }

    
    const CHALLENGE_EXPIRY = 5 * 60 * 1000; 
    for (const [challengeId, challenge] of this.acceptedChallenges.entries()) {
      if (now - challenge.timestamp > CHALLENGE_EXPIRY) {
        this.acceptedChallenges.delete(challengeId);
      }
    }
  }

  
  startPeriodicTasks() {
    this.cleanupExpiredInvitations();
    const CLEANUP_INTERVAL_MS = 60 * 1000;
    this._cleanupInterval = setInterval(() => {
      this.cleanupExpiredInvitations();
    }, CLEANUP_INTERVAL_MS);
  }

  
  handlePlayerDisconnect(playerId) {


    
    this.removeFromMatchmakingQueue(playerId);

    
    const found = this.findRoomByPlayer(playerId);


    if (found) {

      this.removePlayer(found.roomCode, playerId, false);

    }

    
    for (const [friendId, invitation] of this.pendingInvitations.entries()) {
      if (invitation.from === playerId) {
        this.pendingInvitations.delete(friendId);
      }
    }

    
    for (const [challengeId, challenge] of this.acceptedChallenges.entries()) {
      if (challenge.inviterId === playerId || challenge.acceptorId === playerId) {
        this.acceptedChallenges.delete(challengeId);
      }
    }

  }
}

export default GameManager;

