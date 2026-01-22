'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';
import { IoExpand, IoContract } from 'react-icons/io5';
import api from "@/lib/api"
import { getBackendURL } from '@/lib/utils';
import { ServerGameState } from '@/types/game';

// Extended Document interface for vendor-prefixed fullscreen APIs
interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

// Extended Element interface for vendor-prefixed fullscreen APIs
interface ExtendedElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const defaultProfileImg = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/HeathJoker.png/250px-HeathJoker.png';

// Helper function to resolve profile image URL
const getProfileImageUrl = (profileImg: string | null | undefined): string => {
  if (!profileImg) return defaultProfileImg;
  const API_URL = getBackendURL();
  if (profileImg.startsWith('/uploads/')) {
    return `${API_URL}${profileImg}`;
  }
  return profileImg;
};

export default function RemoteGameRoomPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { roomCode } = params;
  const { setGameMode } = useGameContext();
  const { socket, user ,connect } = useUserStore();
  
  const [serverGameState, setServerGameState] = useState<ServerGameState | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [error, setError] = useState('');
  const [rematchOffer, setRematchOffer] = useState(false);
  const [rematchDeclinedMessage, setRematchDeclinedMessage] = useState('');
  const [rematchRequested, setRematchRequested] = useState(false);
  const [gameOver, setGameOver] = useState<{
    winner: string;
    finalScore: { player1: number; player2: number };
    reason?: string;
    message?: string;
  } | null>(null);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Player profile images state
  const [player1ProfileImg, setPlayer1ProfileImg] = useState<string>(defaultProfileImg);
  const [player2ProfileImg, setPlayer2ProfileImg] = useState<string>(defaultProfileImg);
  const [player1Username, setPlayer1Username] = useState<string>('');
  const [player2Username, setPlayer2Username] = useState<string>('');
  
  const profileImagesFetched = useRef<Set<number>>(new Set());
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoFullscreenAttemptedRef = useRef<boolean>(false);
  const gameStartedRef = useRef<boolean>(false);
  const handleAcceptRematchRef = useRef<(() => void) | null>(null);
  const handleDeclineRematchRef = useRef<(() => void) | null>(null);
  const messageHandlerAttachedRef = useRef<boolean>(false);

  useEffect(() => {
    document.title = t('game.onlineMultiplayerPingPong');
    setGameMode('remote');
  }, [setGameMode, t]);

  // Fetch player profile images when gameState is available
  useEffect(() => {
    if (!serverGameState || !user?.access_token) return;
    
    const fetchPlayerProfile = async (playerId: number, username: string, isPlayer1: boolean) => {
      if (profileImagesFetched.current.has(playerId)) return;
      
      try {
        const response = await api.get(
          `/api/getUserStats/${playerId}`,
          {
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        );
        if (response.data?.profile_img || response.data?.avatar) {
          const profileImg = response.data.profile_img || response.data.avatar;
          const resolvedImg = getProfileImageUrl(profileImg);
          if (isPlayer1) {
            setPlayer1ProfileImg(resolvedImg);
          } else {
            setPlayer2ProfileImg(resolvedImg);
          }
          profileImagesFetched.current.add(playerId);
        }
      } catch (error) {
        console.error(`[RemoteGameRoom] Error fetching profile for ${username}:`, error);
      }
    };

    if (serverGameState.player1?.id && serverGameState.player1?.username) {
      setPlayer1Username(serverGameState.player1.username);
      fetchPlayerProfile(
        serverGameState.player1.id,
        serverGameState.player1.username,
        true
      );
      if (user?.id_user === serverGameState.player1.id && user?.profile_img) {
        setPlayer1ProfileImg(getProfileImageUrl(user.profile_img));
        profileImagesFetched.current.add(serverGameState.player1.id);
      }
    }
    
    if (serverGameState.player2?.id && serverGameState.player2?.username) {
      setPlayer2Username(serverGameState.player2.username);
      fetchPlayerProfile(
        serverGameState.player2.id,
        serverGameState.player2.username,
        false
      );
      if (user?.id_user === serverGameState.player2.id && user?.profile_img) {
        setPlayer2ProfileImg(getProfileImageUrl(user.profile_img));
        profileImagesFetched.current.add(serverGameState.player2.id);
      }
    }
  }, [serverGameState, user]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = gameContainerRef.current as ExtendedElement | null;
    if (!container) return;

    try {
      const extDoc = document as ExtendedDocument;
      if (
        document.fullscreenElement ||
        extDoc.webkitFullscreenElement ||
        extDoc.mozFullScreenElement ||
        extDoc.msFullscreenElement
      ) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (extDoc.webkitExitFullscreen) {
          await extDoc.webkitExitFullscreen();
        } else if (extDoc.mozCancelFullScreen) {
          await extDoc.mozCancelFullScreen();
        } else if (extDoc.msExitFullscreen) {
          await extDoc.msExitFullscreen();
        }
      } else {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
          container.focus();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
          container.focus();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
          container.focus();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
          container.focus();
        }
      }
    } catch {
      console.error('Error toggling fullscreen');
    }
  }, []);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      const extDoc = document as ExtendedDocument;
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        extDoc.webkitFullscreenElement ||
        extDoc.mozFullScreenElement ||
        extDoc.msFullscreenElement
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'f' || e.key === 'F' || e.key === 'F11') {
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

  // Auto fullscreen on mount
  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) {
      const retryTimer = setTimeout(() => {
        const retryContainer = gameContainerRef.current as ExtendedElement | null;
        if (retryContainer && !autoFullscreenAttemptedRef.current) {
          autoFullscreenAttemptedRef.current = true;
          requestAnimationFrame(async () => {
            try {
              if (retryContainer.requestFullscreen) {
                await retryContainer.requestFullscreen();
                retryContainer.focus();
              } else if (retryContainer.webkitRequestFullscreen) {
                await retryContainer.webkitRequestFullscreen();
                retryContainer.focus();
              } else if (retryContainer.mozRequestFullScreen) {
                await retryContainer.mozRequestFullScreen();
                retryContainer.focus();
              } else if (retryContainer.msRequestFullscreen) {
                await retryContainer.msRequestFullscreen();
                retryContainer.focus();
              }
            } catch {
              console.warn('[RemoteGame] Fullscreen blocked on retry');
            }
          });
        }
      }, 200);
      return () => clearTimeout(retryTimer);
    }

    const extDoc = document as ExtendedDocument;
    const isAlreadyFullscreen = !!(
      document.fullscreenElement ||
      extDoc.webkitFullscreenElement ||
      extDoc.mozFullScreenElement ||
      extDoc.msFullscreenElement
    );

    if (isAlreadyFullscreen) {
      autoFullscreenAttemptedRef.current = true;
      return;
    }

    autoFullscreenAttemptedRef.current = true;
    const timer = setTimeout(() => {
      requestAnimationFrame(async () => {
        const extContainer = container as ExtendedElement;
        try {
          if (extContainer.requestFullscreen) {
            await extContainer.requestFullscreen();
            extContainer.focus();
          } else if (extContainer.webkitRequestFullscreen) {
            await extContainer.webkitRequestFullscreen();
            extContainer.focus();
          } else if (extContainer.mozRequestFullScreen) {
            await extContainer.mozRequestFullScreen();
            extContainer.focus();
          } else if (extContainer.msRequestFullscreen) {
            await extContainer.msRequestFullscreen();
            extContainer.focus();
          }
        } catch {
          console.warn('[RemoteGame] Auto-fullscreen not available');
          autoFullscreenAttemptedRef.current = false;
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Backup fullscreen attempt when game starts
  useEffect(() => {
    if (!serverGameState || gameOver) return;

    gameStartedRef.current = true;
    const extDoc = document as ExtendedDocument;
    const isInFullscreen = !!(
      document.fullscreenElement ||
      extDoc.webkitFullscreenElement ||
      extDoc.mozFullScreenElement ||
      extDoc.msFullscreenElement
    );

    if (!isInFullscreen && !autoFullscreenAttemptedRef.current) {
      autoFullscreenAttemptedRef.current = true;
      const container = gameContainerRef.current as ExtendedElement | null;
      if (container) {
        requestAnimationFrame(async () => {
          try {
            if (container.requestFullscreen) {
              await container.requestFullscreen();
              container.focus();
            } else if (container.webkitRequestFullscreen) {
              await container.webkitRequestFullscreen();
              container.focus();
            } else if (container.mozRequestFullScreen) {
              await container.mozRequestFullScreen();
              container.focus();
            } else if (container.msRequestFullscreen) {
              await container.msRequestFullscreen();
              container.focus();
            }
          } catch {
            console.warn('[RemoteGame] Fullscreen backup attempt failed');
          }
        });
      }
    }
  }, [serverGameState, gameOver]);

  const handleAcceptRematch = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:accept' }));
      setRematchOffer(false);
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
        autoRedirectTimerRef.current = null;
      }
    }
  }, [socket]);

  const handleDeclineRematch = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:decline' }));
      setRematchOffer(false);
    }
  }, [socket]);

  // Update refs when callbacks change
  useEffect(() => {
    handleAcceptRematchRef.current = handleAcceptRematch;
    handleDeclineRematchRef.current = handleDeclineRematch;
  }, [handleAcceptRematch, handleDeclineRematch]);

  // Main WebSocket message handler
  useEffect(() => {
    messageHandlerAttachedRef.current = false;

    // Check if socket is available and connected
    if (!socket) {
      connect();
      console.log("ok msogra===============+>");
      console.error('[RemoteGameRoom] No socket available');
      setError(t('game.connectionError'));
      // const redirectTimer = setTimeout(() => {
      //   router.push('/game');
      // }, 2000);
      // return () => clearTimeout(redirectTimer);
    }

    // Message handler function
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'gameState':
            setServerGameState(prev => {
              const enrichedPayload = {
                ...message.payload,
                roomCode: message.roomCode ?? message.payload?.roomCode ?? roomCode,
                matchId: message.matchId ?? message.payload?.matchId
              };
              
              if (!prev || JSON.stringify(prev) !== JSON.stringify(enrichedPayload)) {
                console.log('[RemoteGameRoom] Received gameState update:', {
                  hasPayload: !!message.payload,
                  hasBall: !!message.payload?.ball,
                  player1Score: message.payload?.player1?.score,
                  player2Score: message.payload?.player2?.score,
                  roomCode: enrichedPayload.roomCode,
                  timestamp: message.timestamp
                });
              }
              
              if (JSON.stringify(prev) === JSON.stringify(enrichedPayload)) {
                return prev;
              }
              return enrichedPayload;
            });
            break;

          case 'opponentLeft':
            setOpponentLeft(true);
            break;

          case 'rematch:offer':
            setRematchOffer(true);
            setRematchRequested(false);
            break;

          case 'rematch:declined':
            setRematchDeclinedMessage(t('game.opponentDeclinedRematch'));
            setRematchRequested(false);
            break;

          case 'rematch:start':
            if (autoRedirectTimerRef.current) {
              clearTimeout(autoRedirectTimerRef.current);
              autoRedirectTimerRef.current = null;
            }
            autoFullscreenAttemptedRef.current = false;
            gameStartedRef.current = false;
            setServerGameState({
              ...message.payload,
              roomCode: message.roomCode ?? message.payload?.roomCode ?? roomCode,
              matchId: message.matchId ?? message.payload?.matchId
            });
            setRematchOffer(false);
            setRematchDeclinedMessage('');
            setRematchRequested(false);
            setGameOver(null);
            break;

          case 'gameOver':
            console.log('[RemoteGameRoom] Game over received:', message.payload);
            setGameOver({
              winner: message.payload.winner,
              finalScore: message.payload.finalScore,
              reason: message.payload.reason,
              message: message.payload.message
            });
            
            if (message.payload.finalGameState) {
              setServerGameState(prev => {
                if (JSON.stringify(prev) === JSON.stringify(message.payload.finalGameState)) {
                  return prev;
                }
                return message.payload.finalGameState;
              });
            }
            
            if (message.payload.reason === 'opponentQuit') {
              setRematchOffer(false);
              setRematchRequested(false);
              setRematchDeclinedMessage('');
              setOpponentLeft(true);
            }
            break;

          case 'matchFound':
            if (message.payload.roomCode === roomCode) {
              setServerGameState(prev => {
                if (prev === null) return prev;
                return null;
              });
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

    // Handle different socket states
    if (socket.readyState === WebSocket.CONNECTING) {
      const openHandler = () => {
        if (!messageHandlerAttachedRef.current && socket) {
          socket.addEventListener('message', handleMessage);
          messageHandlerAttachedRef.current = true;
          
          // Request current game state
          socket.send(JSON.stringify({
            type: 'requestGameState',
            payload: { roomCode }
          }));
        }
      };
      
      socket.addEventListener('open', openHandler);
      
      const connectTimeout = setTimeout(() => {
        if (socket && socket.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          setError(t('game.connectionTimeout'));
          router.push('/game');
        }
      }, 3000);
      
      return () => {
        socket?.removeEventListener('open', openHandler);
        socket?.removeEventListener('message', handleMessage);
        messageHandlerAttachedRef.current = false;
        clearTimeout(connectTimeout);
      };
    }

    if (socket.readyState === WebSocket.OPEN) {
      if (!messageHandlerAttachedRef.current) {
        socket.addEventListener('message', handleMessage);
        messageHandlerAttachedRef.current = true;
        
        // Request current game state
        socket.send(JSON.stringify({
          type: 'requestGameState',
          payload: { roomCode }
        }));
      }
      
      return () => {
        socket?.removeEventListener('message', handleMessage);
        messageHandlerAttachedRef.current = false;
      };
    }

    // Socket is closed or closing
    console.error('[RemoteGameRoom] Socket is not connected');
    setError(t('game.connectionLost'));
    const redirectTimer = setTimeout(() => {
      router.push('/game');
    }, 2000);
    
    return () => clearTimeout(redirectTimer);
  }, [socket, roomCode, router, t]);

  const leaveRoom = useCallback(() => {
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
      autoRedirectTimerRef.current = null;
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'leaveRoom',
        payload: { roomCode }
      }));
    }
    router.push('/game');
  }, [socket, roomCode, router]);

  // Auto-redirect timer
  useEffect(() => {
    if (gameOver && gameOver.reason !== 'opponentQuit') {
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
      }
      
      autoRedirectTimerRef.current = setTimeout(() => {
        console.log('[RemoteGameRoom] Auto-redirecting to lobby after 1 minute');
        leaveRoom();
      }, 60000);
      
      return () => {
        if (autoRedirectTimerRef.current) {
          clearTimeout(autoRedirectTimerRef.current);
          autoRedirectTimerRef.current = null;
        }
      };
    } else {
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
        autoRedirectTimerRef.current = null;
      }
    }
  }, [gameOver, leaveRoom]);

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
      tabIndex={-1}
      className={`flex flex-col items-center justify-center w-full transition-all duration-300 focus:outline-none ${
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
          
          {gameOver.reason === 'opponentQuit' && gameOver.message && (
            <p className="text-yellow-400 text-lg mb-4 font-semibold">{gameOver.message}</p>
          )}
          
          <p className="text-lg mb-4">
            {t('game.finalScore')}: {gameOver.finalScore.player1} - {gameOver.finalScore.player2}
          </p>
          
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
                        if (autoRedirectTimerRef.current) {
                          clearTimeout(autoRedirectTimerRef.current);
                          autoRedirectTimerRef.current = null;
                        }
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
                      setRematchDeclinedMessage('');
                      if (autoRedirectTimerRef.current) {
                        clearTimeout(autoRedirectTimerRef.current);
                        autoRedirectTimerRef.current = null;
                      }
                    }
                  }}
                  className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-lg hover:bg-green-600 transition-colors"
                >
                  {t('game.requestRematch')}
                </button>
              )}
            </>
          )}
          
          <button
            onClick={leaveRoom}
            className={`mt-4 ${gameOver.reason !== 'opponentQuit' ? 'ml-4' : ''} px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition-colors`}
          >
            {t('game.backToGameLobby')}
          </button>
        </div>
      ) : (
        <>
          {!isFullscreen && (
            <div className="mb-4 text-center w-full max-w-4xl">
              <h2 className="text-2xl font-bold text-white mb-2">{t('game.onlineGame')}</h2>
              <p className="text-gray-300">{t('game.room')}: {roomCode}</p>
            </div>
          )}
          
          <div className={`w-full flex flex-col items-center ${isFullscreen ? 'h-full justify-center' : 'max-w-4xl'}`}>
            {serverGameState && (player1Username || player2Username) && !isFullscreen && (
              <div className="w-full max-w-4xl mb-4 px-4">
                <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <Image
                        src={player1ProfileImg}
                        alt={player1Username || 'Player 1'}
                        width={64}
                        height={64}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-400 shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultProfileImg;
                        }}
                      />
                      {serverGameState?.player1 && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-800 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{serverGameState.player1.score}</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                        {player1Username || serverGameState?.player1?.username || 'Player 1'}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">Left Paddle</p>
                    </div>
                  </div>
                  
                  <div className="mx-4 sm:mx-6 flex-shrink-0">
                    <span className="text-yellow-400 font-bold text-lg sm:text-xl md:text-2xl">VS</span>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-1 flex-row-reverse text-right">
                    <div className="relative">
                      <Image
                        src={player2ProfileImg}
                        alt={player2Username || 'Player 2'}
                        width={64}
                        height={64}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-red-400 shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultProfileImg;
                        }}
                      />
                      {serverGameState?.player2 && (
                        <div className="absolute -bottom-1 -left-1 bg-red-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-800 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{serverGameState.player2.score}</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                        {player2Username || serverGameState?.player2?.username || 'Player 2'}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">Right Paddle</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {serverGameState && (player1Username || player2Username) && isFullscreen && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={player1ProfileImg}
                      alt={player1Username || 'Player 1'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultProfileImg;
                      }}
                    />
                    <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                      {player1Username || serverGameState?.player1?.username || 'P1'}
                    </span>
                    {serverGameState?.player1 && (
                      <span className="text-blue-400 font-bold text-sm">{serverGameState.player1.score}</span>
                    )}
                  </div>
                  <span className="text-yellow-400 font-bold">VS</span>
                  <div className="flex items-center gap-2">
                    {serverGameState?.player2 && (
                      <span className="text-red-400 font-bold text-sm">{serverGameState.player2.score}</span>
                    )}
                    <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                      {player2Username || serverGameState?.player2?.username || 'P2'}
                    </span>
                    <Image
                      src={player2ProfileImg}
                      alt={player2Username || 'Player 2'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-red-400"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultProfileImg;
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {!gameOver && (
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
                    socket={socket}
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
            )}

            {!isFullscreen && (
              <div className="w-full max-w-2xl mt-4 text-center space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-white text-sm md:text-base mb-2">
                    <span className="font-semibold">Controls:</span> Use <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">W</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">S</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">↑</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-sm">↓</kbd> keys to move your paddle
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm mb-2">
                    First to 10 points wins!
                  </p>
                  <p className="text-gray-500 text-xs">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">F</kbd> for fullscreen mode
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
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

                  <button
                    onClick={leaveRoom}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {t('game.leaveGame')}
                  </button>
                </div>
              </div>
            )}

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