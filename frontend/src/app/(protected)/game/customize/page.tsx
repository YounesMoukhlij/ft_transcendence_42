'use client';

import React, { useState, useEffect } from 'react';
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
            setIsSearching(false);
            router.push(`/game/remote/${roomCode}`);
          } else if (message.type === 'waitingForOpponent') {
            console.log('[CustomizePage] Waiting for opponent to finish customization...');
            setIsSearching(true);
            setError('');
          } else if (message.type === 'error') {
            console.error('[CustomizePage] Error from server:', message.message);
            setError(message.message || 'An error occurred');
            setIsSearching(false);
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

      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          <h1 className="text-2xl font-bold mt-8">
            {isFriendChallenge ? t('game.waitingForFriend') : t('game.searchingForOpponent')}
          </h1>
          <p className="text-lg mt-2">
            {isFriendChallenge
              ? t('game.friendCustomizing')
              : t('game.pleaseWaitForMatch')}
          </p>
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
