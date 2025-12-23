'use client';

import React from 'react';
import { Player } from './GameContext';
import { FaUser, FaUpload, FaCrown } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';

interface LocalTournamentPlayerRegistrationProps {
  tempPlayers: Player[];
  defaultAvatars: string[];
  playerCount: number;
  updatePlayer: (index: number, field: keyof Player, value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function LocalTournamentPlayerRegistration({
  tempPlayers,
  defaultAvatars,
  playerCount,
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
            className="bg-gray-800 rounded-xl p-6 border-2 border-blue-400 hover:border-blue-300 transition-all transform hover:scale-105"
          >
            {/* Player Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <img
                  src={player.avatar}
                  alt={`${t('game.player')} ${index + 1}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
                />
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                    <FaCrown className="text-white text-xs" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  <span className="text-white font-semibold text-sm break-words">
                    {index === 0 ? t('game.hostPlayer') : `${t('game.player')} ${index + 1}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Player Name Input */}
            <div className="mb-4">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                placeholder={t('game.enterNameForPlayer', { number: index + 1 })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={index === 0}
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                {t('game.chooseAvatar')}:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {defaultAvatars.slice(0, 6).map((avatar, avatarIndex) => (
                  <button
                    key={avatarIndex}
                    onClick={() => handleAvatarSelect(index, avatarIndex)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      player.avatar === avatar
                        ? 'border-blue-500 ring-2 ring-blue-300 scale-110'
                        : 'border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${avatarIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onComplete}
          disabled={!allPlayersReady}
          className={`px-12 py-4 rounded-xl text-xl font-semibold transition-all transform ${
            allPlayersReady
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:scale-105'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('common.continue')}
        </button>
      </div>
    </div>
  );
}

