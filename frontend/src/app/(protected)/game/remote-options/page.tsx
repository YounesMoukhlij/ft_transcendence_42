'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/LanguageContext';
import { FaSearch, FaUserFriends, FaArrowRight, FaRandom } from 'react-icons/fa';
import { IoGameControllerOutline } from 'react-icons/io5';

export default function RemoteOptionsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSearchRandom = () => {
    router.push('/game/customize');
  };

  const handleInviteFriend = () => {
    router.push('/game/invite-friend');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full p-4 md:p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
   
      <div className="relative w-full max-w-5xl z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20">
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-transparent">
            {t('game.chooseYourOpponent')}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {t('game.playRandomOrFriend')}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Search Random Opponent Card */}
          <button
            onClick={handleSearchRandom}
            className="group relative flex flex-col items-center justify-center p-8 md:p-10  rounded-3xl border-2 border-gray-700 hover:border-blue-400 transition-all duration-300 hover:scale-105  overflow-hidden"
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 transition-all duration-300"></div>

            {/* Animated Background Circles */}
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 w-32 h-32  rounded-full transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full transition-all duration-300"></div>
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                  <FaSearch className="w-12 h-12 md:w-14 md:h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {t('game.searchRandomOpponent')}
              </h2>
              <p className="text-gray-400 text-sm md:text-base text-center mb-6 max-w-xs">
            {t('game.matchWithRandom')}
                
              </p>

              {/* Action Indicator */}
              <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm md:text-base">{t('game.startMatching')}</span>
                <FaArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Invite Friend Card */}
          <button
            onClick={handleInviteFriend}
            className="group relative flex flex-col items-center justify-center p-8 md:p-10 rounded-3xl border-2 border-gray-700 hover:border-red-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 transition-all duration-300"></div>

            {/* Animated Background Circles */}
            <div className="absolute top-4 left-4 w-32 h-32 transition-all duration-300"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 transition-all duration-300"></div>
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg group-hover:shadow-red-500/50 transition-all duration-300">
                  <FaUserFriends className="w-12 h-12 md:w-14 md:h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors duration-300">
                {t('game.inviteFriend')}
              </h2>
              <p className="text-gray-400 text-sm md:text-base text-center mb-6 max-w-xs">
                {t('game.challengeFriends')}
              </p>

              {/* Action Indicator */}
              <div className="flex items-center gap-2 text-red-400/80 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm md:text-base">{t('game.selectFriend')}</span>
                <FaArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-8 md:mt-12 text-center">
          <button
            onClick={() => router.push('/game')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm md:text-base font-medium group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>{t('game.backToGameModes') || 'Back to Game Modes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
