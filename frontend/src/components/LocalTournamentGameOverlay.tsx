'use client';

import React from 'react';
import { Player } from './GameContext';
import { useTranslation } from '@/contexts/LanguageContext';

const defaultProfileImg = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/HeathJoker.png/250px-HeathJoker.png';

interface LocalTournamentGameOverlayProps {
  player1: Player;
  player2: Player;
  score1: number;
  score2: number;
  isFullscreen?: boolean;
}

export default function LocalTournamentGameOverlay({
  player1,
  player2,
  score1,
  score2,
  isFullscreen = false,
}: LocalTournamentGameOverlayProps) {
  const { t } = useTranslation();

  // Non-fullscreen player info bar (matches remote 1v1 style)
  if (!isFullscreen) {
    return (
      <div className="w-full max-w-4xl mb-4 px-4">
        <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
          {/* Player 1 */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <img
                src={player1.avatar || defaultProfileImg}
                alt={player1.name}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-400 shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultProfileImg;
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-800 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{score1}</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                {player1.name || t('game.player1')}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">{t('game.leftPaddle')}</p>
            </div>
          </div>

          {/* VS Separator */}
          <div className="mx-4 sm:mx-6 flex-shrink-0">
            <span className="text-yellow-400 font-bold text-lg sm:text-xl md:text-2xl">{t('game.VS')}</span>
          </div>

          {/* Player 2 */}
          <div className="flex items-center gap-3 flex-1 flex-row-reverse text-right">
            <div className="relative">
              <img
                src={player2.avatar || defaultProfileImg}
                alt={player2.name}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-red-400 shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultProfileImg;
                }}
              />
              <div className="absolute -bottom-1 -left-1 bg-red-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-800 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{score2}</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                {player2.name || t('game.player2')}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">{t('game.rightPaddle')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen minimal player info (matches remote 1v1 style)
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src={player1.avatar || defaultProfileImg}
            alt={player1.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultProfileImg;
            }}
          />
          <span className="text-white text-xs font-semibold truncate max-w-[100px]">
            {player1.name || 'P1'}
          </span>
          <span className="text-blue-400 font-bold text-sm">{score1}</span>
        </div>
          <span className="text-yellow-400 font-bold">{t('game.VS')}</span>
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-bold text-sm">{score2}</span>
          <span className="text-white text-xs font-semibold truncate max-w-[100px]">
            {player2.name || 'P2'}
          </span>
          <img
            src={player2.avatar || defaultProfileImg}
            alt={player2.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-red-400"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultProfileImg;
            }}
          />
        </div>
      </div>
    </div>
  );
}

