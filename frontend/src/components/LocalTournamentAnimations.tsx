'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Player } from './GameContext';
import { FaTrophy, FaCrown, FaFire, FaStar } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';
import { getProfileImageUrl } from '@/lib/utils';

interface LocalTournamentAnimationsProps {
  champion: Player | null;
  onRestart: () => void;
  onBack: () => void;
}

export default function LocalTournamentAnimations({
  champion,
  onRestart,
  onBack,
}: LocalTournamentAnimationsProps) {
  const { t } = useTranslation();
  const [showConfetti] = useState(true);
  const [, setShowChampion] = useState(false);

  useEffect(() => {
    // Show champion after confetti
    const timer = setTimeout(() => {
      setShowChampion(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Confetti animation
  useEffect(() => {
    if (!showConfetti) return;

    const confettiCount = 100;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
      const element = document.createElement('div');
      element.className = 'confetti';
      element.style.left = Math.random() * 100 + '%';
      element.style.animationDelay = Math.random() * 3 + 's';
      element.style.backgroundColor = [
        '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'
      ][Math.floor(Math.random() * 6)];
      element.style.width = Math.random() * 10 + 5 + 'px';
      element.style.height = element.style.width;
      document.body.appendChild(element);
      confetti.push(element);
    }

    return () => {
      confetti.forEach(el => el.remove());
    };
  }, [showConfetti]);

  if (!champion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center max-w-4xl mx-auto px-4">

        {/* Champion Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white ">
          {t('game.tournamentChampion')}
        </h1>
        <div className="mb-8 relative">
          <div className="absolute inset-0 "></div>
          <div className="relative bg-gray-900 rounded-3xl p-8 border border-gray-800 ">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Image
                src={getProfileImageUrl(champion.avatar)}
                alt={champion.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border border-gray-800 "
                unoptimized
              />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-2">
              {champion.name}
            </h2>
          </div>
        </div>


        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-blue-500/50 text-white rounded-xl text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            {t('game.playAgain')}
          </button>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xl font-semibold transition-all transform hover:scale-105"
          >
            {t('common.back')}
          </button>
        </div>
      </div>

      {/* Sparkle Effects */}
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: yellow;
          border-radius: 50%;
          animation: sparkle 1s infinite;
        }
      `}</style>
    </div>
  );
}

