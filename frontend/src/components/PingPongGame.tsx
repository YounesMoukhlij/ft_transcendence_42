'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameContext } from '../components/GameContext';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'next/navigation';
import { ServerGameState, Player } from '../types/game';

const PADDLE_HEIGHT = 100;
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
const PADDLE_WIDTH = 16;
const BALL_RADIUS = 10;
const WINNING_SCORE = 5;
const AI_WINNING_SCORE = 15; // AI games are first to 15 points

// AI difficulty settings
const AI_DIFFICULTY_SETTINGS = {
  easy: {
    speed: 4,           // Slower movement
    reactionDelay: 0.3, // Delay before reacting
    accuracy: 0.7,      // 70% accuracy in positioning
    prediction: false,   // No prediction
  },
  medium: {
    speed: 6,           // Medium movement
    reactionDelay: 0.15, // Small delay
    accuracy: 0.85,     // 85% accuracy
    prediction: true,    // Basic prediction
  },
  hard: {
    speed: 8,           // Fast movement
    reactionDelay: 0,   // Instant reaction
    accuracy: 0.95,     // 95% accuracy
    prediction: true,   // Advanced prediction
  },
};

// Unified Props for both Local and Remote
interface PingPongGameProps {
  // Remote game props
  serverGameState?: ServerGameState | null;
  opponentLeft?: boolean;
  setServerGameState?: (state: ServerGameState) => void;
  rematchDeclinedMessage?: string;
  setRematchDeclinedMessage?: (message: string) => void;
  rematchOffer?: boolean;
  handleAcceptRematch?: () => void;

  // Tournament mode props
  tournamentMode?: boolean;
  tournamentPlayers?: Player[];
  onTournamentMatchEnd?: (winner: Player) => void;
}

