'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';

export default function AIGamePage() {
  const router = useRouter();
  const { gameState, setGameMode } = useGameContext();

  // Set page title
  useEffect(() => {
    document.title = 'AI Ping Pong Game';
  }, []);

  // Ensure we're in AI mode (only set once on mount)
  useEffect(() => {
    if (gameState.mode !== 'ai') {
      setGameMode('ai');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%]">
      <div className="w-[90%] h-[80%]">
        <PingPongGame />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/game')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Back to Game Modes
        </button>
      </div>
    </div>
  );
}
