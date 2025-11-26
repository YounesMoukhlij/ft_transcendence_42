'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from './GameContext';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

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
  onStartGame: (customization: { tableBg: string; ballColor: string; paddleColor: string; }) => void;
  isSocketConnected?: boolean;
}

const GameCustomization: React.FC<GameCustomizationProps> = ({ onBack, onStartGame, isSocketConnected }) => {
  const router = useRouter();
  const { gameState, setCustomisation } = useGameContext();
  const { user, clearUser } = useUserStore();
  const token = user?.token;

  const [tableBg, setTableBg] = useState<string | null>(null);
  const [ballColor, setBallColor] = useState<string | null>(null);
  const [paddleColor, setPaddleColor] = useState<string | null>(null);

  const isReady = tableBg && ballColor && paddleColor;

  const axiosInstance = axios.create({
    baseURL: `http://${process.env.NEXT_PUBLIC_BACKEND_IP}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const response = await axiosInstance.get('/getGameCustomization');
        if (response.data) {
          const { tableBg, ballColor, paddleColor } = response.data;
          setTableBg(tableBg);
          setBallColor(ballColor);
          setPaddleColor(paddleColor);
          // Update the game context immediately
          setCustomisation({ tableBg, ballColor, paddleColor });
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          clearUser();
          router.push('/login');
        }
        console.error('Error fetching game customization:', error);
      }
    };

    if (token) {
      fetchCustomization();
    }
  }, [token, setCustomisation, clearUser, router]);

  const saveCustomization = async (customization: { tableBg: string; ballColor: string; paddleColor: string; }) => {
    try {
      await axiosInstance.post('/saveGameCustomization', customization);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearUser();
        router.push('/login');
      }
      console.error('Error saving game customization:', error);
    }
  };

  const handleStartGame = () => {
    if (isReady) {
      const customization = { tableBg, ballColor, paddleColor };
      setCustomisation(customization);
      saveCustomization(customization);
      onStartGame(customization);
    }
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
          Customize Your Playground
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
              Table Background
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
              Ball Color
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
              Paddle Color
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

          {/* Live Preview Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
              Preview
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

          {!isReady && (
            <div className="text-center">
              <p className="text-yellow-500 text-xs">
                All customization options must be selected to start the game
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-center space-x-4 pt-3 border-t border-gray-700">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
          >
            Back to Player Setup
          </button>
          <button
            onClick={handleStartGame}
            disabled={!isReady || (gameState.mode === 'remote' && !isSocketConnected)}
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
            {gameState.mode === 'remote' && !isSocketConnected ? 'Connecting...' : 'Start Game'}
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