// Initial state for local game
const useLocalGameState = (players: Player[]) => {
  const [gameState, setGameState] = useState({
    scores: { player1: 0, player2: 0 },
    paddles: [GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2],
    ball: {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      vx: 5,
      vy: 5,
    },
  });

  const resetGameState = useCallback(() => {
    setGameState({
      scores: { player1: 0, player2: 0 },
      paddles: [GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2],
      ball: {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
        vx: Math.random() > 0.5 ? 5 : -5,
        vy: Math.random() > 0.5 ? 5 : -5,
      },
    });
  }, []);

  const updateGameState = useCallback((keysPressed: { [key: string]: boolean }, isAIMode: boolean = false, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    setGameState(prev => {
      // Paddles
      const newPaddles = [...prev.paddles];
      if (keysPressed['w']) newPaddles[0] -= 8;
      if (keysPressed['s']) newPaddles[0] += 8;

      // AI controls player 2 paddle (right side)
      if (isAIMode) {
        const settings = AI_DIFFICULTY_SETTINGS[difficulty];
        const ballX = prev.ball.x;
        const ballVx = prev.ball.vx;
        const ballVy = prev.ball.vy;
        const ballY = prev.ball.y;
        const aiPaddleCenter = newPaddles[1] + PADDLE_HEIGHT / 2;

        // Calculate target position with prediction for medium/hard
        let targetY = ballY;

        if (settings.prediction && ballVx > 0) {
          // Predict where the ball will be when it reaches the AI paddle
          const distanceToPaddle = (GAME_WIDTH - PADDLE_WIDTH - 10) - ballX;
          const timeToReach = distanceToPaddle / Math.abs(ballVx);
          const predictedY = ballY + (ballVy * timeToReach);

          // Clamp prediction to valid range
          targetY = Math.max(BALL_RADIUS, Math.min(GAME_HEIGHT - BALL_RADIUS, predictedY));
        }

        // Apply accuracy (for easy/medium, AI might not be perfectly accurate)
        const accuracyOffset = (1 - settings.accuracy) * (Math.random() - 0.5) * PADDLE_HEIGHT;
        targetY += accuracyOffset;

        // Only move AI if ball is on the right side or moving towards AI
        const shouldReact = ballX > GAME_WIDTH / 2 || (ballVx > 0 && ballX > GAME_WIDTH / 3);

        if (shouldReact) {
          const targetPaddleY = targetY - PADDLE_HEIGHT / 2;
          const diff = targetPaddleY - newPaddles[1];

          // Apply reaction delay for easy/medium
          const reactionFactor = settings.reactionDelay > 0 ? 0.7 : 1;

          // Move towards target with difficulty-based speed
          if (Math.abs(diff) > 2) {
            const moveAmount = diff * reactionFactor;
            if (diff > 0) {
              newPaddles[1] += Math.min(settings.speed, Math.abs(moveAmount)) * Math.sign(moveAmount);
            } else {
              newPaddles[1] += Math.max(-settings.speed, moveAmount);
            }
          }
        }
      } else {
        // Human controls for player 2 in local/tournament mode
        if (keysPressed['ArrowUp']) newPaddles[1] -= 8;
        if (keysPressed['ArrowDown']) newPaddles[1] += 8;
      }

      newPaddles[0] = Math.max(0, Math.min(newPaddles[0], GAME_HEIGHT - PADDLE_HEIGHT));
      newPaddles[1] = Math.max(0, Math.min(newPaddles[1], GAME_HEIGHT - PADDLE_HEIGHT));

      // Ball
      let { x, y, vx, vy } = prev.ball;
      x += vx;
      y += vy;

      // Wall collision
      if (y - BALL_RADIUS < 0 || y + BALL_RADIUS > GAME_HEIGHT) {
        vy = -vy;
      }

      // Paddle collision
      if (x - BALL_RADIUS < 10 + PADDLE_WIDTH && x - BALL_RADIUS > 10 && y > newPaddles[0] && y < newPaddles[0] + PADDLE_HEIGHT) {
        vx = -vx * 1.02;
        x = 10 + PADDLE_WIDTH + BALL_RADIUS; // prevent sticking
      }
      if (x + BALL_RADIUS > GAME_WIDTH - PADDLE_WIDTH - 10 && x + BALL_RADIUS < GAME_WIDTH - 10 && y > newPaddles[1] && y < newPaddles[1] + PADDLE_HEIGHT) {
        vx = -vx * 1.02;
        x = GAME_WIDTH - PADDLE_WIDTH - 10 - BALL_RADIUS; // prevent sticking
      }

      const newScores = { ...prev.scores };
      let ballReset = false;

      // Score
      if (x + BALL_RADIUS < 0) { // Ball passed left paddle
        newScores.player2++;
        ballReset = true;
      } else if (x - BALL_RADIUS > GAME_WIDTH) { // Ball passed right paddle
        newScores.player1++;
        ballReset = true;
      }

      const newBall = ballReset
        ? {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT / 2,
            vx: Math.random() > 0.5 ? 5 : -5,
            vy: Math.random() > 0.5 ? 2 : -2,
          }
        : { x, y, vx, vy };

      return {
        scores: newScores,
        paddles: newPaddles,
        ball: newBall,
      };
    });
  }, []);

  return { ...gameState, updateGameState, resetGameState };
};

