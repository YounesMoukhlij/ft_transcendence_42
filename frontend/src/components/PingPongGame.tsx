'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameContext } from '../components/GameContext';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'next/navigation';
import { ServerGameState, Player } from '../types/game';
import { useTranslation } from '../contexts/LanguageContext';

const PADDLE_HEIGHT = 100;
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
const PADDLE_WIDTH = 16;
const BALL_RADIUS = 10;
const WINNING_SCORE = 10;
const AI_WINNING_SCORE = 10; // AI games are first to 10 points

// Game constants for smooth gameplay
const PADDLE_SPEED = 10; // Pixels per frame at 60 FPS (600 pixels/second)
const BALL_INITIAL_SPEED = 6;
const BALL_MAX_SPEED = 14;
const BALL_SPEED_INCREMENT = 0.05; // Speed increase per collision
const BALL_MIN_SPEED = 5;

// AI difficulty settings - balanced for beatable gameplay
const AI_DIFFICULTY_SETTINGS = {
  easy: {
    speed: 3,           // Slower movement speed
    reactionDelay: 0.5, // Longer delay before reacting
    accuracy: 0.5,      // 50% accuracy - makes significant mistakes
    prediction: false,   // No prediction
    maxSpeed: 0.6,      // AI moves at 60% max speed
    missChance: 0.15,   // 15% chance to miss even when ball is reachable
  },
  medium: {
    speed: 5,           // Moderate movement speed
    reactionDelay: 0.25, // Noticeable delay
    accuracy: 0.7,      // 70% accuracy - some mistakes
    prediction: false,   // No prediction for medium
    maxSpeed: 0.75,     // AI moves at 75% max speed
    missChance: 0.08,   // 8% chance to miss
  },
  hard: {
    speed: 7,           // Fast movement
    reactionDelay: 0.15, // Small delay (not instant)
    accuracy: 0.85,     // 85% accuracy (reduced from 96%)
    prediction: true,   // Advanced prediction
    maxSpeed: 0.9,      // AI moves at 90% max speed (not 100%)
    missChance: 0.05,   // 5% chance to miss
  },
};

// Unified Props for both Local and Remote
interface PingPongGameProps {
  // Remote game props
  serverGameState?: ServerGameState | null;
  opponentLeft?: boolean;
  setServerGameState?: (state: ServerGameState) => void;
  socket?: WebSocket | null;
  rematchDeclinedMessage?: string;
  setRematchDeclinedMessage?: (message: string) => void;
  rematchOffer?: boolean;
  handleAcceptRematch?: () => void;

  // Tournament mode props
  tournamentMode?: boolean;
  tournamentPlayers?: Player[];
  onTournamentMatchEnd?: (winner: Player) => void;
  isTournamentFinalMatch?: boolean; // Hide rematch button and game over screen for final match

  // Local/AI game props
  onGameOver?: (winner: string | null) => void;
}

