'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../../../../components/GameContext';
import GameCustomization from '../../../../components/GameCustomization';

export default function CustomizePage() {
  const router = useRouter();
  const { gameState } = useGameContext();

  // Set page title based on game mode
  useEffect(() => {
    const title = gameState.mode === 'ai' ? 'AI Game Customization' :
                 gameState.mode === 'local' ? 'Local Game Customization' :
                 gameState.mode === 'tournament' ? 'Online Game Customization' : 'Game Customization';
    document.title = title;
  }, [gameState.mode]);

  useEffect(() => {
    if (!gameState.mode) {
      router.push('/game');
    }
  }, [gameState.mode, router]);

  if (!gameState.mode) {
    return null;
  }

  const handleBack = () => {
    if (gameState.mode === 'local' || gameState.mode === 'tournament') {
      router.push('/game/versus-selection');
    } else {
      router.push('/game');
    }
  };

  const handleStartGame = () => {
    if (gameState.mode === 'ai') {
      router.push('/game/ai');
    } else if (gameState.mode === 'local') {
      router.push('/game/local');
    } else if (gameState.mode === 'tournament') {
      router.push('/game/tournament');
    } else {
      router.push('/game/play');
    }
  };

  return (
    <div className="h-full w-full  flex items-center justify-center p-4">

          <GameCustomization
            onBack={handleBack}
            onStartGame={handleStartGame}
          />
        </div>
  );
}
