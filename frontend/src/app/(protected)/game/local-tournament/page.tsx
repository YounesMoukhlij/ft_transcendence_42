'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext, Player as GamePlayer } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';
import { FaTrophy } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';
import type { Player as GameTypePlayer, ServerGameState } from '@/types/game';
import LocalTournamentManager from '@/components/LocalTournamentManager';
import LocalTournamentBracket from '@/components/LocalTournamentBracket';
import LocalTournamentAnimations from '@/components/LocalTournamentAnimations';
import LocalTournamentPlayerRegistration from '@/components/LocalTournamentPlayerRegistration';
import LocalTournamentGameOverlay from '@/components/LocalTournamentGameOverlay';

// Generate modern, attractive avatar SVGs with gradients and patterns
const generateModernAvatarSVG = (primaryColor: string, secondaryColor: string, pattern: string): string => {
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
      </linearGradient>
      <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        ${pattern}
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#grad)" stroke="#ffffff" stroke-width="2"/>
    <circle cx="50" cy="50" r="45" fill="url(#pattern)" opacity="0.3"/>
  </svg>`;

  // Use a proper UTF-8 to base64 conversion that works with Unicode
  try {
    // For browser environment, use btoa with proper encoding
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  } catch (e) {
    // Fallback for environments where btoa/unescape isn't available
    return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
  }
};

// Modern avatar patterns - simplified and more reliable
const avatarPatterns = [
  // Player 2: Blue gradient with simple dots
  generateModernAvatarSVG('#3B82F6', '#1D4ED8',
    '<circle cx="15" cy="15" r="3" fill="white" opacity="0.8"/><circle cx="35" cy="35" r="3" fill="white" opacity="0.8"/><circle cx="15" cy="35" r="2" fill="white" opacity="0.6"/>'),

  // Player 3: Green gradient with diagonal lines
  generateModernAvatarSVG('#10B981', '#059669',
    '<line x1="10" y1="10" x2="40" y2="40" stroke="white" stroke-width="2" opacity="0.7"/><line x1="40" y1="10" x2="10" y2="40" stroke="white" stroke-width="2" opacity="0.7"/>'),

  // Player 4: Purple gradient with geometric shapes
  generateModernAvatarSVG('#8B5CF6', '#7C3AED',
    '<rect x="12" y="12" width="8" height="8" fill="white" opacity="0.8"/><rect x="30" y="30" width="8" height="8" fill="white" opacity="0.8"/>'),

  // Player 5: Orange gradient with simple pattern
  generateModernAvatarSVG('#F59E0B', '#D97706',
    '<circle cx="25" cy="25" r="15" fill="none" stroke="white" stroke-width="3" opacity="0.7"/><circle cx="25" cy="25" r="5" fill="white" opacity="0.9"/>'),
];

// Special host avatar with star pattern (no Unicode characters)
const hostAvatar = generateModernAvatarSVG('#FFD700', '#FFA500',
  '<polygon points="25,10 28,18 36,18 30,24 32,32 25,27 18,32 20,24 14,18 22,18" fill="white" opacity="0.9"/><circle cx="25" cy="25" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.7"/>');

// For the host (player 1), we'll use their actual profile image, fallback to special crown avatar
// For other players, use the modern pattern avatars
const defaultAvatars = avatarPatterns;

type TournamentStep = 'setup' | 'registration' | 'customization' | 'bracket' | 'playing' | 'completed';

export default function LocalTournamentPage() {
  const { t } = useTranslation();
  const { gameState, setGameMode } = useGameContext();
  const { user } = useUserStore();
  const router = useRouter();

  // Tournament state
  const [tournamentStep, setTournamentStep] = useState<TournamentStep>('setup');
  const [registeredPlayers, setRegisteredPlayers] = useState<GamePlayer[]>([]);
  const [tempPlayers, setTempPlayers] = useState<GamePlayer[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matchWinner, setMatchWinner] = useState<GamePlayer | null>(null);
  const [showMatchCompletionModal, setShowMatchCompletionModal] = useState(false);
  const [showTournamentWinnerMessage, setShowTournamentWinnerMessage] = useState(false);
  const [, setIsMatchActive] = useState(false);
  const [, setServerGameState] = useState<ServerGameState | null>(null);
  const [gameScores, setGameScores] = useState({ player1: 0, player2: 0 });
  const [, setCustomization] = useState({
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
      const newTempPlayers: GamePlayer[] = Array.from({ length: 4 }, (_, i) => ({
        id: `player-${i + 1}`,
        name: i === 0 ? (user?.username || t('game.player') + ' 1') : '',
        // Host gets their profile image, fallback to crown avatar, others get modern pattern avatars
        avatar: i === 0 ? (user?.profile_img || hostAvatar) : defaultAvatars[(i - 1) % defaultAvatars.length],
        color: colors[i % colors.length],
        id_user: i === 0 ? user?.id_user : undefined,
      }));
      setTempPlayers(newTempPlayers);
    }
  }, [tournamentStep, user?.username, user?.profile_img, user?.id_user, t]);

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
  const handleCustomizationComplete = useCallback((customizationData: { ballColor: string; paddleColor: string; backgroundColor: string; ballSpeed: number; paddleSize: number }) => {
    setCustomization(customizationData);
    setTournamentStep('bracket');
  }, []);

  // Handle match completion - called from PingPongGame
  const handleMatchComplete = useCallback((winner: GamePlayer, matchStats?: any) => {
    if (!currentMatch || !winner || !tournamentManager) return;

    setMatchWinner(winner);
    setIsMatchActive(false);
    setShowMatchCompletionModal(true);

    // Update bracket with winner
    tournamentManager.setMatchWinner(currentMatch.id, winner);


    // Save match data to database if statistics are available
    console.log('Checking if we should save match data:', {
      hasMatchStats: !!matchStats,
      winnerIdUser: winner.id_user,
      winnerId: winner.id,
      winnerName: winner.name,
      currentMatchPlayer1: currentMatch?.player1?.name,
      currentMatchPlayer2: currentMatch?.player2?.name
    });

    if (matchStats && currentMatch?.player1 && currentMatch?.player2) {
      // Determine winner and loser from tournament players
      const isWinnerPlayer1 = winner.id === currentMatch.player1.id;
      const loser = isWinnerPlayer1 ? currentMatch.player2 : currentMatch.player1;

      // Always attempt to save match data - backend will handle guest players
      const isPlayer1Winner = matchStats.finalScore.player1 > matchStats.finalScore.player2;

      // Calculate base values first
      const win_score = (() => {
        if (matchStats?.finalScore) {
          const p1 = Number(matchStats.finalScore.player1) || 0;
          const p2 = Number(matchStats.finalScore.player2) || 0;
          return Math.max(p1, p2);
        }
        // Fallback: assume winner has 10 points, loser has less
        return isPlayer1Winner ? 10 : 9;
      })();

      const lose_score = (() => {
        if (matchStats?.finalScore) {
          const p1 = Number(matchStats.finalScore.player1) || 0;
          const p2 = Number(matchStats.finalScore.player2) || 0;
          return Math.min(p1, p2);
        }
        // Fallback: assume winner has 10 points, loser has less
        return isPlayer1Winner ? 9 : 10;
      })();

      const duration = (() => {
        const actualDuration = matchStats?.duration ? Math.round(matchStats.duration / 1000) : 0;
        // Ensure minimum duration for a valid match (at least 10 seconds)
        return Math.max(actualDuration, 10);
      })();

      const longest_rally = (() => {
        const actualLongest = matchStats?.longestRally || 0;
        // Estimate based on scores if no rallies tracked
        const totalPoints = win_score + lose_score;
        return Math.max(actualLongest, Math.min(totalPoints * 2, 20)); // Estimate 2 touches per point, max 20
      })();

      const average_rally = (() => {
        const actualAverage = matchStats?.averageRally ? Math.round(matchStats.averageRally * 100) / 100 : 0;
        // Estimate based on longest rally if available
        return actualAverage > 0 ? actualAverage : Math.max(longest_rally * 0.7, 3); // Estimate 70% of longest, min 3
      })();

      const touches_win = (() => {
        const actualTouches = isPlayer1Winner ? (matchStats?.player1Touches || 0) : (matchStats?.player2Touches || 0);
        // Estimate based on rallies and average rally length
        const estimatedTouches = longest_rally > 0 ? Math.round(average_rally * (win_score + lose_score) * 0.6) : 0;
        return Math.max(actualTouches, estimatedTouches, win_score * 3); // At least 3 touches per point won
      })();

      const matchData = {
        // Player information - use tournament player data directly
        winner_info: {
          id_user: winner.id_user,
          id: winner.id,
          name: winner.name,
          username: winner.username
        },
        loser_info: {
          id_user: loser.id_user,
          id: loser.id,
          name: loser.name,
          username: loser.username
        },
        // Match scores - use calculated values
        win_score,
        lose_score,
        type: 'tournament',
        tournament_id: matchStats?.tournamentId || 'local-tournament',
        duration,
        longest_rally,
        average_rally,
        ball_max_speed: (() => {
          const actualSpeed = matchStats?.maxBallSpeed ? Math.round(matchStats.maxBallSpeed * 100) / 100 : 0;
          // Provide reasonable default for ball speed
          return Math.max(actualSpeed, 8.5); // Default ball speed in m/s
        })(),
        touches_win,
        touches_lose: (() => {
          const actualTouches = !isPlayer1Winner ? (matchStats?.player1Touches || 0) : (matchStats?.player2Touches || 0);
          // Estimate based on winner's touches
          return Math.max(actualTouches, Math.round(touches_win * 0.7), lose_score * 2); // Estimate 70% of winner, min 2 per point lost
        })(),
        max_points_streak_win: (() => {
          const actualStreak = isPlayer1Winner ? (matchStats?.maxStreakPlayer1 || 0) : (matchStats?.maxStreakPlayer2 || 0);
          // Estimate based on score difference
          const scoreDiff = win_score - lose_score;
          return Math.max(actualStreak, Math.min(win_score, Math.max(1, scoreDiff)));
        })(),
        max_points_streak_lose: (() => {
          const actualStreak = !isPlayer1Winner ? (matchStats?.maxStreakPlayer1 || 0) : (matchStats?.maxStreakPlayer2 || 0);
          // Estimate based on loser's best performance
          return Math.max(actualStreak, Math.min(lose_score, 2));
        })(),
        max_leading_time_win: (() => {
          const actualTime = matchStats?.leadingTimePlayer1 || matchStats?.leadingTimePlayer2 ?
            Math.round((isPlayer1Winner ? (matchStats.leadingTimePlayer1 || 0) : (matchStats.leadingTimePlayer2 || 0)) / 1000) : 0;
          // Estimate based on duration and win margin ok ok 
          const estimatedTime = Math.round(duration * 0.7); // Assume winner led 70% of the match ma3endna mandiro a ba AYOUB
          return Math.max(actualTime, estimatedTime);
        })(),
        max_leading_time_lose: (() => {
          const actualTime = matchStats?.leadingTimePlayer1 || matchStats?.leadingTimePlayer2 ?
            Math.round((!isPlayer1Winner ? (matchStats.leadingTimePlayer1 || 0) : (matchStats.leadingTimePlayer2 || 0)) / 1000) : 0;
          // Estimate based on remaining time
          const estimatedTime = Math.round(duration * 0.2); // Assume loser led 20% of the match
          return Math.max(actualTime, estimatedTime);
        })()
      };

      console.log('🔍 DEBUG: handleMatchComplete called with:', {
        winner: winner,
        loser: loser,
        isWinnerPlayer1: isWinnerPlayer1,
        matchStats: matchStats,
        currentMatch: currentMatch,
        gameStatsDetails: matchStats ? {
          duration: Date.now() - (matchStats.startTime || Date.now()),
          ralliesCount: matchStats.rallies?.length || 0,
          totalTouches: (matchStats.player1Touches || 0) + (matchStats.player2Touches || 0),
          maxBallSpeed: matchStats.maxBallSpeed || 0
        } : 'No matchStats'
      });

      // Validate matchData before sending
      const validationErrors = [];
      if (!matchData.winner_info?.name) validationErrors.push('winner_info.name missing');
      if (!matchData.loser_info?.name) validationErrors.push('loser_info.name missing');
      if (matchData.win_score === undefined || matchData.win_score === null) validationErrors.push('win_score invalid');
      if (matchData.lose_score === undefined || matchData.lose_score === null) validationErrors.push('lose_score invalid');

      if (validationErrors.length > 0) {
        console.error(' Validation errors in matchData:', validationErrors);
        console.error(' Invalid matchData:', matchData);
        return; // Don't send invalid data
      }

      console.log('  Sending validated match data to API:', JSON.stringify(matchData, null, 2));
      console.log(' WATA KHEDM Aaaaaaaaaaa WLLLLD LKLBA API URL:', `${process.env.NEXT_PUBLIC_BACK_API}/saveTournamentMatch`);

      // Fire-and-forget API call
      fetch(`${process.env.NEXT_PUBLIC_BACK_API}/saveTournamentMatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
        credentials: 'include',
      })
      .then(async response => {
        console.log(' HANA -> Response status:', response.status, response.statusText);
        console.log(' Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          console.log(' HANA -> Tournament match data saved successfully');
          return response.json();
        } else {
          console.error(' HANA Failed to save tournament match data - Status:', response.status);
          const errorText = await response.text();
          console.error(' Response body:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      })
      .then(data => {
        if (data) {
          console.log(' API Response:', data);
        }
      })
      .catch(error => {
        console.error(' Network/API Error:', error);
        console.error(' Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      });
    }
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
      setServerGameState(gameState as unknown as ServerGameState);
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
            updatePlayer={(index, field, value) => {
              setTempPlayers(prevPlayers => {
                const updated = prevPlayers.map((player, i) =>
                  i === index ? { ...player, [field]: value } : player
                );
                return updated;
              });
            }}
            updatePlayerObject={(index, playerData) => {
              setTempPlayers(prevPlayers => {
                const updated = prevPlayers.map((player, i) =>
                  i === index ? { ...player, ...playerData } : player
                );
                return updated;
              });
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
                          id: currentMatch.player1.id ?? 'player-1',
                          name: currentMatch.player1.name,
                          avatar: currentMatch.player1.avatar,
                          color: currentMatch.player1.color,
                          username: currentMatch.player1.username,
                          id_user: typeof currentMatch.player1.id_user === 'number' ? currentMatch.player1.id_user : undefined,
                        },
                        {
                          id: currentMatch.player2.id ?? 'player-2',
                          name: currentMatch.player2.name,
                          avatar: currentMatch.player2.avatar,
                          color: currentMatch.player2.color,
                          username: currentMatch.player2.username,
                          id_user: typeof currentMatch.player2.id_user === 'number' ? currentMatch.player2.id_user : undefined,
                        },
                      ] satisfies GameTypePlayer[]}
                      onScoreUpdate={(scores) => setGameScores(scores)}
                      onTournamentMatchEnd={(winner, matchStats) => {
                        // Convert winner back to GameContext Player format
                        const gameContextWinner: GamePlayer = {
                          ...winner,
                          color: winner.color || '#ffffff'
                        };
                        handleMatchComplete(gameContextWinner, matchStats);
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

