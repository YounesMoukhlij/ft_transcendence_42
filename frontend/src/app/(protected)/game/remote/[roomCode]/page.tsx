'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { useUserStore } from '@/store/userStore';
import { getWebSocket } from '@/components/globalSocket';
import PingPongGame from '@/components/PingPongGame';
import { useTranslation } from '@/contexts/LanguageContext';
import { IoExpand, IoContract } from 'react-icons/io5';
import axios from 'axios';
import { getBackendURL } from '@/lib/utils';

import { ServerGameState } from '@/types/game';

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

export default function RemoteGameRoomPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { roomCode } = params;
  const { setGameMode } = useGameContext();
  const { socket, user } = useUserStore();

  const [serverGameState, setServerGameState] = useState<ServerGameState | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [error, setError] = useState('');
  const [rematchOffer, setRematchOffer] = useState(false);
  const [rematchDeclinedMessage, setRematchDeclinedMessage] = useState('');
  const [rematchRequested, setRematchRequested] = useState(false);
  const [gameOver, setGameOver] = useState<{
    winner: string;
    finalScore: any;
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
  const profileImagesFetched = useRef<Set<number>>(new Set()); // Track which player IDs we've fetched
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null); // Timer for auto-redirect after 1 minute
  const autoFullscreenAttemptedRef = useRef<boolean>(false); // Track if we've attempted auto-fullscreen
  const gameStartedRef = useRef<boolean>(false); // Track if game has started (serverGameState received)
  const handleAcceptRematchRef = useRef<(() => void) | null>(null); // Ref for rematch handler
  const handleDeclineRematchRef = useRef<(() => void) | null>(null); // Ref for decline handler
  const messageHandlerAttachedRef = useRef<boolean>(false); // Track if message handler is attached

  useEffect(() => {
    document.title = t('game.onlineMultiplayerPingPong');
    setGameMode('remote');
  }, [setGameMode, t]);

  // Fetch player profile images when gameState is available
  useEffect(() => {
    if (!serverGameState || !user?.access_token) return;

    const fetchPlayerProfile = async (playerId: number, username: string, isPlayer1: boolean) => {
      // Skip if we've already fetched this player's profile
      if (profileImagesFetched.current.has(playerId)) return;

      try {
        const response = await axios.get(
          `${getBackendURL()}/getUserStats/${username}`,
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
        // Use default image on error
      }
    };

    // Fetch both players' profiles
    if (serverGameState.player1?.id && serverGameState.player1?.username) {
      setPlayer1Username(serverGameState.player1.username);
      fetchPlayerProfile(
        serverGameState.player1.id,
        serverGameState.player1.username,
        true
      );

      // If current user is player1, use their profile immediately
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

      // If current user is player2, use their profile immediately
      if (user?.id_user === serverGameState.player2.id && user?.profile_img) {
        setPlayer2ProfileImg(getProfileImageUrl(user.profile_img));
        profileImagesFetched.current.add(serverGameState.player2.id);
      }
    }
  }, [serverGameState, user]);

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

  // Automatically enter fullscreen when page mounts (user initiated navigation = user interaction)
  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) {
      // Container not ready yet, retry after a short delay
      const retryTimer = setTimeout(() => {
        const retryContainer = gameContainerRef.current;
        if (retryContainer && !autoFullscreenAttemptedRef.current) {
          autoFullscreenAttemptedRef.current = true;
          requestAnimationFrame(async () => {
            try {
              if (retryContainer.requestFullscreen) {
                await retryContainer.requestFullscreen();
                retryContainer.focus();
              } else if ((retryContainer as any).webkitRequestFullscreen) {
                await (retryContainer as any).webkitRequestFullscreen();
                retryContainer.focus();
              } else if ((retryContainer as any).mozRequestFullScreen) {
                await (retryContainer as any).mozRequestFullScreen();
                retryContainer.focus();
              } else if ((retryContainer as any).msRequestFullscreen) {
                await (retryContainer as any).msRequestFullscreen();
                retryContainer.focus();
              }
            } catch (error) {
              console.warn('[RemoteGame] Fullscreen blocked on retry:', error);
            }
          });
        }
      }, 200);
      return () => clearTimeout(retryTimer);
    }

    // Check if already in fullscreen
    const isAlreadyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    if (isAlreadyFullscreen) {
      autoFullscreenAttemptedRef.current = true;
      return; // Already in fullscreen
    }

    // Mark as attempted immediately
    autoFullscreenAttemptedRef.current = true;

    // Trigger fullscreen - using requestAnimationFrame to ensure we're in interaction context
    const timer = setTimeout(() => {
      requestAnimationFrame(async () => {
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
          console.warn('[RemoteGame] Auto-fullscreen not available:', error);
          // If fullscreen fails, reset the flag so we can try again when gameState arrives
          autoFullscreenAttemptedRef.current = false;
        }
      });
    }, 300); // Small delay to ensure DOM is fully ready

    return () => clearTimeout(timer);
  }, []); // Run once on mount - navigation is user-initiated

  // Backup: Also attempt fullscreen when game actually starts (if mount attempt failed)
  useEffect(() => {
    // Only trigger when game actually starts (serverGameState is available) and not game over
    if (!serverGameState || gameOver) return;

    // Mark game as started
    gameStartedRef.current = true;

    // If we haven't successfully entered fullscreen yet, try again
    const isInFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    if (!isInFullscreen && !autoFullscreenAttemptedRef.current) {
      autoFullscreenAttemptedRef.current = true;
      const container = gameContainerRef.current;
      if (container) {
        requestAnimationFrame(async () => {
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
            console.warn('[RemoteGame] Fullscreen backup attempt failed:', error);
          }
        });
      }
    }
  }, [serverGameState, gameOver]); // Trigger when game starts

  const handleAcceptRematch = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'rematch:accept' }));
      setRematchOffer(false);
      // Clear auto-redirect timer since user is interacting
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

  useEffect(() => {
    // Reset message handler attachment flag when socket changes
    messageHandlerAttachedRef.current = false;

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
            // Use functional update to prevent infinite loops
            setServerGameState(prev => {
              // Merge roomCode from message into payload (needed for paddle moves)
              const enrichedPayload = {
                ...message.payload,
                roomCode: message.roomCode ?? message.payload?.roomCode ?? roomCode,
                matchId: message.matchId ?? message.payload?.matchId
              };

              // Log receipt of gameState for debugging
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

              // Only update if the payload is actually different
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
            setRematchRequested(false); // Reset request status when offer received
            break;
          case 'rematch:declined':
            setRematchDeclinedMessage(t('game.opponentDeclinedRematch'));
            setRematchRequested(false); // Reset request status
            break;
          case 'rematch:start':
            // Clear auto-redirect timer since rematch is starting
            if (autoRedirectTimerRef.current) {
              clearTimeout(autoRedirectTimerRef.current);
              autoRedirectTimerRef.current = null;
            }
            // Reset flags so fullscreen can trigger again for rematch
            autoFullscreenAttemptedRef.current = false;
            gameStartedRef.current = false;
            // Use functional update to prevent infinite loops - include roomCode
            setServerGameState({
              ...message.payload,
              roomCode: message.roomCode ?? message.payload?.roomCode ?? roomCode,
              matchId: message.matchId ?? message.payload?.matchId
            });
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
              // Use functional update to prevent infinite loops
              setServerGameState(prev => {
                if (JSON.stringify(prev) === JSON.stringify(message.payload.finalGameState)) {
                  return prev;
                }
                return message.payload.finalGameState;
              });
            }
            // If opponent quit, clear any rematch states since they're no longer in the room
            if (message.payload.reason === 'opponentQuit') {
              setRematchOffer(false);
              setRematchRequested(false);
              setRematchDeclinedMessage('');
              setOpponentLeft(true);
              // Don't set auto-redirect timer for opponent quit - user should manually leave
            }
            break;
          case 'matchFound':
            // If we receive matchFound while on room page, reset state to trigger re-render
            if (message.payload.roomCode === roomCode) {
              // Use functional update to check if we need to update
              setServerGameState(prev => {
                // If already null, no need to update
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
              // Socket is now open, set up message handler (only if not already attached)
              if (!messageHandlerAttachedRef.current) {
                finalSocket.addEventListener('message', handleMessage);
                messageHandlerAttachedRef.current = true;
              }
            }
          }, 2000); // Wait 2 more seconds for connection

          return () => clearTimeout(connectTimeout);
        }

        // If socket is still not open, redirect
        if (!finalSocket || finalSocket.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection not available, redirecting to game home');
          router.push('/game');
        } else {
          // Socket is open, set up message handler (only if not already attached)
          if (!messageHandlerAttachedRef.current) {
            finalSocket.addEventListener('message', handleMessage);
            messageHandlerAttachedRef.current = true;
          }
        }
      }, 500); // Wait 500ms before checking

      return () => clearTimeout(timeoutId);
    }

    // If socket is connecting, wait for it to open
    if (activeSocket.readyState === WebSocket.CONNECTING) {
      const openHandler = () => {
        // Socket is now open, set up message handler (only if not already attached)
        if (!messageHandlerAttachedRef.current && activeSocket) {
          activeSocket.addEventListener('message', handleMessage);
          messageHandlerAttachedRef.current = true;
        }
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
        messageHandlerAttachedRef.current = false;
        clearTimeout(connectTimeout);
      };
    }

    // Socket is open, set up message handler (only if not already attached)
    if (!messageHandlerAttachedRef.current) {
      activeSocket.addEventListener('message', handleMessage);
      messageHandlerAttachedRef.current = true;

      // Request current game state when joining the room
      activeSocket.send(JSON.stringify({
        type: 'requestGameState',
        payload: { roomCode }
      }));
    }

    return () => {
      activeSocket?.removeEventListener('message', handleMessage);
      messageHandlerAttachedRef.current = false;
    };
  }, [socket, roomCode, router, t]); // Removed handleAcceptRematch and handleDeclineRematch from dependencies

  const leaveRoom = useCallback(() => {
    // Clear auto-redirect timer since user is leaving
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

  // Auto-redirect timer: After 1 minute of inactivity on game over screen, redirect to lobby
  useEffect(() => {
    // Only set timer if game is over and opponent didn't quit (they can still rematch)
    if (gameOver && gameOver.reason !== 'opponentQuit') {
      // Clear any existing timer first
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
      }

      // Set new timer for 60 seconds (1 minute)
      autoRedirectTimerRef.current = setTimeout(() => {
        console.log('[RemoteGameRoom] Auto-redirecting to lobby after 1 minute of inactivity');
        leaveRoom();
      }, 60000); // 60 seconds = 1 minute

      // Cleanup function
      return () => {
        if (autoRedirectTimerRef.current) {
          clearTimeout(autoRedirectTimerRef.current);
          autoRedirectTimerRef.current = null;
        }
      };
    } else {
      // If gameOver is cleared or opponent quit, clear any existing timer
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
                        // Clear auto-redirect timer since user is interacting
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
                      setRematchDeclinedMessage(''); // Clear any previous decline message
                      // Clear auto-redirect timer since user is interacting
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
            {/* Player Profile Images - Shown at top of game table */}
            {serverGameState && (player1Username || player2Username) && !isFullscreen && (
              <div className="w-full max-w-4xl mb-4 px-4">
                <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
                  {/* Player 1 */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <img
                        src={player1ProfileImg}
                        alt={player1Username || 'Player 1'}
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

                  {/* VS Separator */}
                  <div className="mx-4 sm:mx-6 flex-shrink-0">
                    <span className="text-yellow-400 font-bold text-lg sm:text-xl md:text-2xl">VS</span>
                  </div>

                  {/* Player 2 */}
                  <div className="flex items-center gap-3 flex-1 flex-row-reverse text-right">
                    <div className="relative">
                      <img
                        src={player2ProfileImg}
                        alt={player2Username || 'Player 2'}
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

            {/* Player Profile Images in Fullscreen - Minimal */}
            {serverGameState && (player1Username || player2Username) && isFullscreen && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={player1ProfileImg}
                      alt={player1Username || 'Player 1'}
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
                    <img
                      src={player2ProfileImg}
                      alt={player2Username || 'Player 2'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-red-400"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultProfileImg;
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Only render PingPongGame when game is NOT over to prevent "Connecting Game..." message */}
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
                    socket={socket || getWebSocket()}
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

            {/* Controls - Hidden in fullscreen */}
            {!isFullscreen && (
              <div className="w-full max-w-2xl mt-4 text-center space-y-4">
                {/* Controls Instructions */}
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
