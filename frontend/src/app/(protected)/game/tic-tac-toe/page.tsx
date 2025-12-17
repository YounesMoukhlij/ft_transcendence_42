'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import TicTacToe from '@/components/TicTacToe';
import { useTranslation } from '@/contexts/LanguageContext';

export default function TicTacToePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { gameState, setGameMode } = useGameContext();
  const gameContainerRef = useRef<HTMLDivElement>(null);

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

  // Automatically enter fullscreen when game starts
  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) return;

    // Check if already in fullscreen
    if (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    ) {
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(async () => {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
          container.focus();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
          container.focus();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
          container.focus();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
          container.focus();
        }
      } catch (error) {
        console.log('Auto-fullscreen not available:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.push('/game');
  };

  return (
    <div ref={gameContainerRef} tabIndex={-1} className="h-full w-full focus:outline-none">
      <TicTacToe onBack={handleBack} />
    </div>
  );
}

