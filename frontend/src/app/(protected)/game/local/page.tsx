'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';

export default function LocalGamePage() {
  const { t } = useTranslation();
  const { gameState } = useGameContext();
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = t('game.localMultiplayerPingPong');
  }, [t]);

  useEffect(() => {
    if (!gameState.players || !gameState.players[1]?.name) {
      router.replace('/game/player2');
    }
  }, [gameState.players, router]);

  if (!gameState.players || !gameState.players[1]?.name) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%] ">

      <div className="w-[90%] h-[80%]">
        <PingPongGame />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/game')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          {t('game.backToGameModes')}
        </button>
      </div>
    </div>
  );
}
