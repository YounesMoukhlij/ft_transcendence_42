'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';

export default function CustomizePage() {
  const router = useRouter();
  const { gameState, setCustomisation } = useGameContext();
  const [isSearching, setIsSearching] = useState(false);
  const { user, _hasHydrated, socket } = useUserStore();

  // Set page title based on game mode
  useEffect(() => {
    const title =
      gameState.mode === 'ai'
        ? 'AI Game Customization'
        : gameState.mode === 'local'
        ? 'Local Game Customization'
        : gameState.mode === 'tournament'
        ? 'Online Game Customization'
        : gameState.mode === 'remote'
        ? 'Remote Game Customization'
        : 'Game Customization';
    document.title = title;
  }, [gameState.mode]);

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
            router.push(`/game/remote/${roomCode}`);
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

  useEffect(() => {
    if (gameState.mode === 'remote') {
      // Wait for the store to be hydrated
      if (_hasHydrated) {
        // If hydration is complete and there is still no user, redirect to login
        if (!user) {
          alert('You must be logged in to play a remote game.');
          router.push('/signIn');
        }
      }
    }
  }, [_hasHydrated, user, router, gameState.mode]);

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
      if (!user) {
        alert('No user found. Please log in again.');
        router.push('/signIn');
        return;
      }
      if (!socket) {
        alert('Socket not connected. Please try again.');
        return;
      }
      setCustomisation(customization);
      const message = {
        type: 'findMatch',
        payload: {
          customization,
          username: user.username,
        },
      };
      socket.send(JSON.stringify(message));
      setIsSearching(true);
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
    if (!_hasHydrated) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          <h1 className="text-2xl font-bold mt-8">Loading User Data...</h1>
        </div>
      );
    }

    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          <h1 className="text-2xl font-bold mt-8">Searching for an opponent...</h1>
          <p className="text-lg mt-2">Please wait while we find a match for you.</p>
        </div>
      );
    }
  }

  return (
    <div className="h-full w-full  flex items-center justify-center p-4">
      <GameCustomization onBack={handleBack} onStartGame={handleStartGame} />
    </div>
  );
}
