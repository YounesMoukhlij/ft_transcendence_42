'use client';

import React from 'react';
import { FaTrophy, FaMedal, FaStar, FaRedo, FaHome } from 'react-icons/fa';

interface GameResultsModalProps {
  isOpen: boolean;
  winner: string;
  isWinner: boolean;
  finalScore: {
    left: number;
    right: number;
  };
  xpGained: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const GameResultsModal: React.FC<GameResultsModalProps> = ({
  isOpen,
  winner,
  isWinner,
  finalScore,
  xpGained,
  onPlayAgain,
  onGoHome
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center border border-gray-600 shadow-2xl">
        {/* Trophy/Medal Icon */}
        <div className="mb-6">
          {isWinner ? (
            <FaTrophy className="w-20 h-20 mx-auto text-yellow-400 animate-bounce" />
          ) : (
            <FaMedal className="w-20 h-20 mx-auto text-gray-400" />
          )}
        </div>

        {/* Game Result */}
        <div className="mb-6">
          <h2 className={`text-3xl font-bold mb-2 ${isWinner ? 'text-yellow-400' : 'text-red-400'}`}>
            {isWinner ? 'Victory' : 'Defeat'}
          </h2>
          <p className="text-gray-300 text-lg">
            {winner} wins!
          </p>

          {/* Final Score */}
          <div className="mt-4 bg-gray-700 rounded-lg p-4">
            <p className="text-white text-xl font-bold">
              Final Score: {finalScore.left} - {finalScore.right}
            </p>
          </div>
        </div>

        {/* XP Gained */}
        <div className="mb-8">
          <div className={`bg-gradient-to-r ${isWinner ? 'from-green-600 to-green-700' : 'from-blue-600 to-blue-700'} rounded-lg p-4`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaStar className="text-yellow-400" />
              <span className="text-white font-semibold">XP Gained</span>
              <FaStar className="text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              +{xpGained} XP
            </p>
            <p className="text-green-200 text-sm mt-1">
              {isWinner ? 'Well played! Victory bonus included.' : 'Good effort! Better luck next time.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <FaRedo className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            <FaHome className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultsModal;
