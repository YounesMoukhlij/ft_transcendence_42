'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import { getWebSocket } from '@/components/globalSocket';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';
import { IoExpand, IoContract } from 'react-icons/io5';

import { ServerGameState } from '@/types/game';

export default function RemoteGameRoomPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { roomCode } = params;
  const { setGameMode } = useGameContext();
  const { socket } = useUserStore();

  const [serverGameState, setServerGameState] = useState<ServerGameState | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [error, setError] = useState('');
  const [rematchOffer, setRematchOffer] = useState(false);
  const [rematchDeclinedMessage, setRematchDeclinedMessage] = useState('');
  const [rematchRequested, setRematchRequested] = useState(false);
  const [gameOver, setGameOver] = useState<{winner: string; finalScore: any} | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.title = t('game.onlineMultiplayerPingPong');
    setGameMode('remote');
  }, [setGameMode, t]);

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

  const handleAcceptRematch = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:accept' }));
      setRematchOffer(false);
    }
  }, [socket]);

  const handleDeclineRematch = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:decline' }));
      setRematchOffer(false);
    }
  }, [socket]);

  useEffect(() => {
    // Try to get WebSocket connection - first from store, then from globalSocket
    let activeSocket = socket;

    // If socket from store is not available, try to get it from globalSocket
    if (!activeSocket || activeSocket.readyState === WebSocket.CLOSED || activeSocket.readyState === WebSocket.CLOSING) {
      try {
        activeSocket = getWebSocket();
      } catch (err) {
        console.error('Failed to get WebSocket:', err);
      }
    }

    // Message handler function
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'gameState':
            setServerGameState(message.payload);
            break;
          case 'opponentLeft':
            setOpponentLeft(true);
            break;
          case 'rematch:offer':
            setRematchOffer(true);
            setRematchRequested(false); // Reset request status when offer received
            break;
          case 'rematch:declined':
            setRematchDeclinedMessage(t('game.opponentDeclinedRematch'));
            setRematchRequested(false); // Reset request status
            break;
          case 'rematch:start':
            setServerGameState(message.payload);
            setRematchOffer(false);
            setRematchDeclinedMessage('');
            setRematchRequested(false);
            setGameOver(null); // Reset game over state for rematch
            break;
          case 'gameOver':
            // Game ended, winner is in message.payload.winner
            console.log('[RemoteGameRoom] Game over received:', message.payload);
            setGameOver({
              winner: message.payload.winner,
              finalScore: message.payload.finalScore,
              reason: message.payload.reason,
              message: message.payload.message
            });
            // Update final game state if provided
            if (message.payload.finalGameState) {
              setServerGameState(message.payload.finalGameState);
            }
            // If opponent quit, clear any rematch states since they're no longer in the room
            if (message.payload.reason === 'opponentQuit') {
              setRematchOffer(false);
              setRematchRequested(false);
              setRematchDeclinedMessage('');
              setOpponentLeft(true);
            }
            break;
          case 'matchFound':
            // If we receive matchFound while on room page, update state
            if (message.payload.roomCode === roomCode) {
              setServerGameState(null); // Reset to trigger re-render
            }
            break;
          case 'error':
            setError(message.message || t('game.anErrorOccurred'));
            break;
          default:
            console.log('Unhandled game message:', message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // If still no socket, wait a bit for connection to establish, then redirect
    if (!activeSocket || (activeSocket.readyState !== WebSocket.OPEN && activeSocket.readyState !== WebSocket.CONNECTING)) {
      // Give it a short time to connect (in case it's still connecting)
      const timeoutId = setTimeout(() => {
        // Check one more time if socket is now available
        let finalSocket = socket;
        if (!finalSocket || finalSocket.readyState === WebSocket.CLOSED || finalSocket.readyState === WebSocket.CLOSING) {
          try {
            finalSocket = getWebSocket();
          } catch (err) {
            // If still no connection, redirect to game home page
            console.error('WebSocket connection not available, redirecting to game home');
            router.push('/game');
            return;
          }
        }

        // If socket is connecting, wait a bit more
        if (finalSocket && finalSocket.readyState === WebSocket.CONNECTING) {
          const connectTimeout = setTimeout(() => {
            if (finalSocket && finalSocket.readyState !== WebSocket.OPEN) {
              console.error('WebSocket connection timeout, redirecting to game home');
              router.push('/game');
            } else if (finalSocket && finalSocket.readyState === WebSocket.OPEN) {
              // Socket is now open, set up message handler
              finalSocket.addEventListener('message', handleMessage);
            }
          }, 2000); // Wait 2 more seconds for connection

          return () => clearTimeout(connectTimeout);
        }

        // If socket is still not open, redirect
        if (!finalSocket || finalSocket.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection not available, redirecting to game home');
          router.push('/game');
        } else {
          // Socket is open, set up message handler
          finalSocket.addEventListener('message', handleMessage);
        }
      }, 500); // Wait 500ms before checking

      return () => clearTimeout(timeoutId);
    }

    // If socket is connecting, wait for it to open
    if (activeSocket.readyState === WebSocket.CONNECTING) {
      const openHandler = () => {
        // Socket is now open, set up message handler
        activeSocket!.addEventListener('message', handleMessage);
      };

      activeSocket.addEventListener('open', openHandler);

      // Also set a timeout in case connection fails
      const connectTimeout = setTimeout(() => {
        if (activeSocket && activeSocket.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout, redirecting to game home');
          router.push('/game');
        }
      }, 3000);

      return () => {
        activeSocket?.removeEventListener('open', openHandler);
        activeSocket?.removeEventListener('message', handleMessage);
        clearTimeout(connectTimeout);
      };
    }

    // Socket is open, set up message handler
    activeSocket.addEventListener('message', handleMessage);

    return () => {
      activeSocket?.removeEventListener('message', handleMessage);
    };
  }, [socket, handleAcceptRematch, handleDeclineRematch, roomCode, router]);

  const leaveRoom = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'leaveRoom',
        payload: { roomCode }
      }));
    }
    router.push('/game');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <button
          onClick={() => router.push('/game')}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          {t('game.backToGameMenu')}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={gameContainerRef}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${
        isFullscreen
          ? 'h-screen bg-black p-4'
          : 'min-h-full p-4 bg-transparent'
      }`}
    >
      {/* Game Over Screen */}
      {gameOver ? (
        <div className="text-white text-center p-8 bg-gray-800 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">{t('game.gameOver')}</h2>
          <p className="text-2xl mt-4 mb-6">{t('game.isTheWinner', { winner: gameOver.winner })}</p>

          {/* Show opponent quit message if applicable */}
          {gameOver.reason === 'opponentQuit' && gameOver.message && (
            <p className="text-yellow-400 text-lg mb-4 font-semibold">{gameOver.message}</p>
          )}

          <p className="text-lg mb-4">
            {t('game.finalScore')}: {gameOver.finalScore.player1} - {gameOver.finalScore.player2}
          </p>

          {/* Only show rematch options if opponent didn't quit (they're still available for rematch) */}
          {gameOver.reason !== 'opponentQuit' && (
            <>
              {rematchDeclinedMessage && <p className="text-red-400 mb-4">{rematchDeclinedMessage}</p>}

              {rematchOffer ? (
                <div>
                  <p className="text-yellow-400 mb-4">{t('game.opponentRequestedRematch')}</p>
                  <button
                    onClick={handleAcceptRematch}
                    className="mt-4 px-6 py-3 bg-yellow-500 rounded-lg text-lg hover:bg-yellow-600 transition-colors"
                  >
                    {t('game.acceptRematch')}
                  </button>
                  <button
                    onClick={() => {
                      if (socket && socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ type: 'rematch:decline' }));
                        setRematchOffer(false);
                      }
                    }}
                    className="mt-4 ml-4 px-6 py-3 bg-red-500 rounded-lg text-lg hover:bg-red-600 transition-colors"
                  >
                    {t('common.decline')}
                  </button>
                </div>
              ) : rematchRequested ? (
                <p className="text-yellow-400 mb-4">{t('game.waitingForOpponentRematch')}</p>
              ) : (
                <button
                  onClick={() => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                      socket.send(JSON.stringify({ type: 'rematch:request' }));
                      setRematchRequested(true);
                      setRematchDeclinedMessage(''); // Clear any previous decline message
                    }
                  }}
                  className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors"
                >
                  {t('game.requestRematch')}
                </button>
              )}
            </>
          )}

          {/* Always show back to lobby button */}
          <button
            onClick={leaveRoom}
            className={`mt-4 ${gameOver.reason !== 'opponentQuit' ? 'ml-4' : ''} px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition-colors`}
          >
            {t('game.backToGameLobby')}
          </button>
        </div>
      ) : (
        <>
          {/* Room Info - Hidden in fullscreen */}
          {!isFullscreen && (
            <div className="mb-4 text-center w-full max-w-4xl">
              <h2 className="text-2xl font-bold text-white mb-2">{t('game.onlineGame')}</h2>
              <p className="text-gray-300">{t('game.room')}: {roomCode}</p>
            </div>
          )}

          {/* Game Container */}
          <div className={`w-full flex flex-col items-center ${isFullscreen ? 'h-full justify-center' : 'max-w-4xl'}`}>
            <div className={`w-full flex justify-center ${isFullscreen ? 'flex-1 items-center' : ''}`}>
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
                  serverGameState={serverGameState}
                  opponentLeft={opponentLeft}
                  setServerGameState={setServerGameState}
                  rematchDeclinedMessage={rematchDeclinedMessage}
                  setRematchDeclinedMessage={setRematchDeclinedMessage}
                  rematchOffer={rematchOffer}
                  handleAcceptRematch={handleAcceptRematch}
                />
              </div>
            </div>

            {/* Controls - Hidden in fullscreen */}
            {!isFullscreen && (
              <div className="w-full max-w-2xl mt-4 text-center space-y-4">
                {/* Controls Instructions */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-white text-sm md:text-base mb-2">
                    <span className="font-semibold">Controls:</span> Use <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">W</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">S</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">↑</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">↓</kbd> keys to move your paddle
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm mb-2">
                    First to 5 points wins!
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

                  {/* Leave Game Button */}
                  <button
                    onClick={leaveRoom}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {t('game.leaveGame')}
                  </button>
                </div>
              </div>
            )}

            {/* Minimal UI in Fullscreen - Fixed Bottom */}
            {isFullscreen && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700 shadow-xl">
                <div className="flex items-center gap-4 text-white text-sm flex-wrap justify-center">
                  <div>
                    <span className="opacity-70">Room: </span>
                    <span className="font-semibold">{roomCode}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <div>
                    <span className="opacity-70">Controls: </span>
                    <span className="font-semibold">W/S or ↑/↓</span>
                  </div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <div className="opacity-70 text-xs">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">F</kbd> to exit fullscreen
                  </div>
                  <div className="h-4 w-px bg-gray-600"></div>
                  <button
                    onClick={leaveRoom}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm font-medium"
                  >
                    Leave Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
