'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/contexts/LanguageContext';

export default function CustomizePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { gameState, setCustomisation } = useGameContext();
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const { user, _hasHydrated, socket, isConnect: storeIsConnected, connect, initConnection } = useUserStore();
  const [socketConnected, setSocketConnected] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(120); // 2 minutes in seconds

  // Ensure socket is connected for remote mode
  useEffect(() => {
    if (gameState.mode === 'remote' && _hasHydrated) {
      console.log('Remote mode - checking socket connection:', {
        hasSocket: !!socket,
        socketState: socket ? socket.readyState : 'no socket',
        storeIsConnected
      });

      // Try to initialize connection if not already connected
      if (!socket) {
        console.log('No socket found, initializing connection...');
        initConnection();
        // Give it a moment to create the socket
        setTimeout(() => {
          const newSocket = useUserStore.getState().socket;
          if (newSocket) {
            console.log('Socket created, state:', newSocket.readyState);
          } else {
            console.warn('Socket still not created after initConnection');
          }
        }, 100);
      } else if (socket.readyState !== WebSocket.OPEN && !storeIsConnected) {
        // If socket exists but not open, check why
        console.log('Socket exists but not open:', {
          readyState: socket.readyState,
          readyStateName: socket.readyState === WebSocket.CONNECTING ? 'CONNECTING' :
                         socket.readyState === WebSocket.OPEN ? 'OPEN' :
                         socket.readyState === WebSocket.CLOSING ? 'CLOSING' :
                         socket.readyState === WebSocket.CLOSED ? 'CLOSED' : 'UNKNOWN'
        });

        // If closed, try to reconnect
        if (socket.readyState === WebSocket.CLOSED) {
          console.log('Socket is closed, attempting to reconnect...');
          connect();
        }
      } else if (socket.readyState === WebSocket.OPEN || storeIsConnected) {
        // Socket is already connected
        console.log('Socket is already connected');
        setSocketConnected(true);
      }
    }
  }, [gameState.mode, _hasHydrated, socket, storeIsConnected, connect, initConnection]);

  // Monitor socket connection status
  useEffect(() => {
    if (!socket) {
      setSocketConnected(false);
      // If no socket exists but we're in remote mode and hydrated, try to create one
      if (gameState.mode === 'remote' && _hasHydrated) {
        console.log('No socket in monitor, attempting to initialize...');
        initConnection();
      }
      return;
    }

    // Check initial state
    const checkConnection = () => {
      const isOpen = socket.readyState === WebSocket.OPEN;
      const isConnecting = socket.readyState === WebSocket.CONNECTING;
      const connected = isOpen || storeIsConnected;

      console.log('Checking socket connection:', {
        readyState: socket.readyState,
        readyStateName: socket.readyState === WebSocket.CONNECTING ? 'CONNECTING' :
                       socket.readyState === WebSocket.OPEN ? 'OPEN' :
                       socket.readyState === WebSocket.CLOSING ? 'CLOSING' :
                       socket.readyState === WebSocket.CLOSED ? 'CLOSED' : 'UNKNOWN',
        isOpen,
        isConnecting,
        storeIsConnected,
        connected
      });

      // Set connected if socket is open OR store says it's connected
      // Don't set to false if it's still connecting
      if (connected) {
        setSocketConnected(true);
      } else if (!isConnecting) {
        // Only set to false if it's not connecting (i.e., closed or error)
        setSocketConnected(false);
      }
    };

    checkConnection();

    // Listen for connection events
    const handleOpen = () => {
      console.log('Socket opened in customize page');
      setSocketConnected(true);
    };

    const handleClose = () => {
      console.log('Socket closed in customize page');
      setSocketConnected(false);
    };

    const handleError = (error: Event) => {
      console.error('Socket error in customize page:', error);
      setSocketConnected(false);

      // Try to reconnect after error
      setTimeout(() => {
        if (gameState.mode === 'remote') {
          console.log('Attempting to reconnect after error...');
          const { socket: currentSocket } = useUserStore.getState();
          if (!currentSocket || currentSocket.readyState === WebSocket.CLOSED) {
            connect();
          }
        }
      }, 2000);
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('close', handleClose);
    socket.addEventListener('error', handleError);

    // Also check periodically in case events are missed
    const interval = setInterval(checkConnection, 500);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('close', handleClose);
      socket.removeEventListener('error', handleError);
      clearInterval(interval);
    };
  }, [socket, storeIsConnected]);

  // Set page title based on game mode
  useEffect(() => {
    const title =
      gameState.mode === 'ai'
        ? t('game.aiGameCustomization')
        : gameState.mode === 'local'
        ? t('game.localGameCustomization')
        : gameState.mode === 'tournament'
        ? t('game.onlineGameCustomization')
        : gameState.mode === 'remote'
        ? t('game.remoteGameCustomization')
        : t('game.gameCustomization');
    document.title = title;
  }, [gameState.mode, t]);

  useEffect(() => {
    if (!gameState.mode) {
      router.push('/game');
    }
  }, [gameState.mode, router]);

  // Cancel search handler
  const handleCancelSearchRef = useRef<(() => void) | null>(null);

  const handleCancelSearch = useCallback(() => {
    // Clear timeouts
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Send cancel message to server if socket is open
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'cancelSearch' }));
    }

    setIsSearching(false);
    setTimeRemaining(120);
    setError('');
  }, [socket]);

  // Update ref when handler changes
  handleCancelSearchRef.current = handleCancelSearch;

  useEffect(() => {
    if (gameState.mode === 'remote') {
      if (!socket) return;

      const handleMessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'matchFound') {
            const { roomCode } = message.payload;
            console.log('[CustomizePage] Match found! Room code:', roomCode);
            // Clear any pending challenge
            if (typeof window !== 'undefined') {
              localStorage.removeItem('pendingChallengeId');
            }
            // Clear timeout
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
              searchTimeoutRef.current = null;
            }
            setIsSearching(false);
            setTimeRemaining(120);
            router.push(`/game/remote/${roomCode}`);
          } else if (message.type === 'waitingForOpponent') {
            console.log('[CustomizePage] Waiting for opponent to finish customization...');
            setIsSearching(true);
            setError('');
          } else if (message.type === 'searchCancelled') {
            console.log('[CustomizePage] Search cancelled successfully');
            setIsSearching(false);
            setTimeRemaining(120);
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
              searchTimeoutRef.current = null;
            }
          } else if (message.type === 'error') {
            const errorMessage = message.message || t('game.anErrorOccurred');

            // Handle "Already in a game" error by leaving the current game
            if (errorMessage.toLowerCase().includes('already in a game') ||
                errorMessage.toLowerCase().includes('already in game')) {
              // Log as info since we're handling it gracefully (only in development)
              if (process.env.NODE_ENV === 'development') {
                console.log('[CustomizePage] User is already in a game, attempting to leave...');
              }

              // Try to leave the current game room
              if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                  type: 'cancelMatchmaking'
                }));

                // Also try to leave room if we have a roomCode
                if (gameState.roomCode) {
                  socket.send(JSON.stringify({
                    type: 'leaveRoom',
                    payload: { roomCode: gameState.roomCode }
                  }));
                }

                // Set a friendlier error message
                setError(t('game.leftPreviousGame') || 'Left previous game. Please try again.');

                // Clear game state
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('pendingChallengeId');
                }

                // Clear search state after a short delay so user can retry
                setTimeout(() => {
                  setError('');
                }, 3000);
              } else {
                setError(errorMessage);
              }
            } else {
              // For other errors, log them (only in development) and show to user
              if (process.env.NODE_ENV === 'development') {
                console.error('[CustomizePage] Error from server:', errorMessage);
              }
              setError(errorMessage);
            }

            setIsSearching(false);
            setTimeRemaining(120);
            // Clear timeout
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
              searchTimeoutRef.current = null;
            }
            // Clear challengeId on error so user can try again
            if (typeof window !== 'undefined') {
              localStorage.removeItem('pendingChallengeId');
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.addEventListener('message', handleMessage);

      return () => {
        socket.removeEventListener('message', handleMessage);
      };
    }
  }, [socket, router, gameState.mode]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Removed aggressive redirect check - we'll check in handleStartGame instead
  // This prevents false redirects when user is actually logged in but store hasn't fully hydrated

  if (!gameState.mode) {
    return null;
  }

  const handleBack = () => {
    if (gameState.mode === 'local' || gameState.mode === 'tournament') {
      router.push('/game/versus-selection');
    } else if (gameState.mode === 'remote') {
      router.back();
    } else {
      router.push('/game');
    }
  };

  const handleStartGame = (customization: any) => {
    if (gameState.mode === 'remote') {
      // Get user from state or localStorage
      let currentUser = user;

      // If user is not in state, try to get from localStorage
      if (!currentUser && typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('user-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            currentUser = parsed?.state?.user || null;

            // If we found user in localStorage, update the store
            if (currentUser) {
              const { setUser } = useUserStore.getState();
              setUser(currentUser);
            }
          }
        } catch (error) {
          console.error('Error reading user from localStorage:', error);
        }
      }

      // Check if we have a valid user with username
      if (!currentUser || !currentUser.username) {
        alert(t('game.mustBeLoggedIn'));
        router.push('/signIn');
        return;
      }

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        alert(t('game.websocketNotConnected'));
        return;
      }

      setCustomisation(customization);

      // Check if there's a pending accepted challenge
      const challengeId = typeof window !== 'undefined' ? localStorage.getItem('pendingChallengeId') : null;

      if (challengeId) {
        console.log('[CustomizePage] Sending findMatch with challengeId:', challengeId);
      } else {
        console.log('[CustomizePage] Sending findMatch for random matchmaking');
      }

      const message = {
        type: 'findMatch',
        payload: {
          customization,
          username: currentUser.username,
          ...(challengeId && { challengeId }) // Include challengeId if exists
        },
      };
      socket.send(JSON.stringify(message));
      setIsSearching(true);
      setTimeRemaining(120); // Reset to 2 minutes

      // Set up 2-minute timeout for random matchmaking (not for friend challenges)
      if (!challengeId) {
        // Clear any existing timeouts
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Start countdown timer
        countdownIntervalRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              // Timeout reached - cancel search and show error
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              handleCancelSearchRef.current?.();
              setError(t('game.searchTimeoutMessage'));
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Set main timeout to cancel after 2 minutes
        searchTimeoutRef.current = setTimeout(() => {
          handleCancelSearchRef.current?.();
          setError(t('game.searchTimeoutMessage'));
        }, 120000); // 2 minutes
      }

      // Don't clear challengeId immediately - wait until match is found
      // It will be cleared when matchFound is received
    } else if (gameState.mode === 'ai') {
        setCustomisation(customization);
        router.push('/game/ai');
    } else if (gameState.mode === 'local') {
        setCustomisation(customization);
        router.push('/game/local');
    } else if (gameState.mode === 'tournament') {
        setCustomisation(customization);
        router.push('/game/tournament');
    } else {
      router.push('/game/play');
    }
  };

  if (gameState.mode === 'remote') {
    // Only show loading if store hasn't hydrated AND we don't have user in localStorage
    if (!_hasHydrated) {
      // Check if user exists in localStorage as fallback
      let hasStoredUser = false;
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('user-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            hasStoredUser = !!(parsed?.state?.user?.username || parsed?.state?.user?.id_user);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // If we have stored user, don't show loading - proceed with customization
      if (!hasStoredUser) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            <h1 className="text-2xl font-bold mt-8">{t('game.loadingUserData')}</h1>
          </div>
        );
      }
    }

    if (isSearching) {
      // Check if this is a friend challenge or random matchmaking
      const challengeId = typeof window !== 'undefined' ? localStorage.getItem('pendingChallengeId') : null;
      const isFriendChallenge = !!challengeId;

      // Format time remaining (MM:SS)
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      return (
        <div className="flex flex-col items-center justify-center h-full  text-white p-4">
          <div className="max-w-md w-full">
            {/* Loading Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-24 w-24 md:h-32 md:w-32 border-4 border-transparent border-t-purple-500 border-r-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg md:text-xl">
                      {!isFriendChallenge && formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isFriendChallenge ? t('game.waitingForFriend') : t('game.searchingForOpponent')}
              </h1>
              <p className="text-gray-400 text-base md:text-lg">
                {isFriendChallenge
                  ? t('game.friendCustomizing')
                  : t('game.pleaseWaitForMatch')}
              </p>
              {!isFriendChallenge && (
                <p className="text-yellow-400 text-sm mt-2">
                  {t('game.searchTimeoutWarning', { time: formatTime(timeRemaining) })}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Cancel Button - Only show for random matchmaking */}
            {!isFriendChallenge && (
              <div className="flex justify-center">
                <button
                  onClick={handleCancelSearch}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>{t('game.cancelSearch')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="h-full w-full  flex items-center justify-center p-4">
      <GameCustomization onBack={handleBack} onStartGame={handleStartGame} isSocketConnected={socketConnected} />
    </div>
  );
}
