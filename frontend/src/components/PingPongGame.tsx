'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameContext } from '../components/GameContext';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'next/navigation';
import { ServerGameState } from '../types/game';

const PADDLE_HEIGHT = 100;
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
const PADDLE_WIDTH = 16;
const BALL_RADIUS = 10;

const PingPongGame: React.FC<{ serverGameState: ServerGameState | null, opponentLeft: boolean }> = ({ serverGameState, opponentLeft }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState } = useGameContext();
  const { user, socket } = useUserStore();
  const router = useRouter();

  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (serverGameState) {
      if (serverGameState.player1.score >= 10) {
        setWinner(serverGameState.player1.username);
      } else if (serverGameState.player2.score >= 10) {
        setWinner(serverGameState.player2.username);
      }
    }
  }, [serverGameState]);

  // Handle keyboard input for paddle movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (winner) return;
      if (e.key === 'w' || e.key === 'ArrowUp') {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'up' } }));
        }
      } else if (e.key === 's' || e.key === 'ArrowDown') {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'paddleMove', payload: { direction: 'down' } }));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (winner) return;
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
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket, gameState, serverGameState, user, winner]);

  // Drawing logic
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !serverGameState) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { player1, player2, ball } = serverGameState;
    const p1Custom = player1.customization;
    const p2Custom = player2.customization;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw background (player 1's choice)
    ctx.fillStyle = p1Custom?.tableBg || '#333';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw center line
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(GAME_WIDTH / 2, 0);
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = p1Custom?.paddleColor || '#ff0000';
    ctx.fillRect(10, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    ctx.fillStyle = p2Custom?.paddleColor || '#0000ff';
    ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, player2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = p1Custom?.ballColor || '#fff';
    ctx.fill();

    // Draw scores
    ctx.fillStyle = '#fff';
    ctx.font = '45px Arial';
    ctx.fillText(player1.score.toString(), GAME_WIDTH / 2 - 100, 50);
    ctx.fillText(player2.score.toString(), GAME_WIDTH / 2 + 60, 50);

  }, [serverGameState]);

  // Render loop
  useEffect(() => {
    const render = () => {
      draw();
      requestAnimationFrame(render);
    };
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [draw]);

  const handleExit = () => {
    router.push('/game');
  };

  if (opponentLeft) {
    return (
      <div className="text-white text-center">
        <h2>Your opponent has left the game.</h2>
        <button onClick={handleExit} className="mt-4 px-4 py-2 bg-blue-500 rounded">Back to Game Lobby</button>
      </div>
    );
  }
  
  if (winner) {
    return (
      <div className="text-white text-center">
        <h2>Game Over</h2>
        <p className="text-2xl mt-4">{winner} is the winner!</p>
        <button onClick={handleExit} className="mt-4 px-4 py-2 bg-blue-500 rounded">Back to Game Lobby</button>
      </div>
    );
  }

  if (!serverGameState) {
    return <div className="text-white">Connecting to game...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between w-full max-w-4xl mb-2">
        <span className="text-white text-xl">{serverGameState.player1.username}</span>
        <span className="text-white text-xl">{serverGameState.player2.username}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="bg-gray-800 rounded-lg shadow-lg"
      />
      <div className="mt-4 text-center text-white">
        <p>Use W/S or Arrow Up/Down to control your paddle.</p>
        <p>First to 10 points wins!</p>
      </div>
    </div>
  );
};

export default PingPongGame;