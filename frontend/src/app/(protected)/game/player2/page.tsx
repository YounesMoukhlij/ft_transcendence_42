'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/contexts/LanguageContext';
import { FaUser, FaUpload, FaCheck, FaArrowRight } from 'react-icons/fa';

const predefinedAvatars = [
  '/profileface.png',
  '/robot.png',
  '/user.png',
];

function Player2Setup() {
  const { t } = useTranslation();
  const { gameState, setPlayers } = useGameContext();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [upload, setUpload] = useState<File | null>(null);

  // Initialize Player 1 with logged-in user's data when component mounts
  useEffect(() => {
    if (user) {
      // Always ensure Player 1 is set with the logged-in user's data
      const player1 = {
        name: user.username || 'Player 1',
        avatar: user.profile_img || '',
        color: '#f87171',
        id: user.id_user?.toString() || undefined,
      };

      // Only update if Player 1 doesn't exist or doesn't match the logged-in user
      if (!gameState.players || !gameState.players[0] || gameState.players[0].id !== player1.id) {
        setPlayers([player1]);
      }
    }
  }, [user, gameState.players, setPlayers]);

  const handleAvatarSelect = (src: string) => {
    setAvatar(src);
    setUpload(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
        setUpload(e.target.files![0]);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure Player 1 has the logged-in user's data
    const player1 = gameState.players[0] || {
      name: user?.username || 'Player 1',
      avatar: user?.profile_img || '',
      color: '#f87171',
      id: user?.id_user?.toString() || undefined,
    };
    setPlayers([
      player1,
      { name: name || 'Player 2', avatar: avatar || '', color: '#60a5fa' },
    ]);
    router.push('/game/customize');
  };

  const player1 = gameState.players?.[0];
  const isFormValid = name.trim().length > 0 || avatar.length > 0;

  return (
    <div className="flex flex-col items-center m-3 justify-center h-full w-full p-1 md:p-6">
      <div className="w-full max-w-2xl">
        {/* Player 1 Display Card */}
        {player1 && (
          <div className="mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={player1.avatar || '/profileface.png'}
                  alt={player1.name}
                  className="w-16 h-16 rounded-full border-4 border-blue-400 shadow-lg object-cover"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <FaCheck className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium">{t('game.hostPlayer')}</p>
                <p className="text-white text-xl font-bold">{player1.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Player 2 Setup Card */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
                <FaUser className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t('game.player2Setup')}
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Configure Player 2 for local multiplayer
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name Input Section */}
              <div className="space-y-2">
                <label className="block text-white font-semibold text-sm md:text-base mb-2">
                  {t('game.name')}
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3.5 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-all duration-300 placeholder-gray-500 text-base"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t('game.enterYourName')}
                    maxLength={16}
                  />
                  {name.trim().length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FaCheck className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-xs">
                  {name.length}/16 characters
                </p>
              </div>

              {/* Avatar Selection Section */}
              <div className="space-y-3">
                <label className="block text-white font-semibold text-sm md:text-base mb-2">
                  {t('game.chooseAnAvatar')}
                </label>

                {/* Avatar Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {predefinedAvatars.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => handleAvatarSelect(src)}
                      className={`relative group aspect-square rounded-2xl border-4 transition-all duration-300 overflow-hidden ${
                        avatar === src
                          ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/50'
                          : 'border-gray-700 hover:border-gray-600 hover:scale-105'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {avatar === src && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <FaCheck className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}

                  {/* Upload Button */}
                  <label className="relative group aspect-square rounded-2xl border-4 border-dashed border-gray-700 hover:border-blue-500 bg-gray-800/50 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUpload}
                    />
                    <FaUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-400 mb-2 transition-colors duration-300" />
                    <span className="text-gray-400 group-hover:text-blue-400 text-xs font-medium transition-colors duration-300 text-center px-2">
                      {t('game.upload')}
                    </span>
                    {upload && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {/* Avatar Preview */}
                {avatar && (
                  <div className="flex flex-col items-center gap-2 pt-4 border-t border-gray-700/50">
                    <span className="text-gray-400 text-sm font-medium">{t('game.preview')}</span>
                    <div className="relative">
                      <img
                        src={avatar}
                        alt="Preview"
                        className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg">
                        <FaCheck className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`mt-6 relative group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  isFormValid
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transform hover:scale-105 active:scale-95'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>{t('game.continue')}</span>
                {isFormValid && (
                  <FaArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                )}
                {isFormValid && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/game')}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-2 justify-center group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>{t('game.backToGameModes') || t('common.back') || 'Back to Game Modes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Player2Page() {
  return <Player2Setup />;
}