// Initial state for local game
const useLocalGameState = (players: Player[]) => {
  const [gameState, setGameState] = useState({
    scores: { player1: 0, player2: 0 },
    paddles: [GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2],
    ball: {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      vx: BALL_INITIAL_SPEED,
      vy: BALL_INITIAL_SPEED,
      speed: BALL_INITIAL_SPEED, // Track current speed
    },
  });

  const resetGameState = useCallback(() => {
    // Random initial direction
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6; // -30 to +30 degrees
    const speed = BALL_INITIAL_SPEED;
    setGameState({
      scores: { player1: 0, player2: 0 },
      paddles: [GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2],
      ball: {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
        vx: Math.random() > 0.5 ? speed * Math.cos(angle) : -speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        speed: speed,
      },
    });
  }, []);

  const updateGameState = useCallback((keysPressed: { [key: string]: boolean }, isAIMode: boolean = false, difficulty: 'easy' | 'medium' | 'hard' = 'medium', deltaTime: number = 1) => {
    setGameState(prev => {
      // Paddles - smooth movement based on delta time
      const newPaddles = [...prev.paddles];
      // Player 1 (left paddle) - W/S only in local/tournament mode, W/S or ArrowUp/ArrowDown in AI mode
      if (isAIMode) {
        // AI mode: Player 1 can use both W/S and Arrow keys
        if (keysPressed['w'] || keysPressed['ArrowUp']) newPaddles[0] -= PADDLE_SPEED * deltaTime;
        if (keysPressed['s'] || keysPressed['ArrowDown']) newPaddles[0] += PADDLE_SPEED * deltaTime;
      } else {
        // Local/Tournament mode: Player 1 uses only W/S
        if (keysPressed['w']) newPaddles[0] -= PADDLE_SPEED * deltaTime;
        if (keysPressed['s']) newPaddles[0] += PADDLE_SPEED * deltaTime;
      }

      // AI controls player 2 paddle (right side)
      if (isAIMode) {
        const settings = AI_DIFFICULTY_SETTINGS[difficulty];
        const ballX = prev.ball.x;
        const ballVx = prev.ball.vx;
        const ballVy = prev.ball.vy;
        const ballY = prev.ball.y;
        const aiPaddleCenter = newPaddles[1] + PADDLE_HEIGHT / 2;
        const aiPaddleX = GAME_WIDTH - PADDLE_WIDTH - 10;

        // Calculate target position with prediction for hard mode only
        let targetY = ballY;

        if (settings.prediction && ballVx > 0) {
          // Predict where the ball will be when it reaches the AI paddle
          const distanceToPaddle = aiPaddleX - ballX;
          if (Math.abs(ballVx) > 0.1) {
          const timeToReach = distanceToPaddle / Math.abs(ballVx);
            let predictedY = ballY + (ballVy * timeToReach);

            // Account for wall bounces (with some error for lower difficulties)
            let bounceError = difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 0.9 : 1.0;
            while (predictedY < BALL_RADIUS || predictedY > GAME_HEIGHT - BALL_RADIUS) {
              if (predictedY < BALL_RADIUS) {
                predictedY = BALL_RADIUS + (BALL_RADIUS - predictedY) * bounceError;
              } else {
                predictedY = (GAME_HEIGHT - BALL_RADIUS) - (predictedY - (GAME_HEIGHT - BALL_RADIUS)) * bounceError;
              }
              bounceError *= 0.95; // Reduce error on multiple bounces
            }

            targetY = predictedY;
          }
        }

        // Apply accuracy with larger offset range for easier difficulties
        const accuracyMultiplier = difficulty === 'easy' ? 2.0 : difficulty === 'medium' ? 1.5 : 1.0;
        const accuracyOffset = (1 - settings.accuracy) * (Math.random() - 0.5) * PADDLE_HEIGHT * accuracyMultiplier;
        targetY += accuracyOffset;

        // Add intentional overshooting on easy/medium (AI goes past target sometimes)
        if (difficulty !== 'hard' && Math.random() < 0.2) {
          const overshootAmount = difficulty === 'easy' ? PADDLE_HEIGHT * 0.3 : PADDLE_HEIGHT * 0.15;
          targetY += (Math.random() > 0.5 ? 1 : -1) * overshootAmount;
        }

        // React later on easier difficulties (closer to paddle)
        const reactThreshold = difficulty === 'easy' ? GAME_WIDTH * 0.7 : difficulty === 'medium' ? GAME_WIDTH * 0.6 : GAME_WIDTH / 3;
        const shouldReact = ballX > reactThreshold && (ballVx > 0 || ballX > GAME_WIDTH / 2);

        if (shouldReact) {
          // Miss chance - sometimes AI just doesn't move at all
          const missChance = settings.missChance || 0;
          const shouldMiss = Math.random() < missChance;

          // Only skip movement if missing, but still allow ball and other updates
          if (!shouldMiss) {
            const targetPaddleCenter = targetY;
            const diff = targetPaddleCenter - aiPaddleCenter;

            // Apply reaction delay (longer on easier difficulties)
            const reactionFactor = settings.reactionDelay > 0 ? 1 - settings.reactionDelay : 1;

            // Add occasional hesitation on easy/medium (stops moving briefly)
            const shouldHesitate = difficulty !== 'hard' && Math.random() < 0.1;

            if (!shouldHesitate) {
              // Smooth movement towards target with difficulty-based speed
              if (Math.abs(diff) > 2) { // Increased threshold from 1 to 2 for less precision
                const maxMoveSpeed = settings.speed * settings.maxSpeed;
                // Use a smaller multiplier for movement calculation to slow it down
                const moveSpeed = Math.min(maxMoveSpeed, Math.abs(diff) * (difficulty === 'easy' ? 0.08 : difficulty === 'medium' ? 0.12 : 0.15));
                const moveAmount = Math.sign(diff) * moveSpeed * reactionFactor * deltaTime;

                // Sometimes move in wrong direction on easy (especially when ball is far)
                if (difficulty === 'easy' && Math.random() < 0.15 && ballX < GAME_WIDTH * 0.8) {
                  newPaddles[1] -= moveAmount * 0.5; // Move opposite direction slightly
            } else {
                  newPaddles[1] += moveAmount;
            }
          }
            }
            // If hesitating, paddle doesn't move (but ball still updates)
          }
          // If missing, paddle doesn't move (but ball still updates)
        }
      } else {
        // Human controls for player 2 in local/tournament mode
        if (keysPressed['ArrowUp']) newPaddles[1] -= PADDLE_SPEED * deltaTime;
        if (keysPressed['ArrowDown']) newPaddles[1] += PADDLE_SPEED * deltaTime;
      }

      newPaddles[0] = Math.max(0, Math.min(newPaddles[0], GAME_HEIGHT - PADDLE_HEIGHT));
      newPaddles[1] = Math.max(0, Math.min(newPaddles[1], GAME_HEIGHT - PADDLE_HEIGHT));

      // Ball - improved physics with better collision
      let { x, y, vx, vy, speed } = prev.ball;
      // Ensure speed property exists (fallback for legacy state)
      if (speed === undefined) {
        speed = Math.sqrt(vx * vx + vy * vy) || BALL_INITIAL_SPEED;
      }
      x += vx * deltaTime;
      y += vy * deltaTime;

      // Wall collision with proper bounce
      if (y - BALL_RADIUS <= 0) {
        y = BALL_RADIUS;
        vy = Math.abs(vy); // Bounce down (positive velocity)
      } else if (y + BALL_RADIUS >= GAME_HEIGHT) {
        y = GAME_HEIGHT - BALL_RADIUS;
        vy = -Math.abs(vy); // Bounce up (negative velocity)
      }

      // Improved paddle collision with angle calculation
      const paddle1X = 10 + PADDLE_WIDTH;
      const paddle1Top = newPaddles[0];
      const paddle1Bottom = newPaddles[0] + PADDLE_HEIGHT;
      const paddle1Center = newPaddles[0] + PADDLE_HEIGHT / 2;

      const paddle2X = GAME_WIDTH - PADDLE_WIDTH - 10;
      const paddle2Top = newPaddles[1];
      const paddle2Bottom = newPaddles[1] + PADDLE_HEIGHT;
      const paddle2Center = newPaddles[1] + PADDLE_HEIGHT / 2;

      // Check collision with left paddle (player 1)
      if (x - BALL_RADIUS <= paddle1X && x - BALL_RADIUS >= 10 &&
          y + BALL_RADIUS >= paddle1Top && y - BALL_RADIUS <= paddle1Bottom &&
          vx < 0) {
        // Calculate hit position relative to paddle center (-0.5 to 0.5)
        const hitPos = (y - paddle1Center) / (PADDLE_HEIGHT / 2);
        const clampedHitPos = Math.max(-0.9, Math.min(0.9, hitPos));

        // Calculate angle based on hit position (max 60 degrees)
        const maxAngle = Math.PI / 3; // 60 degrees
        const angle = clampedHitPos * maxAngle;

        // Increase speed slightly on collision
        speed = Math.min(speed * 1.05, BALL_MAX_SPEED);

        // Set new velocity with angle (normalized to maintain speed)
        const magnitude = Math.sqrt(vx * vx + vy * vy) || speed;
        const newSpeed = Math.min(Math.max(magnitude, BALL_MIN_SPEED), BALL_MAX_SPEED);
        vx = Math.abs(Math.cos(angle) * newSpeed);
        vy = Math.sin(angle) * newSpeed;
        speed = newSpeed;

        // Prevent sticking
        x = paddle1X + BALL_RADIUS + 1;
      }

      // Check collision with right paddle (player 2 / AI)
      if (x + BALL_RADIUS >= paddle2X && x + BALL_RADIUS <= GAME_WIDTH - 10 &&
          y + BALL_RADIUS >= paddle2Top && y - BALL_RADIUS <= paddle2Bottom &&
          vx > 0) {
        // Calculate hit position relative to paddle center (-0.5 to 0.5)
        const hitPos = (y - paddle2Center) / (PADDLE_HEIGHT / 2);
        const clampedHitPos = Math.max(-0.9, Math.min(0.9, hitPos));

        // Calculate angle based on hit position (max 60 degrees)
        const maxAngle = Math.PI / 3; // 60 degrees
        const angle = clampedHitPos * maxAngle;

        // Increase speed slightly on collision
        speed = Math.min(speed * 1.05, BALL_MAX_SPEED);

        // Set new velocity with angle (going left, normalized to maintain speed)
        const magnitude = Math.sqrt(vx * vx + vy * vy) || speed;
        const newSpeed = Math.min(Math.max(magnitude, BALL_MIN_SPEED), BALL_MAX_SPEED);
        vx = -Math.abs(Math.cos(angle) * newSpeed);
        vy = Math.sin(angle) * newSpeed;
        speed = newSpeed;

        // Prevent sticking
        x = paddle2X - BALL_RADIUS - 1;
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
            // Reset ball with random angle
            speed: BALL_INITIAL_SPEED,
            vx: Math.random() > 0.5 ? BALL_INITIAL_SPEED : -BALL_INITIAL_SPEED,
            vy: (Math.random() - 0.5) * 3, // Random vertical velocity
          }
        : { x, y, vx, vy, speed };

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
  socket: socketProp,
  rematchDeclinedMessage,
  setRematchDeclinedMessage,
  rematchOffer,
  handleAcceptRematch,
  tournamentMode = false,
  tournamentPlayers = [],
  onTournamentMatchEnd,
  isTournamentFinalMatch = false,
  onGameOver
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const { gameState } = useGameContext();
  const { user, socket: storeSocket } = useUserStore();
  const socket = socketProp ?? storeSocket;
  const router = useRouter();
  const { t } = useTranslation();
  const activeRoomCode = serverGameState?.roomCode;
  const activeMatchId = (serverGameState as any)?.matchId;

  // Unified state
  const [winner, setWinner] = useState<string | null>(null);
  const [rematchRequested, setRematchRequested] = useState(false);

  // Interpolation state for smooth movement
  const previousGameStateRef = useRef<ServerGameState | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const interpolatedStateRef = useRef<ServerGameState | null>(null);
  const updateHistoryRef = useRef<Array<{ state: ServerGameState; timestamp: number }>>([]);
  const smoothedBallPositionRef = useRef<{ x: number; y: number } | null>(null); // For exponential smoothing
  const networkLatencyRef = useRef<number>(16.67); // Track network latency (default to 1 frame)

  // Local game state - use gameState.players for local mode, tournamentPlayers for tournament mode
  const localPlayers = tournamentMode ? tournamentPlayers : (gameState.mode === 'local' ? gameState.players : []);
  const { scores, paddles, ball, updateGameState, resetGameState } = useLocalGameState(localPlayers);

  // Refs for draw function to avoid re-creating it every frame
  const scoresRef = useRef(scores);
  const paddlesRef = useRef(paddles);
  const ballRef = useRef(ball);
  useEffect(() => { scoresRef.current = scores; }, [scores]);
  useEffect(() => { paddlesRef.current = paddles; }, [paddles]);
  useEffect(() => { ballRef.current = ball; }, [ball]);

  // Track if we've initialized the game to prevent infinite loops
  const gameInitializedRef = useRef<string | null>(null);

  // Reset game state for new tournament match or AI game (only when mode changes)
  useEffect(() => {
    const currentMode = tournamentMode ? 'tournament' : gameState.mode;
    // For tournament mode, include player IDs to detect when match changes
    const playerKey = tournamentMode && localPlayers.length >= 2
      ? `${localPlayers[0].id}-${localPlayers[1].id}`
      : tournamentMode
        ? `length-${tournamentPlayers.length}`
        : '';
    const modeKey = `${currentMode}-${playerKey}`;

    // Only reset if the mode has actually changed OR if it's a new tournament match (different players)
    if (gameInitializedRef.current !== modeKey) {
      if (tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local') {
        setWinner(null);
        resetGameState();
        keysPressed.current = {};
        gameInitializedRef.current = modeKey;
      }
    }
  }, [tournamentPlayers, tournamentMode, gameState.mode, resetGameState, localPlayers]);

  // Refs for keyboard handler to avoid re-bindings on every serverGameState change
  const serverGameStateRef = useRef(serverGameState);
  const activeRoomCodeRef = useRef(activeRoomCode);
  const activeMatchIdRef = useRef(activeMatchId);
  const winnerRef2 = useRef(winner);
  const socketRef = useRef(socket);
  useEffect(() => { serverGameStateRef.current = serverGameState; }, [serverGameState]);
  useEffect(() => { activeRoomCodeRef.current = activeRoomCode; }, [activeRoomCode]);
  useEffect(() => { activeMatchIdRef.current = activeMatchId; }, [activeMatchId]);
  useEffect(() => { winnerRef2.current = winner; }, [winner]);
  useEffect(() => { socketRef.current = socket; }, [socket]);

  // Track last sent direction to avoid spamming the same command
  const lastSentDirectionRef = useRef<string | null>(null);

  // Keyboard controls for local, remote, and AI modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key repeat events
      if (e.repeat) return;
      if (winnerRef2.current) return;

      // Determine if this is a remote game (has serverGameState) or local game
      const isRemoteGame = !!serverGameStateRef.current && !tournamentMode;
      const isLocalGame = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';

      if (isLocalGame) {
        // Local tournament, AI mode, or local mode - use keyboard controls
        keysPressed.current[e.key] = true;
      } else if (isRemoteGame) {
        // Remote mode - send paddle moves to backend
        const roomCode = activeRoomCodeRef.current;
        const matchId = activeMatchIdRef.current;
        const ws = socketRef.current;
        if (!roomCode) return;

        let direction: string | null = null;
        if (e.key === 'w' || e.key === 'ArrowUp') {
          direction = 'up';
        } else if (e.key === 's' || e.key === 'ArrowDown') {
          direction = 'down';
        }

        // Only send if direction changed
        if (direction && direction !== lastSentDirectionRef.current) {
          lastSentDirectionRef.current = direction;
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'paddleMove',
              payload: { direction, roomCode, matchId }
            }));
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (winnerRef2.current) return;

        // Determine if this is a remote game (has serverGameState) or local game
        const isRemoteGame = !!serverGameStateRef.current && !tournamentMode;
        const isLocalGame = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';

        if (isLocalGame) {
            // Local tournament, AI mode, or local mode - use keyboard controls
            keysPressed.current[e.key] = false;
        } else if (isRemoteGame) {
            // Remote mode - send stop command to backend
            const roomCode = activeRoomCodeRef.current;
            const matchId = activeMatchIdRef.current;
            const ws = socketRef.current;
            if (!roomCode) return;
            if (
                e.key === 'w' ||
                e.key === 'ArrowUp' ||
                e.key === 's' ||
                e.key === 'ArrowDown'
            ) {
                // Only send stop if we were moving
                if (lastSentDirectionRef.current !== 'stop') {
                  lastSentDirectionRef.current = 'stop';
                  if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                      type: 'paddleMove',
                      payload: { direction: 'stop', roomCode, matchId }
                    }));
                  }
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
  }, [tournamentMode, gameState.mode]);

  // Game loop for local tournament, AI mode, and local mode - improved with delta time
  const gameModeRef = useRef(gameState.mode);
  const aiDifficultyRef = useRef(gameState.customisation?.aiDifficulty);
  const winnerRef = useRef(winner);
  const tournamentModeRef = useRef(tournamentMode);
  const updateGameStateRef = useRef(updateGameState);

  // Update refs when values change (don't restart loop)
  useEffect(() => {
    gameModeRef.current = gameState.mode;
    aiDifficultyRef.current = gameState.customisation?.aiDifficulty;
    winnerRef.current = winner;
    tournamentModeRef.current = tournamentMode;
    updateGameStateRef.current = updateGameState;
  }, [gameState.mode, gameState.customisation?.aiDifficulty, winner, tournamentMode, updateGameState]);

  // Game loop for local/tournament/AI modes - optimized to prevent multiple loops
  useEffect(() => {
    const isLocalMode = tournamentModeRef.current || gameModeRef.current === 'ai' || gameModeRef.current === 'local';
    if (!isLocalMode) return;

    // Don't start loop if there's a winner
    if (winnerRef.current) return;

    let lastTime = performance.now();
    let animationFrameId: number | null = null;
    let isRunning = true;

    const gameLoop = (currentTime: number) => {
      // Check if game ended or component unmounted
      if (!isRunning || winnerRef.current) {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }

      // Calculate deltaTime: milliseconds since last frame, normalized to 60fps (16.67ms per frame)
      // This ensures consistent speed regardless of frame rate
      const elapsed = currentTime - lastTime;
      const deltaTime = Math.min(Math.max(elapsed / 16.67, 0.1), 2.5); // Cap between 0.1 and 2.5x
      lastTime = currentTime;

      // Update game state (ball and paddles movement)
      const difficulty = (aiDifficultyRef.current || 'medium') as 'easy' | 'medium' | 'hard';
      const isAIMode = gameModeRef.current === 'ai';
      updateGameStateRef.current(keysPressed.current, isAIMode, difficulty, deltaTime);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  }, [winner]); // Include winner in dependencies to restart loop when winner changes from non-null to null


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
          const winnerName = localPlayers[0].name;
          setWinner(winnerName);
          if (onGameOver) onGameOver(winnerName);
        } else if (scores.player2 >= WINNING_SCORE) {
          const winnerName = localPlayers[1].name;
          setWinner(winnerName);
          if (onGameOver) onGameOver(winnerName);
        }
      }
    }
  }, [scores, tournamentMode, gameState.mode, onTournamentMatchEnd, localPlayers, winner, onGameOver]);

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
    // For remote tournaments, tournamentMode is false, so we need to check if we have serverGameState
    // The condition should allow remote mode (which includes remote tournaments)
    // IMPORTANT: Check for serverGameState first - if it exists, we're in remote mode
    const isRemoteMode = !!serverGameState && !tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local';
    const shouldProcess = isRemoteMode && serverGameState;

    if (shouldProcess) {
      const now = Date.now();
      const timeSinceUpdate = now - lastUpdateTimeRef.current;

      // Calculate adaptive network latency (moving average of update intervals)
      if (timeSinceUpdate > 0 && timeSinceUpdate < 200) { // Only track reasonable latencies
        // Exponential moving average for latency
        networkLatencyRef.current = networkLatencyRef.current * 0.7 + timeSinceUpdate * 0.3;
      }

      // Store previous state for interpolation
      if (interpolatedStateRef.current) {
        previousGameStateRef.current = { ...interpolatedStateRef.current };
      }

      // Update current state
      interpolatedStateRef.current = { ...serverGameState };
      lastUpdateTimeRef.current = now;

      // Initialize smoothed position if needed
      if (!smoothedBallPositionRef.current) {
        smoothedBallPositionRef.current = {
          x: serverGameState.ball.x,
          y: serverGameState.ball.y
        };
      }

      // Keep a history of recent updates for better interpolation (keep last 5 updates for better smoothing)
      updateHistoryRef.current.push({ state: { ...serverGameState }, timestamp: now });
      if (updateHistoryRef.current.length > 5) {
        updateHistoryRef.current.shift();
      }
    } else {
      // Log why interpolation is not running (for debugging)
      if (serverGameState && !shouldProcess) {
        console.log('[PingPongGame] Interpolation skipped:', {
          tournamentMode,
          gameStateMode: gameState.mode,
          hasServerGameState: !!serverGameState,
          reason: tournamentMode ? 'tournamentMode is true' :
                  gameState.mode === 'ai' ? 'AI mode' :
                  gameState.mode === 'local' ? 'local mode' :
                  'unknown'
        });
      }

      if (!serverGameState || gameState.mode === 'ai' || gameState.mode === 'local') {
        // Reset interpolation state when game state is cleared or in AI/local mode
        previousGameStateRef.current = null;
        interpolatedStateRef.current = null;
        updateHistoryRef.current = [];
        smoothedBallPositionRef.current = null;
        networkLatencyRef.current = 16.67;
      }
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

      // Table background - handle both solid colors and gradients (same logic as remote mode)
      const tableBg = customisation?.tableBg || '#15803d'; // Default to green, not white
      if (tableBg && (tableBg.includes('gradient') || tableBg.includes('linear-gradient'))) {
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
              // Fallback to first color found or default green
              const colorMatch = tableBg.match(/#[0-9a-fA-F]{6}/);
              ctx.fillStyle = colorMatch ? colorMatch[0] : '#15803d';
            }
          } else {
            // Fallback to first color found or default green
            const colorMatch = tableBg.match(/#[0-9a-fA-F]{6}/);
            ctx.fillStyle = colorMatch ? colorMatch[0] : '#15803d';
          }
        } catch (e) {
          // Fallback to solid color - ensure it's a valid color
          const colorMatch = tableBg.match(/#[0-9a-fA-F]{6}/);
          ctx.fillStyle = colorMatch ? colorMatch[0] : '#15803d';
        }
      } else if (tableBg && tableBg.startsWith('#')) {
        // Solid color - validate it's a valid hex color
        ctx.fillStyle = tableBg.match(/#[0-9a-fA-F]{6}/) ? tableBg : '#15803d';
      } else {
        // Invalid or missing tableBg - use default green
        ctx.fillStyle = '#15803d';
      }
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.setLineDash([]);

      // Use refs for smooth rendering without re-creating draw callback
      const currentPaddles = paddlesRef.current;
      const currentBall = ballRef.current;
      const currentScores = scoresRef.current;

      // Player 1 paddle (left side - human player) - with shadow
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = customisation?.paddleColor || '#ff0000';
      ctx.fillStyle = customisation?.paddleColor || '#ff0000';
      ctx.fillRect(10, currentPaddles[0], PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.restore();

      // Player 2 paddle (right side - AI in AI mode, human in tournament mode) - with shadow
      ctx.save();
      const paddle2Color = gameState.mode === 'ai' ? '#888888' : (customisation?.paddleColor || '#0000ff');
      ctx.shadowBlur = 10;
      ctx.shadowColor = paddle2Color;
      ctx.fillStyle = paddle2Color;
      ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, currentPaddles[1], PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.restore();

      // Ball with glow effect for better visibility
      ctx.save();
      ctx.beginPath();
      ctx.arc(currentBall.x, currentBall.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.shadowBlur = 15;
      ctx.shadowColor = customisation?.ballColor || '#fff';
      ctx.fillStyle = customisation?.ballColor || '#fff';
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#fff';
      ctx.font = '45px Arial';
      ctx.fillText(currentScores.player1.toString(), GAME_WIDTH / 2 - 100, 80);
      ctx.fillText(currentScores.player2.toString(), GAME_WIDTH / 2 + 60, 80);

    } else if (serverGameStateDrawRef.current) {
      // Remote Game Draw - use server state directly for accurate sync
      const currentServerState = serverGameStateDrawRef.current;

      // Use server state directly - server sends at 60 FPS which is smooth enough
      // Complex interpolation was causing lag issues
      const displayState = currentServerState;

      const { player1, player2, ball: remoteBall } = displayState;

      // Determine which player is the current user
      const currentUserId = user?.id_user;
      // Convert IDs to strings for comparison (backend may send numbers or strings)
      const player1Id = player1.id?.toString();
      const player2Id = player2.id?.toString();
      const currentUserIdStr = currentUserId?.toString();

      const isPlayer1 = currentUserIdStr && player1Id === currentUserIdStr;
      const isPlayer2 = currentUserIdStr && player2Id === currentUserIdStr;

      // Log player ID matching for debugging
      if (!isPlayer1 && !isPlayer2 && currentUserId) {
        console.warn('[PingPongGame] Player ID mismatch:', {
          currentUserId: currentUserIdStr,
          player1Id,
          player2Id,
          player1Username: player1.username,
          player2Username: player2.username,
          userUsername: user?.username
        });
      }

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
      ctx.fillText(player1.score.toString(), GAME_WIDTH / 2 - 100, 80);
      ctx.fillText(player2.score.toString(), GAME_WIDTH / 2 + 60, 80);
    }

  }, [tournamentMode, gameState, user]); // Removed serverGameState - use ref instead

  // Ref for serverGameState to avoid draw callback recreation
  const serverGameStateDrawRef = useRef(serverGameState);
  useEffect(() => { serverGameStateDrawRef.current = serverGameState; }, [serverGameState]);

  // Render loop - stable, doesn't depend on changing state
  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      draw();
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);
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

  // Winner screen for remote game (but not for tournament final match)
  if (winner && !tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local' && !isTournamentFinalMatch) {
    return (
      <div className="text-white text-center p-8 bg-gray-800 rounded-lg">
        <h2 className="text-4xl font-bold mb-4">{t('game.TournamentDone')}</h2>
        <p className="text-2xl mt-4 mb-6">{t('game.isTheWinner', { winner })}</p>

        {rematchDeclinedMessage && <p className="text-red-400 mb-4">{rematchDeclinedMessage} asdasdasd </p>}



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
    const isPlayerWinner = winner === 'You';
    return (
      <div className="relative w-full max-w-md mx-auto p-1 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-2xl">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 sm:p-8 text-center">
          {/* Trophy/Skull Icon */}
          <div className="mb-4 sm:mb-6">
            <span className="text-5xl sm:text-6xl drop-shadow-lg">
              {isPlayerWinner ? '🏆' : '💀'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
            {isPlayerWinner ? 'Victory!' : 'Game Over'}
          </h2>

          {/* Winner Text */}
          <p className="text-lg sm:text-2xl text-gray-200 font-semibold mb-4 sm:mb-6">
            {isPlayerWinner ? 'You defeated the AI!' : 'The AI wins this round'}
          </p>

          {/* Score Card */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 mb-1">You</span>
              <span className={`text-3xl sm:text-5xl font-black ${isPlayerWinner ? 'text-green-400' : 'text-gray-300'}`}>
                {scores.player1}
              </span>
            </div>
            <span className="text-xl sm:text-2xl text-gray-500 font-light">—</span>
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 mb-1">AI</span>
              <span className={`text-3xl sm:text-5xl font-black ${!isPlayerWinner ? 'text-red-400' : 'text-gray-300'}`}>
                {scores.player2}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                setWinner(null);
                resetGameState();
                keysPressed.current = {};
              }}
              className="group relative px-6 py-3 rounded-xl font-bold text-base sm:text-lg overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Play Again
              </span>
            </button>
            <button
              onClick={handleExit}
              className="group px-6 py-3 rounded-xl font-bold text-base sm:text-lg bg-gray-700/80 text-gray-200 border border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                Exit
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Winner screen for local mode
  if (winner && gameState.mode === 'local' && !tournamentMode) {
    const player1Name = localPlayers[0]?.name || 'Player 1';
    const player2Name = localPlayers[1]?.name || 'Player 2';
    const isPlayer1Winner = winner === player1Name;
    return (
      <div className="relative w-full max-w-md mx-auto p-1 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 sm:p-8 text-center">
          {/* Trophy Icon */}
          <div className="mb-4 sm:mb-6">
            <span className="text-5xl sm:text-6xl drop-shadow-lg">🏆</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
            Victory!
          </h2>

          {/* Winner Text */}
          <p className="text-lg sm:text-2xl text-gray-200 font-semibold mb-4 sm:mb-6">
            {winner} wins!
          </p>

          {/* Score Card */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 mb-1">{player1Name}</span>
              <span className={`text-3xl sm:text-5xl font-black ${isPlayer1Winner ? 'text-green-400' : 'text-gray-300'}`}>
                {scores.player1}
              </span>
            </div>
            <span className="text-xl sm:text-2xl text-gray-500 font-light">—</span>
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 mb-1">{player2Name}</span>
              <span className={`text-3xl sm:text-5xl font-black ${!isPlayer1Winner ? 'text-green-400' : 'text-gray-300'}`}>
                {scores.player2}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                keysPressed.current = {};
                setWinner(null);
                resetGameState();
                setTimeout(() => {
                  if (onGameOver) onGameOver(null);
                }, 50);
              }}
              className="group relative px-6 py-3 rounded-xl font-bold text-base sm:text-lg overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Play Again
              </span>
            </button>
            <button
              onClick={() => {
                if (onGameOver) onGameOver(null);
                handleExit();
              }}
              className="group px-6 py-3 rounded-xl font-bold text-base sm:text-lg bg-gray-700/80 text-gray-200 border border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                Exit
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game display
  const isLocalMode = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';
  const winningScore = gameState.mode === 'ai' ? AI_WINNING_SCORE : WINNING_SCORE;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-0 p-2 sm:p-4 overflow-hidden">
      <div
        className="relative flex justify-center items-center flex-shrink"
        style={{
          width: '100%',

          maxWidth: 'min(100%, 90vw, 800px)',
          maxHeight: 'min(calc(100vh - 200px), calc(90vw * 0.75), 600px)',
          aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`
        }}
      >
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl border border-gray-700 block"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
      <div className="mt-2 sm:mt-4 text-center text-white px-2">
        {gameState.mode === 'ai' ? (
          <>
            <p className="text-xs sm:text-sm md:text-base">
              <span className="font-semibold text-purple-400">Controls:</span>{' '}
              <span className="bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded text-xs font-mono">W</span>
              <span className="mx-0.5 sm:mx-1">/</span>
              <span className="bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded text-xs font-mono">S</span>
              <span className="mx-1 sm:mx-2 text-gray-400">or</span>
              <span className="bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded text-xs font-mono">↑</span>
              <span className="mx-0.5 sm:mx-1">/</span>
              <span className="bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded text-xs font-mono">↓</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Score to win: {AI_WINNING_SCORE}</p>
          </>
        ) : tournamentMode ? (
          <>
            <p className="text-xs sm:text-sm">Player 1: W/S keys. Player 2: Up/Down Arrow keys.</p>
            <p className="text-xs sm:text-sm text-gray-400">Score to win: {WINNING_SCORE}</p>
          </>
        ) : gameState.mode === 'local' ? (
          <>
            <p className="text-xs sm:text-sm">Player 1: W/S keys. Player 2: Up/Down Arrow keys.</p>
            <p className="text-xs sm:text-sm text-gray-400">Score to win: {WINNING_SCORE}</p>
          </>
        ) : (
          <>
            <p className="text-xs sm:text-sm">Use W/S or Arrow Up/Down keys to move your paddle.</p>
            <p className="text-xs sm:text-sm text-gray-400">Score to win: {WINNING_SCORE}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PingPongGame;
