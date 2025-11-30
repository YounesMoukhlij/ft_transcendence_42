'use client';

import React, { useState, useCallback } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface TicTacToeProps {
  onBack?: () => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onBack }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  const calculateWinner = useCallback((squares: Board): { winner: Player | 'draw'; line?: number[] } | null => {
    const lines = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal top-left to bottom-right
      [2, 4, 6], // Diagonal top-right to bottom-left
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a] as Player, line };
      }
    }

    // Check for draw
    if (squares.every(square => square !== null)) {
      return { winner: 'draw' };
    }

    return null;
  }, []);

  const handleClick = useCallback((index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      if (result.line) {
        setWinningLine(result.line);
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, winner, calculateWinner]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
  }, []);

  const getCellClass = (index: number) => {
    let baseClass = 'w-24 h-24 text-4xl font-bold border-2 border-gray-400 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center';

    if (winningLine.includes(index)) {
      baseClass += ' bg-green-300 animate-pulse';
    } else if (board[index]) {
      baseClass += ' bg-gray-100';
    } else {
      baseClass += ' bg-white cursor-pointer hover:bg-gray-50';
    }

    if (winner && !winningLine.includes(index)) {
      baseClass += ' opacity-50';
    }

    return baseClass;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Tic Tac Toe</h1>

        {/* Game Status */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="text-2xl font-bold">
              {winner === 'draw' ? (
                <p className="text-yellow-600">It's a Draw!</p>
              ) : (
                <p className="text-green-600">Player {winner} Wins! 🎉</p>
              )}
            </div>
          ) : (
            <p className="text-xl text-gray-700">
              Current Player: <span className="font-bold text-2xl">{currentPlayer}</span>
            </p>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-800 p-2 rounded-lg">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner}
              className={getCellClass(index)}
            >
              {cell && (
                <span className={cell === 'X' ? 'text-blue-600' : 'text-red-600'}>
                  {cell}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            New Game
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Games
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Player X goes first. Click on a cell to make your move!</p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;

