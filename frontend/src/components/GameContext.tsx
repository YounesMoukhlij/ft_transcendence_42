'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Player {
  name: string;
  avatar: string;
  color: string;
  id?: string;
}

export interface TournamentMatch {
  id: number;
  round: number;
  player1?: Player;
  player2?: Player;
  winner?: Player;
  status: 'pending' | 'playing' | 'finished';
}

export interface Tournament {
  type: 'local' | 'remote';
  playerCount: 4;
  status: 'setup' | 'playing' | 'finished';
  currentMatch: number;
  bracket: TournamentMatch[];
}

export interface GameCustomisation {
  tableBg: string | null;
  ballColor: string | null;
  paddleColor: string | null;
  aiDifficulty?: 'easy' | 'medium' | 'hard' | null;
}

export interface GameState {
  mode: 'ai' | 'local' | 'tournament' | 'remote' | 'tic-tac-toe' | null;
  players: Player[];
  customisation: GameCustomisation;
  roomCode?: string;
  isHost?: boolean;
  gameRoom?: { id: string };
  tournament?: Tournament;
}

interface GameContextType {
  gameState: GameState;
  setGameMode: (mode: GameState['mode']) => void;
  setPlayers: (players: Player[]) => void;
  setCustomisation: (customisation: GameCustomisation) => void;
  setRoomCode: (roomCode: string) => void;
  resetGameState: () => void;
  setTournament: (tournament: Tournament) => void;
  updateTournamentMatch: (matchId: number, updates: Partial<TournamentMatch>) => void;
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
      aiDifficulty: null,
    },
    tournament: undefined,
  });

  const setGameMode = useCallback((mode: GameState['mode']) => {
    setGameState(prev => {
      const newState = { ...prev, mode };
      return newState;
    });
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    setGameState(prev => ({ ...prev, players }));
  }, []);

  const setCustomisation = useCallback((customisation: GameCustomisation) => {
    setGameState(prev => ({ ...prev, customisation }));
  }, []);

  const setRoomCode = useCallback((roomCode: string) => {
    setGameState(prev => ({ ...prev, roomCode }));
  }, []);

  const resetGameState = useCallback(() => {
    setGameState({
      mode: null,
      players: [],
      customisation: {
        tableBg: null,
        ballColor: null,
        paddleColor: null,
        aiDifficulty: null,
      },
      tournament: undefined,
    });
  }, []);

  const setTournament = useCallback((tournament: Tournament) => {
    setGameState(prev => ({ ...prev, tournament }));
  }, []);

  const updateTournamentMatch = useCallback((matchId: number, updates: Partial<TournamentMatch>) => {
    setGameState(prev => {
      if (!prev.tournament) return prev;
      const newBracket = prev.tournament.bracket.map(match => {
        if (match.id === matchId) {
          return { ...match, ...updates };
        }
        return match;
      });
      return {
        ...prev,
        tournament: {
          ...prev.tournament,
          bracket: newBracket,
        },
      };
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameMode,
        setPlayers,
        setCustomisation,
        setRoomCode,
        resetGameState,
        setTournament,
        updateTournamentMatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
