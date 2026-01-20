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

  const gameModes = [
    {
      mode: "ai",
      title: 'game.ai',
      description: 'game.playXOGameLocally',
      icon: Bot,
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-600",
      iconBg: "bg-blue-500"
    },
    {
      mode: "local",
      title: 'game.gameVsHuman',
      description: 'game.playAgainstComputer',
      icon: Users,
      gradientFrom: "from-purple-500",
      gradientTo: "to-pink-600",
      iconBg: "bg-purple-500"
    },
    {
      mode: "tournament",
      title: 'game.localTournament',
      description: 'game.allPlayersSameDevice',
      icon: Trophy,
      gradientFrom: "from-amber-500",
      gradientTo: "to-orange-600",
      iconBg: "bg-amber-500"
    },
    {
      mode: "remote",
      title: 'game.remoteGame',
      description: 'game.playWithFriendOnline',
      icon: Wifi,
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-600",
      iconBg: "bg-green-500"
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
    <div className="flex flex-col justify-center items-center w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8 h-full">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
            {t('game.selectMode')}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
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
                className="relative group cursor-pointer bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex justify-center mb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo} rounded-full shadow-lg`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {t(mode.title)}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mb-4">
                    {t(mode.description)}
                  </p>
                  
                  <button className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${mode.gradientFrom} ${mode.gradientTo} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}>
                    {t('game.playNow')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradientFrom} ${mode.gradientTo} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
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