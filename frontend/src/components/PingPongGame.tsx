'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
const winningScore = 5;
const AI_winningScore = 10; // AI games are first to 10 points

// Game constants for smooth gameplay
const PADDLE_SPEED = 10; // Pixels per frame at 60 FPS (600 pixels/second)
const BALL_INITIAL_SPEED = 6;
const BALL_MAX_SPEED = 14;
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
  onTournamentMatchEnd?: (winner: Player, matchStats?: any) => void;
  isTournamentFinalMatch?: boolean; // Hide rematch button and game over screen for final match
  onScoreUpdate?: (scores: { player1: number; player2: number }) => void; // Callback for score updates

  // Local/AI game props
  onGameOver?: (winner: string | null) => void;
}

// Initial state for local game
const useLocalGameState = () => {
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
    // Tournament match statistics - always initialize
    gameStats: {
      startTime: Date.now(),
      player1Touches: 0,
      player2Touches: 0,
      currentStreakPlayer1: 0, // Current consecutive points
      currentStreakPlayer2: 0,
      maxStreakPlayer1: 0,
      maxStreakPlayer2: 0,
      player1LeadingTime: 0,
      player2LeadingTime: 0,
      lastLeadingPlayer: null as string | null, // Track who was leading last check
      lastLeadingCheck: Date.now(),
      maxBallSpeed: 0,
    },
  });

  const resetGameState = useCallback(() => {
    // Random initial direction
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6; // -30 to +30 degrees
    const speed = BALL_INITIAL_SPEED;
    setGameState(prevState => ({
      scores: { player1: 0, player2: 0 },
      paddles: [GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2],
      ball: {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
        vx: Math.random() > 0.5 ? speed * Math.cos(angle) : -speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        speed: speed,
      },
      gameStats: {
        startTime: Date.now(), // Reset start time for new match
        player1Touches: 0,
        player2Touches: 0,
        currentStreakPlayer1: 0,
        currentStreakPlayer2: 0,
        maxStreakPlayer1: 0,
        maxStreakPlayer2: 0,
        player1LeadingTime: 0,
        player2LeadingTime: 0,
        lastLeadingPlayer: null,
        lastLeadingCheck: Date.now(),
        maxBallSpeed: 0,
      },
    }));
  }, []);

  const updateGameState = useCallback((keysPressed: { [key: string]: boolean }, isAIMode: boolean = false, difficulty: 'easy' | 'medium' | 'hard' = 'medium', deltaTime: number = 1) => {
    setGameState(prev => {
      const now = Date.now();
      // Ensure gameStats always exists with default values - preserve all accumulated values
      const defaultGameStats = {
        startTime: prev.gameStats?.startTime || Date.now(),
        player1Touches: prev.gameStats?.player1Touches || 0,
        player2Touches: prev.gameStats?.player2Touches || 0,
        currentStreakPlayer1: prev.gameStats?.currentStreakPlayer1 || 0, // Preserve current streak
        currentStreakPlayer2: prev.gameStats?.currentStreakPlayer2 || 0,
        maxStreakPlayer1: prev.gameStats?.maxStreakPlayer1 || 0,
        maxStreakPlayer2: prev.gameStats?.maxStreakPlayer2 || 0,
        player1LeadingTime: prev.gameStats?.player1LeadingTime || 0,
        player2LeadingTime: prev.gameStats?.player2LeadingTime || 0,
        lastLeadingPlayer: prev.gameStats?.lastLeadingPlayer || null,
        lastLeadingCheck: prev.gameStats?.lastLeadingCheck || Date.now(),
        maxBallSpeed: prev.gameStats?.maxBallSpeed || 0,
      };
      let statsUpdate = { ...defaultGameStats };
      // Paddles - smooth movement based on delta time
      const newPaddles = [...prev.paddles];
      // AI mode: Support both W/S and Arrow Up/Down keys for player 1
      if (isAIMode) {
        if (keysPressed['w'] || keysPressed['ArrowUp']) newPaddles[0] -= PADDLE_SPEED * deltaTime;
        if (keysPressed['s'] || keysPressed['ArrowDown']) newPaddles[0] += PADDLE_SPEED * deltaTime;
      } else {
        // Local/tournament mode: Only W/S for player 1
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

        // Track statistics: increment player 1 touches
        statsUpdate.player1Touches++;

        // Track max ball speed
        if (newSpeed > statsUpdate.maxBallSpeed) {
          statsUpdate.maxBallSpeed = newSpeed;
        }

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

        // Track statistics: increment player 2 touches
        statsUpdate.player2Touches++;

        // Track max ball speed
        if (newSpeed > statsUpdate.maxBallSpeed) {
          statsUpdate.maxBallSpeed = newSpeed;
        }

        // Prevent sticking
        x = paddle2X - BALL_RADIUS - 1;
      }

      const newScores = { ...prev.scores };
      let ballReset = false;

      // Track leading time (check every 100ms to avoid excessive updates)
      const timeSinceLastCheck = now - statsUpdate.lastLeadingCheck;
      if (timeSinceLastCheck >= 100) {
        // Determine who is currently leading
        const currentLeader = newScores.player1 > newScores.player2 ? 'player1' : 
                              newScores.player2 > newScores.player1 ? 'player2' : null;
        
        // Add time to the current leader
        if (currentLeader === 'player1') {
          statsUpdate.player1LeadingTime += timeSinceLastCheck;
        } else if (currentLeader === 'player2') {
          statsUpdate.player2LeadingTime += timeSinceLastCheck;
        }
        
        statsUpdate.lastLeadingPlayer = currentLeader;
        statsUpdate.lastLeadingCheck = now;
      }

      // Score and track statistics
      if (x + BALL_RADIUS < 0) { // Ball passed left paddle (player 2 scores)
        newScores.player2++;
        ballReset = true;

        // Update streaks - player 2 scored, so increment their streak and reset player 1's
        statsUpdate.currentStreakPlayer2++;
        statsUpdate.currentStreakPlayer1 = 0; // Reset opponent streak
        
        // Update max streak if current streak is higher
        if (statsUpdate.currentStreakPlayer2 > statsUpdate.maxStreakPlayer2) {
          statsUpdate.maxStreakPlayer2 = statsUpdate.currentStreakPlayer2;
        }

      } else if (x - BALL_RADIUS > GAME_WIDTH) { // Ball passed right paddle (player 1 scores)
        newScores.player1++;
        ballReset = true;

        // Update streaks - player 1 scored, so increment their streak and reset player 2's
        statsUpdate.currentStreakPlayer1++;
        statsUpdate.currentStreakPlayer2 = 0; // Reset opponent streak
        
        // Update max streak if current streak is higher
        if (statsUpdate.currentStreakPlayer1 > statsUpdate.maxStreakPlayer1) {
          statsUpdate.maxStreakPlayer1 = statsUpdate.currentStreakPlayer1;
        }
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
        gameStats: statsUpdate,
      };
    });
  }, []);

  return { ...gameState, updateGameState, resetGameState };
};

