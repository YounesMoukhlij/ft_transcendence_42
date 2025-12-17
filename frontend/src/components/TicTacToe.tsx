'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

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
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

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
      // Update scores
      if (result.winner === 'draw') {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else if (result.winner === 'X') {
        setScores(prev => ({ ...prev, X: prev.X + 1 }));
      } else {
        setScores(prev => ({ ...prev, O: prev.O + 1 }));
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

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = gameContainerRef.current;
    if (!container) return;

    try {
      if (
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } else {
        // Enter fullscreen
        if (container.requestFullscreen) {
          await container.requestFullscreen();
          container.focus();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
          container.focus();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
          container.focus();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
          container.focus();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement)
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcut for fullscreen (F key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        // Don't trigger if user is typing in an input
        if ((e.target as HTMLElement).tagName === 'INPUT') return;
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleFullscreen]);

  // Note: Auto-fullscreen removed because it requires user interaction
  // Fullscreen API requires a user gesture (click, keypress, etc.)
  // Users can toggle fullscreen manually using the F key or the button

  const getCellClass = (index: number) => {
    let baseClass = `${isFullscreen ? 'w-32 h-32 md:w-40 md:h-40 text-6xl md:text-7xl' : 'w-24 h-24 md:w-28 md:h-28 text-5xl md:text-6xl'} font-extrabold border-3 transition-all duration-300 flex items-center justify-center rounded-xl backdrop-blur-sm`;

    // Winning line cells
    if (winningLine.includes(index)) {
      baseClass += ' bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300 shadow-2xl shadow-emerald-500/50 scale-105 animate-pulse';
    }
    // Filled cells
    else if (board[index]) {
      baseClass += ' bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 shadow-lg';
    }
    // Empty cells
    else {
      baseClass += ' bg-white/80 border-slate-300 cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-400 hover:shadow-lg hover:scale-105 active:scale-95';
    }

    // Dim non-winning cells when game is over
    if (winner && !winningLine.includes(index)) {
      baseClass += ' opacity-40';
    }

    return baseClass;
  };

  return (
    <div
      ref={gameContainerRef}
      tabIndex={-1}
      className="flex flex-col items-center justify-center min-h-full  p-4 relative overflow-hidden focus:outline-none"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>



      {/* Main Game Container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header with Scores */}
        <div className={`mb-8 ${isFullscreen ? 'mb-4' : ''}`}>
          <h1 className={`${isFullscreen ? 'text-4xl mb-4' : 'text-5xl md:text-6xl mb-8'} font-extrabold text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl`}>
            Tic Tac Toe
          </h1>

          {/* Score Cards */}
          <div className={`grid grid-cols-3 gap-4 ${isFullscreen ? 'mb-4' : 'mb-6'}`}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className={`${isFullscreen ? 'text-xl' : 'text-2xl'} font-bold text-cyan-400 mb-1`}>X</div>
                <div className={`${isFullscreen ? 'text-2xl' : 'text-3xl'} font-extrabold text-white`}>{scores.X}</div>
                <div className="text-xs text-gray-300 mt-1">Wins</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className={`${isFullscreen ? 'text-xl' : 'text-2xl'} font-bold text-gray-400 mb-1`}>Draws</div>
                <div className={`${isFullscreen ? 'text-2xl' : 'text-3xl'} font-extrabold text-white`}>{scores.draws}</div>
                <div className="text-xs text-gray-300 mt-1">Ties</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className={`${isFullscreen ? 'text-xl' : 'text-2xl'} font-bold text-pink-400 mb-1`}>O</div>
                <div className={`${isFullscreen ? 'text-2xl' : 'text-3xl'} font-extrabold text-white`}>{scores.O}</div>
                <div className="text-xs text-gray-300 mt-1">Wins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
          {/* Current Player Indicator */}
          <div className="text-center mb-6">
            {winner ? (
              <div className="space-y-3">
                {winner === 'draw' ? (
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg">
                    <p className="text-2xl md:text-3xl font-bold text-white">It's a Draw! 🤝</p>
                  </div>
                ) : (
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg animate-pulse">
                    <p className="text-2xl md:text-3xl font-bold text-white">
                      Player {winner} Wins! 🎉
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg">
                <span className="text-lg text-white/80">Current Player:</span>
                <span className={`text-3xl md:text-4xl font-extrabold ${currentPlayer === 'X' ? 'text-cyan-300' : 'text-pink-300'} drop-shadow-lg`}>
                  {currentPlayer}
                </span>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 md:p-5 rounded-2xl shadow-inner">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                disabled={!!cell || !!winner}
                className={getCellClass(index)}
              >
                {cell && (
                  <span
                    className={`${cell === 'X'
                      ? 'text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 drop-shadow-lg'
                      : 'text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-rose-600 drop-shadow-lg'
                    }`}
                    style={{
                      animation: 'scale-in 0.3s ease-out'
                    }}
                  >
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform"
            >
              🔄 New Game
            </button>
            {onBack && !isFullscreen && (
              <button
                onClick={onBack}
                className="px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl font-bold text-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform"
              >
                ← Back to Games
              </button>
            )}
            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform"
                title="Exit fullscreen (or press F)"
              >
                ✕ Exit Fullscreen
              </button>
            )}


          </div>

          {/* Instructions */}
          {!isFullscreen && (
            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm md:text-base">
                Player <span className="font-bold text-cyan-400">X</span> goes first. Click on a cell to make your move!
              </p>
              <p className="text-white/70 text-sm md:text-base">
                Press on <span className="font-bold text-yellow-400">F</span> to exit fullscreen.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TicTacToe;
