'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';
import { IoExpand, IoContract } from 'react-icons/io5';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { getBackendURL } from '@/lib/utils';

const defaultProfileImg = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/HeathJoker.png/250px-HeathJoker.png';

// Helper function to resolve profile image URL
const getProfileImageUrl = (profileImg: string | null | undefined): string => {
  if (!profileImg) return defaultProfileImg;

  const API_URL = getBackendURL();

  // If the path is from our DB (e.g., /uploads/...), prefix with API_URL
  if (profileImg.startsWith('/uploads/')) {
    return `${API_URL}${profileImg}`;
  }

  // Otherwise, it's a full URL (default or from OAuth), use it directly
  return profileImg;
};

export default function AIGamePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { gameState, setGameMode } = useGameContext();
  const { user } = useUserStore();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Player profile images state
  const [player1ProfileImg, setPlayer1ProfileImg] = useState<string>(defaultProfileImg);
  const [player2ProfileImg, setPlayer2ProfileImg] = useState<string>(defaultProfileImg);
  const profileImagesFetched = useRef<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false); // Track if game is over

  // Set page title and ensure game mode is set to AI
  useEffect(() => {
    document.title = t('game.aiPingPongGame');
    setGameMode('ai');
  }, [t, setGameMode]);

  // Fetch player 1 (user) profile image
  useEffect(() => {
    if (user?.profile_img && !profileImagesFetched.current) {
      setPlayer1ProfileImg(getProfileImageUrl(user.profile_img));
      profileImagesFetched.current = true;
    } else if (user?.id_user && user?.access_token && !profileImagesFetched.current) {
      // Try to fetch updated profile image
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(
            `${getBackendURL()}/getUserStats`,
            {
              headers: { Authorization: `Bearer ${user.access_token}` }
            }
          );

          if (response.data?.profile_img || response.data?.avatar) {
            const profileImg = response.data.profile_img || response.data.avatar;
            setPlayer1ProfileImg(getProfileImageUrl(profileImg));
            profileImagesFetched.current = true;
          }
        } catch (error) {
          // Silently fail - use default image
          console.debug('[AIGame] Could not fetch user profile, using default');
        }
      };

      fetchUserProfile();
    }

    // Set AI profile image (default or can be customized)
    setPlayer2ProfileImg(defaultProfileImg);
  }, [user]);

  // Reset gameOver state when game mode changes
  useEffect(() => {
    setGameOver(false);
  }, [gameState.mode]);

  // Automatically enter fullscreen when game starts
  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) return;

    // Check if already in fullscreen
    if (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    ) {
      return; // Already in fullscreen
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(async () => {
      try {
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
      } catch (error) {
        // User may have denied fullscreen or browser doesn't support it
        console.log('Auto-fullscreen not available:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Run once on mount

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
  const player1Name = user?.username || 'Player 1';
  const player2Name = `AI (${difficultyText})`;

  return (
    <div
      ref={gameContainerRef}
      tabIndex={-1}
      className={`flex m-1 flex-col items-center justify-center w-full  transition-all duration-300 focus:outline-none ${
        isFullscreen
          ? 'h-screen bg-black p-4'
          : 'min-h-full p-2'
      }`}
    >
      <div className={`w-full flex flex-col items-center ${isFullscreen ? 'h-full justify-center' : 'max-w-4xl'}`}>
        {/* Player Profile Images - Shown at top of game table (hidden when game is over) */}
        {!gameOver && !isFullscreen && (
          <div className="w-full max-w-4xl mb-4 px-4">
            <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
              {/* Player 1 (User) */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <img
                    src={player1ProfileImg}
                    alt={player1Name}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-400 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultProfileImg;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                    {player1Name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">Left Paddle</p>
                </div>
              </div>

              {/* VS Separator */}
              <div className="mx-4 sm:mx-6 flex-shrink-0">
                <span className="text-yellow-400 font-bold text-lg sm:text-xl md:text-2xl">VS</span>
              </div>

              {/* Player 2 (AI) */}
              <div className="flex items-center gap-3 flex-1 flex-row-reverse text-right">
                <div className="relative">
                  <img
                    src={player2ProfileImg}
                    alt={player2Name}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-red-400 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultProfileImg;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                    {player2Name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">Right Paddle</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player Profile Images in Fullscreen - Minimal (hidden when game is over) */}
        {!gameOver && isFullscreen && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={player1ProfileImg}
                  alt={player1Name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultProfileImg;
                  }}
                />
                <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                  {player1Name}
                </span>
              </div>
              <span className="text-yellow-400 font-bold">VS</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                  {player2Name}
                </span>
                <img
                  src={player2ProfileImg}
                  alt={player2Name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-red-400"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultProfileImg;
                  }}
                />
              </div>
            </div>
          </div>
        )}

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
            <PingPongGame
              onGameOver={(winner) => {
                // Set gameOver state based on whether there's a winner
                setGameOver(winner !== null);
              }}
            />
          </div>
        </div>

        {/* Controls and Info - Hidden in fullscreen and when game is over */}
        {!isFullscreen && !gameOver && (
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
                First to 10 points wins!
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

        {/* Minimal UI in Fullscreen - Fixed Bottom (hidden when game is over) */}
        {isFullscreen && !gameOver && (
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
              <button
                onClick={toggleFullscreen}
                className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm font-medium flex items-center gap-2"
                aria-label="Exit Fullscreen"
              >
                <IoContract className="w-4 h-4" />
                Exit Fullscreen
              </button>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="opacity-70 text-xs">
                Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">F</kbd> for fullscreen
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
