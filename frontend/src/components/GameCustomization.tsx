'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from './GameContext';
import { useUserStore } from '../store/userStore';
import axios from 'axios';
import { getBackendURL } from '../lib/utils';
import { useTranslation } from '../contexts/LanguageContext';

const tableBackgrounds = [
  { name: 'Classic Green', value: '#15803d', type: 'color' },
  { name: 'Blue Gradient', value: 'linear-gradient(135deg, #3b82f6, #1e3a8a)', type: 'gradient' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #ec4899, #f59e0b, #ea580c)', type: 'gradient' },
  { name: 'Dark Blue', value: '#1e40af', type: 'color' }
];

const ballColors = [
  '#ffffff', // white
  '#f87171', // red
  '#60a5fa', // blue
  '#fbbf24', // yellow
  '#34d399', // green
  '#a78bfa', // purple
];

const paddleColors = [
  '#f87171', // red
  '#60a5fa', // blue
  '#fbbf24', // yellow
  '#34d399', // green
  '#a78bfa', // purple
  '#f3f4f6', // gray
];

interface GameCustomizationProps {
  onBack: () => void;
  onStartGame: (customization: { tableBg: string; ballColor: string; paddleColor: string; aiDifficulty?: 'easy' | 'medium' | 'hard' | null; winningScore?: 5 | 10 | null; }) => void;
  isSocketConnected?: boolean;
}

const GameCustomization: React.FC<GameCustomizationProps> = ({ onBack, onStartGame, isSocketConnected }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { gameState, setCustomisation } = useGameContext();
  const { user, clearUser } = useUserStore();

  // Debug: Log socket connection status
  useEffect(() => {
    if (gameState.mode === 'remote') {
      console.log('GameCustomization - Socket connection status:', isSocketConnected);
    }
  }, [isSocketConnected, gameState.mode]);

  // Get token from user object (access_token) or fallback to localStorage
  const getToken = () => {
    if (user?.access_token) return user.access_token;
    if (user?.token) return user.token; // Fallback for compatibility

    // Try to get from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed?.state?.user?.access_token || parsed?.state?.user?.token || null;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return null;
  };

  const token = getToken();

  // Helper function to get random defaults - generates all at once
  const getRandomDefaults = useMemo(() => {
    const randomTableBg = tableBackgrounds[Math.floor(Math.random() * tableBackgrounds.length)].value;
    const randomBallColor = ballColors[Math.floor(Math.random() * ballColors.length)];
    const randomPaddleColor = paddleColors[Math.floor(Math.random() * paddleColors.length)];
    const randomAiDifficulty = (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)];
    const randomWinningScore = Math.random() > 0.5 ? 5 : 10; // Randomly choose 5 or 10 points

    return {
      tableBg: randomTableBg,
      ballColor: randomBallColor,
      paddleColor: randomPaddleColor,
      aiDifficulty: randomAiDifficulty,
      winningScore: randomWinningScore
    };
  }, []); // Only generate once on mount

  // Initialize with random defaults (only once on mount)
  const [tableBg, setTableBg] = useState<string>(getRandomDefaults.tableBg);
  const [ballColor, setBallColor] = useState<string>(getRandomDefaults.ballColor);
  const [paddleColor, setPaddleColor] = useState<string>(getRandomDefaults.paddleColor);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>(getRandomDefaults.aiDifficulty);
  const [winningScore, setWinningScore] = useState<5 | 10>(getRandomDefaults.winningScore);

  // Create axios instance with token, but only if token exists
  const axiosInstance = useMemo(() => {
    const baseURL = getBackendURL();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return axios.create({
      baseURL,
      headers,
    });
  }, [token]);

  useEffect(() => {
    const fetchCustomization = async () => {
      // Don't fetch if no token - customization is optional, use random defaults
      if (!token) {
        console.warn('No token available, using random defaults');
        // Initialize game context with random defaults
        setCustomisation({
          tableBg: getRandomDefaults.tableBg,
          ballColor: getRandomDefaults.ballColor,
          paddleColor: getRandomDefaults.paddleColor,
          aiDifficulty: gameState.mode === 'ai' ? getRandomDefaults.aiDifficulty : null,
          winningScore: getRandomDefaults.winningScore
        });
        return;
      }

      try {
        const response = await axiosInstance.get('/getGameCustomization');
        if (response.data && response.data.tableBg && response.data.ballColor && response.data.paddleColor) {
          // Use saved customization if available
          const { tableBg, ballColor, paddleColor, aiDifficulty, winningScore } = response.data;
          setTableBg(tableBg);
          setBallColor(ballColor);
          setPaddleColor(paddleColor);
          if (aiDifficulty) setAiDifficulty(aiDifficulty);
          if (winningScore) setWinningScore(winningScore);
          // Update the game context immediately
          setCustomisation({ tableBg, ballColor, paddleColor, aiDifficulty: aiDifficulty || null, winningScore: winningScore || 5 });
        } else {
          // No saved customization, use random defaults and update context
          setCustomisation({
            tableBg: getRandomDefaults.tableBg,
            ballColor: getRandomDefaults.ballColor,
            paddleColor: getRandomDefaults.paddleColor,
            aiDifficulty: gameState.mode === 'ai' ? getRandomDefaults.aiDifficulty : null,
            winningScore: getRandomDefaults.winningScore
          });
        }
      } catch (error) {
        // Never redirect from customization fetch - it's optional
        // Use random defaults if fetch fails
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            // Auth issue, but don't redirect - customization is optional
            console.warn('Could not fetch saved customization (auth issue, but non-critical). Using random defaults.');
          } else {
            // For other errors, just log
            console.warn('Could not fetch customization (non-critical). Using random defaults:', error.message);
          }
        } else {
          console.error('Error fetching game customization. Using random defaults:', error);
        }
        // Initialize game context with random defaults
        setCustomisation({
          tableBg: getRandomDefaults.tableBg,
          ballColor: getRandomDefaults.ballColor,
          paddleColor: getRandomDefaults.paddleColor,
          aiDifficulty: gameState.mode === 'ai' ? getRandomDefaults.aiDifficulty : null,
          winningScore: getRandomDefaults.winningScore
        });
      }
    };

    fetchCustomization();
  }, [token, setCustomisation, clearUser, router, axiosInstance, gameState.mode, getRandomDefaults]);

  const saveCustomization = async (customization: { tableBg: string; ballColor: string; paddleColor: string; aiDifficulty?: 'easy' | 'medium' | 'hard' | null; }) => {
    // If no token, skip saving (customization is optional for remote games)
    if (!token) {
      console.warn('No token available, skipping customization save');
      return Promise.resolve(); // Return resolved promise so it doesn't block
    }

    try {
      await axiosInstance.post('/saveGameCustomization', customization);
      return Promise.resolve();
    } catch (error) {
      // Never redirect from customization save - it's non-critical
      // Just log the error and continue
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Token might be expired or invalid, but don't redirect
          // User can still play - customization is optional
          console.warn('Could not save customization (auth issue, but non-critical):', error.message);
        } else {
          console.warn('Could not save customization (non-critical):', error.message);
        }
      } else {
        console.error('Error saving game customization:', error);
      }
      // Return resolved promise so caller doesn't think it failed critically
      return Promise.resolve();
    }
  };

  const handleStartGame = () => {
    // Always ready since we have defaults pre-selected
    const customization = {
      tableBg,
      ballColor,
      paddleColor,
      ...(gameState.mode === 'ai' && { aiDifficulty }),
      // For remote games, use default winning score of 5 since score selection is hidden
      winningScore: gameState.mode === 'remote' ? 5 : winningScore
    };
    setCustomisation(customization);

    // Try to save customization, but don't block game start if it fails
    // This is non-critical - game can proceed without saving customization
    saveCustomization(customization).catch(err => {
      console.warn('Could not save customization, but continuing with game:', err);
    });

    // Start game regardless of customization save result
    onStartGame(customization);
  };

  return (
    <div className='w-[100%] h-[100%]'>
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

        <h1 className='text-2xl font-bold text-center mb-3'
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
          {t('game.customizeYourPlayground')}
        </h1>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Table Background Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
              {t('game.tableBackground')}
            </h2>
            <div className="flex gap-3 justify-center">
              {tableBackgrounds.map((bg) => (
                <button
                  key={bg.name}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer
                    ${tableBg === bg.value ? 'scale-110' : 'hover:scale-105'}
                  `}
                  style={{
                    boxShadow: tableBg === bg.value
                      ? `
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        inset 0 -1px 0 rgba(0,0,0,0.2),
                        0 6px 12px rgba(59,130,246,0.4),
                        0 0 0 2px rgba(59,130,246,0.6)
                      `
                      : `
                        inset 0 1px 0 rgba(255,255,255,0.2),
                        inset 0 -1px 0 rgba(0,0,0,0.3),
                        0 3px 6px rgba(0,0,0,0.3),
                        0 0 0 1px rgba(255,255,255,0.1)
                      `
                  }}
                  onClick={() => setTableBg(bg.value)}
                  aria-label={bg.name}
                >
                  {bg.type === 'gradient' ? (
                    <div
                      className="w-full h-full rounded-md"
                      style={{ background: bg.value }}
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-md"
                      style={{ backgroundColor: bg.value }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ball Color Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
              {t('game.ballColor')}
            </h2>
            <div className="flex gap-3 flex-wrap justify-center">
              {ballColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer
                    ${ballColor === color ? 'scale-110' : 'hover:scale-105'}
                  `}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd, ${color}aa)`,
                    boxShadow: ballColor === color
                      ? `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 4px 8px rgba(59,130,246,0.4),
                        0 0 0 2px rgba(59,130,246,0.6)
                      `
                      : `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 2px 4px rgba(0,0,0,0.3)
                      `
                  }}
                  onClick={() => setBallColor(color)}
                  aria-label={color}
                />
              ))}
            </div>
          </div>

          {/* Paddle Color Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
              {t('game.paddleColor')}
            </h2>
            <div className="flex gap-3 flex-wrap justify-center">
              {paddleColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer
                    ${paddleColor === color ? 'scale-110' : 'hover:scale-105'}
                  `}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd, ${color}aa)`,
                    boxShadow: paddleColor === color
                      ? `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 4px 8px rgba(59,130,246,0.4),
                        0 0 0 2px rgba(59,130,246,0.6)
                      `
                      : `
                        inset -1px -1px 2px rgba(0,0,0,0.3),
                        inset 1px 1px 2px rgba(255,255,255,0.3),
                        0 2px 4px rgba(0,0,0,0.3)
                      `
                  }}
                  onClick={() => setPaddleColor(color)}
                  aria-label={color}
                />
              ))}
            </div>
          </div>

          {/* AI Difficulty Section - Only shown in AI mode */}
          {gameState.mode === 'ai' && (
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                {t('game.aiDifficulty')}
              </h2>
              <div className="flex gap-3 justify-center">
                {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 font-semibold text-sm
                      ${aiDifficulty === difficulty ? 'scale-110' : 'hover:scale-105'}
                    `}
                    style={{
                      background: aiDifficulty === difficulty
                        ? 'linear-gradient(135deg, #3b82f6, #1e40af)'
                        : 'linear-gradient(135deg, #4b5563, #374151)',
                      color: '#ffffff',
                      boxShadow: aiDifficulty === difficulty
                        ? `
                          inset 0 1px 0 rgba(255,255,255,0.3),
                          inset 0 -1px 0 rgba(0,0,0,0.3),
                          0 4px 8px rgba(59,130,246,0.4),
                          0 0 0 2px rgba(59,130,246,0.6)
                        `
                        : `
                          inset 0 1px 0 rgba(255,255,255,0.1),
                          inset 0 -1px 0 rgba(0,0,0,0.3),
                          0 2px 4px rgba(0,0,0,0.3)
                        `,
                      textTransform: 'capitalize',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                    onClick={() => setAiDifficulty(difficulty)}
                  >
                    {t(`game.${difficulty}`)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Winning Score Section - Hidden for remote 1v1 games */}
          {gameState.mode !== 'remote' && (
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                {t('game.winningScore')}
              </h2>
              <div className="flex gap-3 justify-center">
                {([5, 10] as const).map((score) => (
                  <button
                    key={score}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 font-semibold text-sm
                      ${winningScore === score ? 'scale-110' : 'hover:scale-105'}
                    `}
                    style={{
                      background: winningScore === score
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'linear-gradient(135deg, #4b5563, #374151)',
                      color: '#ffffff',
                      boxShadow: winningScore === score
                        ? `
                          inset 0 1px 0 rgba(255,255,255,0.3),
                          inset 0 -1px 0 rgba(0,0,0,0.3),
                          0 4px 8px rgba(245,158,11,0.4),
                          0 0 0 2px rgba(245,158,11,0.6)
                        `
                        : `
                          inset 0 1px 0 rgba(255,255,255,0.1),
                          inset 0 -1px 0 rgba(0,0,0,0.3),
                          0 2px 4px rgba(0,0,0,0.3)
                        `,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                    onClick={() => setWinningScore(score)}
                  >
                    {score} {t('game.points')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
              {t('game.preview')}
            </h2>
            <div className="w-[40%] h-32 self-center rounded-xl border-2 border-gray-700 flex items-center justify-center relative overflow-hidden"
              style={{
                background: tableBg || 'linear-gradient(145deg, #374151, #1f2937)',
                boxShadow: `
                  inset 0 2px 4px rgba(255,255,255,0.1),
                  inset 0 -2px 4px rgba(0,0,0,0.3),
                  0 6px 12px rgba(0,0,0,0.4),
                  0 0 0 1px rgba(255,255,255,0.1)
                `,
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            >
              {/* 3D Paddles */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-12 rounded-full animate-paddle-left"
                   style={{
                     background: `linear-gradient(180deg, ${paddleColor || '#fff'}, ${paddleColor || '#fff'}dd)`,
                     boxShadow: `
                       inset 0 1px 0 rgba(255,255,255,0.3),
                       inset 0 -1px 0 rgba(0,0,0,0.3),
                       0 2px 4px rgba(0,0,0,0.3)
                     `,
                     animation: 'paddleLeft 3s infinite ease-in-out'
                   }} />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-12 rounded-full animate-paddle-right"
                   style={{
                     background: `linear-gradient(180deg, ${paddleColor || '#fff'}, ${paddleColor || '#fff'}dd)`,
                     boxShadow: `
                       inset 0 1px 0 rgba(255,255,255,0.3),
                       inset 0 -1px 0 rgba(0,0,0,0.3),
                       0 2px 4px rgba(0,0,0,0.3)
                     `,
                     animation: 'paddleRight 3s infinite ease-in-out'
                   }} />
              {/* 3D Ball */}
              <div
                className="absolute w-5 h-5 rounded-full animate-bounce-ball"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${ballColor || '#fff'}, ${ballColor || '#fff'}dd, ${ballColor || '#fff'}aa)`,
                  boxShadow: `
                    inset -1px -1px 2px rgba(0,0,0,0.3),
                    inset 1px 1px 2px rgba(255,255,255,0.3),
                    0 3px 6px rgba(0,0,0,0.4)
                  `,
                  animation: 'bounceBall 4s infinite ease-in-out'
                }}
              />
            </div>
          </div>

        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-center space-x-4 pt-3 border-t border-gray-700">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
          >
            {t('game.backToPlayerSetup')}
          </button>
          <button
            onClick={handleStartGame}
            className="pb-2 cursor-pointer bg-black border-2 border-white hover:bg-white hover:text-black px-6 py-2 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.3),
                inset 0 -1px 0 rgba(0,0,0,0.3),
                0 4px 8px rgba(59,130,246,0.3),
                0 0 0 1px rgba(59,130,246,0.2)
              `,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {gameState.mode === 'remote' && !isSocketConnected
              ? t('game.connecting')
              : t('game.startGame')}
          </button>
        </div>

        <style jsx>{`
          @keyframes bounceBall {
            0% {
              transform: translate(60px, 80%);
            }
            50% {
              transform: translate(calc(100% - 60px), 90%);
            }
            100% {
              transform: translate(60px, 80%);
            }
          }

          @keyframes paddleLeft {
            0% {
              transform: translateY(-50%);
            }
            50% {
              transform: translateY(calc(100% - 48px));
            }
            100% {
              transform: translateY(-50%);
            }
          }

          @keyframes paddleRight {
            0% {
              transform: translateY(calc(100% - 48px));
            }
            50% {
              transform: translateY(-50%);
            }
            100% {
              transform: translateY(calc(100% - 48px));
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GameCustomization;
