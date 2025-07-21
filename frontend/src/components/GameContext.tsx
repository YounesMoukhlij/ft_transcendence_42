'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Player {
  name: string;
  avatar: string;
  color: string;
  id?: string;
}

export interface GameCustomisation {
  tableBg: string | null;
  ballColor: string | null;
  paddleColor: string | null;
}

export interface GameState {
  mode: 'ai' | 'local' | 'tournament' | null;
  players: Player[];
  customisation: GameCustomisation;
  roomCode?: string;
}

interface GameContextType {
  gameState: GameState;
  setGameMode: (mode: GameState['mode']) => void;
  setPlayers: (players: Player[]) => void;
  setCustomisation: (customisation: GameCustomisation) => void;
  setRoomCode: (roomCode: string) => void;
  resetGameState: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    mode: null,
    players: [],
    customisation: {
      tableBg: null,
      ballColor: null,
      paddleColor: null,
    },
  });

  const setGameMode = (mode: GameState['mode']) => {
    setGameState(prev => {
      const newState = { ...prev, mode };
      return newState;
    });
  };

  const setPlayers = (players: Player[]) => {
    setGameState(prev => ({ ...prev, players }));
  };

  const setCustomisation = (customisation: GameCustomisation) => {
    setGameState(prev => ({ ...prev, customisation }));
  };

  const setRoomCode = (roomCode: string) => {
    setGameState(prev => ({ ...prev, roomCode }));
  };

  const resetGameState = () => {
    setGameState({
      mode: null,
      players: [],
      customisation: {
        tableBg: null,
        ballColor: null,
        paddleColor: null,
      },
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameMode,
        setPlayers,
        setCustomisation,
        setRoomCode,
        resetGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
