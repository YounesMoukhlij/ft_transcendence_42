'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import TicTacToe from '@/components/TicTacToe';
import { useTranslation } from '@/contexts/LanguageContext';

export default function TicTacToePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { gameState, setGameMode } = useGameContext();

  // Set page title
  useEffect(() => {
    document.title = `${t('game.ticTacToe')} - ${t('game.xOGame')}`;
  }, [t]);

  // Ensure we're in tic-tac-toe mode (only set once on mount)
  useEffect(() => {
    if (gameState.mode !== 'tic-tac-toe') {
      setGameMode('tic-tac-toe');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleBack = () => {
    router.push('/game');
  };

  return (
    <div className="h-full w-full">
      <TicTacToe onBack={handleBack} />
    </div>
  );
}

