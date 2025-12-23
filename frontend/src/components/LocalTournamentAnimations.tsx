'use client';

import React, { useEffect, useState } from 'react';
import { Player } from './GameContext';
import { FaTrophy, FaCrown, FaFire, FaStar } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';

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
  const [showConfetti, setShowConfetti] = useState(true);
  const [showChampion, setShowChampion] = useState(false);

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
      {/* Confetti Container */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          position: fixed;
          top: -10px;
          border-radius: 50%;
          animation: confetti-fall 3s linear infinite;
        }
      `}</style>

      {/* Champion Announcement */}
      <div className="text-center max-w-4xl mx-auto px-4">
        {/* Trophy Icon with Animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <FaTrophy className="text-yellow-400 text-9xl animate-pulse opacity-30" />
          </div>
          <FaTrophy className="text-yellow-400 text-9xl relative z-10 animate-bounce" />
        </div>

        {/* Champion Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
          {t('game.tournamentChampion')}
        </h1>

        {/* Champion Name with Glow Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-50"></div>
          <div className="relative bg-gray-900 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={champion.avatar}
                alt={champion.name}
                className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg"
              />
              <FaCrown className="text-yellow-400 text-5xl animate-bounce" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-2">
              {champion.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <FaStar className="text-yellow-400 animate-spin" />
              <span className="text-2xl text-yellow-300 font-semibold">
                {t('game.victory')}
              </span>
              <FaStar className="text-yellow-400 animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>
        </div>

        {/* Fire Animation */}
        <div className="flex justify-center gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <FaFire
              key={i}
              className="text-orange-500 text-3xl animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
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

