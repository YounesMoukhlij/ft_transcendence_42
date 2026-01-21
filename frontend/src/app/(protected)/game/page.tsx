'use client';
import { useEffect } from 'react';
import { Bot, Users, Trophy, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useTranslation } from '@/contexts/LanguageContext';

export default function GamePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setGameMode } = useGameContext();

  useEffect(() => {
    document.title = t('game.selectMode');
  }, [t]);

  // Kept structure but unused color properties will be ignored in the render for the monochrome look
  const gameModes = [
    {
      mode: "ai",
      title: 'game.ai',
      description: 'game.playXOGameLocally',
      icon: Bot,
    },
    {
      mode: "local",
      title: 'game.gameVsHuman',
      description: 'game.playAgainstComputer',
      icon: Users,
    },
    {
      mode: "tournament",
      title: 'game.localTournament',
      description: 'game.allPlayersSameDevice',
      icon: Trophy,
    },
    {
      mode: "remote",
      title: 'game.remoteGame',
      description: 'game.playWithFriendOnline',
      icon: Wifi,
    }
  ];

  const handleClick = (mode: string) => {
    if (mode === 'ai') {
      setGameMode(mode);
      router.push('/game/customize');
    } else if (mode === 'local') {
      setGameMode(mode);
      router.push('/game/player2');
    } else if (mode === 'tournament') {
      setGameMode(mode);
      router.push('/game/tournament');
    } else if (mode === 'remote') {
      setGameMode(mode);
      router.push('/game/remote-options');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-neutral-950 p-4 sm:p-6 lg:p-8  text-white">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 border border-neutral-800 rounded-full mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
            {t('game.selectMode')}
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            {t('game.ModeSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {gameModes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <div
                key={index}
                onClick={() => handleClick(mode.mode)}
                className="relative group cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-white rounded-xl p-6 sm:p-8 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-neutral-950 border border-neutral-800 rounded-full group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {t(mode.title)}
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mb-6">
                    {t(mode.description)}
                  </p>
                  
                  <button className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black text-sm font-bold rounded hover:bg-neutral-200 transition-colors">
                    {t('game.playNow')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors hover:cursor-pointer border raduis px-4 py-2 hover:bg-neutral-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('game.backToModes')}
          </button>
        </div>
      </div>
    </div>
  );
}