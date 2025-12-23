'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext, Player, TournamentMatch } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';
import { FaUser, FaUpload, FaCrown, FaTrophy, FaGamepad, FaCheck, FaTimes } from 'react-icons/fa';
import { IoExpand, IoContract } from 'react-icons/io5';
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
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Start current match and enter fullscreen
  const handleStartMatch = useCallback(() => {
    if (!currentMatch) return;
    setIsMatchActive(true);
    setTournamentStep('playing');

    // Auto-enter fullscreen when match starts
    setTimeout(() => {
      if (gameContainerRef.current && !document.fullscreenElement) {
        gameContainerRef.current.requestFullscreen().catch((err) => {
          console.log('Fullscreen request failed:', err);
        });
      }
    }, 100);
  }, [currentMatch]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!gameContainerRef.current) return;

    try {
      const container = gameContainerRef.current;
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (isCurrentlyFullscreen) {
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

  // Handle fullscreen change
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

  // Keyboard shortcut for fullscreen (F key) - only during playing
  useEffect(() => {
    // Only add keyboard listener when in playing mode
    if (tournamentStep !== 'playing') return;

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
  }, [toggleFullscreen, tournamentStep]);

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
          <div
            ref={gameContainerRef}
            tabIndex={-1}
            className={`flex flex-col items-center justify-center w-full transition-all duration-300 focus:outline-none ${
              isFullscreen
                ? 'h-screen bg-black p-4'
                : 'min-h-full p-4 bg-transparent'
            }`}
          >
            {currentMatch && currentMatch.player1 && currentMatch.player2 && (
              <>
                {/* Player Profile Images - Shown at top of game table (matches remote 1v1 style) */}
                {!isFullscreen && (
                  <LocalTournamentGameOverlay
                    player1={currentMatch.player1}
                    player2={currentMatch.player2}
                    score1={gameScores.player1}
                    score2={gameScores.player2}
                    isFullscreen={false}
                  />
                )}

                {/* Player Profile Images in Fullscreen - Minimal (matches remote 1v1 style) */}
                {isFullscreen && (
                  <LocalTournamentGameOverlay
                    player1={currentMatch.player1}
                    player2={currentMatch.player2}
                    score1={gameScores.player1}
                    score2={gameScores.player2}
                    isFullscreen={true}
                  />
                )}

                {/* Game Container */}
                <div className={`w-full flex flex-col items-center ${isFullscreen ? 'h-full justify-center' : 'max-w-4xl'}`}>
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

                {/* Controls - Hidden in fullscreen (matches remote 1v1 style) */}
                {!isFullscreen && (
                  <div className="w-full max-w-2xl mt-4 text-center space-y-4">
                    {/* Controls Instructions */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <p className="text-white text-sm md:text-base mb-2">
                        <span className="font-semibold">{t('game.controls')}</span> {t('game.useWASDOrArrows')}
                      </p>
                      <p className="text-gray-400 text-xs md:text-sm mb-2">
                        {t('game.firstTo10PointsWins')}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {t('game.pressFForFullscreen')}
                      </p>
                    </div>

                    {/* Fullscreen Toggle Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
                      aria-label={isFullscreen ? t('game.exitFullscreen') : t('game.fullscreen')}
                    >
                      {isFullscreen ? (
                        <>
                          <IoContract className="w-5 h-5" />
                          <span>{t('game.exitFullscreen') || 'Exit Fullscreen'}</span>
                        </>
                      ) : (
                        <>
                          <IoExpand className="w-5 h-5" />
                          <span>{t('game.fullscreen') || 'Fullscreen'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
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

