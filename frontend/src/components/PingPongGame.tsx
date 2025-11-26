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

  const updateGameState = useCallback((keysPressed: { [key: string]: boolean }) => {
    setGameState(prev => {
      // Paddles
      const newPaddles = [...prev.paddles];
      if (keysPressed['w']) newPaddles[0] -= 8;
      if (keysPressed['s']) newPaddles[0] += 8;
      if (keysPressed['ArrowUp']) newPaddles[1] -= 8;
      if (keysPressed['ArrowDown']) newPaddles[1] += 8;
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

  // Local game state
  const localPlayers = tournamentMode ? tournamentPlayers : [];
  const { scores, paddles, ball, updateGameState, resetGameState } = useLocalGameState(localPlayers);

  // Reset game state for new tournament match
  useEffect(() => {
    if (tournamentMode) {
      setWinner(null);
      resetGameState();
      keysPressed.current = {};
    }
  }, [tournamentPlayers, tournamentMode, resetGameState]); // Key dependency

  // Keyboard controls for local and remote
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (winner) return;
      if (tournamentMode) {
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
        if (tournamentMode) {
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
  }, [socket, user, winner, tournamentMode]);

  // Game loop for local tournament
  useEffect(() => {
    if (!tournamentMode || winner) return;
  
    const gameLoop = setInterval(() => {
      updateGameState(keysPressed.current);
    }, 1000 / 60); // 60 FPS
  
    return () => clearInterval(gameLoop);
  }, [tournamentMode, winner, updateGameState]);


  // Check for winner in local tournament
  useEffect(() => {
    if (!winner && tournamentMode && onTournamentMatchEnd && localPlayers.length >= 2) {
      if (scores.player1 >= WINNING_SCORE) {
        setWinner(localPlayers[0].name);
        onTournamentMatchEnd(localPlayers[0]);
      } else if (scores.player2 >= WINNING_SCORE) {
        setWinner(localPlayers[1].name);
        onTournamentMatchEnd(localPlayers[1]);
      }
    }
  }, [scores, tournamentMode, onTournamentMatchEnd, localPlayers, winner]);

  // Check for winner in remote game
  useEffect(() => {
    if (!tournamentMode && serverGameState) {
      if (serverGameState.player1.score >= WINNING_SCORE) {
        setWinner(serverGameState.player1.username);
      } else if (serverGameState.player2.score >= WINNING_SCORE) {
        setWinner(serverGameState.player2.username);
      }
    }
  }, [serverGameState, tournamentMode]);

  // Drawing logic (works for both modes)
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (tournamentMode) {
      const { customisation } = gameState;
      // Local Tournament Draw
      ctx.fillStyle = customisation?.tableBg || '#333';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = customisation?.paddleColor || '#ff0000';
      ctx.fillRect(10, paddles[0], PADDLE_WIDTH, PADDLE_HEIGHT);

      ctx.fillStyle = customisation?.paddleColor || '#0000ff';
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
      // Remote Game Draw
      const { player1, player2, ball: remoteBall } = serverGameState;
      const p1Custom = player1.customization;
      const p2Custom = player2.customization;

      ctx.fillStyle = p1Custom?.tableBg || '#333';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(GAME_WIDTH / 2, 0);
      ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = p1Custom?.paddleColor || '#ff0000';
      ctx.fillRect(10, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      ctx.fillStyle = p2Custom?.paddleColor || '#0000ff';
      ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, player2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      ctx.beginPath();
      ctx.arc(remoteBall.x, remoteBall.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = p1Custom?.ballColor || '#fff';
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '45px Arial';
      ctx.fillText(player1.score.toString(), GAME_WIDTH / 2 - 100, 50);
      ctx.fillText(player2.score.toString(), GAME_WIDTH / 2 + 60, 50);
    }

  }, [serverGameState, tournamentMode, paddles, ball, scores]);

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
  if (winner && !tournamentMode) {
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
  if (!tournamentMode && !serverGameState) {
    return <div className="text-white">Connecting to game...</div>;
  }
  
  // Main game display
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between w-full max-w-4xl mb-2">
        <span className="text-white text-xl">
            {tournamentMode ? localPlayers[0]?.name : serverGameState?.player1.username}
        </span>
        <span className="text-white text-xl">
            {tournamentMode ? localPlayers[1]?.name : serverGameState?.player2.username}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="bg-gray-800 rounded-lg shadow-lg"
      />
      <div className="mt-4 text-center text-white">
        <p>Player 1: W/S keys. Player 2: Up/Down Arrow keys.</p>
        <p>First to {WINNING_SCORE} points wins!</p>
      </div>
    </div>
  );
};

export default PingPongGame;