const PingPongGame: React.FC<PingPongGameProps> = ({
  serverGameState,
  opponentLeft,
  setServerGameState,
  rematchDeclinedMessage,
  setRematchDeclinedMessage,
  rematchOffer,
  handleAcceptRematch,
  tournamentMode = false,
  tournamentPlayers = [],
  onTournamentMatchEnd
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const { gameState } = useGameContext();
  const { user, socket } = useUserStore();
  const router = useRouter();

  // Unified state
  const [winner, setWinner] = useState<string | null>(null);
  const [rematchRequested, setRematchRequested] = useState(false);

  // Interpolation state for smooth movement
  const previousGameStateRef = useRef<ServerGameState | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const interpolatedStateRef = useRef<ServerGameState | null>(null);
  const updateHistoryRef = useRef<Array<{ state: ServerGameState; timestamp: number }>>([]);

  // Local game state - use gameState.players for local mode, tournamentPlayers for tournament mode
  const localPlayers = tournamentMode ? tournamentPlayers : (gameState.mode === 'local' ? gameState.players : []);
  const { scores, paddles, ball, updateGameState, resetGameState } = useLocalGameState(localPlayers);

  // Track if we've initialized the game to prevent infinite loops
  const gameInitializedRef = useRef<string | null>(null);

  // Reset game state for new tournament match or AI game (only when mode changes)
  useEffect(() => {
    const currentMode = tournamentMode ? 'tournament' : gameState.mode;
    const modeKey = `${currentMode}-${tournamentMode ? tournamentPlayers.length : ''}`;

    // Only reset if the mode has actually changed
    if (gameInitializedRef.current !== modeKey) {
      if (tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local') {
        setWinner(null);
        resetGameState();
        keysPressed.current = {};
        gameInitializedRef.current = modeKey;
      }
    }
  }, [tournamentPlayers, tournamentMode, gameState.mode, resetGameState]);

  // Keyboard controls for local, remote, and AI modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (winner) return;
      if (tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local') {
        // Local tournament, AI mode, or local mode - use keyboard controls
        keysPressed.current[e.key] = true;
      } else { // Remote mode
        if (e.key === 'w' || e.key === 'ArrowUp') {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'up' } }));
          }
        } else if (e.key === 's' || e.key === 'ArrowDown') {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'down' } }));
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (winner) return;
        if (tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local') {
            // Local tournament, AI mode, or local mode - use keyboard controls
            keysPressed.current[e.key] = false;
        } else { // Remote mode
            if (
                e.key === 'w' ||
                e.key === 'ArrowUp' ||
                e.key === 's' ||
                e.key === 'ArrowDown'
            ) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'stop' } }));
                }
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket, user, winner, tournamentMode, gameState.mode]);

  // Game loop for local tournament, AI mode, and local mode
  useEffect(() => {
    const isLocalMode = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';
    if (!isLocalMode || winner) return;

    const gameLoop = setInterval(() => {
      const difficulty = (gameState.customisation?.aiDifficulty || 'medium') as 'easy' | 'medium' | 'hard';
      updateGameState(keysPressed.current, gameState.mode === 'ai', difficulty);
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [tournamentMode, gameState.mode, gameState.customisation?.aiDifficulty, winner, updateGameState]);


  // Check for winner in local tournament, AI mode, and local mode
  useEffect(() => {
    const isLocalMode = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';
    const winningScore = gameState.mode === 'ai' ? AI_WINNING_SCORE : WINNING_SCORE;

    if (!winner && isLocalMode) {
      if (tournamentMode && onTournamentMatchEnd && localPlayers.length >= 2) {
        if (scores.player1 >= WINNING_SCORE) {
          setWinner(localPlayers[0].name);
          onTournamentMatchEnd(localPlayers[0]);
        } else if (scores.player2 >= WINNING_SCORE) {
          setWinner(localPlayers[1].name);
          onTournamentMatchEnd(localPlayers[1]);
        }
      } else if (gameState.mode === 'ai') {
        // AI mode - check for winner
        if (scores.player1 >= AI_WINNING_SCORE) {
          setWinner('You');
        } else if (scores.player2 >= AI_WINNING_SCORE) {
          setWinner('AI');
        }
      } else if (gameState.mode === 'local' && localPlayers.length >= 2) {
        // Local mode - check for winner
        if (scores.player1 >= WINNING_SCORE) {
          setWinner(localPlayers[0].name);
        } else if (scores.player2 >= WINNING_SCORE) {
          setWinner(localPlayers[1].name);
        }
      }
    }
  }, [scores, tournamentMode, gameState.mode, onTournamentMatchEnd, localPlayers, winner]);

  // Check for winner in remote game
  useEffect(() => {
    if (!tournamentMode && gameState.mode !== 'ai' && serverGameState) {
      if (serverGameState.player1.score >= WINNING_SCORE) {
        setWinner(serverGameState.player1.username);
      } else if (serverGameState.player2.score >= WINNING_SCORE) {
        setWinner(serverGameState.player2.username);
      }
    }
  }, [serverGameState, tournamentMode, gameState.mode]);

  // Update interpolation state when server state changes (only for remote mode)
  useEffect(() => {
    if (!tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local' && serverGameState) {
      const now = Date.now();

      // Store previous state for interpolation
      if (interpolatedStateRef.current) {
        previousGameStateRef.current = { ...interpolatedStateRef.current };
      }

      // Update current state
      interpolatedStateRef.current = { ...serverGameState };
      lastUpdateTimeRef.current = now;

      // Keep a history of recent updates for better interpolation (keep last 3 updates)
      updateHistoryRef.current.push({ state: { ...serverGameState }, timestamp: now });
      if (updateHistoryRef.current.length > 3) {
        updateHistoryRef.current.shift();
      }
    } else if (!serverGameState || gameState.mode === 'ai' || gameState.mode === 'local') {
      // Reset interpolation state when game state is cleared or in AI/local mode
      previousGameStateRef.current = null;
      interpolatedStateRef.current = null;
      updateHistoryRef.current = [];
    }
  }, [serverGameState, tournamentMode, gameState.mode]);

  // Drawing logic (works for both modes)
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local') {
      const { customisation } = gameState;
      // Local Tournament, AI mode, or Local mode Draw
      ctx.fillStyle = customisation?.tableBg || '#333';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.setLineDash([]);

      // Player 1 paddle (left side - human player)
      ctx.fillStyle = customisation?.paddleColor || '#ff0000';
      ctx.fillRect(10, paddles[0], PADDLE_WIDTH, PADDLE_HEIGHT);

      // Player 2 paddle (right side - AI in AI mode, human in tournament mode)
      ctx.fillStyle = gameState.mode === 'ai' ? '#888888' : (customisation?.paddleColor || '#0000ff');
      ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, paddles[1], PADDLE_WIDTH, PADDLE_HEIGHT);

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = customisation?.ballColor || '#fff';
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '45px Arial';
      ctx.fillText(scores.player1.toString(), GAME_WIDTH / 2 - 100, 50);
      ctx.fillText(scores.player2.toString(), GAME_WIDTH / 2 + 60, 50);

    } else if (serverGameState) {
      // Remote Game Draw with interpolation for smooth movement
      let displayState = serverGameState;

      // Apply interpolation if we have previous state for smoother movement
      if (previousGameStateRef.current && interpolatedStateRef.current && !winner) {
        const now = Date.now();
        const timeSinceUpdate = now - lastUpdateTimeRef.current;

        // Calculate expected time between updates (60 FPS = ~16.67ms)
        const expectedUpdateInterval = 16.67;

        // Use a longer interpolation window for smoother movement (up to 50ms)
        // This handles network jitter better
        const interpolationDuration = expectedUpdateInterval * 2; // ~33ms
        const maxInterpolationTime = 50; // Don't interpolate if update is too old

        // Only interpolate if update is recent enough
        if (timeSinceUpdate < maxInterpolationTime) {
          const prev = previousGameStateRef.current;
          const curr = interpolatedStateRef.current;

          // Calculate interpolation factor (0 to 1)
          // If we're ahead of schedule, use extrapolation (factor > 1)
          // If we're behind, use interpolation (factor < 1)
          let interpolationFactor = timeSinceUpdate / interpolationDuration;

          // Clamp extrapolation to prevent too much prediction
          interpolationFactor = Math.min(interpolationFactor, 1.5);

          // Smooth interpolation function (ease-out for more natural movement)
          const smoothStep = (t: number) => t * t * (3 - 2 * t);
          const smoothedFactor = smoothStep(Math.min(interpolationFactor, 1));

          // Linear interpolation/extrapolation for smooth movement
          const lerp = (start: number, end: number, factor: number) => {
            if (factor <= 1) {
              // Interpolation
              return start + (end - start) * factor;
            } else {
              // Extrapolation (predict future position)
              // Calculate velocity from previous state
              const velocity = end - start;
              return end + velocity * (factor - 1) * 0.5; // Dampen extrapolation
            }
          };

          displayState = {
            ...curr,
            player1: {
              ...curr.player1,
              y: lerp(prev.player1.y, curr.player1.y, smoothedFactor)
            },
            player2: {
              ...curr.player2,
              y: lerp(prev.player2.y, curr.player2.y, smoothedFactor)
            },
            ball: {
              ...curr.ball,
              x: lerp(prev.ball.x, curr.ball.x, smoothedFactor),
              y: lerp(prev.ball.y, curr.ball.y, smoothedFactor)
            }
          };
        }
      }

      const { player1, player2, ball: remoteBall } = displayState;

      // Determine which player is the current user
      const currentUserId = user?.id_user;
      const isPlayer1 = currentUserId && player1.id === currentUserId;
      const isPlayer2 = currentUserId && player2.id === currentUserId;

      // Use current player's customization for table, ball, and own paddle
      // Use opponent's customization only for their paddle
      const currentPlayerCustom = isPlayer1 ? player1.customization :
                                  isPlayer2 ? player2.customization :
                                  player1.customization; // Fallback to player1 if user not identified
      const opponentCustom = isPlayer1 ? player2.customization :
                            isPlayer2 ? player1.customization :
                            player2.customization;

      // Table background - use current player's customization
      const tableBg = currentPlayerCustom?.tableBg || '#15803d';
      if (tableBg.includes('gradient') || tableBg.includes('linear-gradient')) {
        // Handle gradient backgrounds
        try {
          // Try to parse gradient and create canvas gradient
          const gradientMatch = tableBg.match(/linear-gradient\(([^)]+)\)/);
          if (gradientMatch) {
            const gradientParts = gradientMatch[1].split(',');
            const colors = gradientParts.filter(part => part.trim().startsWith('#'));
            if (colors.length > 0) {
              // Create a linear gradient
              const gradient = ctx.createLinearGradient(0, 0, GAME_WIDTH, GAME_HEIGHT);
              colors.forEach((color, index) => {
                const position = index / (colors.length - 1 || 1);
                gradient.addColorStop(position, color.trim());
              });
              ctx.fillStyle = gradient;
            } else {
              // Fallback to first color found
              const colorMatch = tableBg.match(/#[0-9a-fA-F]{6}/);
              ctx.fillStyle = colorMatch ? colorMatch[0] : '#15803d';
            }
          } else {
            // Fallback to first color found
            const colorMatch = tableBg.match(/#[0-9a-fA-F]{6}/);
            ctx.fillStyle = colorMatch ? colorMatch[0] : '#15803d';
          }
        } catch (e) {
          // Fallback to solid color
          const colorMatch = tableBg.match(/#[0-9a-fA-F]{6}/);
          ctx.fillStyle = colorMatch ? colorMatch[0] : '#15803d';
        }
      } else {
        ctx.fillStyle = tableBg;
      }
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.setLineDash([]);

      // Player 1 paddle - use player1's customization if current user is player1, otherwise opponent's
      const p1PaddleColor = isPlayer1 ? currentPlayerCustom?.paddleColor : opponentCustom?.paddleColor;
      ctx.fillStyle = p1PaddleColor || '#ff0000';
      ctx.fillRect(10, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Player 2 paddle - use player2's customization if current user is player2, otherwise opponent's
      const p2PaddleColor = isPlayer2 ? currentPlayerCustom?.paddleColor : opponentCustom?.paddleColor;
      ctx.fillStyle = p2PaddleColor || '#0000ff';
      ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, player2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball - use current player's customization
      ctx.beginPath();
      ctx.arc(remoteBall.x, remoteBall.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = currentPlayerCustom?.ballColor || '#ffffff';
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '45px Arial';
      ctx.fillText(player1.score.toString(), GAME_WIDTH / 2 - 100, 50);
      ctx.fillText(player2.score.toString(), GAME_WIDTH / 2 + 60, 50);
    }

  }, [serverGameState, tournamentMode, gameState, paddles, ball, scores, user]);

  // Render loop
  useEffect(() => {
    const render = () => {
      draw();
      requestAnimationFrame(render);
    };
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [draw]);

  // --- UI Rendering ---

  const handleExit = () => {
    // In tournament mode, we don't exit, the parent component handles it
    if (!tournamentMode) {
        router.push('/game');
    }
  };

  const handleRematchRequest = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:request' }));
      setRematchRequested(true);
      if(setRematchDeclinedMessage) setRematchDeclinedMessage('');
    }
  };

  if (opponentLeft) {
    return (
      <div className="text-white text-center">
        <h2>Your opponent has left the game.</h2>
        <button onClick={handleExit} className="mt-4 px-4 py-2 bg-blue-500 rounded">Back to Game Lobby</button>
      </div>
    );
  }

  // Winner screen for remote game
  if (winner && !tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local') {
    return (
      <div className="text-white text-center p-8 bg-gray-800 rounded-lg">
        <h2 className="text-4xl font-bold mb-4">Game Over</h2>
        <p className="text-2xl mt-4 mb-6">{winner} is the winner!</p>

        {rematchDeclinedMessage && <p className="text-red-400 mb-4">{rematchDeclinedMessage}</p>}

        {rematchOffer ? (
            handleAcceptRematch &&
          <button onClick={handleAcceptRematch} className="mt-4 px-6 py-3 bg-yellow-500 rounded-lg text-lg hover:bg-yellow-600 transition-colors">
            Accept Rematch
          </button>
        ) : rematchRequested ? (
          <p className="text-yellow-400">Waiting for opponent to accept...</p>
        ) : (
          <button onClick={handleRematchRequest} className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors">
            Request Rematch
          </button>
        )}

        <button onClick={handleExit} className="mt-4 ml-4 px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition-colors">
          Back to Game Lobby
        </button>
      </div>
    );
  }

  // Loading/initial state for remote game
  if (!tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local' && !serverGameState) {
    return <div className="text-white">Connecting to game...</div>;
  }

  // Winner screen for AI mode
  if (winner && gameState.mode === 'ai') {
    return (
      <div className="text-white text-center p-8 bg-gray-800 rounded-lg">
        <h2 className="text-4xl font-bold mb-4">Game Over</h2>
        <p className="text-2xl mt-4 mb-6">{winner} won!</p>
        <p className="text-lg mb-4">Final Score: {scores.player1} - {scores.player2}</p>
        <button
          onClick={() => {
            setWinner(null);
            resetGameState();
            keysPressed.current = {};
          }}
          className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={handleExit}
          className="mt-4 ml-4 px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Back to Game Modes
        </button>
      </div>
    );
  }

  // Winner screen for local mode
  if (winner && gameState.mode === 'local' && !tournamentMode) {
    return (
      <div className="text-white text-center p-8 bg-gray-800 rounded-lg">
        <h2 className="text-4xl font-bold mb-4">Game Over</h2>
        <p className="text-2xl mt-4 mb-6">{winner} wins! 🎉</p>
        <p className="text-lg mb-4">Final Score: {scores.player1} - {scores.player2}</p>
        <button
          onClick={() => {
            setWinner(null);
            resetGameState();
            keysPressed.current = {};
          }}
          className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={handleExit}
          className="mt-4 ml-4 px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Back to Game Modes
        </button>
      </div>
    );
  }

  // Main game display
  const isLocalMode = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';
  const winningScore = gameState.mode === 'ai' ? AI_WINNING_SCORE : WINNING_SCORE;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between w-full max-w-4xl mb-2">
        <span className="text-white text-xl">
            {isLocalMode
              ? (gameState.mode === 'ai' ? 'You' : localPlayers[0]?.name)
              : serverGameState?.player1.username}
        </span>
        <span className="text-white text-xl">
            {isLocalMode
              ? (gameState.mode === 'ai' ? 'AI' : localPlayers[1]?.name)
              : serverGameState?.player2.username}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="bg-gray-800 rounded-lg shadow-lg"
      />
      <div className="mt-4 text-center text-white">
        {gameState.mode === 'ai' ? (
          <>
            <p>Use W/S keys to move your paddle.</p>
            <p>First to {AI_WINNING_SCORE} points wins!</p>
          </>
        ) : tournamentMode ? (
          <>
            <p>Player 1: W/S keys. Player 2: Up/Down Arrow keys.</p>
            <p>First to {WINNING_SCORE} points wins!</p>
          </>
        ) : gameState.mode === 'local' ? (
          <>
            <p>Player 1: W/S keys. Player 2: Up/Down Arrow keys.</p>
            <p>First to {WINNING_SCORE} points wins!</p>
          </>
        ) : (
          <>
            <p>Use W/S or Arrow Up/Down keys to move your paddle.</p>
            <p>First to {WINNING_SCORE} points wins!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PingPongGame;
