'use client';

import React from 'react';
import { Player } from './GameContext';
import { FaUser, FaCrown } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslation } from '@/contexts/LanguageContext';

interface LocalTournamentPlayerRegistrationProps {
  tempPlayers: Player[];
  defaultAvatars: string[];
  updatePlayer: (index: number, field: keyof Player, value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function LocalTournamentPlayerRegistration({
  tempPlayers,
  defaultAvatars,
  updatePlayer,
  onComplete,
  onBack,
}: LocalTournamentPlayerRegistrationProps) {
  const { t } = useTranslation();

  const handleAvatarSelect = (playerIndex: number, avatarIndex: number) => {
    updatePlayer(playerIndex, 'avatar', defaultAvatars[avatarIndex % defaultAvatars.length]);
  };

  const allPlayersReady = tempPlayers.every(player => player.name.trim() !== '');

  return (
    <div className="w-full max-w-6xl mx-auto h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-3xl shadow-2xl border-2 border-blue-500 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
          {t('game.registerPlayers')}
        </h2>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
        >
          {t('common.back')}
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {tempPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`relative rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 overflow-hidden ${
              index === 0
                ? 'bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-orange-500/20 border-2 border-yellow-400 shadow-lg shadow-yellow-500/20'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-400 hover:border-blue-300 shadow-lg'
            }`}
          >
            {/* Decorative background pattern for non-host players */}
            {index !== 0 && (
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
                <div className="absolute top-2 right-2 w-20 h-20 bg-blue-500/10 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-16 h-16 bg-purple-500/10 rounded-full"></div>
              </div>
            )}

            {/* Host badge */}
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold shadow-lg">
                ⭐ HOST
              </div>
            )}

            {/* Player Header */}
            <div className="relative flex flex-col items-center gap-4 mb-6">
              <div className="relative flex-shrink-0">
                <div className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                  index === 0
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/50'
                    : 'border-blue-400 shadow-lg shadow-blue-400/30'
                }`}>
                  <Image
                    src={player.avatar}
                    alt={`${t('game.player')} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                {index === 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                    <FaCrown className="text-white text-sm" />
                  </div>
                )}
                {index !== 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 shadow-lg">
                    <FaUser className="text-white text-xs" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className={`font-bold text-lg ${
                  index === 0 ? 'text-yellow-300' : 'text-white'
                }`}>
                  {index === 0 ? t('game.hostPlayer') : `${t('game.player')} ${index + 1}`}
                </h3>
                {index === 0 && (
                  <p className="text-yellow-200 text-sm opacity-80">Tournament Leader</p>
                )}
              </div>
            </div>

            {/* Player Name Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                  placeholder={index === 0 ? 'Your name is already set' : t('game.enterNameForPlayer', { number: index + 1 })}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                    index === 0
                      ? 'bg-yellow-500/20 border-2 border-yellow-400 text-yellow-100 placeholder-yellow-200/70 cursor-not-allowed'
                      : 'bg-gray-700/50 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                  }`}
                  disabled={index === 0}
                />
                {index === 0 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar Selection - Only for non-host players */}
            {index !== 0 && (
              <div>
                <label className="block text-gray-300 text-sm mb-3 font-medium">
                  {t('game.chooseAvatar')}:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {defaultAvatars.slice(0, 3).map((avatar, avatarIndex) => (
                    <button
                      key={avatarIndex}
                      onClick={() => handleAvatarSelect(index, avatarIndex)}
                      className={`aspect-square rounded-xl overflow-hidden border-3 transition-all transform hover:scale-110 ${
                        player.avatar === avatar
                          ? 'border-blue-400 ring-4 ring-blue-400/50 shadow-lg shadow-blue-400/30 scale-105'
                          : 'border-gray-600 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <Image
                        src={avatar}
                        alt={`Avatar ${avatarIndex + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Player Status Indicator */}
      <div className="mt-6 mb-4">
        <div className="flex justify-center gap-2 flex-wrap">
          {tempPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                player.name.trim() !== ''
                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                  : 'bg-red-500/20 text-red-300 border border-red-500/50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                player.name.trim() !== '' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span>{index === 0 ? 'Host' : `P${index + 1}`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-4 text-center">
        <button
          onClick={onComplete}
          disabled={!allPlayersReady}
          className={`px-16 py-5 rounded-2xl text-xl font-bold transition-all transform shadow-2xl ${
            allPlayersReady
              ? 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white hover:scale-105 animate-pulse'
              : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border-2 border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            {allPlayersReady ? (
              <>
                <span>🚀</span>
                <span>{t('common.continue')}</span>
                <span>✨</span>
              </>
            ) : (
              <>
                <span>⏳</span>
                <span>Waiting for all players...</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

