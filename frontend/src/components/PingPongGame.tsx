'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameContext } from '../components/GameContext';
import { FaUserCircle } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa';
import { FaPause, FaPlay } from 'react-icons/fa';

interface GameState {
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
  };
  leftPaddle: {
    y: number;
    height: number;
    width: number;
    speed: number;
  };
  rightPaddle: {
    y: number;
    height: number;
    width: number;
    speed: number;
  };
  score: {
    left: number;
    right: number;
  };
  gameStarted: boolean;
  winner: string | null;
}

const PingPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState } = useGameContext();
  const { tableBg, paddleColor, ballColor } = gameState.customisation || {};
  const [localGameState, setLocalGameState] = useState<GameState>({
    ball: {
      x: 400,
      y: 300,
      dx: 3,
      dy: 2,
      radius: 8,
    },
    leftPaddle: {
      y: 250,
      height: 100,
      width: 16,
      speed: 0,
    },
    rightPaddle: {
      y: 250,
      height: 100,
      width: 16,
      speed: 0,
    },
    score: {
      left: 0,
      right: 0,
    },
    gameStarted: false,
    winner: null,
  });
  const [paused, setPaused] = useState(false);

  // Set canvas size to match the table size
  const tableW = 900;
  const tableH = 340;
  const canvasWidth = tableW;
  const canvasHeight = tableH;
  const tableX = 0;
  const tableY = 0;
  const tableRadius = 16;
  // Paddle and ball constants
  const paddleWidth = 16;
  const paddleHeight = 70; // smaller paddles
  const ballRadius = 8;
  // Update gameWidth/gameHeight/gameX/gameY to match table
  const gameWidth = tableW;
  const gameHeight = tableH;
  const gameX = 0;
  const gameY = 0;

  const paddleSpeed = 8;
  const aiPaddleSpeed = 5; // Reduced from 7 to 5 to make AI slower
  const paddleRadius = 8; // Radius for rounded corners
  const keysPressed = useRef<Set<string>>(new Set());

  // Add horizontal padding for paddles
  const paddlePadding = 20;

  // Initialize game based on mode
  useEffect(() => {
    const initializeGame = () => {
      setLocalGameState(prev => ({
        ...prev,
        gameStarted: true,
      }));
    };
    initializeGame();
  }, [gameState.mode]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Keyboard shortcut for pause/unpause (P)
  useEffect(() => {
    const handlePauseKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handlePauseKey);
    return () => window.removeEventListener('keydown', handlePauseKey);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (paused || !localGameState.gameStarted || localGameState.winner) return;
    setLocalGameState(prev => {
      let newState = { ...prev };

      // --- Paddle movement ---
      // Left paddle (W/S)
      if (keysPressed.current.has('w') || keysPressed.current.has('W')) {
        newState.leftPaddle.y = Math.max(0, newState.leftPaddle.y - paddleSpeed);
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('S')) {
        newState.leftPaddle.y = Math.min(gameHeight - paddleHeight, newState.leftPaddle.y + paddleSpeed);
      }
      // Right paddle (AI or Arrow keys)
      if (gameState.mode === 'ai') {
        // AI: Make it smoother and easier to beat
        const paddleCenter = newState.rightPaddle.y + paddleHeight / 2;
        const target = newState.ball.y;

        // 70% of the time, AI makes mistakes
        if (Math.random() < 0.7) {
          // Add prediction error and delayed reaction
          const error = (Math.random() - 0.5) * 100; // Increased error range
          const reactionDelay = 30; // Add delay to AI reactions

          if (paddleCenter < target + error - reactionDelay) {
            newState.rightPaddle.y = Math.min(
              gameHeight - paddleHeight,
              newState.rightPaddle.y + (aiPaddleSpeed * 0.7) // 70% of normal speed
            );
          } else if (paddleCenter > target + error + reactionDelay) {
            newState.rightPaddle.y = Math.max(
              0,
              newState.rightPaddle.y - (aiPaddleSpeed * 0.7)
            );
          }
        } else {
          // 30% of the time, AI plays normally but still not perfect
          if (paddleCenter < target - 15) {
            newState.rightPaddle.y = Math.min(
              gameHeight - paddleHeight,
              newState.rightPaddle.y + aiPaddleSpeed
            );
          } else if (paddleCenter > target + 15) {
            newState.rightPaddle.y = Math.max(
              0,
              newState.rightPaddle.y - aiPaddleSpeed
            );
          }
        }

        // Add slight randomness less frequently (reduced from 0.2 to 0.1)
        if (Math.random() < 0.1) {
          // Reduced random movement magnitude (from 16 to 8)
          newState.rightPaddle.y += (Math.random() - 0.5) * 8;
          newState.rightPaddle.y = Math.max(
            0,
            Math.min(gameHeight - paddleHeight, newState.rightPaddle.y)
          );
        }
      } else {
        if (keysPressed.current.has('ArrowUp')) {
          newState.rightPaddle.y = Math.max(0, newState.rightPaddle.y - paddleSpeed);
        }
        if (keysPressed.current.has('ArrowDown')) {
          newState.rightPaddle.y = Math.min(gameHeight - paddleHeight, newState.rightPaddle.y + paddleSpeed);
        }
      }

      // --- Ball movement ---
      newState.ball.x += newState.ball.dx;
      newState.ball.y += newState.ball.dy;

      // --- Ball collision with top/bottom walls ---
      if (newState.ball.y - ballRadius <= 0) {
        newState.ball.y = ballRadius;
        newState.ball.dy = -newState.ball.dy;
      }
      if (newState.ball.y + ballRadius >= gameHeight) {
        newState.ball.y = gameHeight - ballRadius;
        newState.ball.dy = -newState.ball.dy;
      }

      // --- Ball collision with left paddle ---
      if (
        newState.ball.x - ballRadius <= paddleWidth &&
        newState.ball.x - ballRadius >= 0 &&
        newState.ball.y + ballRadius >= newState.leftPaddle.y &&
        newState.ball.y - ballRadius <= newState.leftPaddle.y + paddleHeight
      ) {
        newState.ball.x = paddleWidth + ballRadius;
        newState.ball.dx = Math.abs(newState.ball.dx);
        // Add a little angle based on where it hit the paddle
        const hitPos = (newState.ball.y - (newState.leftPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
        newState.ball.dy = 4 * hitPos;
      }

      // --- Ball collision with right paddle ---
      if (
        newState.ball.x + ballRadius >= gameWidth - paddleWidth &&
        newState.ball.x + ballRadius <= gameWidth &&
        newState.ball.y + ballRadius >= newState.rightPaddle.y &&
        newState.ball.y - ballRadius <= newState.rightPaddle.y + paddleHeight
      ) {
        newState.ball.x = gameWidth - paddleWidth - ballRadius;
        newState.ball.dx = -Math.abs(newState.ball.dx);
        // Add a little angle based on where it hit the paddle
        const hitPos = (newState.ball.y - (newState.rightPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
        newState.ball.dy = 4 * hitPos;
      }

      // --- Scoring ---
      if (newState.ball.x + ballRadius < 0) {
        newState.score.right++;
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: -3 * (Math.random() > 0.5 ? 1 : -1),
          dy: (Math.random() - 0.5) * 4,
          radius: ballRadius,
        };
      } else if (newState.ball.x - ballRadius > gameWidth) {
        newState.score.left++;
        newState.ball = {
          x: gameWidth / 2,
          y: gameHeight / 2,
          dx: 3 * (Math.random() > 0.5 ? 1 : -1),
          dy: (Math.random() - 0.5) * 4,
          radius: ballRadius,
        };
      }

      // --- Win condition ---
      if (newState.score.left >= 20) {
        newState.winner = gameState.players[0]?.name || 'Player 1';
      } else if (newState.score.right >= 20) {
        newState.winner = gameState.mode === 'ai' ? 'AI Opponent' : (gameState.players[1]?.name || 'Player 2');
      }

      // --- Sync paddle/ball state for rendering ---
      newState.leftPaddle.width = paddleWidth;
      newState.leftPaddle.height = paddleHeight;
      newState.rightPaddle.width = paddleWidth;
      newState.rightPaddle.height = paddleHeight;
      newState.ball.radius = ballRadius;

      return newState;
    });
  }, [paused, localGameState.gameStarted, localGameState.winner, gameState.mode, gameState.players]);

  // Render game
  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- 1. Draw table background (custom or default) ---
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const customBg = gameState.customisation?.tableBg;
    if (customBg) {
      if (customBg.startsWith('linear-gradient')) {
        const match = customBg.match(/linear-gradient\(135deg,\s*([^,]+),\s*([^,]+)(?:,\s*([^,]+))?\)/);
        if (match) {
          const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
          grad.addColorStop(0, match[1].trim());
          grad.addColorStop(0.5, match[3] ? match[2].trim() : match[2].trim());
          grad.addColorStop(1, match[3] ? match[3].trim() : match[2].trim());
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = customBg;
        }
      } else {
        ctx.fillStyle = customBg;
      }
    } else {
      ctx.fillStyle = 'rgba(75, 85, 99, 0.9)'; // default gray-600
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // --- 2. Draw white rounded table border only (no background fill) ---
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(tableX, tableY, tableW, tableH, tableRadius);
    ctx.stroke();
    ctx.restore();

    // --- 3. Draw thick dashed gray center line ---
    ctx.save();
    ctx.setLineDash([18, 18]);
    ctx.strokeStyle = '#bdbdbd';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, tableY + 10);
    ctx.lineTo(canvasWidth / 2, tableY + tableH - 10);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // --- 4. Draw 3D paddles (custom color) ---
    ctx.save();
    // Left paddle
    const leftPaddleX = gameX + paddlePadding;
    const leftPaddleY = gameY + localGameState.leftPaddle.y;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight, 8);
    ctx.fillStyle = gameState.customisation?.paddleColor || '#f87171';
    ctx.fill();
    ctx.restore();
    // Right paddle
    const rightPaddleX = gameX + gameWidth - paddleWidth - paddlePadding;
    const rightPaddleY = gameY + localGameState.rightPaddle.y;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = -4;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight, 8);
    ctx.fillStyle = gameState.customisation?.paddleColor || '#60a5fa';
    ctx.fill();
    ctx.restore();
    ctx.restore();

    // --- 5. Draw 3D ball (custom color) ---
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    const ballX = gameX + localGameState.ball.x;
    const ballY = gameY + localGameState.ball.y;
    const ballR = ballRadius;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
    ctx.fillStyle = gameState.customisation?.ballColor || '#fff';
    ctx.fill();
    ctx.restore();

    // --- 6. Draw large gray score ---
    ctx.save();
    ctx.fillStyle = '#e0e0e0';
    ctx.font = 'bold 54px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 2;
    ctx.fillText(
      localGameState.score.left.toString(),
      tableX + tableW * 0.18,
      tableY + 18
    );
    ctx.fillText(
      localGameState.score.right.toString(),
      tableX + tableW * 0.82,
      tableY + 18
    );
    ctx.restore();

    // --- 7. Draw winner overlay if needed ---
    if (localGameState.winner) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(tableX, tableY, tableW, tableH);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${localGameState.winner} Wins!`, canvasWidth / 2, canvasHeight / 2);
      ctx.font = '24px Arial';
      ctx.fillText('Press R to restart', canvasWidth / 2, canvasHeight / 2 + 40);
      ctx.restore();
    }
  }, [localGameState, gameState.mode]);

  // Game loop and rendering
  useEffect(() => {
    const interval = setInterval(() => {
      gameLoop();
    }, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [gameLoop]);

  useEffect(() => {
    renderGame();
  }, [renderGame]);

  // Handle restart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' && localGameState.winner) {
        setLocalGameState({
          ball: {
            x: 400,
            y: 300,
            dx: 3,
            dy: 2,
            radius: 8,
          },
          leftPaddle: {
            y: 250,
            height: 100,
            width: 16,
            speed: 0,
          },
          rightPaddle: {
            y: 250,
            height: 100,
            width: 16,
            speed: 0,
          },
          score: {
            left: 0,
            right: 0,
          },
          gameStarted: true,
          winner: null,
        });
        setPaused(false);
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [localGameState.winner]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      {/* Pause Button (centered above playground, only when not paused) */}
      {!paused && (
        <div className="absolute left-1/2 -translate-x-1/2 top-18 z-40 flex justify-center">
          <button
            onClick={() => setPaused(true)}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition text-lg font-bold flex items-center justify-center"
          >
            <FaPause className="w-6 h-6" />
          </button>
        </div>
      )}
      {/* Paused Overlay with Resume Button */}
      {paused && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-30"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <span className="text-4xl text-white font-bold mb-8">Paused</span>
          <button
            onClick={() => setPaused(false)}
            className="px-8 py-4 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition text-2xl font-bold z-40 flex items-center justify-center"
          >
            <FaPlay className="w-8 h-8" />
          </button>
        </div>
      )}
      {/* Player Avatars and Names */}
      <div className="absolute left-0 right-0 flex flex-row justify-between items-center px-22" style={{top: 0, height: '90px', pointerEvents: 'none', zIndex: 10}}>
        {/* Left Player */}
        <div className="flex flex-row items-center gap-2 ">
          {/* Avatar */}
          {gameState.players && gameState.players[0]?.avatar ? (
            <img src={gameState.players[0].avatar} alt="Player 1" className="w-20 h-20 rounded-full border-2 border-white bg-gray-700 object-cover" />
          ) : (
            <FaUserCircle className="w-20 h-20 text-white bg-gray-700 rounded-full border-2 border-white" />
          )}
          {/* Name */}
          <span className="text-white text-2xl pl-7 font-bold drop-shadow-md">
            {gameState.players && gameState.players[0]?.name ? gameState.players[0].name : 'PLAYER 1'}
          </span>
        </div>
        {/* Right Player */}
        <div className="flex flex-row items-center gap-2">
          {/* Name */}
          <span className="text-white text-2xl pr-7 font-bold drop-shadow-md">
            {gameState.mode === 'ai'
              ? 'THE MACHINIST (AI)'
              : (gameState.players && gameState.players[1]?.name ? gameState.players[1].name : 'PLAYER 2')}
          </span>
          {/* Avatar */}
          {gameState.mode === 'ai' ? (
            <FaRobot className="w-20 h-20 text-blue-300 bg-gray-700 rounded-full border-2 border-white" />
          ) : (
            gameState.players && gameState.players[1]?.avatar ? (
              <img src={gameState.players[1].avatar} alt="Player 2" className="w-20 h-20 rounded-full border-2 border-white bg-gray-700 object-cover" />
            ) : (
              <FaUserCircle className="w-20 h-20 text-white bg-gray-700 rounded-full border-2 border-white" />
            )
          )}
        </div>
      </div>
      {/* Game Title and Description removed */}
      <div className="mt-[70px]" />
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="rounded-lg shadow-lg"
        style={{ background: 'transparent' }}
      />
      <div className="mt-4 text-center text-white">
        <p className="text-sm">
          {gameState.mode === 'ai' ? 'Use W/S to control your paddle' :
           'Left: W/S | Right: ↑/↓'}
        </p>
        <p className="text-sm mt-1">Click on P to pause / resume the game</p>
        <p className="text-sm mt-3">First to 20 points wins!</p>
      </div>
    </div>
  );
};

export default PingPongGame;
