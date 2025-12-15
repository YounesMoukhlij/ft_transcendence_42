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
      if (keysPressed['w']) newPaddles[0] -= PADDLE_SPEED * deltaTime;
      if (keysPressed['s']) newPaddles[0] += PADDLE_SPEED * deltaTime;

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
  const { user, socket } = useUserStore();
  const router = useRouter();
  const { t } = useTranslation();

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

  // Keyboard controls for local, remote, and AI modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (winner) return;

      // Determine if this is a remote game (has serverGameState) or local game
      const isRemoteGame = !!serverGameState && !tournamentMode;
      const isLocalGame = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';

      if (isLocalGame) {
        // Local tournament, AI mode, or local mode - use keyboard controls
        keysPressed.current[e.key] = true;
      } else if (isRemoteGame) {
        // Remote mode - send paddle moves to backend
        if (e.key === 'w' || e.key === 'ArrowUp') {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'up' } }));
          } else {
            console.warn('[PingPongGame] Cannot send paddle move - socket not connected');
          }
        } else if (e.key === 's' || e.key === 'ArrowDown') {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'down' } }));
          } else {
            console.warn('[PingPongGame] Cannot send paddle move - socket not connected');
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        if (winner) return;

        // Determine if this is a remote game (has serverGameState) or local game
        const isRemoteGame = !!serverGameState && !tournamentMode;
        const isLocalGame = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';

        if (isLocalGame) {
            // Local tournament, AI mode, or local mode - use keyboard controls
            keysPressed.current[e.key] = false;
        } else if (isRemoteGame) {
            // Remote mode - send stop command to backend
            if (
                e.key === 'w' ||
                e.key === 'ArrowUp' ||
                e.key === 's' ||
                e.key === 'ArrowDown'
            ) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'stop' } }));
                } else {
                  console.warn('[PingPongGame] Cannot send paddle stop - socket not connected');
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
  }, [socket, user, winner, tournamentMode, gameState.mode, serverGameState]);

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

      // Player 1 paddle (left side - human player) - with shadow
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = customisation?.paddleColor || '#ff0000';
      ctx.fillStyle = customisation?.paddleColor || '#ff0000';
      ctx.fillRect(10, paddles[0], PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.restore();

      // Player 2 paddle (right side - AI in AI mode, human in tournament mode) - with shadow
      ctx.save();
      const paddle2Color = gameState.mode === 'ai' ? '#888888' : (customisation?.paddleColor || '#0000ff');
      ctx.shadowBlur = 10;
      ctx.shadowColor = paddle2Color;
      ctx.fillStyle = paddle2Color;
      ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, paddles[1], PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.restore();

      // Ball with glow effect for better visibility
      ctx.save();
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.shadowBlur = 15;
      ctx.shadowColor = customisation?.ballColor || '#fff';
      ctx.fillStyle = customisation?.ballColor || '#fff';
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#fff';
      ctx.font = '45px Arial';
      ctx.fillText(scores.player1.toString(), GAME_WIDTH / 2 - 100, 50);
      ctx.fillText(scores.player2.toString(), GAME_WIDTH / 2 + 60, 50);

    } else if (serverGameState) {
      // Remote Game Draw with improved interpolation for smooth movement
      // Always use the latest serverGameState as base, even if interpolation isn't ready
      let displayState = serverGameState;

      // Apply advanced interpolation if we have previous state for smoother movement
      // CRITICAL: Only interpolate if we have BOTH previous and current states
      // Otherwise, just use the raw serverGameState to prevent freezing
      if (previousGameStateRef.current && interpolatedStateRef.current && !winner && serverGameState) {
        const now = Date.now();
        const timeSinceUpdate = now - lastUpdateTimeRef.current;

        // Calculate expected time between updates (60 FPS = ~16.67ms)
        const expectedUpdateInterval = 16.67;

        // Adaptive interpolation window based on network latency
        // Use longer window (up to 150ms) to handle network jitter better
        const adaptiveWindow = Math.max(100, networkLatencyRef.current * 3); // At least 100ms, scale with latency
        const maxInterpolationTime = Math.min(150, adaptiveWindow); // Cap at 150ms

        // Only interpolate if update is recent enough
        if (timeSinceUpdate < maxInterpolationTime) {
          const prev = previousGameStateRef.current;
          const curr = interpolatedStateRef.current;

          // Calculate interpolation factor
          const interpolationDuration = expectedUpdateInterval;
          let interpolationFactor = timeSinceUpdate / interpolationDuration;

          // Linear interpolation for paddles (smooth movement)
          const lerp = (start: number, end: number, factor: number) => {
            if (factor <= 1) {
              return start + (end - start) * factor;
            } else {
              // Extrapolation with less damping for better responsiveness
              const velocity = end - start;
              return end + velocity * (factor - 1) * 0.7; // Reduced damping from 0.5 to 0.7
            }
          };

          // Smooth interpolation for paddles (slight easing for natural feel)
          const smoothStep = (t: number) => t * t * (3 - 2 * t);
          const smoothedPaddleFactor = smoothStep(Math.min(interpolationFactor, 1));

          // Velocity-based prediction for ball (smooth and linear movement)
          const getBallPosition = () => {
            if (!smoothedBallPositionRef.current) {
              smoothedBallPositionRef.current = { x: curr.ball.x, y: curr.ball.y };
            }

            const prevBall = prev.ball;
            const currBall = curr.ball;

            // Calculate velocity from server state
            // dx/dy are in pixels per frame (where frame = 16.67ms at 60 FPS)
            // Convert to pixels per millisecond for prediction
            let ballVx: number;
            let ballVy: number;

            if (currBall.dx !== undefined && currBall.dy !== undefined) {
              // Use velocity from server (pixels per frame), convert to pixels per ms
              // Since updates come every 16.67ms (60 FPS), divide by 16.67
              ballVx = currBall.dx / expectedUpdateInterval;
              ballVy = currBall.dy / expectedUpdateInterval;
            } else {
              // Fallback: calculate velocity from position difference
              ballVx = (currBall.x - prevBall.x) / interpolationDuration;
              ballVy = (currBall.y - prevBall.y) / interpolationDuration;
            }

            // Calculate predicted position using velocity (timeSinceUpdate is in ms)
            const predictedX = currBall.x + ballVx * timeSinceUpdate;
            const predictedY = currBall.y + ballVy * timeSinceUpdate;

            // Exponential smoothing for ultra-smooth ball movement
            // Higher alpha (0.15-0.25) = more responsive, lower = smoother
            const alpha = 0.2; // Balance between responsiveness and smoothness
            const smoothedX = smoothedBallPositionRef.current.x * (1 - alpha) + predictedX * alpha;
            const smoothedY = smoothedBallPositionRef.current.y * (1 - alpha) + predictedY * alpha;

            // Update smoothed position reference
            smoothedBallPositionRef.current = { x: smoothedX, y: smoothedY };

            // For interpolation (when behind), use linear interpolation for accuracy
            if (interpolationFactor <= 1) {
              // Linear interpolation when behind - more accurate
              return {
                x: prevBall.x + (currBall.x - prevBall.x) * interpolationFactor,
                y: prevBall.y + (currBall.y - prevBall.y) * interpolationFactor
              };
            } else {
              // Use smoothed prediction when ahead
              return { x: smoothedX, y: smoothedY };
            }
          };

          const ballPos = getBallPosition();

          displayState = {
            ...curr,
            player1: {
              ...curr.player1,
              y: lerp(prev.player1.y, curr.player1.y, smoothedPaddleFactor)
            },
            player2: {
              ...curr.player2,
              y: lerp(prev.player2.y, curr.player2.y, smoothedPaddleFactor)
            },
            ball: {
              ...curr.ball,
              x: ballPos.x,
              y: ballPos.y
            }
          };
        } else {
          // If update is too old, reset smoothed position to current state
          smoothedBallPositionRef.current = {
            x: serverGameState.ball.x,
            y: serverGameState.ball.y
          };
          // Use raw serverGameState when interpolation window expires
          displayState = serverGameState;
        }
      } else {
        // No interpolation available yet - use raw serverGameState to prevent freezing
        // This ensures the game is always visible, even before interpolation is set up
        displayState = serverGameState;
      }

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

  // Winner screen for remote game (but not for tournament final match)
  if (winner && !tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local' && !isTournamentFinalMatch) {
    return (
      <div className="text-white text-center p-8 bg-gray-800 rounded-lg">
        <h2 className="text-4xl font-bold mb-4">{t('game.gameOver')}</h2>
        <p className="text-2xl mt-4 mb-6">{t('game.isTheWinner', { winner })}</p>

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
            keysPressed.current = {}; // Clear any pressed keys first
            setWinner(null);
            resetGameState();
            // Small delay to ensure state is reset before game loop restarts
            setTimeout(() => {
              if (onGameOver) onGameOver(null); // Notify parent that game is reset
            }, 50);
          }}
          className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={() => {
            if (onGameOver) onGameOver(null); // Notify parent before exit
            handleExit();
          }}
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
      <div className="relative w-full flex justify-center items-center" style={{ maxWidth: '100%', maxHeight: '100%' }}>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="bg-gray-800 rounded-lg shadow-lg"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
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
