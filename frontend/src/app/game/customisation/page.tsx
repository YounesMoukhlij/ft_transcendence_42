'use client';

import { useState } from 'react';

const tableBackgrounds = [
  { name: 'Classic Green', value: 'bg-green-700', type: 'color' },
  { name: 'Blue Gradient', value: 'bg-gradient-to-br from-blue-500 to-blue-900', type: 'color' },
  { name: 'Sunset', value: 'bg-gradient-to-br from-pink-500 via-yellow-400 to-orange-500', type: 'color' },
  { name: 'black', value: 'bg-gradient-to-white from-black-500 via-yellow-400 to-orange-500', type: 'color' }
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

export default function GameCustomisationPage() {
  const [tableBg, setTableBg] = useState<string | null>(null);
  const [ballColor, setBallColor] = useState<string | null>(null);
  const [paddleColor, setPaddleColor] = useState<string | null>(null);

  const isReady = tableBg && ballColor && paddleColor;

  return (
    // <div className='border-2 border-white h-[100%]  w-[100%] flex flex-col items-center  justify-center text-white p-4'>
        <div className='text-white opacity-98 w-[100%] h-full rounded-2xl p-8 flex flex-col gap-6 relative border-2 border-white'
             style={{
               background: 'linear-gradient(145deg, #374151, #1f2937)',
               boxShadow: `
                 inset 0 1px 0 rgba(255,255,255,0.1),
                 inset 0 -1px 0 rgba(0,0,0,0.3),
                 0 20px 40px rgba(0,0,0,0.4),
                 0 0 0 1px rgba(255,255,255,0.05)
               `
             }}>
            <h1 className='text-3xl font-bold text-center mb-4'
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
              Customize Your Playground
            </h1>

            {/* Table Background Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                  Table Background
                </h2>
                <div className="flex gap-4 justify-center">
                    {tableBackgrounds.map((bg) => (
                      <button
                        key={bg.name}
                        className={`w-16 h-16 rounded-xl border-4 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer
                          ${tableBg === bg.value ? 'scale-110' : 'hover:scale-105'}
                        `}
                        style={{
                          boxShadow: tableBg === bg.value
                            ? `
                              inset 0 1px 0 rgba(255,255,255,0.3),
                              inset 0 -1px 0 rgba(0,0,0,0.2),
                              0 8px 16px rgba(59,130,246,0.4),
                              0 0 0 2px rgba(59,130,246,0.6)
                            `
                            : `
                              inset 0 1px 0 rgba(255,255,255,0.2),
                              inset 0 -1px 0 rgba(0,0,0,0.3),
                              0 4px 8px rgba(0,0,0,0.3),
                              0 0 0 1px rgba(255,255,255,0.1)
                            `
                        }}
                        onClick={() => setTableBg(bg.value)}
                        aria-label={bg.name}
                      >
                        {bg.type === 'color' ? (
                          <div className={`w-full h-full ${bg.value} rounded-lg`} />
                        ) : (
                          <img src={bg.value} alt={bg.name} className="w-full h-full object-cover rounded-lg" />
                        )}
                      </button>
                    ))}
                </div>
            </div>

            {/* Ball Color Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                  Ball Color
                </h2>
                <div className="flex gap-4 flex-wrap justify-center">
                    {ballColors.map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-full border-4 transition-all duration-300 flex items-center justify-center cursor-pointer
                          ${ballColor === color ? 'scale-110' : 'hover:scale-105'}
                        `}
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd, ${color}aa)`,
                          boxShadow: ballColor === color
                            ? `
                              inset -1px -1px 2px rgba(0,0,0,0.3),
                              inset 1px 1px 2px rgba(255,255,255,0.3),
                              0 6px 12px rgba(59,130,246,0.4),
                              0 0 0 2px rgba(59,130,246,0.6)
                            `
                            : `
                              inset -1px -1px 2px rgba(0,0,0,0.3),
                              inset 1px 1px 2px rgba(255,255,255,0.3),
                              0 3px 6px rgba(0,0,0,0.3)
                            `
                        }}
                        onClick={() => setBallColor(color)}
                        aria-label={color}
                      />
                    ))}
                </div>
            </div>

            {/* Paddle Color Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                  Paddle Color
                </h2>
                <div className="flex gap-4 flex-wrap justify-center">
                    {paddleColors.map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-full border-4 transition-all duration-300 flex items-center justify-center cursor-pointer
                          ${paddleColor === color ? 'scale-110' : 'hover:scale-105'}
                        `}
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd, ${color}aa)`,
                          boxShadow: paddleColor === color
                            ? `
                              inset -1px -1px 2px rgba(0,0,0,0.3),
                              inset 1px 1px 2px rgba(255,255,255,0.3),
                              0 6px 12px rgba(59,130,246,0.4),
                              0 0 0 2px rgba(59,130,246,0.6)
                            `
                            : `
                              inset -1px -1px 2px rgba(0,0,0,0.3),
                              inset 1px 1px 2px rgba(255,255,255,0.3),
                              0 3px 6px rgba(0,0,0,0.3)
                            `
                        }}
                        onClick={() => setPaddleColor(color)}
                        aria-label={color}
                      />
                    ))}
                </div>
            </div>

            {/* Live Preview Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                Preview
              </h2>
                <div className="w-[35%] h-40 self-center rounded-2xl border-4 border-gray-700 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: tableBg && tableBackgrounds.find(bg => bg.value === tableBg)?.type === 'image'
                      ? `url(${tableBg}) center/cover`
                      : tableBg || 'linear-gradient(145deg, #374151, #1f2937)',
                    boxShadow: `
                      inset 0 2px 4px rgba(255,255,255,0.1),
                      inset 0 -2px 4px rgba(0,0,0,0.3),
                      0 8px 16px rgba(0,0,0,0.4),
                      0 0 0 1px rgba(255,255,255,0.1)
                    `,
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
                >
                    {/* Color/gradient background if not image */}
                    {tableBg && tableBackgrounds.find(bg => bg.value === tableBg)?.type === 'color' && (
                      <div className={`absolute inset-0 rounded-xl ${tableBg}`} />
                    )}
                    {/* 3D Paddles */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-16 rounded-full animate-paddle-left"
                         style={{
                           background: `linear-gradient(180deg, ${paddleColor || '#fff'}, ${paddleColor || '#fff'}dd)`,
                           boxShadow: `
                             inset 0 1px 0 rgba(255,255,255,0.3),
                             inset 0 -1px 0 rgba(0,0,0,0.3),
                             0 2px 4px rgba(0,0,0,0.3)
                           `,
                           animation: 'paddleLeft 3s infinite ease-in-out'
                         }} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-16 rounded-full animate-paddle-right"
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
                      className="absolute w-7 h-7 rounded-full animate-bounce-ball"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${ballColor || '#fff'}, ${ballColor || '#fff'}dd, ${ballColor || '#fff'}aa)`,
                        boxShadow: `
                          inset -2px -2px 4px rgba(0,0,0,0.3),
                          inset 2px 2px 4px rgba(255,255,255,0.3),
                          0 4px 8px rgba(0,0,0,0.4)
                        `,
                        animation: 'bounceBall 4s infinite ease-in-out'
                      }}
                    />
                </div>
            </div>

            {/* Start Game Button */}
            <button
              className={`pb-2 cursor-pointer bg-black border-2 border-white hover:bg-white hover:text-black self-center w-[30%] h-[20%] hover:scale-105  py-3 rounded-xl text-lg font-bold transition-all duration-300 mt-2
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
              disabled={!isReady}
            >
              Start Game
            </button>
        {/* </div> */}

        <style jsx>{`
          @keyframes bounceBall {
            0% {
              transform: translate(100px, 90%);
            }
            50% {
              transform: translate(calc(100% - 90px), 100%);
            }
            100% {
              transform: translate(100px, 90%);
            }
          }

          @keyframes paddleLeft {
            0% {
              transform: translateY(-50%);
            }
            50% {
              transform: translateY(calc(100% - 64px));
            }
            100% {
              transform: translateY(-50%);
            }
          }

          @keyframes paddleRight {
            0% {
              transform: translateY(calc(100% - 64px));
            }
            50% {
              transform: translateY(-50%);
            }
            100% {
              transform: translateY(calc(100% - 64px));
            }
          }
        `}</style>
    </div>
  );
}
