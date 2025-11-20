'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import PingPongGame from '@/components/PingPongGame';

import { ServerGameState } from '@/types/game';

export default function RemoteGameRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { roomCode } = params;
  const { setGameMode } = useGameContext();
  const { socket } = useUserStore();

  const [serverGameState, setServerGameState] = useState<ServerGameState | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Online Multiplayer Ping Pong';
    setGameMode('remote');
  }, [setGameMode]);

  useEffect(() => {
    if (!socket) {
      setError('WebSocket connection not found. Please try again.');
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'gameState':
            setServerGameState(message.payload);
            break;
          case 'opponentLeft':
            setOpponentLeft(true);
            break;
          default:
            console.log('Unhandled game message:', message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  const leaveRoom = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'leaveRoom',
        payload: { roomCode }
      }));
    }
    router.push('/game');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <button
          onClick={() => router.push('/game')}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Back to Game Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Online Game</h2>
        <p className="text-gray-300">Room: {roomCode}</p>
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Leave Game
          </button>
        </div>
      </div>
      <PingPongGame serverGameState={serverGameState} opponentLeft={opponentLeft} />
    </div>
  );
}
