'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../../../../components/GameContext';

export default function RemoteGamePage() {
  const router = useRouter();
  const { gameState } = useGameContext();

  // Set page title
  useEffect(() => {
    document.title = 'Online Multiplayer Ping Pong';
  }, []);

  // If no mode is selected or it's not remote mode, redirect back
  if (!gameState.mode || gameState.mode !== 'remote') {
    router.push('/game');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-gray-900">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-6">Online Multiplayer</h1>
        <p className="text-gray-300 text-lg mb-8">
          Online multiplayer functionality is coming soon!
        </p>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Planned Features:</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Room-based matchmaking</li>
            <li>• Real-time multiplayer games</li>
            <li>• Global leaderboards</li>
            <li>• Friend system</li>
            <li>• Chat functionality</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/game')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Back to Game Modes
          </button>
          <button
            onClick={() => router.push('/game/versus-selection')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Try Local Mode Instead
          </button>
        </div>
      </div>
    </div>
  );
}
