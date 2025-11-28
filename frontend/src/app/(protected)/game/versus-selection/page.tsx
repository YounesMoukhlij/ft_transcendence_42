'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import Image from 'next/image';
import { FaUserFriends, FaGlobe } from 'react-icons/fa';

export default function VersusSelectionPage() {
  const router = useRouter();
  const { setGameMode } = useGameContext();

  // Set page title
  useEffect(() => {
    document.title = '1 Versus 1 - Choose Game Type';
  }, []);

  const handleModeSelection = (mode: 'local' | 'remote') => {
    setGameMode(mode);
    if (mode === 'local') {
      router.push('/game/player2');
    } else if (mode === 'remote') {
      router.push('/game/customize-remote');
    } else {
      router.push('/game/customize');
    }
  };

  const handleBack = () => {
    router.push('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%] ">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">1 Versus 1</h1>
        <p className="text-gray-300 text-xl">Choose your game type</p>
      </div>

      <div className="flex gap-8 justify-center items-center w-[80%] max-w-4xl">
        <div className="flex-1 max-w-md">
          <div
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-blue-400 hover:border-blue-300"
            onClick={() => handleModeSelection('local')}
            style={{
              boxShadow: `
                0 20px 40px rgba(59, 130, 246, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
          >
            <div className="text-center flex flex-col items-center justify-center">

              <FaUserFriends className="w-16 h-16 mx-auto mb-4 text-blue-300 bg-white rounded-full p-3 border-2 border-blue-400" />
              <h2 className="text-2xl font-bold text-white mb-2">Local Game</h2>
              <p className="text-blue-100 mb-4">Play with a friend on the same device</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 w-[80%] h-15">
                <p className="text-black text-s font-semibold">Controls:</p>
                <p className="text-black text-xs">Left: W/S | Right: ↑/↓</p>
              </div>
            </div>
          </div>
        </div>

        {/* Remote Mode Card */}
        <div className="flex-1 max-w-md min-w-[320px] min-h-[370px] flex flex-col justify-center">
          <div
            className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-purple-400 hover:border-purple-300 h-full flex flex-col justify-center"
            onClick={() => handleModeSelection('remote')}
            style={{
              boxShadow: `
                0 20px 40px rgba(147, 51, 234, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
          >

            <div className="flex flex-col items-center justify-center h-full ">
              <FaGlobe className="w-16 h-16 mx-auto mb-4 text-purple-300 bg-white rounded-full p-3 border-2 border-purple-400" />
              <h2 className="text-2xl font-bold text-white mb-2">Online Game</h2>
              <p className="text-purple-100 mb-4">Play with friends over the internet</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 w-[80%] h-15 flex items-center justify-center">
                <p className="text-black text-m">Matchmaking • Global leaderboards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={handleBack}
          className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-semibold"
        >
          ← Back to Game Modes
        </button>
      </div>
    </div>
  );
}
