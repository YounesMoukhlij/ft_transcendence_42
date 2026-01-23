'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/contexts/LanguageContext';
import { FaUser, FaCheck, FaArrowRight, FaCrown } from 'react-icons/fa';
import { getProfileImageUrl } from '@/lib/utils';

const predefinedAvatars = [
  'https://static.vecteezy.com/system/resources/thumbnails/013/336/791/small/gamer-streamer-mascot-logo-illustration-free-vector.jpg',
  'https://t4.ftcdn.net/jpg/09/74/99/11/360_F_974991185_UffDpZ0MV6MvJ75h8yik3AMSlVDKrHBy.jpg',
  'https://img.freepik.com/photos-premium/logo-jeu_1117469-9898.jpg?semt=ais_hybrid&w=740&q=80',
  'https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70.jpg',
];

function Player2Setup() {
  const { t } = useTranslation();
  const { gameState, setPlayers } = useGameContext();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [upload, setUpload] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const player1 = {
        name: user.username || 'Player 1',
        avatar: user.profile_img || '',
        color: '#f87171',
        id: user.id_user?.toString() || undefined,
      };
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
  const isFormValid = name.trim().length > 0 && avatar.length > 0;

  return (
    <div className="flex items-center justify-center  w-full bg-black p-4 sm:p-6">
      <div className="w-full max-w-5xl">
        {/* Players Display - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Player 1 Card */}
          {player1 && (
            <div className="relative group">
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={getProfileImageUrl(player1.avatar)}
                      alt={player1.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full border-2 border-white/20 object-cover"
                      unoptimized
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-black flex items-center justify-center">
                      <FaCrown className="w-4 h-4 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full border border-white/20">
                        {t('game.hostPlayer')}
                      </span>
                    </div>
                    <p className="text-white text-2xl font-bold">{player1.name}</p>
                    <p className="text-white/50 text-sm mt-1">{t('game.readyToPlay')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Player 2 Preview Card */}
          <div className="relative group">
            <div className={`relative rounded-2xl p-6 border transition-all duration-300 ${
              isFormValid
                ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20'
                : 'bg-white/[0.02] backdrop-blur-sm border-white/5 border-dashed'
            }`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {avatar ? (
                    <Image
                      src={getProfileImageUrl(avatar)}
                      alt="Player 2"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full border-2 border-white/20 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center">
                      <FaUser className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full border border-white/20">
                      {t('game.player')} 2
                    </span>
                  </div>
                  <p className="text-white text-2xl font-bold">
                    {name || t('game.waiting')}
                  </p>
                  <p className={`text-sm mt-1 ${isFormValid ? 'text-white' : 'text-white/30'}`}>
                    {isFormValid ? t('game.readyToPlay') : t('game.setupRequired')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <div className="relative">
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            
            <div className="relative p-6 sm:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Input */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white font-bold text-base">
                    <span className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    {t('game.name')}
                  </label>
                  <div className="relative group">
                    <input
                      className="w-full px-5 py-4 bg-white/5 backdrop-blur-sm text-white text-lg rounded-xl border-2 border-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder-white/30"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t('game.enterYourName')}
                      maxLength={16}
                    />
                    {name.trim().length > 0 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <FaCheck className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/50 text-sm">
                      {name.length}/16 {t('game.characters')}
                    </p>
                    {name.trim().length > 0 && (
                      <p className="text-white text-sm font-medium flex items-center gap-1">
                        <FaCheck className="w-3 h-3" />
                        {t('game.nameSet')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-white font-bold text-base">
                    <span className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    {t('game.chooseAnAvatar')}
                  </label>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {predefinedAvatars.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => handleAvatarSelect(src)}
                        onMouseEnter={() => setIsHovering(index)}
                        onMouseLeave={() => setIsHovering(null)}
                        className={`relative aspect-square rounded-2xl border-2 transition-all duration-300 overflow-hidden transform ${
                          avatar === src
                            ? 'border-white scale-110 z-10'
                            : isHovering === index
                            ? 'border-white/40 scale-105'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <Image
                          src={getProfileImageUrl(src)}
                          alt={`Avatar ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          unoptimized
                        />
                        {avatar === src && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                              <FaCheck className="w-5 h-5 text-black" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {avatar && (
                    <p className="text-white text-sm font-medium flex items-center gap-2 mt-2">
                      <FaCheck className="w-4 h-4" />
                      {t("game.avatarSelected")}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full relative group flex items-center justify-center gap-3 px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden ${
                    isFormValid
                      ? 'bg-white text-black hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed border-2 border-white/10'
                  }`}
                >
                  <span className="relative">{t('game.continue')}</span>
                  {isFormValid && (
                    <FaArrowRight className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/game')}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all duration-200 text-sm font-medium group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span>{t('game.backToGameModes') || 'Back to Game Modes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Player2Page() {
  return <Player2Setup />;
}