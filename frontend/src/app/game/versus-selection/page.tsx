'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../../../contexts/GameContext';
import Image from 'next/image';

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
        {/* Local Mode Card */}
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
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/1vs1.png"
                  alt="Local Game"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Local Game</h2>
              <p className="text-blue-100 mb-4">Play with a friend on the same device</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-white text-sm font-semibold">Controls:</p>
                <p className="text-blue-100 text-xs">Left: W/S | Right: ↑/↓</p>
              </div>
            </div>
          </div>
        </div>

        {/* Remote Mode Card */}
        <div className="flex-1 max-w-md">
          <div
            className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-purple-400 hover:border-purple-300"
            onClick={() => handleModeSelection('remote')}
            style={{
              boxShadow: `
                0 20px 40px rgba(147, 51, 234, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/globe.svg"
                  alt="Remote Game"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Online Game</h2>
              <p className="text-purple-100 mb-4">Play with friends over the internet</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-white text-sm font-semibold">Features:</p>
                <p className="text-purple-100 text-xs">Room codes • Matchmaking • Global leaderboards</p>
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
