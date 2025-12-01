'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';

export default function AIGamePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { gameState, setGameMode } = useGameContext();

  // Set page title
  useEffect(() => {
    document.title = t('game.aiPingPongGame');
  }, [t]);

  // Ensure we're in AI mode (only set once on mount)
  useEffect(() => {
    if (gameState.mode !== 'ai') {
      setGameMode('ai');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Get difficulty for display
  const difficulty = gameState.customisation?.aiDifficulty || 'medium';
  const difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Game Container */}
        <div className="w-full flex justify-center mb-4">
          <PingPongGame />
        </div>

        {/* Controls and Info */}
        <div className="w-full max-w-2xl mt-4 text-center space-y-4">
          {/* Difficulty Display */}
          <div className="text-white text-lg">
            <span className="opacity-70">Difficulty: </span>
            <span className="font-semibold text-xl">{difficultyText}</span>
          </div>

          {/* Controls Instructions */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p className="text-white text-sm md:text-base mb-2">
              <span className="font-semibold">Controls:</span> Use <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">W</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">S</kbd> keys to move your paddle
            </p>
            <p className="text-gray-400 text-xs md:text-sm">
              First to 15 points wins!
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push('/game')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('game.backToGameModes')}
          </button>
        </div>
      </div>
    </div>
  );
}
