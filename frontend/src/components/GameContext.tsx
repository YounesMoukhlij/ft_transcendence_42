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
  mode: 'ai' | 'local' | 'tournament' | 'remote' | null;
  players: Player[];
  customisation: GameCustomisation;
  roomCode?: string;
  isHost?: boolean;
  gameRoom?: {
    id: string;
    status: 'waiting' | 'playing' | 'finished';
    playerId: string;
  };
  tournament?: {
    type: 'local' | 'remote';
    playerCount: 4 | 8;
    status: 'setup' | 'registration' | 'playing' | 'finished';
    currentMatch: number;
    bracket: TournamentMatch[];
    winner?: Player;
  };
}

export interface TournamentMatch {
  id: number;
  round: number;
  player1?: Player;
  player2?: Player;
  winner?: Player;
  status: 'pending' | 'playing' | 'finished';
}

interface GameContextType {
  gameState: GameState;
  setGameMode: (mode: GameState['mode']) => void;
  setPlayers: (players: Player[]) => void;
  setCustomisation: (customisation: GameCustomisation) => void;
  setRoomCode: (roomCode: string) => void;
  setGameRoom: (room: GameState['gameRoom']) => void;
  setIsHost: (isHost: boolean) => void;
  setTournament: (tournament: GameState['tournament']) => void;
  updateTournamentMatch: (matchId: number, updates: Partial<TournamentMatch>) => void;
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

  const setGameRoom = (gameRoom: GameState['gameRoom']) => {
    setGameState(prev => ({ ...prev, gameRoom }));
  };

  const setIsHost = (isHost: boolean) => {
    setGameState(prev => ({ ...prev, isHost }));
  };

  const setTournament = (tournament: GameState['tournament']) => {
    setGameState(prev => ({ ...prev, tournament }));
  };

  const updateTournamentMatch = (matchId: number, updates: Partial<TournamentMatch>) => {
    setGameState(prev => ({
      ...prev,
      tournament: prev.tournament ? {
        ...prev.tournament,
        bracket: prev.tournament.bracket.map(match =>
          match.id === matchId ? { ...match, ...updates } : match
        )
      } : prev.tournament
    }));
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
        setGameRoom,
        setIsHost,
        setTournament,
        updateTournamentMatch,
        resetGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
