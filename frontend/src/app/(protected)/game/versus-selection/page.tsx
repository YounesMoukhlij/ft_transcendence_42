'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';

export default function VersusSelectionPage() {
  const router = useRouter();
  const { setGameMode } = useGameContext();

  // Set page title
  useEffect(() => {
    document.title = 'Local Game Setup';
  }, []);

  // Automatically redirect to player 2 setup
  useEffect(() => {
    setGameMode('local');
    router.replace('/game/player2');
  }, [router, setGameMode]);

  // Show loading while redirecting
  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%]">
      <div className="text-white text-center">
        <p>Setting up local game...</p>
      </div>
    </div>
  );
}
