'use client';

import React, { useState, useEffect } from 'react';
import { Player } from './GameContext';
import {FaCrown, FaPlus, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslation } from '@/contexts/LanguageContext';
import { useUserStore } from '@/store/userStore';
import { getProfileImageUrl } from '@/lib/utils';

interface LocalTournamentPlayerRegistrationProps {
  tempPlayers: Player[];
  defaultAvatars: string[];
  tournamentId: number | null;
  updatePlayer: (index: number, field: keyof Player, value: string) => void;
  updatePlayerObject?: (index: number, playerData: Partial<Player>) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function LocalTournamentPlayerRegistration({
  tempPlayers,
  defaultAvatars,
  tournamentId,
  updatePlayer,
  updatePlayerObject,
  onComplete,
  onBack,
}: LocalTournamentPlayerRegistrationProps) {
  const { t } = useTranslation();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newPlayerUsername, setNewPlayerUsername] = useState('');
  const [newPlayerPassword, setNewPlayerPassword] = useState('');
  const [updateCounter, setUpdateCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const user = useUserStore((state) => state.user);

  // Debug: log when tempPlayers changes
  useEffect(() => {
    console.log('LocalTournamentPlayerRegistration: tempPlayers updated:', tempPlayers.map(p => ({ name: p.name, id: p.id })));
  }, [tempPlayers]);



  const handleAddPlayer = async () => {
    if (newPlayerUsername.trim() && newPlayerPassword.trim()) {
      setIsLoading(true);
      setErrorMessage('');

      // Check for duplicate usernames in existing players
      const trimmedUsername = newPlayerUsername.trim();

      const isDuplicate = tempPlayers.some(player =>
        (player.username && player.username.trim() === trimmedUsername) ||
        (player.name && player.name.trim() === trimmedUsername)
      );

      if (isDuplicate) {
        setErrorMessage(t('game.alreadyInGame'));
        setIsLoading(false);
        return;
      }

      try {
        // Call the API to authenticate and get real user data
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/api/registerInTournament`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.access_token}`
          },
          body: JSON.stringify({
            username: newPlayerUsername.trim(),
            password: newPlayerPassword,
            tournamentId: tournamentId
          }),
        });
        const data = await response.json();
        if (data.success && data.user) {
          // Check again for duplicates using the API response data (more reliable)
          const isDuplicateAfterApi = tempPlayers.some(player =>
            (player.id_user && player.id_user === data.user.id) ||
            (player.username && player.username.trim() === data.user.username.trim()) ||
            (player.name && player.name.trim() === data.user.username.trim())
          );

          if (isDuplicateAfterApi) {
            setErrorMessage(t('game.alreadyInGame'));
            setIsLoading(false);
            return;
          }

          // Find the next available player slot
          const nextIndex = tempPlayers.findIndex(player => player.name.trim() === '');

          if (nextIndex !== -1) {
            // Update with real user data from API
            if (updatePlayerObject) {
              updatePlayerObject(nextIndex, {
                name: data.user.username,
                avatar: data.user.profile || defaultAvatars[(nextIndex - 1) % defaultAvatars.length],
                id_user: data.user.id,
                username: data.user.username
              });
            } else {
              // Fallback to individual updates if updatePlayerObject is not available
              updatePlayer(nextIndex, 'name', data.user.username);
              updatePlayer(nextIndex, 'avatar', data.user.profile || defaultAvatars[(nextIndex - 1) % defaultAvatars.length]);
              updatePlayer(nextIndex, 'id_user', data.user.id);
              updatePlayer(nextIndex, 'username', data.user.username);
            }

            // Clear the form and close modal
            setNewPlayerUsername('');
            setNewPlayerPassword('');
            setShowAddUserModal(false);
            setUpdateCounter(prev => prev + 1); // Force re-render
          }
        } else {
          setErrorMessage(data.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Error registering tournament user:', error);
        setErrorMessage(
          error.message ||
          'Failed to authenticate user'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };


  const allPlayersReady = tempPlayers.every(player => player.name.trim() !== '');

  return (
    <div key={`registration-${updateCounter}`} className="w-full max-w-6xl mx-auto h-full   rounded-3xl shadow-2xl  p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white bg-clip-text ">
          {t('game.registerPlayers')}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddUserModal(true)}
            disabled={tempPlayers.filter(player => player.name.trim() !== '').length >= 4}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition-all flex items-center gap-2 ${
              tempPlayers.length >= 4
                ? 'bg-gray-900 cursor-not-allowed text-gray-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg'
            }`}
          >
            <FaPlus className="text-sm" />
            {t('game.addUser')}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
          >
            {t('common.back')}
          </button>
        </div>
      </div>

      {/* Players List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">{t('game.registeredPlayers')} ({tempPlayers.filter(p => p.name.trim() !== '').length}/4)</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2" key={`players-${updateCounter}`}>
          {tempPlayers.map((player, index) => (
            <div
              key={`${player.id}-${player.name}-${index}`}
              className={`relative rounded-xl p-4 transition-all duration-300 ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400'
                  : player.name.trim() !== ''
                  ? 'bg-[#1a1f2e]/30 border-2 border-green-400'
                  : 'bg-[#1a1f2e]/30 border-2 border-gray-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                    index === 0 ? 'border-yellow-400' : 'border-blue-400'
                  }`}>
                    <Image
                      src={getProfileImageUrl(player.avatar)}
                      alt={`${t('game.player')} ${index + 1}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  {index === 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                      <FaCrown className="text-white text-xs" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${
                      index === 0 ? 'text-yellow-300' : 'text-white'
                    }`}>
                      {index === 0 ? t('game.host') : `${t('game.player')} ${index + 1}`}
                    </h4>
                    {index === 0 && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full">
                        {t('game.tournamentLeader')}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    index === 0 ? 'text-yellow-200' : player.name.trim() !== '' ? 'text-green-300' : 'text-gray-400'
                  }`}>
                    {player.name || t('game.notRegistered')}
                  </p>
                </div>
                {player.name.trim() !== '' && (
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f2e]/40 rounded-3xl p-6 border-2 border-gray-800 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">{t('game.addUser')}</h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setErrorMessage('');
                  setIsLoading(false);
                }}
                disabled={isLoading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  {t('settings.username')}
                </label>
                <input
                  type="text"
                  value={newPlayerUsername}
                  onChange={(e) => {
                    setNewPlayerUsername(e.target.value);
                    setErrorMessage(''); // Clear error when user types
                  }}
                  placeholder={t('game.enterUsername')}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-[#1a1f2e]/60 border-2 border-gray-600 text-white rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  {t('game.password')}
                </label>
                <input
                  type="password"
                  value={newPlayerPassword}
                  onChange={(e) => {
                    setNewPlayerPassword(e.target.value);
                    setErrorMessage(''); // Clear error when user types
                  }}
                  placeholder={t('game.enterPassword')}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-[#1a1f2e]/60 border-2 border-gray-600 text-white rounded-xl focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                />
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (!isLoading) {
                    setShowAddUserModal(false);
                    setErrorMessage('');
                  }
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all disabled:opacity-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleAddPlayer}
                disabled={!newPlayerUsername.trim() || !newPlayerPassword.trim() || isLoading}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  newPlayerUsername.trim() && newPlayerPassword.trim() && !isLoading
                    ? 'bg-blue-500/60 cursor-pointer  hover:scale-102 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {('g')}
                  </>
                ) : (
                  t('game.addPlayer')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onComplete}
          disabled={!allPlayersReady}
          className={`px-16 py-5 rounded-2xl text-xl font-bold transition-all transform shadow-2xl border border-gray-800 ${
            allPlayersReady
              ? 'bg-blue-500/60 cursor-pointer hover:scale-105 '
              : 'cursor-not-allowed border-2 '
          }`}
        >
          <div className="flex items-center gap-3">
            {allPlayersReady ? (
              <>
                <span>{t('common.continue')}</span>
              </>
            ) : (
              <>
                <span> {t('game.need')} {4 - tempPlayers.filter(p => p.name.trim() !== '').length} {t('game.morePlayers')} </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

