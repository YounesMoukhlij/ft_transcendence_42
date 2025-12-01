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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-5xl z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
            <IoGameControllerOutline className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {t('game.chooseYourOpponent')}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Play against a random opponent or challenge a friend to an epic match
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Search Random Opponent Card */}
          <button
            onClick={handleSearchRandom}
            className="group relative flex flex-col items-center justify-center p-8 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden"
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>

            {/* Animated Background Circles */}
            <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                  <FaSearch className="w-12 h-12 md:w-14 md:h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Random Indicator */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaRandom className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {t('game.searchRandomOpponent')}
              </h2>
              <p className="text-gray-400 text-sm md:text-base text-center mb-6 max-w-xs">
                Match with a random player online and start playing instantly
              </p>

              {/* Action Indicator */}
              <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm md:text-base">Start Matching</span>
                <FaArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Invite Friend Card */}
          <button
            onClick={handleInviteFriend}
            className="group relative flex flex-col items-center justify-center p-8 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300"></div>

            {/* Animated Background Circles */}
            <div className="absolute top-4 left-4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-300"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all duration-300"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all duration-300"></div>
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                  <FaUserFriends className="w-12 h-12 md:w-14 md:h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Friend Indicator */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUserFriends className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                {t('game.inviteFriend')}
              </h2>
              <p className="text-gray-400 text-sm md:text-base text-center mb-6 max-w-xs">
                Challenge your friends to a match and show them who's the best
              </p>

              {/* Action Indicator */}
              <div className="flex items-center gap-2 text-purple-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm md:text-base">Select Friend</span>
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
