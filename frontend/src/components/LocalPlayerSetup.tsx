'use client';

import React, { useState } from 'react';
import { useGameContext, Player } from '../contexts/GameContext';
import PlayerForm from './PlayerForm';
import GameCustomization from './GameCustomization';

const LocalPlayerSetup: React.FC = () => {
  const { setPlayers, setGameMode } = useGameContext();

  // Player 1 is the logged-in user (not configurable)
  const player1: Player = {
    name: 'You', // This would come from auth context in real app
    avatar: '/user.png',
    color: '#f87171',
  };

  const [player2, setPlayer2] = useState<Player>({
    name: '',
    avatar: '/profileface.png',
    color: '#60a5fa',
  });

  const [showCustomization, setShowCustomization] = useState(false);

  const isReady = player2.name.trim().length >= 2;

  const handleProceedToCustomization = () => {
    if (isReady) {
      setPlayers([player1, player2]);
      setGameMode('local');
      setShowCustomization(true);
    }
  };

  const handleBack = () => {
    setGameMode(null);
    // This would navigate back to game selection
  };

  const handleBackToPlayerSetup = () => {
    setShowCustomization(false);
  };

  if (showCustomization) {
    return <GameCustomization onBack={handleBackToPlayerSetup} />;
  }

  return (
    <div className='w-[100%] h-[100%] border-2 border-white'>
      <div className='text-white opacity-98 w-[100%] h-[100%] rounded-2xl p-6 flex flex-col relative border-2 border-white'
           style={{
             background: 'linear-gradient(145deg, #374151, #1f2937)',
             boxShadow: `
               inset 0 1px 0 rgba(255,255,255,0.1),
               inset 0 -1px 0 rgba(0,0,0,0.3),
               0 20px 40px rgba(0,0,0,0.4),
               0 0 0 1px rgba(255,255,255,0.05)
             `
           }}>

        <h1 className='text-2xl font-bold text-center mb-4'
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
          Local 1v1 Player Setup
        </h1>

        {/* Main Content Area - Scrollable if needed */}
        <div className="flex-1 overflow-y-auto">
          {/* Player Setup Section */}
          <div className="flex flex-col gap-3 mb-4">
            <h2 className="text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
              Players
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Player 1 (Logged-in user) - Not configurable */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-base font-semibold text-white mb-3">Player 1 (You)</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={player1.avatar}
                    alt={player1.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{player1.name}</p>
                    <p className="text-gray-300 text-xs">Logged-in user</p>
                  </div>
                </div>
              </div>

              {/* Player 2 - Configurable */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <PlayerForm
                  player={player2}
                  setPlayer={setPlayer2}
                  title="Player 2"
                  isRequired={true}
                />
              </div>
            </div>
          </div>

          {/* Game Preview
          {isReady && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
              <h3 className="text-base font-semibold text-white mb-3 text-center">Game Preview</h3>
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <img
                    src={player1.avatar}
                    alt={player1.name}
                    className="w-12 h-12 rounded-full mx-auto mb-1"
                  />
                  <p className="text-white font-semibold text-sm">{player1.name}</p>
                  <p className="text-gray-300 text-xs">W/S controls</p>
                </div>
                <div className="text-xl font-bold text-white">VS</div>
                <div className="text-center">
                  <img
                    src={player2.avatar}
                    alt={player2.name}
                    className="w-12 h-12 rounded-full mx-auto mb-1"
                  />
                  <p className="text-white font-semibold text-sm">{player2.name}</p>
                  <p className="text-gray-300 text-xs">↑/↓ controls</p>
                </div>
              </div>
            </div>
          )} */}

          {!isReady && (
            <div className="text-center mb-4">
              <p className="text-yellow-500 text-xs">
                Player 2 must have a name (at least 2 characters) to proceed
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-center space-x-4 pt-4 border-t border-gray-700">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
          >
            Back to Game Modes
          </button>
          <button
            onClick={handleProceedToCustomization}
            disabled={!isReady}
            className={`pb-2 cursor-pointer bg-black border-2 border-white hover:bg-white hover:text-black px-6 py-2 rounded-xl text-base font-bold transition-all duration-300
              ${isReady ? 'hover:scale-105' : 'cursor-not-allowed'}`}
            style={{
              boxShadow: isReady
                ? `
                  inset 0 1px 0 rgba(255,255,255,0.3),
                  inset 0 -1px 0 rgba(0,0,0,0.3),
                  0 4px 8px rgba(59,130,246,0.3),
                  0 0 0 1px rgba(59,130,246,0.2)
                `
                : `
                  inset 0 1px 0 rgba(255,255,255,0.1),
                  inset 0 -1px 0 rgba(0,0,0,0.3),
                  0 2px 4px rgba(0,0,0,0.2)
                `,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Customize Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalPlayerSetup;
