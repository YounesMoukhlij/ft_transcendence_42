'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext, Player, TournamentMatch } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';
import { FaUser, FaUpload, FaCrown, FaTrophy, FaGamepad, FaCheck, FaTimes } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';
import { ServerGameState } from '@/types/game';
import LocalTournamentManager from '@/components/LocalTournamentManager';
import LocalTournamentBracket from '@/components/LocalTournamentBracket';
import LocalTournamentAnimations from '@/components/LocalTournamentAnimations';
import LocalTournamentPlayerRegistration from '@/components/LocalTournamentPlayerRegistration';
import LocalTournamentGameOverlay from '@/components/LocalTournamentGameOverlay';

const defaultAvatars = [
  'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/HeathJoker.png/250px-HeathJoker.png',
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];

type TournamentStep = 'setup' | 'registration' | 'customization' | 'bracket' | 'playing' | 'completed';

export default function LocalTournamentPage() {
  const { t } = useTranslation();
  const { gameState, setGameMode } = useGameContext();
  const { user } = useUserStore();
  const router = useRouter();

  // Tournament state
  const [tournamentStep, setTournamentStep] = useState<TournamentStep>('setup');
  const [playerCount] = useState<4>(4); // Local tournaments only support 4 players
  const [registeredPlayers, setRegisteredPlayers] = useState<Player[]>([]);
  const [tempPlayers, setTempPlayers] = useState<Player[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matchWinner, setMatchWinner] = useState<Player | null>(null);
  const [showMatchCompletionModal, setShowMatchCompletionModal] = useState(false);
  const [showTournamentWinnerMessage, setShowTournamentWinnerMessage] = useState(false);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [serverGameState, setServerGameState] = useState<ServerGameState | null>(null);
  const [gameScores, setGameScores] = useState({ player1: 0, player2: 0 });
  const [customization, setCustomization] = useState({
    ballColor: '#ffffff',
    paddleColor: '#ffffff',
    backgroundColor: '#000000',
    ballSpeed: 1,
    paddleSize: 1,
  });

  // Initialize game mode
  useEffect(() => {
    document.title = t('game.localTournament');
    setGameMode('local');
  }, [t, setGameMode]);

  // Initialize players for 4-player tournament
  useEffect(() => {
    if (tournamentStep === 'setup' || tournamentStep === 'registration') {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
      const newTempPlayers: Player[] = Array.from({ length: 4 }, (_, i) => ({
        id: `player-${i + 1}`,
        name: i === 0 ? (user?.username || t('game.player') + ' 1') : '',
        avatar: defaultAvatars[i % defaultAvatars.length],
        color: colors[i % colors.length],
      }));
      setTempPlayers(newTempPlayers);
    }
  }, [tournamentStep, user?.username, t]);

  // Tournament manager handles bracket logic - only create when we have 4 registered players
  const tournamentManager = useMemo(() => {
    if (registeredPlayers.length !== 4) {
      return null;
    }
    return new LocalTournamentManager(registeredPlayers);
  }, [registeredPlayers]);

  const bracket = useMemo(() => {
    if (!tournamentManager) return [];
    return tournamentManager.getBracket();
  }, [tournamentManager]);

  const currentMatch = useMemo(() => {
    if (bracket.length === 0 || currentMatchIndex >= bracket.length) return null;
    return bracket[currentMatchIndex];
  }, [bracket, currentMatchIndex]);

  // Handle player registration completion
  const handleRegistrationComplete = useCallback(() => {
    setRegisteredPlayers([...tempPlayers]);
    setTournamentStep('customization');
  }, [tempPlayers]);

  // Handle customization complete
  const handleCustomizationComplete = useCallback((customizationData: any) => {
    setCustomization(customizationData);
    setTournamentStep('bracket');
  }, []);

  // Handle match completion - called from PingPongGame
  const handleMatchComplete = useCallback((winner: Player) => {
    if (!currentMatch || !winner || !tournamentManager) return;

    setMatchWinner(winner);
    setIsMatchActive(false);
    setShowMatchCompletionModal(true);

    // Update bracket with winner
    tournamentManager.setMatchWinner(currentMatch.id, winner);
  }, [currentMatch, tournamentManager]);

  // Handle continue after match
  const handleContinueAfterMatch = useCallback(() => {
    if (!tournamentManager) return;

    setShowMatchCompletionModal(false);
    setMatchWinner(null);
    // Reset game scores for next match
    setGameScores({ player1: 0, player2: 0 });

    // Check if tournament is complete
    const champion = tournamentManager.getChampion();
    if (champion) {
      setShowTournamentWinnerMessage(true);
      setTournamentStep('completed');
    } else {
      // Move to next match
      const nextMatchIndex = tournamentManager.getNextMatchIndex(currentMatchIndex);
      if (nextMatchIndex !== -1) {
        setCurrentMatchIndex(nextMatchIndex);
        setTournamentStep('bracket');
      }
    }
  }, [currentMatchIndex, tournamentManager]);

  // Start current match
  const handleStartMatch = useCallback(() => {
    if (!currentMatch || !tournamentManager) return;
    setIsMatchActive(true);
    setTournamentStep('playing');
    // Update match status to 'playing' in the tournament manager
    const match = tournamentManager.getBracket().find(m => m.id === currentMatch.id);
    if (match && match.status === 'pending') {
      match.status = 'playing';
    }
  }, [currentMatch, tournamentManager]);


  // Handle game state updates
  useEffect(() => {
    if (gameState && tournamentStep === 'playing') {
      // Convert gameState to ServerGameState format if needed
      setServerGameState(gameState as any);
    }
  }, [gameState, tournamentStep]);

  // Render based on tournament step
  const renderContent = () => {
    switch (tournamentStep) {
      case 'setup':
        return (
          <div className="w-full max-w-4xl mx-auto h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-3xl shadow-2xl border-2 border-blue-500 p-8 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
                {t('game.localTournament')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('game.allPlayersSameDevice')}
              </p>
            </div>
            <div className="space-y-6 w-full max-w-md">
              <div className="bg-gray-800 rounded-xl p-6 border-2 border-blue-400">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {t('game.playersLabel')}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {t('game.semiFinalsFinal')}
                  </p>
                </div>
                <button
                  onClick={() => setTournamentStep('registration')}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {t('game.startTournament')}
                </button>
              </div>
            </div>
          </div>
        );

      case 'registration':
        return (
          <LocalTournamentPlayerRegistration
            tempPlayers={tempPlayers}
            defaultAvatars={defaultAvatars}
            playerCount={playerCount}
            updatePlayer={(index, field, value) => {
              const updated = [...tempPlayers];
              updated[index] = { ...updated[index], [field]: value };
              setTempPlayers(updated);
            }}
            onComplete={handleRegistrationComplete}
            onBack={() => setTournamentStep('setup')}
          />
        );

      case 'customization':
        return (
          <div className="w-full max-w-6xl mx-auto h-full">
            <GameCustomization
              onStartGame={(customization) => {
                const customData = {
                  ballColor: customization.ballColor,
                  paddleColor: customization.paddleColor,
                  backgroundColor: customization.tableBg || '#000000',
                  ballSpeed: 1,
                  paddleSize: 1,
                };
                handleCustomizationComplete(customData);
              }}
              onBack={() => setTournamentStep('registration')}
            />
          </div>
        );

      case 'bracket':
        if (!tournamentManager || bracket.length === 0) {
          return (
            <div className="w-full max-w-4xl mx-auto h-full bg-gray-900 bg-opacity-90 rounded-3xl shadow-2xl border-2 border-blue-500 p-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-xl mb-4">{t('game.loadingBracket')}</p>
              </div>
            </div>
          );
        }
        return (
          <LocalTournamentBracket
            bracket={bracket}
            currentMatchIndex={currentMatchIndex}
            onStartMatch={handleStartMatch}
            onBack={() => router.push('/game')}
          />
        );

      case 'playing':
        return (
          <div className="flex flex-col items-center justify-center w-full min-h-full p-4 bg-transparent transition-all duration-300">
            {currentMatch && currentMatch.player1 && currentMatch.player2 && (
              <>
                {/* Player Profile Images - Shown at top of game table */}
                <LocalTournamentGameOverlay
                  player1={currentMatch.player1}
                  player2={currentMatch.player2}
                  score1={gameScores.player1}
                  score2={gameScores.player2}
                  isFullscreen={false}
                />

                {/* Game Container */}
                <div className="w-full flex flex-col items-center max-w-4xl">
                  <div className="w-full">
                    <PingPongGame
                      tournamentMode={true}
                      tournamentPlayers={[
                        {
                          ...currentMatch.player1,
                          id: currentMatch.player1.id || `player-1`,
                          id_user: typeof currentMatch.player1.id_user === 'number' ? currentMatch.player1.id_user : undefined
                        },
                        {
                          ...currentMatch.player2,
                          id: currentMatch.player2.id || `player-2`,
                          id_user: typeof currentMatch.player2.id_user === 'number' ? currentMatch.player2.id_user : undefined
                        }
                      ] as any}
                      onScoreUpdate={(scores) => setGameScores(scores)}
                      onTournamentMatchEnd={(winner) => {
                        // Convert winner back to GameContext Player format
                        const gameContextWinner: Player = {
                          ...winner,
                          color: winner.color || '#ffffff'
                        };
                        handleMatchComplete(gameContextWinner);
                      }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full max-w-2xl mt-4 text-center space-y-4">
                  {/* Controls Instructions */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <p className="text-white text-sm md:text-base mb-2">
                      <span className="font-semibold">{t('game.controls')}</span> {t('game.useWASDOrArrows')}
                    </p>
                    <p className="text-gray-400 text-xs md:text-sm mb-2">
                      {t('game.firstTo10PointsWins')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'completed':
        if (!tournamentManager) {
          return (
            <div className="w-full max-w-4xl mx-auto h-full bg-gray-900 bg-opacity-90 rounded-3xl shadow-2xl border-2 border-blue-500 p-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-xl mb-4">{t('game.loadingResults')}</p>
              </div>
            </div>
          );
        }
        return (
          <LocalTournamentAnimations
            champion={tournamentManager.getChampion()}
            onRestart={() => {
              setTournamentStep('setup');
              setCurrentMatchIndex(0);
              setRegisteredPlayers([]);
              setTempPlayers([]);
              setMatchWinner(null);
              setShowTournamentWinnerMessage(false);
            }}
            onBack={() => router.push('/game')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {renderContent()}

      {/* Match Completion Modal */}
      {showMatchCompletionModal && matchWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-3xl p-8 border-2 border-blue-500 max-w-md w-full mx-4">
            <div className="text-center">
              <FaTrophy className="text-yellow-400 text-6xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {t('game.matchWinner')}
              </h2>
              <p className="text-2xl text-blue-300 mb-6">
                {matchWinner.name}
              </p>
              <button
                onClick={handleContinueAfterMatch}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold transition-all"
              >
                {tournamentManager?.getChampion() ? t('game.viewResults') : t('game.nextMatch')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Winner Animation */}
      {showTournamentWinnerMessage && tournamentManager && (
        <LocalTournamentAnimations
          champion={tournamentManager.getChampion()}
          onRestart={() => {
            setTournamentStep('setup');
            setCurrentMatchIndex(0);
            setRegisteredPlayers([]);
            setTempPlayers([]);
            setMatchWinner(null);
            setShowTournamentWinnerMessage(false);
          }}
          onBack={() => router.push('/game')}
        />
      )}
    </div>
  );
}