const PingPongGame: React.FC<PingPongGameProps> = ({
  serverGameState,
  opponentLeft,
  socket: socketProp,
  rematchDeclinedMessage,
  setRematchDeclinedMessage: _setRematchDeclinedMessage,
  rematchOffer,
  handleAcceptRematch,
  tournamentMode = false,
  tournamentPlayers = [],
  onTournamentMatchEnd,
  isTournamentFinalMatch = false,
  onGameOver,
  onScoreUpdate
}) => {
  // Suppress unused parameter warning - setRematchDeclinedMessage is part of the props interface but not used
  void _setRematchDeclinedMessage;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const { gameState } = useGameContext();
  const { user, socket: storeSocket } = useUserStore();
  const socket = socketProp ?? storeSocket;
  const router = useRouter();
  const { t } = useTranslation();
  const activeRoomCode = serverGameState?.roomCode;
  const activeMatchId = serverGameState?.matchId;

  // Debug: log roomCode status for remote 1v1
  useEffect(() => {
    if (serverGameState && !tournamentMode) {
      console.log('[PingPongGame] Remote 1v1 state:', {
        hasServerGameState: !!serverGameState,
        roomCode: activeRoomCode,
        matchId: activeMatchId,
        hasSocket: !!socket,
        socketState: socket?.readyState
      });
    }
  }, [serverGameState, activeRoomCode, activeMatchId, socket, tournamentMode]);

  // Unified state
  const [winner, setWinner] = useState<string | null>(null);

  // Interpolation state for smooth movement
  const previousGameStateRef = useRef<ServerGameState | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const interpolatedStateRef = useRef<ServerGameState | null>(null);
  const updateHistoryRef = useRef<Array<{ state: ServerGameState; timestamp: number }>>([]);
  const smoothedBallPositionRef = useRef<{ x: number; y: number } | null>(null); // For exponential smoothing
  const networkLatencyRef = useRef<number>(16.67); // Track network latency (default to 1 frame)

  // Local game state - use gameState.players for local mode, tournamentPlayers for tournament mode
  const localPlayers = useMemo(() => {
    return tournamentMode ? tournamentPlayers : (gameState.mode === 'local' ? gameState.players : []);
  }, [tournamentMode, tournamentPlayers, gameState.mode, gameState.players]);
  const { scores, paddles, ball, gameStats, updateGameState, resetGameState } = useLocalGameState();

  // Get winning score from customization
  const [winningScore, setWinningScore] = useState(5);

  useEffect(() => {
    const newWinningScore = gameState.customisation?.winningScore || 5;
    console.log('PingPongGame - updating winningScore:', newWinningScore, 'gameState.customisation:', gameState.customisation);
    setWinningScore(newWinningScore);
  }, [gameState.customisation?.winningScore]);

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

  // Refs for keyboard handlers - prevents re-attaching listeners on every serverGameState change
  const serverGameStateRef = useRef(serverGameState);
  const activeRoomCodeRef = useRef(activeRoomCode);
  const activeMatchIdRef = useRef(activeMatchId);
  const winnerRef2 = useRef(winner);
  const socketRef = useRef(socket);
  useEffect(() => { serverGameStateRef.current = serverGameState; }, [serverGameState]);
  useEffect(() => { activeRoomCodeRef.current = activeRoomCode; }, [activeRoomCode]);
  useEffect(() => { activeMatchIdRef.current = activeMatchId; }, [activeMatchId]);
  const isTournamentFinalMatchRef = useRef(isTournamentFinalMatch);
  useEffect(() => { winnerRef2.current = winner; }, [winner]);
  useEffect(() => { socketRef.current = socket; }, [socket]);
  useEffect(() => { isTournamentFinalMatchRef.current = isTournamentFinalMatch; }, [isTournamentFinalMatch]);

  // Keyboard controls for local, remote, and AI modes - stable event listeners using refs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore key repeat
      // For tournament final matches, don't disable input even when winner is detected
      // The winner screen is hidden but paddles should still be movable
      if (winnerRef2.current && !isTournamentFinalMatchRef.current) return;

      // Determine if this is a remote game (has serverGameState) or local game
      const isRemoteGame = !!serverGameStateRef.current && !tournamentMode;
      const isLocalGame = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';

      if (isLocalGame) {
        keysPressed.current[e.key] = true;
      } else if (isRemoteGame) {
        const roomCode = activeRoomCodeRef.current;
        const matchId = activeMatchIdRef.current;
        const ws = socketRef.current;
        if (!roomCode) return;

        let direction: string | null = null;
        if (e.key === 'w' || e.key === 'ArrowUp') direction = 'up';
        else if (e.key === 's' || e.key === 'ArrowDown') direction = 'down';

        if (direction && ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'paddleMove',
            payload: { direction, roomCode, matchId }
          }));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // For tournament final matches, don't disable input even when winner is detected
      // The winner screen is hidden but paddles should still be movable
      if (winnerRef2.current && !isTournamentFinalMatchRef.current) return;

      const isRemoteGame = !!serverGameStateRef.current && !tournamentMode;
      const isLocalGame = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';

      if (isLocalGame) {
        keysPressed.current[e.key] = false;
      } else if (isRemoteGame) {
        const roomCode = activeRoomCodeRef.current;
        const matchId = activeMatchIdRef.current;
        const ws = socketRef.current;
        if (!roomCode) return;

        if (e.key === 'w' || e.key === 'ArrowUp' || e.key === 's' || e.key === 'ArrowDown') {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'paddleMove',
              payload: { direction: 'stop', roomCode, matchId }
            }));
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
  }, [tournamentMode, gameState.mode, isTournamentFinalMatch]); // Stable deps - refs handle dynamic values

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


  // Notify parent of score updates for tournament mode
  useEffect(() => {
    if (tournamentMode && onScoreUpdate) {
      onScoreUpdate(scores);
    }
  }, [scores, tournamentMode, onScoreUpdate]);

  // Check for winner in local tournament, AI mode, and local mode
  useEffect(() => {
    const isLocalMode = tournamentMode || gameState.mode === 'ai' || gameState.mode === 'local';

    if (!winner && isLocalMode) {
      if (tournamentMode && onTournamentMatchEnd && localPlayers.length >= 2) {
        // gameStats is already available from useLocalGameState
        const matchDuration = Date.now() - gameStats.startTime;
        const totalPoints = scores.player1 + scores.player2;

        // Calculate final match statistics with new simplified structure
        const matchStats = {
          player1Id: localPlayers[0].id_user || localPlayers[0].id,
          player2Id: localPlayers[1].id_user || localPlayers[1].id,
          finalScore: scores,
          duration: matchDuration,
          // Total touches for each player (ball hits on paddle)
          totalTouches: (gameStats.player1Touches || 0) + (gameStats.player2Touches || 0),
          player1Touches: gameStats.player1Touches || 0,
          player2Touches: gameStats.player2Touches || 0,
          // Seconds per point (average time between points - e.g., "a point every 6 seconds")
          pointsPerSecond: totalPoints > 0 ? ((matchDuration / 1000) / totalPoints) : 0,
          maxBallSpeed: gameStats.maxBallSpeed || 0,
          maxStreakPlayer1: gameStats.maxStreakPlayer1 || 0,
          maxStreakPlayer2: gameStats.maxStreakPlayer2 || 0,
          leadingTimePlayer1: gameStats.player1LeadingTime || 0,
          leadingTimePlayer2: gameStats.player2LeadingTime || 0,
          tournamentId: 'local-tournament' // Identifier for local tournaments
        };

        if (scores.player1 >= winningScore) {
          setWinner(localPlayers[0].name);
          console.log('🏆 PingPongGame: Player 1 wins!', {
            scores,
            localPlayers,
            gameStats
          });
          // Ensure player has required id property for onTournamentMatchEnd (expects types/game.Player)
          const winnerPlayer: Player = {
            ...localPlayers[0],
            id: localPlayers[0].id || `player-1`,
            id_user: typeof localPlayers[0].id_user === 'number' ? localPlayers[0].id_user : (typeof localPlayers[0].id_user === 'string' ? parseInt(localPlayers[0].id_user, 10) : undefined)
          };
          console.log('📤 PingPongGame: Calling onTournamentMatchEnd with:', {
            winnerPlayer,
            matchStats,
            gameStatsSummary: {
              duration: matchDuration,
              totalTouches: matchStats.totalTouches,
              player1Touches: gameStats.player1Touches || 0,
              player2Touches: gameStats.player2Touches || 0,
              pointsPerSecond: matchStats.pointsPerSecond,
              maxBallSpeed: gameStats.maxBallSpeed || 0,
              maxStreakPlayer1: gameStats.maxStreakPlayer1 || 0,
              maxStreakPlayer2: gameStats.maxStreakPlayer2 || 0
            }
          });
          onTournamentMatchEnd(winnerPlayer, matchStats);
        } else if (scores.player2 >= winningScore) {
          setWinner(localPlayers[1].name);
          console.log('🏆 PingPongGame: Player 2 wins!', {
            scores,
            localPlayers,
            gameStats
          });
          // Ensure player has required id property for onTournamentMatchEnd (expects types/game.Player)
          const winnerPlayer: Player = {
            ...localPlayers[1],
            id: localPlayers[1].id || `player-2`,
            id_user: typeof localPlayers[1].id_user === 'number' ? localPlayers[1].id_user : (typeof localPlayers[1].id_user === 'string' ? parseInt(localPlayers[1].id_user, 10) : undefined)
          };
          console.log('📤 PingPongGame: Calling onTournamentMatchEnd with:', {
            winnerPlayer,
            matchStats,
            gameStatsSummary: {
              duration: matchDuration,
              totalTouches: matchStats.totalTouches,
              player1Touches: gameStats.player1Touches || 0,
              player2Touches: gameStats.player2Touches || 0,
              pointsPerSecond: matchStats.pointsPerSecond,
              maxBallSpeed: gameStats.maxBallSpeed || 0,
              maxStreakPlayer1: gameStats.maxStreakPlayer1 || 0,
              maxStreakPlayer2: gameStats.maxStreakPlayer2 || 0
            }
          });
          onTournamentMatchEnd(winnerPlayer, matchStats);
        }
      } else if (gameState.mode === 'ai') {
        // AI mode - check for winner
        console.log('AI winner check - scores:', scores, 'winningScore:', winningScore);
        if (scores.player1 >= winningScore) {
          console.log('Setting winner: You');
          setWinner('You');
        } else if (scores.player2 >= winningScore) {
          console.log('Setting winner: AI');
          setWinner('AI');
        }
      } else if (gameState.mode === 'local' && localPlayers.length >= 2) {
        // Local mode - check for winner
        if (scores.player1 >= winningScore) {
          const winnerName = localPlayers[0].name;
          setWinner(winnerName);
          if (onGameOver) onGameOver(winnerName);
        } else if (scores.player2 >= winningScore) {
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
      if (serverGameState.player1.score >= winningScore) {
        setWinner(serverGameState.player1.username);
      } else if (serverGameState.player2.score >= winningScore) {
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

    if (shouldProcess && serverGameState?.ball) {
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

  // Refs for draw function to avoid recreating callback every frame
  const serverGameStateDrawRef = useRef(serverGameState);
  const paddlesRef = useRef(paddles);
  const ballRef = useRef(ball);
  const scoresRef = useRef(scores);
  const gameStateRef = useRef(gameState);
  const userRef = useRef(user);
  useEffect(() => {
    serverGameStateDrawRef.current = serverGameState;
  }, [serverGameState]);
  useEffect(() => { paddlesRef.current = paddles; }, [paddles]);
  useEffect(() => { ballRef.current = ball; }, [ball]);
  useEffect(() => { scoresRef.current = scores; }, [scores]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { userRef.current = user; }, [user]);

  // Drawing logic (works for both modes) - uses refs for all dynamic values to stay stable
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Access all dynamic values via refs
    const currentGameState = gameStateRef.current;
    const currentPaddles = paddlesRef.current;
    const currentBall = ballRef.current;
    const currentScores = scoresRef.current;
    const currentUser = userRef.current;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (tournamentMode || currentGameState.mode === 'ai' || currentGameState.mode === 'local') {
      const { customisation } = currentGameState;
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
        } catch {
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
      ctx.fillRect(10, currentPaddles[0], PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.restore();

      // Player 2 paddle (right side - AI in AI mode, human in tournament mode) - with shadow
      ctx.save();
      const paddle2Color = currentGameState.mode === 'ai' ? '#888888' : (customisation?.paddleColor || '#0000ff');
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
      ctx.fillText(currentScores.player1.toString(), GAME_WIDTH / 2 - 100, 50);
      ctx.fillText(currentScores.player2.toString(), GAME_WIDTH / 2 + 60, 50);

    } else if (serverGameStateDrawRef.current) {
      // Remote Game Draw - use server state directly (server sends at 60 FPS)
      const displayState = serverGameStateDrawRef.current;

      const { player1, player2, ball: remoteBall } = displayState;

      // Guard against missing data
      if (!player1 || !player2 || !remoteBall) return;

      // Determine which player is the current user
      const currentUserId = currentUser?.id_user;
      // Convert IDs to strings for comparison (backend may send numbers or strings)
      const player1Id = player1.id?.toString();
      const player2Id = player2.id?.toString();
      const currentUserIdStr = currentUserId?.toString();

      const isPlayer1 = currentUserIdStr && player1Id === currentUserIdStr;
      const isPlayer2 = currentUserIdStr && player2Id === currentUserIdStr;

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
        } catch {
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

  }, [tournamentMode]); // All dynamic values accessed via refs for stable callback

  // Render loop - stable, uses ref to always call latest draw
  const drawRef = useRef(draw);
  useEffect(() => { drawRef.current = draw; }, [draw]);

  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      drawRef.current();
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // Empty deps - render loop runs once, uses ref for latest draw

  // --- UI Rendering ---

  const handleExit = () => {
    // In tournament mode, we don't exit, the parent component handles it
    if (!tournamentMode) {
        router.push('/game');
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

  // Winner screen for remote game (but not for tournament final match) - Modern and decorated (like AI/local mode)
  if (winner && !tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local' && !isTournamentFinalMatch) {
    const isUserWinner = winner === user?.username;
    const player1Score = serverGameState?.player1?.score || 0;
    const player2Score = serverGameState?.player2?.score || 0;
    const player1Name = serverGameState?.player1?.username || 'Player 1';
    const player2Name = serverGameState?.player2?.username || 'Player 2';
    const winnerIsPlayer1 = player1Score > player2Score;

    return (
      <div className="relative w-full max-w-md mx-auto p-1 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-2xl animate-pulse">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 sm:p-8 text-center">
          {/* Trophy/Skull Icon with Animation */}
          <div className="mb-4 sm:mb-6">
            <div className="text-6xl sm:text-8xl drop-shadow-lg animate-bounce">
              {isUserWinner ? '🏆' : '💀'}
            </div>
          </div>

          {/* Title with Gradient */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
            {isUserWinner ? t('game.victory') || 'Victory!' : t('game.gameOver') || 'Game Over'}
          </h2>

          {/* Winner Name */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
            {t('game.isTheWinner', { winner }) || `${winner} Won!`}
          </p>

          {/* Score Card */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border-2 border-purple-400/50">
            <p className="text-sm text-gray-300 mb-2">Final Score</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-white">{player1Name}</p>
                <p className={`text-3xl sm:text-4xl font-extrabold ${winnerIsPlayer1 ? 'text-yellow-400' : 'text-purple-300'}`}>
                  {player1Score}
                </p>
              </div>
              <span className="text-2xl text-gray-400">-</span>
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-white">{player2Name}</p>
                <p className={`text-3xl sm:text-4xl font-extrabold ${!winnerIsPlayer1 ? 'text-yellow-400' : 'text-pink-300'}`}>
                  {player2Score}
                </p>
              </div>
            </div>
          </div>

          {rematchDeclinedMessage && (
            <p className="text-red-400 mb-4 text-sm">{rematchDeclinedMessage}</p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {rematchOffer && handleAcceptRematch && (
              <button
                onClick={handleAcceptRematch}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Accept Rematch
              </button>
            )}
            <button
              onClick={handleExit}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {t('game.backToLobby') || 'Back to Game Lobby'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading/initial state for remote game
  if (!tournamentMode && gameState.mode !== 'ai' && gameState.mode !== 'local' && !serverGameState) {
    return <div className="text-white">Connecting to game...</div>;
  }

  // Winner screen for AI mode - Modern and decorated
  if (winner && gameState.mode === 'ai') {
    const isPlayerWinner = winner === 'You';
    return (
      <div className="relative w-full max-w-md mx-auto p-1 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-2xl animate-pulse">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 sm:p-8 text-center">
          {/* Trophy/Skull Icon with Animation */}
          <div className="mb-4 sm:mb-6">
            <div className="text-6xl sm:text-8xl drop-shadow-lg animate-bounce">
              {isPlayerWinner ? '🏆' : '🤖'}
            </div>
          </div>

          {/* Title with Gradient */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
            {isPlayerWinner ? 'Victory!' : 'Game Over'}
          </h2>

          {/* Winner Name */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
            {winner} Won!
          </p>

          {/* Score Card */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border-2 border-purple-400/50">
            <p className="text-sm text-gray-300 mb-2">Final Score</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">You</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-purple-300">{scores.player1}</p>
              </div>
              <span className="text-2xl text-gray-400">-</span>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">AI</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-pink-300">{scores.player2}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setWinner(null);
                resetGameState();
                keysPressed.current = {};
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
            <button
              onClick={handleExit}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Back to Game Modes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Winner screen for local mode - Modern and decorated (like AI mode)
  if (winner && gameState.mode === 'local' && !tournamentMode) {
    const winnerIsPlayer1 = winner === localPlayers[0]?.name;

    return (
      <div className="relative w-full max-w-md mx-auto p-1 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-2xl animate-pulse">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 sm:p-8 text-center">
          {/* Trophy Icon with Animation */}
          <div className="mb-4 sm:mb-6">
            <div className="text-6xl sm:text-8xl drop-shadow-lg animate-bounce">
              🏆
            </div>
          </div>

          {/* Title with Gradient */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
            Victory!
          </h2>

          {/* Winner Name */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
            {winner} Wins! 🎉
          </p>

          {/* Score Card */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border-2 border-purple-400/50">
            <p className="text-sm text-gray-300 mb-2">Final Score</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-white">{localPlayers[0]?.name || 'Player 1'}</p>
                <p className={`text-3xl sm:text-4xl font-extrabold ${winnerIsPlayer1 ? 'text-yellow-400' : 'text-purple-300'}`}>
                  {scores.player1}
                </p>
              </div>
              <span className="text-2xl text-gray-400">-</span>
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-white">{localPlayers[1]?.name || 'Player 2'}</p>
                <p className={`text-3xl sm:text-4xl font-extrabold ${!winnerIsPlayer1 ? 'text-yellow-400' : 'text-pink-300'}`}>
                  {scores.player2}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                if (onGameOver) onGameOver(null); // Notify parent before exit
                handleExit();
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Back to Game Modes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main game display
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
            <p>First to {winningScore} points wins!</p>
          </>
        ) : tournamentMode ? (
          <>
            <p>Player 1: W/S keys. Player 2: Up/Down Arrow keys.</p>
            <p>First to {winningScore} points wins!</p>
          </>
        ) : gameState.mode === 'local' ? (
          <>
            <p>Player 1: W/S keys. Player 2: Up/Down Arrow keys.</p>
            <p>First to {winningScore} points wins!</p>
          </>
        ) : (
          <>
            <p>Use W/S or Arrow Up/Down keys to move your paddle.</p>
            <p>First to {winningScore} points wins!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PingPongGame;
