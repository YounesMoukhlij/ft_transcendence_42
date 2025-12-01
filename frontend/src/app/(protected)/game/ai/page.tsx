'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';
import { IoExpand, IoContract } from 'react-icons/io5';

export default function AIGamePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { gameState, setGameMode } = useGameContext();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = t('game.aiPingPongGame');
  }, [t]);

  // Ensure we're in AI mode (only set once on mount)
  useEffect(() => {
    if (gameState.mode !== 'ai') {
      setGameMode('ai');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Toggle fullscreen - defined first so it can be used in other hooks
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
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
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
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // F key or F11 for fullscreen toggle
      if (e.key === 'f' || e.key === 'F' || e.key === 'F11') {
        // Prevent default F11 behavior if it's F11
        if (e.key === 'F11') {
          e.preventDefault();
        }
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [toggleFullscreen]);

  // Get difficulty for display
  const difficulty = gameState.customisation?.aiDifficulty || 'medium';
  const difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div
      ref={gameContainerRef}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${
        isFullscreen
          ? 'h-screen bg-black p-4'
          : 'min-h-screen p-4'
      }`}
    >
      <div className={`w-full flex flex-col items-center ${isFullscreen ? 'h-full justify-center' : 'max-w-4xl'}`}>
        {/* Game Container */}
        <div className={`w-full flex justify-center ${isFullscreen ? 'flex-1 items-center' : 'mb-4'}`}>
          <div
            className={isFullscreen ? 'w-full h-full flex items-center justify-center' : 'w-full'}
            style={isFullscreen ? {
              aspectRatio: '4/3',
              maxWidth: '95vw',
              maxHeight: '95vh',
              width: 'auto',
              height: 'auto'
            } : {}}
          >
            <PingPongGame />
          </div>
        </div>

        {/* Controls and Info - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="w-full max-w-2xl mt-4 text-center space-y-4">
            {/* Difficulty Display */}
            <div className="text-white text-lg">
              <span className="opacity-70">Difficulty: </span>
              <span className="font-semibold text-xl">{difficultyText}</span>
            </div>

            {/* Controls Instructions */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-white text-sm md:text-base mb-2">
                <span className="font-semibold">Controls:</span> Use <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">W</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">S</kbd> keys to move your paddle
              </p>
              <p className="text-gray-400 text-xs md:text-sm mb-2">
                First to 15 points wins!
              </p>
              <p className="text-gray-500 text-xs">
                Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">F</kbd> for fullscreen mode
              </p>
            </div>

            {/* Bottom Button Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <>
                    <IoContract className="w-5 h-5" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <IoExpand className="w-5 h-5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                onClick={() => router.push('/game')}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t('game.backToGameModes')}
              </button>
            </div>
          </div>
        )}

        {/* Minimal UI in Fullscreen - Fixed Bottom */}
        {isFullscreen && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-4 text-white text-sm flex-wrap justify-center">
              <div>
                <span className="opacity-70">Difficulty: </span>
                <span className="font-semibold">{difficultyText}</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div>
                <span className="opacity-70">Controls: </span>
                <span className="font-semibold">W / S</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="opacity-70 text-xs">
                Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">F</kbd> to exit fullscreen
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <button
                onClick={() => router.push('/game')}
                className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm font-medium"
              >
                Exit Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
