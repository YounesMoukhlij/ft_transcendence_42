'use client';

import { useEffect } from 'react';
import ModeSwiper from "@/components/ModeSwiper";
import { useTranslation } from '@/contexts/LanguageContext';

export default function GamePage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('game.selectMode');
  }, [t]);

  return (
    <div className=" flex flex-col items-center justify-center h-[100%] w-[100%]">
      <ModeSwiper/>
    </div>
  );
}
