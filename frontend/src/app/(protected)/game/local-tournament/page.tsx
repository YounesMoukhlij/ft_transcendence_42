'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext, Player as GamePlayer } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';
import { FaTrophy } from 'react-icons/fa';
import { IoExpand, IoContract } from 'react-icons/io5';
import { useTranslation } from '@/contexts/LanguageContext';
import type { Player as GameTypePlayer, ServerGameState } from '@/types/game';
import LocalTournamentManager from '@/components/LocalTournamentManager';
import LocalTournamentBracket from '@/components/LocalTournamentBracket';
import LocalTournamentAnimations from '@/components/LocalTournamentAnimations';
import LocalTournamentPlayerRegistration from '@/components/LocalTournamentPlayerRegistration';
import LocalTournamentGameOverlay from '@/components/LocalTournamentGameOverlay';
import api from "@/lib/api"

interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface ExtendedElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

// Type for match statistics
interface MatchStats {
  finalScore: { player1: number; player2: number };
  duration: number;
  player1Touches?: number;
  player2Touches?: number;
  totalTouches?: number;
  pointsPerSecond?: number;
  maxBallSpeed?: number;
  maxStreakPlayer1?: number;
  maxStreakPlayer2?: number;
  leadingTimePlayer1?: number;
  leadingTimePlayer2?: number;
}

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
    console.log("error ", e);
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
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [tournamentName, setTournamentName] = useState<string>('');
  const [tournamentNameError, setTournamentNameError] = useState<string>('');
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
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
  const handleMatchComplete = useCallback((winner: GamePlayer, matchStats?: MatchStats) => {
    if (!currentMatch || !winner || !tournamentManager) return;

    setMatchWinner(winner);
    setIsMatchActive(false);
    setShowMatchCompletionModal(true);

    // Update bracket with winner
    tournamentManager.setMatchWinner(currentMatch.id, winner);


    if (matchStats && currentMatch?.player1 && currentMatch?.player2) {
      // Determine winner and loser from tournament players
      const isWinnerPlayer1 = winner.id === currentMatch.player1.id;
      const loser = isWinnerPlayer1 ? currentMatch.player2 : currentMatch.player1;

      // Always attempt to save match data - backend will handle guest players
      const isPlayer1Winner = matchStats.finalScore.player1 > matchStats.finalScore.player2;

      // Calculate base values from matchStats (now properly tracked)
      const win_score = (() => {
        if (matchStats?.finalScore) {
          const p1 = Number(matchStats.finalScore.player1) || 0;
          const p2 = Number(matchStats.finalScore.player2) || 0;
          return Math.max(p1, p2);
        }
        return 5; // Default winning score
      })();

      const lose_score = (() => {
        if (matchStats?.finalScore) {
          const p1 = Number(matchStats.finalScore.player1) || 0;
          const p2 = Number(matchStats.finalScore.player2) || 0;
          return Math.min(p1, p2);
        }
        return 0;
      })();

      const duration = (() => {
        const actualDuration = matchStats?.duration ? Math.round(matchStats.duration / 1000) : 0;
        // Ensure minimum duration for a valid match (at least 10 seconds)
        return Math.max(actualDuration, 10);
      })();

      // Get touches directly from game stats - now properly tracked
      const touches_win = isPlayer1Winner 
        ? (matchStats?.player1Touches || 0) 
        : (matchStats?.player2Touches || 0);
      
      const touches_lose = !isPlayer1Winner 
        ? (matchStats?.player1Touches || 0) 
        : (matchStats?.player2Touches || 0);

      // Total touches (new field replacing longest_rally)
      const total_touches = matchStats?.totalTouches || (touches_win + touches_lose);

      // Seconds per point (stored as points_per_second for DB compatibility)
      // E.g., "a point every 6 seconds"
      const totalPointsScored = win_score + lose_score;
      const points_per_second = matchStats?.pointsPerSecond 
        ? Math.round(matchStats.pointsPerSecond * 100) / 100 
        : (totalPointsScored > 0 ? Math.round((duration / totalPointsScored) * 100) / 100 : 0);

      const matchData = {
        // Player information - use tournament player data directly
        winner: winner.id_user,
        loser: loser.id_user,       
        // Match scores
        win_score,
        lose_score,
        tournament_id: tournamentId,
        duration,
        // New simplified stats
        total_touches,
        points_per_second,
        ball_max_speed: matchStats?.maxBallSpeed ? Math.round(matchStats.maxBallSpeed * 100) / 100 : 6,
        touches_win,
        touches_lose,
        // Streaks - now properly tracked per point
        max_points_streak_win: isPlayer1Winner 
          ? (matchStats?.maxStreakPlayer1 || 1) 
          : (matchStats?.maxStreakPlayer2 || 1),
        max_points_streak_lose: !isPlayer1Winner 
          ? (matchStats?.maxStreakPlayer1 || 0) 
          : (matchStats?.maxStreakPlayer2 || 0),
        // Leading time - now properly accumulated in milliseconds
        max_leading_time_win: Math.round(
          (isPlayer1Winner 
            ? (matchStats?.leadingTimePlayer1 || 0) 
            : (matchStats?.leadingTimePlayer2 || 0)) / 1000
        ),
        max_leading_time_lose: Math.round(
          (!isPlayer1Winner 
            ? (matchStats?.leadingTimePlayer1 || 0) 
            : (matchStats?.leadingTimePlayer2 || 0)) / 1000
        )
      };
      // Validate matchData before sending
      const validationErrors = [];
      if (matchData.win_score === undefined || matchData.win_score === null) validationErrors.push('win_score invalid');
      if (matchData.lose_score === undefined || matchData.lose_score === null) validationErrors.push('lose_score invalid');

      if (validationErrors.length > 0) {
        console.error(' Validation errors in matchData:', validationErrors);
        console.error(' Invalid matchData:', matchData);
        return; // Don't send invalid data
      }

  
      // Fire-and-forget API call
      api.post(`/api/saveTournamentMatch`, matchData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        }
      })
      .then(response => {
        console.log(' HANA -> Response status:', response.status, response.statusText);

        if (response.status >= 200 && response.status < 300) {
          console.log(' HANA -> Tournament match data saved successfully');
          return response.data;
        } else {
          console.error(' HANA Failed to save tournament match data - Status:', response.status);
          throw new Error(`HTTP ${response.status}`);
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
  }, [currentMatch, tournamentManager, tournamentId]);

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

  const toggleFullscreen = useCallback(async () => {
    const container = gameContainerRef.current;
    if (!container) return;
    try {
      const extDoc = document as ExtendedDocument;
      const extEl = container as ExtendedElement;
      if (
        document.fullscreenElement ||
        extDoc.webkitFullscreenElement ||
        extDoc.mozFullScreenElement ||
        extDoc.msFullscreenElement
      ) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (extDoc.webkitExitFullscreen) await extDoc.webkitExitFullscreen();
        else if (extDoc.mozCancelFullScreen) await extDoc.mozCancelFullScreen();
        else if (extDoc.msExitFullscreen) await extDoc.msExitFullscreen();
      } else {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
          container.focus();
        } else if (extEl.webkitRequestFullscreen) {
          await extEl.webkitRequestFullscreen();
          container.focus();
        } else if (extEl.mozRequestFullScreen) {
          await extEl.mozRequestFullScreen();
          container.focus();
        } else if (extEl.msRequestFullscreen) {
          await extEl.msRequestFullscreen();
          container.focus();
        }
      }
    } catch (e) {
      console.error('Error toggling fullscreen:', e);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const extDoc = document as ExtendedDocument;
      const full = !!(
        document.fullscreenElement ||
        extDoc.webkitFullscreenElement ||
        extDoc.mozFullScreenElement ||
        extDoc.msFullscreenElement
      );
      setIsFullscreen(full);
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

  useEffect(() => {
    if (tournamentStep !== 'playing' || !currentMatch || !gameContainerRef.current) return;
    const container = gameContainerRef.current;
    const extDoc = document as ExtendedDocument;
    if (
      document.fullscreenElement ||
      extDoc.webkitFullscreenElement ||
      extDoc.mozFullScreenElement ||
      extDoc.msFullscreenElement
    )
      return;
    const t = setTimeout(async () => {
      try {
        const extEl = container as ExtendedElement;
        if (container.requestFullscreen) {
          await container.requestFullscreen();
          container.focus();
        } else if (extEl.webkitRequestFullscreen) {
          await extEl.webkitRequestFullscreen();
          container.focus();
        } else if (extEl.mozRequestFullScreen) {
          await extEl.mozRequestFullScreen();
          container.focus();
        } else if (extEl.msRequestFullscreen) {
          await extEl.msRequestFullscreen();
          container.focus();
        }
      } catch {
        console.log('Auto-fullscreen not available');
      }
    }, 100);
    return () => clearTimeout(t);
  }, [tournamentStep, currentMatch]);

  useEffect(() => {
    if (tournamentStep !== 'playing') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F' || e.key === 'F11') {
        if (e.key === 'F11') e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tournamentStep, toggleFullscreen]);

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
        const validateTournamentName = (name: string): string => {
          const trimmedName = name.trim();
          if (!trimmedName) {
            return t('game.tournamentNameRequired');
          }
          if (trimmedName.length < 3) {
            return t('game.tournamentNameMinLength') ;
          }
          if (trimmedName.length > 20) {
            return t('game.tournamentNameMaxLength') ;
          }
          if (!/^[a-zA-Z0-9\s_-]+$/.test(trimmedName)) {
            return t('game.tournamentNameInvalidChars');
          }
          return '';
        };

        const handleStartTournament = async () => {
          const error = validateTournamentName(tournamentName);
          if (error) {
            setTournamentNameError(error);
            return;
          }
          setTournamentNameError('');
          
          // Create tournament in backend and get the tournament ID
          try {
            const response = await api.post(`/api/createLocalTournament`, 
              { name: tournamentName.trim() },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user?.access_token}`
                }
              }
            );

            if (response.status >= 200 && response.status < 300) {
              console.log('Tournament created with ID:', response.data.tournamentId);
              setTournamentId(response.data.tournamentId);
            } else {
              console.error('Failed to create tournament:', response.status);
            }
          } catch (error) {
            console.error('Error creating tournament:', error);
          }
          setTournamentStep('registration');
        };

        return (
          <div className="w-full max-w-4xl mx-auto h-full  rounded-3xl shadow-2xl   p-8 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white bg-clip-text mb-4">
                {t('game.localTournament')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('game.allPlayersSameDevice')}
              </p>
            </div>
            <div className="space-y-6 w-full max-w-md">
              <div className="bg-[#1a1f2e]/40 rounded-xl p-6 border-2 border-gray-800">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {t('game.playersLabel')}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {t('game.semiFinalsFinal')}
                  </p>
                </div>
                
                {/* Tournament Name Input */}
                <div className="mb-6">
                  <label htmlFor="tournamentName" className="block text-white text-sm font-medium mb-2">
                    {t('game.tournamentName')}
                  </label>
                  <input
                    type="text"
                    id="tournamentName"
                    value={tournamentName}
                    onChange={(e) => {
                      setTournamentName(e.target.value);
                      if (tournamentNameError) {
                        setTournamentNameError(validateTournamentName(e.target.value));
                      }
                    }}
                    onBlur={() => {
                      if (tournamentName) {
                        setTournamentNameError(validateTournamentName(tournamentName));
                      }
                    }}
                    placeholder={t('game.enterTournamentName') || 'Enter tournament name...'}
                    className={`w-full px-4 py-3 bg-[#1a1f2e]/60 border-2 ${
                      tournamentNameError ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors`}
                    maxLength={20}
                  />
                  {tournamentNameError && (
                    <p className="mt-2 text-red-400 text-sm">{tournamentNameError}</p>
                  )}
                  <p className="mt-1 text-gray-500 text-xs text-right">
                    {tournamentName.length}/20
                  </p>
                </div>

                <button
                  onClick={handleStartTournament}
                  disabled={!tournamentName.trim()}
                  className={`w-full px-8 py-4 text-white rounded-xl text-xl font-semibold transition-all duration-300 transform shadow-lg ${
                    tournamentName.trim()
                      ? 'bg-blue-500/60 cursor-pointer  hover:scale-102'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {t('game.startTournament')}
                </button>
              </div>
            </div>
            
          <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/game')}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all duration-200 text-sm font-medium group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            <span>{t('game.backToGameModes') || 'Back to Game Modes'}</span>
          </button>
        </div>
          </div>
        );

      case 'registration':
        return (
          <LocalTournamentPlayerRegistration
            tempPlayers={tempPlayers}
            defaultAvatars={defaultAvatars}
            tournamentId={tournamentId}
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
          <div
            ref={gameContainerRef}
            tabIndex={-1}
            className={`flex flex-col items-center justify-center w-full transition-all duration-300 focus:outline-none ${
              isFullscreen ? 'h-screen bg-black p-4' : 'min-h-full p-4 bg-transparent'
            }`}
          >
            {currentMatch && currentMatch.player1 && currentMatch.player2 && (
              <>
                <div className={`w-full flex flex-col items-center ${isFullscreen ? 'h-full justify-center' : 'max-w-4xl'}`}>
                  <LocalTournamentGameOverlay
                    player1={currentMatch.player1}
                    player2={currentMatch.player2}
                    score1={gameScores.player1}
                    score2={gameScores.player2}
                    isFullscreen={isFullscreen}
                  />

                  <div className={`w-full flex justify-center ${isFullscreen ? 'flex-1 items-center' : 'max-w-4xl'}`}>
                    <div
                      className={isFullscreen ? 'w-full h-full flex items-center justify-center' : 'w-full'}
                      style={isFullscreen ? {
                        aspectRatio: '4/3',
                        maxWidth: '95vw',
                        maxHeight: '95vh',
                        width: 'auto',
                        height: 'auto',
                      } : {}}
                    >
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
                          const gameContextWinner: GamePlayer = {
                            ...winner,
                            color: winner.color || '#ffffff'
                          };
                          handleMatchComplete(gameContextWinner, matchStats);
                        }}
                      />
                    </div>
                  </div>

                  {!isFullscreen && (
                    <div className="w-full max-w-2xl mt-4 text-center space-y-4">
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
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                          aria-label={isFullscreen ? t('game.exitFullscreen') : t('game.fullscreen')}
                        >
                          <IoExpand className="w-5 h-5" />
                          <span>{t('game.fullscreen')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isFullscreen && !showMatchCompletionModal && (
                  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-4 text-white text-sm flex-wrap justify-center">
                      <div>
                        <span className="opacity-70">{t('game.controls')}: </span>
                        <span className="font-semibold">W / S / ↑ / ↓</span>
                      </div>
                      <div className="h-4 w-px bg-gray-600" />
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
                        aria-label={t('game.exitFullscreen')}
                      >
                        <IoContract className="w-4 h-4" />
                        {t('game.exitFullscreen')}
                      </button>
                      <div className="h-4 w-px bg-gray-600" />
                      <span className="opacity-70 text-xs">{t('game.pressFForFullscreen')}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Match Completion Modal - inside fullscreen container so it's visible in fullscreen */}
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
                      type="button"
                      onClick={handleContinueAfterMatch}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold transition-all"
                    >
                      {tournamentManager?.getChampion() ? t('game.viewResults') : t('game.nextMatch')}
                    </button>
                  </div>
                </div>
              </div>
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
              setTournamentId(null);
              setTournamentName('');
              setTournamentNameError('');
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
            setTournamentId(null);
            setTournamentName('');
            setTournamentNameError('');
          }}
          onBack={() => router.push('/game')}
        />
      )}
    </div>
  );
}

