'use client';

import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GameProvider } from '@/components/GameContext';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <GameProvider>{children}</GameProvider>
    </LanguageProvider>
  );
}
