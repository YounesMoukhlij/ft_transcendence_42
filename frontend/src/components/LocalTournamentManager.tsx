'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useGameContext, Player, TournamentMatch } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/contexts/LanguageContext';
import { FaUser, FaUpload, FaCrown, FaTrophy, FaGamepad, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { IoExpand, IoContract } from 'react-icons/io5';
import { getBackendURL } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components ---

const Confetti = () => {
  const colors = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];
  const confettiCount = 50;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: confettiCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1),
            x: (Math.random() - 0.5) * 100,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const VersusScreen = ({ player1, player2, onComplete }: { player1: Player, player2: Player, onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* Background Split */}
      <div className="absolute inset-0 flex">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          className="w-1/2 h-full bg-gradient-to-br from-blue-900 to-black border-r-4 border-blue-500"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          className="w-1/2 h-full bg-gradient-to-bl from-red-900 to-black border-l-4 border-red-500"
        />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 flex items-center justify-between h-full">

        {/* Player 1 (Left) */}
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <img
                src={player1.avatar}
                alt={player1.name}
                className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full border-4 border-blue-500 object-cover shadow-2xl"
              />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            >
              {player1.name}
            </motion.h2>
          </motion.div>
        </div>

        {/* VS Badge (Center) */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-80"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-600 text-black font-black text-6xl sm:text-8xl p-6 sm:p-10 rounded-xl transform rotate-3 shadow-[0_0_30px_rgba(234,179,8,0.6)] border-4 border-white">
                VS
              </div>
            </div>
          </motion.div>
        </div>

        {/* Player 2 (Right) */}
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <img
                src={player2.avatar}
                alt={player2.name}
                className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full border-4 border-red-500 object-cover shadow-2xl"
              />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            >
              {player2.name}
            </motion.h2>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface PlayerRegistrationProps {
  tempPlayers: Player[];
  defaultAvatars: string[];
  playerCount: number;
  updatePlayer: (index: number, field: keyof Player, value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

const PlayerRegistration: React.FC<PlayerRegistrationProps> = React.memo(({
  tempPlayers,
  defaultAvatars,
  playerCount,
  updatePlayer,
  onComplete,
  onBack
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-6xl mx-auto h-full bg-gray-900 bg-opacity-90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-3 sm:p-6 lg:p-8"
    >
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300 mb-4 sm:mb-6 text-center">{t('game.registerPlayers')}</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {tempPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-400"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={player.avatar}
                  alt={`${t('game.player')} ${index + 1}`}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-purple-400"
                />
                <button className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1 hover:bg-purple-700">
                  <FaUpload className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                  <FaUser className="text-purple-400 text-sm" />
                  <span className="text-white font-semibold text-sm sm:text-base break-words">
                    {index === 0 ? t('game.hostPlayer') : `${t('game.player')} ${index + 1}`}
                  </span>
                  {index === 0 && <FaCrown className="text-yellow-400 text-sm" />}
                </div>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                  placeholder={t('game.enterNameForPlayer', { number: index + 1 })}
                  className="w-full px-2 py-2 sm:px-3 text-sm sm:text-base bg-gray-700 text-white rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={index === 0} // Host name is pre-filled
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs sm:text-sm text-gray-300 mb-2">{t('game.chooseAvatar')}:</label>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {defaultAvatars.slice(0, 6).map((avatar, avatarIndex) => (
                  <button
                    key={avatarIndex}
                    onClick={() => updatePlayer(index, 'avatar', avatar)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 overflow-hidden flex-shrink-0 ${
                      player.avatar === avatar ? 'border-purple-400' : 'border-gray-600'
                    }`}
                  >
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 flex-wrap">
        <button
          onClick={onBack}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
        >
          {t('game.back')}
        </button>
        <button
          onClick={onComplete}
          disabled={tempPlayers.filter(p => p.name.trim() !== '').length !== playerCount}
          className="px-6 py-2 sm:px-8 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm sm:text-base"
        >
          {t('game.startTournament')}
        </button>
      </div>
    </motion.div>
  );
});

PlayerRegistration.displayName = 'PlayerRegistration';

export type LocalTournamentStep = 'setup' | 'registration' | 'customization' | 'bracket' | 'versus' | 'playing' | 'finished';

interface LocalTournamentManagerProps {
  onBackToGameMenu: () => void;
}

const LocalTournamentManager: React.FC<LocalTournamentManagerProps> = ({ onBackToGameMenu }) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const { gameState, setGameMode, setPlayers, setTournament, updateTournamentMatch, setCustomisation } = useGameContext();

  const [tournamentStep, setTournamentStep] = useState<LocalTournamentStep>('setup');
  const [playerCount, setPlayerCount] = useState<4>(4);
  const [registeredPlayers, setRegisteredPlayers] = useState<Player[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [tempPlayers, setTempPlayers] = useState<Player[]>([]);
  const [matchWinner, setMatchWinner] = useState<Player | null>(null);
  const [showTournamentWinnerMessage, setShowTournamentWinnerMessage] = useState(false);
  const [showMatchCompletionModal, setShowMatchCompletionModal] = useState(false);
  const [isStartingTournament, setIsStartingTournament] = useState(false);
  const [matchScores, setMatchScores] = useState<Record<number, { player1Score: number; player2Score: number }>>({});

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const defaultAvatars = useMemo(() => [
    '/profileface.png',
    '/user.png',
    '/robot.png',
    '/42.png',
    '/d.png',
    '/logo.png',
  ], []);

  const getAvatarUrl = useCallback((avatar: string | undefined) => {
    if (!avatar) return defaultAvatars[0];
    if (avatar.startsWith('/uploads/')) {
      return `${getBackendURL()}${avatar}`;
    }
    return avatar;
  }, [defaultAvatars]);

  // Initialize game mode
  useEffect(() => {
    setGameMode('tournament');
  }, [setGameMode]);

  // Initialize tempPlayers when playerCount changes
  useEffect(() => {
    setTempPlayers([
      { name: user?.username || 'Host Player', avatar: getAvatarUrl(user?.avatar) || defaultAvatars[0], color: '#3B82F6', id: user?.id_user?.toString() || '1' },
      ...Array(playerCount - 1).fill(null).map((_, i) => ({
        name: '',
        avatar: defaultAvatars[i + 1],
        color: ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'][i],
        id: `guest-${i + 2}`
      }))
    ]);
  }, [playerCount, defaultAvatars, user, getAvatarUrl]);

  // Create tournament bracket
  const createTournamentBracket = useCallback((players: Player[], count: 4): TournamentMatch[] => {
    const bracket: TournamentMatch[] = [];
    let matchId = 1;

    if (count === 4) {
      // Semi-finals
      bracket.push({
        id: matchId++,
        round: 1,
        player1: players[0],
        player2: players[1],
        status: 'pending'
      });
      bracket.push({
        id: matchId++,
        round: 1,
        player1: players[2],
        player2: players[3],
        status: 'pending'
      });
      // Final
      bracket.push({
        id: matchId++,
        round: 2,
        status: 'pending'
      });
    }

    return bracket;
  }, []);

  // Start tournament
  const startTournament = useCallback((players: Player[]) => {
    const playersToUse = players || registeredPlayers;
    if (playersToUse.length !== playerCount) return;

    const bracket = createTournamentBracket(playersToUse, playerCount);

    setTournament({
      type: 'local',
      playerCount,
      status: 'playing',
      currentMatch: 0,
      bracket
    });

    setPlayers(playersToUse);
    setTournamentStep('bracket');
    setCurrentMatchIndex(0);
  }, [registeredPlayers, playerCount, setTournament, setPlayers, createTournamentBracket]);

  // Update player
  const updatePlayer = useCallback((index: number, field: keyof Player, value: string) => {
    setTempPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Handle player registration complete
  const handlePlayerRegistrationComplete = useCallback(() => {
    const validPlayers = tempPlayers.filter(p => p.name.trim() !== '');
    if (validPlayers.length === playerCount) {
      setRegisteredPlayers(validPlayers);
      setTournamentStep('customization');
    }
  }, [tempPlayers, playerCount]);

  // Handle match completion
  const handleMatchComplete = useCallback((winner: Player, player1Score?: number, player2Score?: number) => {
    // Exit fullscreen when match ends
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }

    const bracket = gameState.tournament?.bracket || [];
    const currentMatch = bracket[currentMatchIndex];

    if (!currentMatch) return;

    // Store match scores
    if (player1Score !== undefined && player2Score !== undefined) {
      setMatchScores(prev => ({
        ...prev,
        [currentMatch.id]: { player1Score, player2Score }
      }));
    }

    updateTournamentMatch(currentMatch.id, {
      winner,
      status: 'finished',
    });

    setMatchWinner(winner);
    setShowMatchCompletionModal(true);

    // Advance winner to next round
    const winnerPlayer = winner;
    const maxRounds = Math.max(...bracket.map(m => m.round), 1);

    if (currentMatch.round < maxRounds) {
      // Find next match in the bracket
      const nextRound = currentMatch.round + 1;
      const nextMatch = bracket.find(m => m.round === nextRound);

      if (nextMatch) {
        // Determine position based on which semi-final match this is
        const semiFinalMatches = bracket.filter(m => m.round === 1);
        const isFirstSemiFinal = currentMatch.id === semiFinalMatches[0]?.id;

        if (isFirstSemiFinal && !nextMatch.player1) {
          updateTournamentMatch(nextMatch.id, { player1: winnerPlayer });
        } else if (!isFirstSemiFinal && !nextMatch.player2) {
          updateTournamentMatch(nextMatch.id, { player2: winnerPlayer });
        }
      }
    } else {
      // Final match finished - tournament complete
      setTimeout(() => {
        setTournamentStep('finished');
      }, 2000);
      return;
    }

    // Find next match
    setTimeout(() => {
      const bracketAfterUpdate = gameState.tournament?.bracket || [];
      const nextMatch = bracketAfterUpdate.find((m, index) =>
        m.status === 'pending' &&
        m.player1 &&
        m.player2 &&
        index !== currentMatchIndex
      );

      if (nextMatch) {
        const nextIndex = bracketAfterUpdate.findIndex(m => m.id === nextMatch.id);
        setCurrentMatchIndex(nextIndex);
        setTournamentStep('bracket');
      } else {
        // Check if tournament is complete
        const playableMatches = bracketAfterUpdate.filter(m => m.player1 && m.player2);
        const isComplete = playableMatches.length > 0 &&
          playableMatches.every(m => m.status === 'finished' && m.winner);
        if (isComplete) {
          setTournamentStep('finished');
        } else {
          setTournamentStep('bracket');
        }
      }
      setShowMatchCompletionModal(false);
    }, 2000);
  }, [gameState.tournament?.bracket, currentMatchIndex, updateTournamentMatch]);

  // Get current match
  const currentMatch = useMemo(() => {
    const bracket = gameState.tournament?.bracket || [];
    return bracket[currentMatchIndex] || null;
  }, [gameState.tournament?.bracket, currentMatchIndex]);

  // Check if last match
  const isLastMatch = useMemo(() => {
    const bracket = gameState.tournament?.bracket || [];
    const currentMatch = bracket[currentMatchIndex];
    if (!currentMatch) return false;
    const maxRound = Math.max(...bracket.map(m => m.round), 1);
    return currentMatch.round === maxRound;
  }, [gameState.tournament?.bracket, currentMatchIndex]);

  // Auto-start matches when bracket is ready
  useEffect(() => {
    if (tournamentStep === 'bracket') {
      const bracket = gameState.tournament?.bracket || [];
      const readyMatch = bracket.find(m => m.status === 'pending' && m.player1 && m.player2);
      if (readyMatch) {
        const matchIndex = bracket.findIndex(m => m.id === readyMatch.id);
        if (matchIndex !== currentMatchIndex) {
          setCurrentMatchIndex(matchIndex);
        }
        // Use setTimeout to avoid state update during render
        setTimeout(() => {
          // Instead of going directly to playing, check if we should show versus screen
          // We can't automatically trigger versus here because 'bracket' step renders the bracket
          // and we want the user to click "Start Match"
        }, 0);
      }
    }
  }, [tournamentStep, gameState.tournament?.bracket, currentMatchIndex]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = gameContainerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
        container.focus();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-fullscreen when playing starts
  useEffect(() => {
    if (tournamentStep === 'playing') {
      const timer = setTimeout(() => {
        if (gameContainerRef.current && !document.fullscreenElement) {
          gameContainerRef.current.requestFullscreen().catch(console.error);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tournamentStep]);

  // Setup Phase
  if (tournamentStep === 'setup') {
    return (
      <div className="flex items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl h-full bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-700 via-purple-900 to-black border-2 border-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto"
        >
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-300 mb-2 xs:mb-3 sm:mb-4 md:mb-6 text-center">{t('game.tournamentSetup')}</h1>

          <div className="space-y-2 xs:space-y-3 sm:space-y-4">
            <div>
              <label className="block text-white text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 xs:mb-2 sm:mb-3 md:mb-4">{t('game.playerCount')}</label>
              <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => setPlayerCount(4)}
                  className={`p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    playerCount === 4
                      ? 'border-purple-400 bg-purple-600 bg-opacity-20'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-1 text-xs xs:text-sm md:text-base">{t('game.playersLabel')}</h3>
                  <p className="text-gray-300 text-xs xs:text-sm">{t('game.semiFinalsFinal')}</p>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-6">
            <button
              onClick={onBackToGameMenu}
              className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-2 xs:order-1"
            >
              {t('game.back')}
            </button>
            <button
              onClick={() => setTournamentStep('registration')}
              className="w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2"
            >
              {t('game.continue')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Registration Phase
  if (tournamentStep === 'registration') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <PlayerRegistration
          tempPlayers={tempPlayers}
          defaultAvatars={defaultAvatars}
          playerCount={playerCount}
          updatePlayer={updatePlayer}
          onComplete={handlePlayerRegistrationComplete}
          onBack={() => setTournamentStep('setup')}
        />
      </div>
    );
  }

  // Starting Tournament Phase
  if (isStartingTournament) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-2 border-purple-400 mx-auto mb-6 sm:mb-8"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-300 mb-4 sm:mb-6">
            {t('game.startingTournament')}
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl">
            {t('game.gettingReady')}
          </p>
        </div>
      </div>
    );
  }

  // Customization Phase
  if (tournamentStep === 'customization') {
    if (!registeredPlayers || registeredPlayers.length !== playerCount) {
      setTournamentStep('registration');
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <div className="mb-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-2">
            {t('game.customizeTournamentGame')}
          </h2>
          <p className="text-gray-300 text-sm">
            {t('game.customizeYourPlayground')}
          </p>
        </div>
        <GameCustomization
          onBack={() => setTournamentStep('registration')}
          onStartGame={(customization) => {
            setCustomisation(customization);
            setIsStartingTournament(true);
            setTimeout(() => {
              startTournament(registeredPlayers);
              setIsStartingTournament(false);
            }, 2000);
          }}
        />
      </div>
    );
  }

  // Versus Phase (Transition)
  if (tournamentStep === 'versus' && currentMatch && currentMatch.player1 && currentMatch.player2) {
    return (
      <VersusScreen
        player1={currentMatch.player1}
        player2={currentMatch.player2}
        onComplete={() => setTournamentStep('playing')}
      />
    );
  }

  // Bracket Phase
  if (tournamentStep === 'bracket') {
    const bracket = gameState.tournament?.bracket || [];
    const rounds = Math.max(...bracket.map(m => m.round), 1);
    const totalMatches = bracket.length;
    const finishedMatches = bracket.filter(m => m.status === 'finished').length;
    const currentRound = currentMatch ? currentMatch.round : null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8 overflow-y-auto"
      >
        <div className="w-full max-w-5xl mx-auto bg-gray-900 bg-opacity-90 rounded-xl shadow-2xl border-2 border-purple-500 p-4 sm:p-6 lg:p-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToGameMenu}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm sm:text-base transition-all"
            >
              <FaArrowLeft className="text-sm" />
              <span>{t('game.backToGameMenu') || 'Back to Game Lobby'}</span>
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 text-center flex-1">{t('game.tournamentBracket')}</h2>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>

          {/* Tournament Info */}
          <div className="mb-6 p-4 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-400">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-purple-300" />
                <span className="text-gray-300">
                  <span className="text-purple-300 font-semibold">Round:</span> {currentRound ? `Round ${currentRound}` : 'Not Started'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                <span className="text-gray-300">
                  <span className="text-purple-300 font-semibold">Progress:</span> {finishedMatches}/{totalMatches} Matches
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-400" />
                <span className="text-gray-300">
                  <span className="text-purple-300 font-semibold">Players:</span> {registeredPlayers.length}
                </span>
              </div>
            </div>
          </div>

          {/* Bracket Display */}
          <div className="flex justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
            {Array.from({ length: rounds }, (_, roundIndex) => (
              <div key={roundIndex} className="flex flex-col gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] flex-shrink-0">
                <h4 className="text-xs sm:text-sm lg:text-md font-semibold text-purple-300 text-center mb-2">
                  {roundIndex === rounds - 1 ? t('game.finalMatch').replace('!', '') :
                   roundIndex === rounds - 2 ? 'Semi-Final' :
                   'Quarter-Final'}
                </h4>
                {bracket.filter(m => m.round === roundIndex + 1).map((match) => {
                  const scores = matchScores[match.id];
                  const isCurrentMatch = currentMatch?.id === match.id;

                  return (
                    <motion.div
                      key={match.id}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-gray-700 rounded-md sm:rounded-lg p-3 sm:p-4 border-2 ${
                        match.status === 'finished' ? 'border-green-400 bg-green-900 bg-opacity-20' :
                        match.status === 'playing' ? 'border-blue-400 bg-blue-900 bg-opacity-20' :
                        isCurrentMatch ? 'border-purple-400 bg-purple-900 bg-opacity-20' :
                        'border-gray-500'
                      }`}
                    >
                      {/* Match Status Badge */}
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          match.status === 'finished' ? 'bg-green-600 text-white' :
                          match.status === 'playing' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-gray-300'
                        }`}>
                          {match.status === 'finished' ? 'Finished' :
                           match.status === 'playing' ? 'Playing' :
                           'Pending'}
                        </span>
                        {isCurrentMatch && (
                          <span className="text-xs px-2 py-1 rounded bg-purple-600 text-white">Current</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {/* Player 1 */}
                        <div className={`flex items-center justify-between gap-2 p-2 rounded ${
                          match.winner?.id === match.player1?.id ? 'bg-green-600' :
                          match.status === 'playing' && isCurrentMatch ? 'bg-blue-600 bg-opacity-50' :
                          'bg-gray-600'
                        }`}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {match.player1 ? (
                              <>
                                <img src={match.player1.avatar} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0 border-2 border-white" />
                                <span className="text-white truncate text-xs sm:text-sm font-semibold">{match.player1.name}</span>
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs">{t('game.tbd')}</span>
                            )}
                          </div>
                          {scores && (
                            <span className={`text-sm sm:text-base font-bold ${
                              match.winner?.id === match.player1?.id ? 'text-yellow-300' : 'text-white'
                            }`}>
                              {scores.player1Score}
                            </span>
                          )}
                          {match.winner?.id === match.player1?.id && (
                            <FaCrown className="text-yellow-400 flex-shrink-0" />
                          )}
                        </div>

                        {/* VS Separator */}
                        {match.player1 && match.player2 && (
                          <div className="text-center text-xs text-gray-400 font-semibold">VS</div>
                        )}

                        {/* Player 2 */}
                        <div className={`flex items-center justify-between gap-2 p-2 rounded ${
                          match.winner?.id === match.player2?.id ? 'bg-green-600' :
                          match.status === 'playing' && isCurrentMatch ? 'bg-blue-600 bg-opacity-50' :
                          'bg-gray-600'
                        }`}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {match.player2 ? (
                              <>
                                <img src={match.player2.avatar} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0 border-2 border-white" />
                                <span className="text-white truncate text-xs sm:text-sm font-semibold">{match.player2.name}</span>
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs">{t('game.tbd')}</span>
                            )}
                          </div>
                          {scores && (
                            <span className={`text-sm sm:text-base font-bold ${
                              match.winner?.id === match.player2?.id ? 'text-yellow-300' : 'text-white'
                            }`}>
                              {scores.player2Score}
                            </span>
                          )}
                          {match.winner?.id === match.player2?.id && (
                            <FaCrown className="text-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Start Match Button */}
          {currentMatch && currentMatch.player1 && currentMatch.player2 && currentMatch.status === 'pending' && (
            <div className="flex justify-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTournamentStep('versus')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold text-base sm:text-lg transition-all shadow-lg border border-white/20"
              >
                {t('game.startMatch')}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Playing Phase
  if (tournamentStep === 'playing' && currentMatch && currentMatch.player1 && currentMatch.player2) {
    const player1 = currentMatch.player1;
    const player2 = currentMatch.player2;

    return (
      <div
        ref={gameContainerRef}
        tabIndex={-1}
        className={`flex flex-col items-center justify-center w-full transition-all duration-300 focus:outline-none ${
          isFullscreen
            ? 'h-screen bg-black p-4'
            : 'w-full h-full'
        }`}
      >
        <div className={`w-full flex flex-col items-center ${isFullscreen ? 'h-full justify-center' : 'max-w-4xl'}`}>
          {/* Player Profile Images - Shown at top of game table */}
          {!isFullscreen && (
            <div className="w-full max-w-4xl mb-4 px-4">
              <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
                {/* Player 1 */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <img
                      src={player1.avatar}
                      alt={player1.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-400 shadow-lg"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                      {player1.name}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">Left Paddle (W/S)</p>
                  </div>
                </div>

                {/* VS Separator */}
                <div className="mx-4 sm:mx-6 flex-shrink-0">
                  <span className="text-yellow-400 font-bold text-lg sm:text-xl md:text-2xl">VS</span>
                </div>

                {/* Player 2 */}
                <div className="flex items-center gap-3 flex-1 flex-row-reverse text-right">
                  <div className="relative">
                    <img
                      src={player2.avatar}
                      alt={player2.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-red-400 shadow-lg"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold text-sm sm:text-base md:text-lg truncate">
                      {player2.name}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">Right Paddle (↑/↓)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Player Profile Images in Fullscreen - Minimal */}
          {isFullscreen && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={player1.avatar}
                    alt={player1.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
                  />
                  <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                    {player1.name}
                  </span>
                </div>
                <span className="text-yellow-400 font-bold">VS</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                    {player2.name}
                  </span>
                  <img
                    src={player2.avatar}
                    alt={player2.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Game Container */}
          <div className={`w-full flex justify-center ${isFullscreen ? 'flex-1 items-center' : 'mb-4'}`}>
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
                tournamentPlayers={[player1, player2]}
                onTournamentMatchEnd={handleMatchComplete}
                isTournamentFinalMatch={isLastMatch}
              />
            </div>
          </div>

          {/* Controls - Hidden in fullscreen */}
          {!isFullscreen && (
            <div className="w-full max-w-2xl mt-4 text-center">
              <button
                onClick={toggleFullscreen}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              >
                <IoExpand className="w-5 h-5" />
                <span>Fullscreen</span>
              </button>
            </div>
          )}

          {/* Minimal UI in Fullscreen - Fixed Bottom */}
          {isFullscreen && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700 shadow-xl">
              <div className="flex items-center gap-4 text-white text-sm flex-wrap justify-center">
                <div>
                  <span className="opacity-70">P1: </span>
                  <span className="font-semibold">W / S</span>
                  <span className="opacity-70 ml-3">P2: </span>
                  <span className="font-semibold">↑ / ↓</span>
                </div>
                <div className="h-4 w-px bg-gray-600"></div>
                <button
                  onClick={toggleFullscreen}
                  className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <IoContract className="w-4 h-4" />
                  Exit Fullscreen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Finished Phase
  if (tournamentStep === 'finished') {
    const champion = gameState.tournament?.bracket?.find(m => m.round === Math.max(...(gameState.tournament?.bracket?.map(m => m.round) || [1])))?.winner;

    return (
      <div className="relative flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <Confetti />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative z-20 w-full max-w-2xl mx-auto bg-gray-900 bg-opacity-95 rounded-xl shadow-2xl border-2 border-yellow-500 p-6 sm:p-8 text-center"
        >
          <motion.h2
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 bg-clip-text text-transparent"
          >
            {t('game.tournamentChampion')}
          </motion.h2>
          {champion && (
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md animate-pulse"></div>
                <img
                  src={champion.avatar}
                  alt={champion.name}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 shadow-xl object-cover"
                />
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2"
                >
                  <FaCrown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
                </motion.div>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-wide">{champion.name}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={onBackToGameMenu}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-sm" />
              <span>{t('game.backToGameMenu') || 'Back to Game Lobby'}</span>
            </button>
            <button
              onClick={() => {
                setTournamentStep('setup');
                setCurrentMatchIndex(0);
                setMatchWinner(null);
                setShowTournamentWinnerMessage(false);
                setRegisteredPlayers([]);
                setTempPlayers([]);
                setMatchScores({});
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
            >
              {t('game.playAgain')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default: go back to setup
  return null;
};

export default LocalTournamentManager;

