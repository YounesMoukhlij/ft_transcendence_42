'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/contexts/LanguageContext';

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

  return (
    <div className="flex flex-col items-center justify-center h-full bg-transparent p-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">{t('game.player2Setup')}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-white">{t('game.name')}</label>
          <input
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('game.enterYourName')}
            maxLength={16}
          />
          <label className="text-white mt-2">{t('game.chooseAnAvatar')}</label>
          <div className="flex gap-4 mb-2">
            {predefinedAvatars.map(src => (
              <img
                key={src}
                src={src}
                alt="avatar"
                className={`w-16 h-16 items-center justify-center flex rounded-full border-2 cursor-pointer ${avatar === src ? 'border-blue-400' : 'border-gray-500'}`}
                onClick={() => handleAvatarSelect(src)}
              />
            ))}
            <label className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-700 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <span className="text-white text-xs">{t('game.upload')}</span>
            </label>
          </div>
          {avatar && (
            <div className="flex flex-col items-center">
              <span className="text-white text-xs mb-1">{t('game.preview')}:</span>
              <img src={avatar} alt="preview" className="w-16 h-16 rounded-full border-2 border-blue-400" />
            </div>
          )}
          <button
            type="submit"
            className="mt-4 bg-black hover:bg-white hover:text-black border-2 border-white text-white font-bold py-2 px-4 rounded"
            disabled={!name && !avatar}
          >
            {t('game.continue')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Player2Page() {
  return <Player2Setup />;
}
