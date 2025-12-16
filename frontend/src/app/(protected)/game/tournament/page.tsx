'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext, Player, TournamentMatch } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { getWebSocket } from '@/components/globalSocket';
import { useUserStore } from '@/store/userStore';
import { FaUser, FaUpload, FaCrown, FaTrophy, FaGamepad, FaSearch, FaCheck, FaTimes as FaReject, FaClock, FaTimes } from 'react-icons/fa';
import { IoExpand, IoContract } from 'react-icons/io5';
import axios from 'axios';
import { getBackendURL } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '@/contexts/LanguageContext';
import { ServerGameState } from '@/types/game';

// Move PlayerRegistration outside to prevent re-creation
interface PlayerRegistrationProps {
  tempPlayers: Player[];
  defaultAvatars: string[];
  playerCount: number;
  updatePlayer: (index: number, field: keyof Player, value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

interface RemoteTournament {
  id: string;
  name: string;
  host: Player;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'in-progress' | 'finished' | 'playing' | 'completed';
  isPrivate: boolean;
  registeredPlayers?: Player[];
  playerCount?: number;
  type?: string;
  bracket?: any[];
  champion?: Player;
}

interface JoinRequest {
  id: string;
  player: Player;
  tournamentId: string;
  status: 'pending' | 'approved' | 'declined';
  timestamp?: number;
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
    <div className="w-full max-w-6xl mx-auto h-full bg-gray-900 bg-opacity-90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-3 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300 mb-4 sm:mb-6 text-center">{t('game.registerPlayers')}</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {tempPlayers.map((player, index) => (
          <div key={player.id} className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-400">
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
          </div>
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
    </div>
  );
});

PlayerRegistration.displayName = 'PlayerRegistration';

export default function TournamentPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const { gameState, setGameMode, setPlayers, setTournament, updateTournamentMatch, setCustomisation } = useGameContext();
  const [tournamentStep, setTournamentStep] = useState<'setup' | 'registration' | 'customization' | 'playing' | 'bracket' | 'finished' | 'search' | 'browse' | 'createOptions'>('setup');

  const [startFinalMatchManually, setStartFinalMatchManually] = useState(false);


  // Log tournamentStep changes
  useEffect(() => {
    console.log('[Frontend] Tournament step changed to:', tournamentStep);
  }, [tournamentStep]);
  const [tournamentType, setTournamentType] = useState<'local' | 'remote'>('local');
  const [playerCount, setPlayerCount] = useState<4>(4);
  const [registeredPlayers, setRegisteredPlayers] = useState<Player[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [remoteTournament, setRemoteTournament] = useState<RemoteTournament | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [tournamentId, setTournamentId] = useState('');
  const [tempPlayers, setTempPlayers] = useState<Player[]>([]);
  const [matchWinner, setMatchWinner] = useState<Player | null>(null);
  const [showTournamentWinnerMessage, setShowTournamentWinnerMessage] = useState(false);
  const [showMatchCompletionModal, setShowMatchCompletionModal] = useState(false);
  // REMOVED: showRound1WinnerBadge - no badge between Round 1 and Round 2
  const [isMatchActive, setIsMatchActive] = useState(false); // Prevent auto-switching during active match
  const [showLoserOptionsModal, setShowLoserOptionsModal] = useState(false);
  const [finishedMatchRound, setFinishedMatchRound] = useState<number | null>(null);
  const gameContainerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStartingTournament, setIsStartingTournament] = useState(false);
  const [isReadyForFinalMatch, setIsReadyForFinalMatch] = useState(false);
  const [waitingForOtherWinner, setWaitingForOtherWinner] = useState(false);

  // New state for tournament search and join requests
  const [availableTournaments, setAvailableTournaments] = useState<RemoteTournament[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [pendingJoinRequest, setPendingJoinRequest] = useState<string | null>(null);
  const [friends, setFriends] = useState<Player[]>([]);
  const [tournamentInvites, setTournamentInvites] = useState<any[]>([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showFriendsListModal, setShowFriendsListModal] = useState(false);
  const [isFindingRandomOpponent, setIsFindingRandomOpponent] = useState(false);
  const [shouldAutoFindRandomOpponent, setShouldAutoFindRandomOpponent] = useState(false);
  const [shouldShowFriendsModalAfterCreation, setShouldShowFriendsModalAfterCreation] = useState(false);
  const [showFriendsListExpanded, setShowFriendsListExpanded] = useState(false);
  const [showRandomOpponentExpanded, setShowRandomOpponentExpanded] = useState(false);
  const [tournamentCancelledMessage, setTournamentCancelledMessage] = useState<string | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [pendingTournamentIdFromStorage, setPendingTournamentIdFromStorage] = useState<string | null>(null);

  // Remote tournament game state
  const [serverGameState, setServerGameState] = useState<any>(null);

  // Log serverGameState changes
  useEffect(() => {
    if (serverGameState) {
      console.log('[Frontend] serverGameState updated:', {
        player1Score: serverGameState.player1?.score,
        player2Score: serverGameState.player2?.score,
        tournamentStep,
        tournamentType
      });
    } else {
      console.log('[Frontend] serverGameState is null');
    }
  }, [serverGameState, tournamentStep, tournamentType]);
  const [opponentLeft, setOpponentLeft] = useState(false);

  // Game started animation
  const [showGameStartedAnimation, setShowGameStartedAnimation] = useState(false);
  const [shouldAutoStartMatch, setShouldAutoStartMatch] = useState(false);



  // Default avatars - moved outside to prevent recreation
  const defaultAvatars = React.useMemo(() => [
    'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCMDKvDLrPdTJtG5O4y3W61Wdqg20GwOOpUA&s',
    'https://www.shutterstock.com/image-vector/black-woman-smiling-portrait-vector-600nw-2281497689.jpg',
    'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    'https://cdn-icons-png.flaticon.com/512/149/149452.png',
    'https://cdn-icons-png.flaticon.com/512/149/149995.png'
  ], []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.access_token) return;

      try {
        const response = await axios.get(`${getBackendURL()}/getUserStats`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);

      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          clearUser();
          router.push('/login');
        }
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [user?.access_token, setUser, clearUser, router]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        try {
          const response = await axios.get(`${getBackendURL()}/GetFriends`, {
            params: { username: user.username },
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          });
          // Map the API response to Player format
          const mappedFriends: Player[] = (response.data || []).map((friend: any) => ({
            id: friend.id_user?.toString() || friend.id?.toString() || '',
            name: friend.username || friend.name || 'Unknown',
            avatar: friend.profile_img || friend.avatar || defaultAvatars[0],
            color: '#10B981'
          }));
          setFriends(mappedFriends);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      }
    };
    fetchFriends();
  }, [user, defaultAvatars]);

  // Initialize tempPlayers only when needed
  useEffect(() => {
    if (tournamentType === 'local') {
      setTempPlayers([
        { name: user?.username || 'Host Player', avatar: user?.avatar || defaultAvatars[0], color: '#3B82F6', id: user?.id_user?.toString() || '1' },
        ...Array(playerCount - 1).fill(null).map((_, i) => ({
          name: '',
          avatar: defaultAvatars[i + 1],
          color: ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'][i],
          id: (i + 2).toString()
        }))
      ]);
    }
  }, [playerCount, tournamentType, defaultAvatars, user]);

  // Read pendingTournamentId from sessionStorage safely (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingId = sessionStorage.getItem('pendingTournamentId');
      setPendingTournamentIdFromStorage(pendingId);
    }
  }, []);

  useEffect(() => {
    setGameMode('tournament');

    // Check if user is coming from accepting an invite (check sessionStorage)
    // Only access sessionStorage in browser environment
    if (typeof window === 'undefined') return;

    const pendingTournamentId = sessionStorage.getItem('pendingTournamentId');
    const pendingTournament = sessionStorage.getItem('pendingTournament');
    const isInvitedPlayer = sessionStorage.getItem('isInvitedPlayer') === 'true';
    const savedTournamentStep = sessionStorage.getItem('tournamentStep');

    if (pendingTournamentId && pendingTournament && !tournamentId && !remoteTournament) {
      try {
        const tournament = JSON.parse(pendingTournament);
        // User just accepted an invite - set up state immediately
        setRemoteTournament(tournament);
        setTournamentId(pendingTournamentId);
        setTournamentType('remote'); // CRITICAL: Set to remote
        const isUserHost = tournament.host.id === user?.id_user?.toString() || tournament.host.id === user?.id_user;
        setIsHost(isUserHost);
        // CRITICAL: Invited players (non-host) should NEVER see setup screen
        // Always go to registration (Tournament Lobby) screen for invited players
        // If they're the host, they'll be redirected to customization when tournament is full
        if (isInvitedPlayer || !isUserHost) {
          // This is an invited friend - force them to Tournament Lobby
          setTournamentStep('registration');
        } else {
          // This is the host - use saved step or default to registration
          setTournamentStep(savedTournamentStep === 'registration' ? 'registration' : 'registration');
        }

        // Clear sessionStorage (only in browser)
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pendingTournamentId');
          sessionStorage.removeItem('pendingTournament');
          sessionStorage.removeItem('isInvitedPlayer');
          sessionStorage.removeItem('tournamentStep');
          setPendingTournamentIdFromStorage(null); // Update state to reflect clearing
        }
      } catch (err) {
        console.error('Error parsing pending tournament:', err);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pendingTournamentId');
          sessionStorage.removeItem('pendingTournament');
          sessionStorage.removeItem('isInvitedPlayer');
          sessionStorage.removeItem('tournamentStep');
          setPendingTournamentIdFromStorage(null); // Update state to reflect clearing
        }
      }
    } else if (!pendingTournamentId && !pendingTournament && !tournamentId && !remoteTournament) {
      // If user navigates directly to /game/tournament without any tournament context,
      // check if they might be in a tournament by looking at URL params or checking backend
      // For now, keep them on setup screen (they can create or join)
    }
  }, []); // Empty dependency array since we only want this to run once

  // Check on page load if user is already in a remote tournament (e.g., from accepting an invite)
  useEffect(() => {
    // If we don't have tournament data yet, request it
    if (!tournamentId && !remoteTournament && user?.id_user) {
      const ws = getWebSocket();
      if (ws) {
        const checkTournament = () => {
          if (ws.readyState === WebSocket.OPEN) {
            // Send user ID for authentication
            ws.send(String(user.id_user));

            // Request tournament list after a short delay to ensure auth is processed
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'game',
                  action: 'searchTournaments',
                  payload: {}
                }));
              }
            }, 500);
          } else if (ws.readyState === WebSocket.CONNECTING) {
            // Wait for connection
            ws.addEventListener('open', checkTournament, { once: true });
          }
        };

        checkTournament();
      }
    }
  }, [tournamentId, remoteTournament, user?.id_user]);

  // Effect to handle invalid match states
  useEffect(() => {
    if (tournamentStep === 'playing') {
      const currentMatch = gameState.tournament?.bracket[currentMatchIndex];
      if (!currentMatch || !currentMatch.player1 || !currentMatch.player2) {
        // If no valid match and match is not active, go back to bracket view (only for local tournaments)
        if (!isMatchActive && tournamentType === 'local') {
        setTournamentStep('bracket');
      } else if (!isMatchActive && tournamentType === 'remote') {
        // For remote tournaments, redirect to game lobby if no valid match
        router.push('/game');
      }
      } else if (currentMatch.status !== 'finished') {
        // Match is valid and not finished - mark as active
        setIsMatchActive(true);
      }
    } else if (tournamentStep !== 'playing') {
      // Reset match active state when not playing
      setIsMatchActive(false);
    }
  }, [tournamentStep, currentMatchIndex, gameState.tournament?.bracket?.length, isMatchActive]);

  // Effect to auto-find random opponent when tournament is created
  useEffect(() => {
    if (shouldAutoFindRandomOpponent && tournamentId && socket && isHost) {
      // Small delay to ensure tournament is fully set up
      const timer = setTimeout(() => {
        findRandomOpponent();
        // Keep shouldAutoFindRandomOpponent true so it continues searching
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoFindRandomOpponent, tournamentId, socket, isHost, remoteTournament]);

  // Separate useEffect for WebSocket management
  useEffect(() => {
    // Always set up WebSocket to handle tournament messages
    const ws = getWebSocket();
    setSocket(ws);

    const handleMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'tournamentCreated':
            setRemoteTournament(message.data.tournament);
            setIsHost(true);
            setTournamentId(message.data.tournamentId);
            setTournamentType('remote'); // Ensure type is set
            // Don't redirect to registration - stay on createOptions page
            // Only redirect when tournament is full (4 players)
            if (message.data.tournament.registeredPlayers?.length >= playerCount) {
            setTournamentStep('registration');
            }
            break;

          case 'tournamentJoined':
            // User accepted an invitation and joined a tournament
            setRemoteTournament(message.data.tournament);
            // Check if user is the host
            const isUserHost = message.data.tournament?.host?.id === user?.id_user?.toString() ||
                              message.data.tournament?.host?.id === user?.id_user;
            setIsHost(isUserHost);
            setTournamentId(message.data.tournamentId);
            setTournamentType('remote'); // CRITICAL: Set type to remote
            // CRITICAL: Invited friends (non-host) should ALWAYS see Tournament Lobby, never Setup
            // Only host can see setup/customization screens
            if (!isUserHost) {
              // This is an invited friend - force them to Tournament Lobby
              setTournamentStep('registration');
            } else {
              // This is the host - they can see setup/customization
              // But if tournament is full, go to customization
              const currentPlayers = message.data.tournament?.registeredPlayers?.length || 0;
              if (currentPlayers >= playerCount) {
                setTournamentStep('customization');
              } else {
                setTournamentStep('registration');
              }
            }
            setIsFindingRandomOpponent(false);
            setShowFriendsListExpanded(false);
            setShowRandomOpponentExpanded(false);
            break;

          case 'tournamentUpdated':
            console.log('[Frontend] Received tournamentUpdated message:', {
              status: message.data?.status,
              hasBracket: !!message.data?.bracket,
              bracketLength: message.data?.bracket?.length,
              currentPlayers: message.data?.currentPlayers,
              maxPlayers: message.data?.maxPlayers,
              bracket: message.data?.bracket?.map(m => ({
                id: m.id,
                round: m.round,
                status: m.status,
                roomCode: m.roomCode,
                player1Id: m.player1?.id,
                player2Id: m.player2?.id
              }))
            });
            setRemoteTournament(message.data);
            const currentPlayers = message.data.registeredPlayers?.length || 0;

            // If tournament is full (4 players)
            if (currentPlayers >= playerCount) {
              // Stop searching
              setIsFindingRandomOpponent(false);
              setShouldAutoFindRandomOpponent(false);
              setShowRandomOpponentExpanded(false);

              // If host and tournament is full, show customization option
              if (isHost && tournamentStep !== 'customization' && tournamentStep !== 'playing' && tournamentStep !== 'bracket') {
                // Only show customization if tournament hasn't started yet
                if (message.data.status !== 'playing') {
                  setTournamentStep('customization');
                }
              } else if (!isHost && tournamentStep !== 'playing' && (tournamentType === 'local' ? tournamentStep !== 'bracket' : true)) {
                // Non-host players stay on registration (waiting) screen
                setTournamentStep('registration');
              }
            } else if (currentPlayers < playerCount && isHost && tournamentStep === 'createOptions') {
              // If tournament is not full and we're still on createOptions page, continue searching
              // Only continue if we were already searching (shouldAutoFindRandomOpponent or isFindingRandomOpponent)
              if (shouldAutoFindRandomOpponent || isFindingRandomOpponent) {
                // Continue searching for more players
                setTimeout(() => {
                  if (socket && tournamentId && currentPlayers < playerCount) {
                    findRandomOpponent();
                  }
                }, 1000); // Small delay before searching again
              }
            } else {
              setIsFindingRandomOpponent(false);
              setShouldAutoFindRandomOpponent(false);
            }

            if (message.data.status === 'playing') {
              console.log('[Frontend] Tournament status changed to "playing"');
              console.log('[Frontend] Tournament data:', {
                bracket: message.data.bracket,
                registeredPlayers: message.data.registeredPlayers,
                bracketLength: message.data.bracket?.length
              });

              // Tournament has started - set bracket and players in game context
              if (message.data.bracket && message.data.registeredPlayers) {
                console.log('[Frontend] Setting tournament bracket and players');
                setTournament({
                  type: 'remote',
                  playerCount: message.data.playerCount || playerCount,
                  status: 'playing',
                  currentMatch: 0,
                  bracket: message.data.bracket
                });
                setPlayers(message.data.registeredPlayers);

                // CRITICAL: Find the user's actual match instead of defaulting to Match 1
                // This prevents Match 2 players from starting with Match 1's index
                const userId = user?.id_user?.toString();
                if (userId && message.data.bracket) {
                  const userMatch = message.data.bracket.find((m: any) =>
                    m.player1 && m.player2 &&
                    (m.player1.id?.toString() === userId || m.player1.id === parseInt(userId) ||
                     m.player2.id?.toString() === userId || m.player2.id === parseInt(userId)) &&
                    m.round === 1
                  );
                  if (userMatch) {
                    const matchIndex = message.data.bracket.findIndex((m: any) => m.id === userMatch.id);
                    if (matchIndex !== -1) {
                      console.log('[Frontend] Setting currentMatchIndex to user\'s actual match:', {
                        matchIndex,
                        matchId: userMatch.id,
                        userId
                      });
                      setCurrentMatchIndex(matchIndex);
                    } else {
                      console.warn('[Frontend] Could not find match index for user match, defaulting to 0');
                setCurrentMatchIndex(0);
              }
                  } else {
                    console.warn('[Frontend] User not found in any Round 1 match, defaulting to 0');
                    setCurrentMatchIndex(0);
                  }
                } else {
                  setCurrentMatchIndex(0);
                }
              }

              // Only show animation and transition if not already in a match
              // REMOVED: Bracket view removed for remote tournaments
              if (!isMatchActive && tournamentStep !== 'playing') {
                if (tournamentType === 'local') {
                  // Show "Game started" animation first, then go to bracket (local tournaments only)
                console.log('[Frontend] Showing game started animation, will transition to bracket in 3s');
                setShowGameStartedAnimation(true);
                // After animation, go to bracket
                setTimeout(() => {
                  console.log('[Frontend] Animation complete, transitioning to bracket step');
                  setShowGameStartedAnimation(false);
              setTournamentStep('bracket');
                  // Auto-start match if player is in the first match
                  console.log('[Frontend] Setting shouldAutoStartMatch to true');
                  setShouldAutoStartMatch(true);
                }, 3000); // 3 second animation
                } else {
                  // For remote tournaments, go directly to playing step
                  setTournamentStep('playing');
                  setShouldAutoStartMatch(true);
                }
              }
            }

            // Update bracket when matches finish (for remote tournaments)
            // ALWAYS update bracket state, even if match is active, so players can see other match status
            if (tournamentType === 'remote' && message.data.bracket) {
              const updatedBracket = message.data.bracket;
              const currentBracket = gameState.tournament?.bracket || [];

              // Check if any match status changed to 'finished' or 'playing'
              const hasChanges = updatedBracket.some((updatedMatch: any, index: number) => {
                const currentMatch = currentBracket[index];
                return !currentMatch ||
                       currentMatch.status !== updatedMatch.status ||
                       (updatedMatch.winner && currentMatch.winner?.id !== updatedMatch.winner.id);
              });

              if (hasChanges) {
                console.log('[Frontend] Bracket updated - matches finished or final match started', {
                  isMatchActive,
                  updatedBracket: updatedBracket.map((m: any) => ({
                    id: m.id,
                    round: m.round,
                    status: m.status,
                    hasWinner: !!m.winner
                  }))
                });

                // ALWAYS update tournament bracket state (even if match is active)
                // This ensures all players see bracket updates regardless of their match status
              const currentTournament = gameState.tournament;
              if (currentTournament) {
                setTournament({
                  ...currentTournament,
                  bracket: updatedBracket
                });
                  console.log('[Frontend] Tournament bracket state updated (isMatchActive:', isMatchActive, ')');
                }

                // Check if current user's match has finished
                const userId = user?.id_user?.toString();
                if (userId) {
                  // PRIORITY: Check final match (Round 2) first - if it's finished, don't process Round 1 matches
                  const finalMatchFinished = updatedBracket.find((m: any) =>
                    m.round === 2 &&
                    m.player1 && m.player2 &&
                    (m.player1.id?.toString() === userId || m.player2.id?.toString() === userId) &&
                    m.status === 'finished' && m.winner
                  );

                  if (finalMatchFinished && finalMatchFinished.winner) {
                    // Final match is finished - this is the most recent match, show completion modal
                    console.log('[Frontend] Final match finished - showing completion modal');
                    setMatchWinner(finalMatchFinished.winner);
                    setShowMatchCompletionModal(true);
                    setShowTournamentWinnerMessage(true);
                    // Don't process Round 1 matches if final match is finished
                  } else {
                    // Final match not finished - check for Round 1 matches
                  const userMatch = updatedBracket.find((m: any) =>
                      m.round === 1 &&
                    m.player1 && m.player2 &&
                    (m.player1.id?.toString() === userId || m.player2.id?.toString() === userId) &&
                    m.status === 'finished' && m.winner
                  );

                  if (userMatch && userMatch.winner) {
                      // Check if current user is actually the winner
                      const isUserWinner = userId && (
                        (userMatch.winner.id?.toString() === userId || userMatch.winner.id === parseInt(userId)) ||
                        (userMatch.winner.id_user?.toString() === userId || userMatch.winner.id_user === parseInt(userId))
                      );

                      if (isUserWinner) {
                        // Current user's Round 1 match finished and user is the winner - but check if final match is ready
                        // Check for both 'playing' and 'pending' status (pending means room creation in progress or failed)
                        const finalMatch = updatedBracket.find((m: any) => m.round === 2 && (m.status === 'playing' || m.status === 'pending'));
                        if (finalMatch && finalMatch.player1 && finalMatch.player2 && finalMatch.roomCode && finalMatch.status === 'playing') {
                      const isUserInFinal =
                        (finalMatch.player1.id?.toString() === userId || finalMatch.player1.id === parseInt(userId)) ||
                        (finalMatch.player2.id?.toString() === userId || finalMatch.player2.id === parseInt(userId));

                          // DISABLED: Auto-transition to final match
                          // Final match should only start when both winners manually click "Proceed to Final Match"
                          // REMOVED: No badges or messages for Round 1 winners
                      if (isUserInFinal && userMatch.round === 1) {
                            // REMOVED: No completion modal for Round 1 winners
                            console.log('[Frontend] User won Round 1 - no badge/message shown');
                        setMatchWinner(userMatch.winner);
                            // Don't show modals for Round 1 winners
                      } else {
                            // REMOVED: No completion modal for Round 1 winners
                            console.log('[Frontend] Current user match finished - no badge/message for Round 1 winner');
                        setMatchWinner(userMatch.winner);
                            // Don't show modals for Round 1 winners
              }
                    } else {
                          // REMOVED: No completion modal for Round 1 winners
                          console.log('[Frontend] Current user match finished - no badge/message for Round 1 winner');
                      setMatchWinner(userMatch.winner);
                        // Don't show modals for Round 1 winners
              }
                    } else {
                        // User is NOT the winner - don't show winner badge
                        console.log('[Frontend] User lost Round 1 match - not showing winner badge');
                      setMatchWinner(userMatch.winner);
                        // Don't set showRound1WinnerBadge for losers
                    }
                  } else {
                      // Check if final match (Round 2) is ready and user is in it
                      // NOTE: Do NOT auto-request room creation - players must click "Proceed to Final Match" button
                      const finalMatch = updatedBracket.find((m: any) => m.round === 2 && (m.status === 'playing' || m.status === 'pending'));

                      // If final match has players but no roomCode, the button will appear for Round 1 winners
                      // They must manually click "Proceed to Final Match" to create the room
                      if (finalMatch && finalMatch.player1 && finalMatch.player2 && !finalMatch.roomCode && finalMatch.status === 'pending') {
                        const isUserInFinal = userId && (
                          finalMatch.player1.id?.toString() === userId ||
                          finalMatch.player2.id?.toString() === userId
                        );
                        if (isUserInFinal) {
                          console.log('[Frontend] Final match has players but no room - waiting for both players to click "Proceed to Final Match" button');
                          // DO NOT auto-request - players must click button
                        }
                      }
                    console.log('[Frontend] Checking for final match:', {
                      hasFinalMatch: !!finalMatch,
                      finalMatchStatus: finalMatch?.status,
                      finalMatchRoomCode: finalMatch?.roomCode,
                      finalMatchPlayer1Id: finalMatch?.player1?.id,
                      finalMatchPlayer2Id: finalMatch?.player2?.id,
                      currentUserId: userId
                    });

                    if (finalMatch && finalMatch.player1 && finalMatch.player2 && finalMatch.roomCode) {
                      const isUserInFinal =
                        (finalMatch.player1.id?.toString() === userId || finalMatch.player1.id === parseInt(userId)) ||
                        (finalMatch.player2.id?.toString() === userId || finalMatch.player2.id === parseInt(userId));

                      console.log('[Frontend] Final match found, checking if user is in it:', {
                        isUserInFinal,
                        userId,
                        player1Id: finalMatch.player1.id,
                        player2Id: finalMatch.player2.id
                      });

                      if (isUserInFinal) {
                        console.log('[Frontend] ✓✓✓ Final match is ready and user is in it, checking if user manually clicked ✓✓✓');
                        // Stop waiting animation only if user manually clicked
                        const finalMatchIndex = updatedBracket.findIndex((m: any) => m.id === finalMatch.id);

                        // ONLY transition if user manually clicked "Proceed to Final Match"
                        if (finalMatchIndex !== -1 && startFinalMatchManually === true) {
                          console.log('[Frontend] User manually clicked - transitioning to final match:', finalMatchIndex);
                          setWaitingForOtherWinner(false);
                          setIsReadyForFinalMatch(false);
                          setCurrentMatchIndex(finalMatchIndex);
                          setTournamentStep('playing');
                          setIsMatchActive(true);
                          setShouldAutoStartMatch(false);
                          setShowTournamentWinnerMessage(false);
                          setShowMatchCompletionModal(false);
                        } else {
                          console.log('[Frontend] Final match ready but user has not manually clicked - waiting for manual action:', {
                            finalMatchIndex,
                            startFinalMatchManually
                          });
                          // Keep waiting animation if user clicked but other player hasn't
                          if (isReadyForFinalMatch && waitingForOtherWinner) {
                            console.log('[Frontend] User is ready, waiting for other winner to click...');
                          }
                        }
                      } else {
                        console.log('[Frontend] User is not in final match, waiting...');
                      }
                    } else {
                      // If user is waiting for final match but it's not ready yet, keep showing waiting animation
                      if (isReadyForFinalMatch && waitingForOtherWinner) {
                        console.log('[Frontend] User is ready but final match not created yet, continuing to wait...');
                      } else {
                        console.log('[Frontend] Final match not ready yet:', {
                          hasFinalMatch: !!finalMatch,
                          hasPlayer1: !!finalMatch?.player1,
                          hasPlayer2: !!finalMatch?.player2,
                          hasRoomCode: !!finalMatch?.roomCode,
                          status: finalMatch?.status
                        });
                      }
                    }

                    // Check if OTHER matches (not current user's) have finished
                    // This allows players to see when other matches finish even while playing
                    const round1Matches = updatedBracket.filter((m: any) => m.round === 1);
                    const otherFinishedMatches = round1Matches.filter((m: any) =>
                      m.status === 'finished' &&
                      m.winner &&
                      !(m.player1?.id?.toString() === userId || m.player2?.id?.toString() === userId)
                    );

                    if (otherFinishedMatches.length > 0 && isMatchActive) {
                      // User is actively playing and another match finished
                      // Show a brief notification that other match finished
                      console.log('[Frontend] Other match(es) finished while user is playing:', otherFinishedMatches.map((m: any) => m.id));

                      // Find the other match that finished
                      const otherMatch = otherFinishedMatches[0];
                      if (otherMatch && otherMatch.winner) {
                        // Store notification to show in UI
                        // The bracket state is already updated, so when user's match finishes,
                        // the completion modal will show the correct status
                        console.log(`[Frontend] Match ${otherMatch.id} finished: ${otherMatch.winner.name} won`);
                        }
                      }
                    }
                  }
                }
              }
            }

            // Handle match room assignment for remote tournaments
            if (tournamentType === 'remote' && message.data.roomCode && message.data.matchId) {
              // Store roomCode for the current match
              const bracket = gameState.tournament?.bracket || [];
              const matchIndex = bracket.findIndex(m => m.id === message.data.matchId);
              if (matchIndex !== -1 && matchIndex === currentMatchIndex) {
                // This is the current match - we're ready to play
                // The gameState messages will come through WebSocket
              }
            }
            break;

          case 'gameState':
            // Handle game state updates for remote tournament matches
            const roomCode = message.roomCode; // Get roomCode from message if available
            const isMatch1 = message.matchId === 1;
            const isMatch2 = message.matchId === 2;
            const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : null);

            if (isMatch1 || isMatch2) {
              console.log(`[Frontend] ${matchLabel}: Received gameState message:`, {
                tournamentType,
                tournamentStep,
                hasPayload: !!message.payload,
                roomCode: roomCode,
                player1Id: message.payload?.player1?.id,
                player2Id: message.payload?.player2?.id,
                player1Username: message.payload?.player1?.username,
                player2Username: message.payload?.player2?.username,
                player1Score: message.payload?.player1?.score,
                player2Score: message.payload?.player2?.score,
                ballX: message.payload?.ball?.x,
                ballY: message.payload?.ball?.y,
                tournamentId: message.tournamentId,
                matchId: message.matchId,
                round: message.round,
                matchNumber: message.matchNumber,
                currentUserId: user?.id_user
              });
            } else {
              console.log('[Frontend] Received gameState message:', {
                tournamentType,
                tournamentStep,
                hasPayload: !!message.payload,
                roomCode: roomCode,
                player1Id: message.payload?.player1?.id,
                player2Id: message.payload?.player2?.id,
                player1Username: message.payload?.player1?.username,
                player2Username: message.payload?.player2?.username,
                tournamentId: message.tournamentId,
                matchId: message.matchId,
                round: message.round,
                matchNumber: message.matchNumber,
                currentUserId: user?.id_user
              });
            }

            // Verify roomCode matches current match if available
            if (roomCode && tournamentType === 'remote') {
              const bracket = gameState.tournament?.bracket || [];
              const currentMatch = bracket[currentMatchIndex];
              if (currentMatch && currentMatch.roomCode && currentMatch.roomCode !== roomCode) {
                console.warn('[Frontend] Received gameState for different room:', {
                  receivedRoomCode: roomCode,
                  expectedRoomCode: currentMatch.roomCode,
                  currentMatchIndex
                });
                // Still process it, but log the mismatch
              }
            }

            // Accept gameState if we're in remote tournament and either playing or bracket step
            // Accept gameState for remote tournaments when playing (bracket step not used for remote)
            if (tournamentType === 'remote' && tournamentStep === 'playing') {
              // Verify roomCode matches current match if available
              const receivedRoomCode = message.roomCode;
              const bracket = gameState.tournament?.bracket || [];
              const currentMatch = bracket[currentMatchIndex];
              const isFinalMatch = message.round === 2;

              // CRITICAL: Check if this is final match BEFORE rejecting roomCode mismatch
              // This allows Round 1 winners to receive final match gameState even if currentMatchIndex
              // still points to their Round 1 match
              if (receivedRoomCode && currentMatch && currentMatch.roomCode && currentMatch.roomCode !== receivedRoomCode) {
                // If this is final match gameState, allow it - we'll update currentMatchIndex below
                if (!isFinalMatch) {
                  console.warn('[Frontend] Received gameState for different room (not final match):', {
                  receivedRoomCode,
                  expectedRoomCode: currentMatch.roomCode,
                  currentMatchIndex,
                    currentMatchId: currentMatch.id,
                    messageRound: message.round
                });
                  // Don't process if it's for a different match (and not final match)
                break;
                } else {
                  console.log('[Frontend] Received final match gameState with different roomCode - will update currentMatchIndex:', {
                    receivedRoomCode,
                    currentRoomCode: currentMatch.roomCode,
                    currentMatchIndex,
                    currentMatchId: currentMatch.id,
                    messageRound: message.round
                  });
                }
              }

              // If we're still on bracket step but receiving gameState, transition to playing
              // Bracket step removed for remote tournaments - this should not happen
              // If somehow on bracket step for remote, transition to playing
              if (tournamentStep === 'playing' && !isMatchActive) {
                console.log('[Frontend] Received gameState - transitioning to playing');
                // Find the match by roomCode FIRST (most reliable), then verify user is in it
                const userId = user?.id_user?.toString();
                if (userId) {
                  let userMatch = null;

                  // Define matchLabel at the start for use throughout this block
                  const isMatch1 = message.matchId === 1;
                  const isMatch2 = message.matchId === 2;
                  const isFinalMatch = message.round === 2;
                  const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : (isFinalMatch ? 'FINAL MATCH' : null));

                  // Priority 1: If this is Round 2 (final match), find it
                  if (isFinalMatch) {
                    console.log('[Frontend] FINAL MATCH: Received gameState for Round 2 (final match)');
                    userMatch = bracket.find(m => m.round === 2 && m.status === 'playing');
                    if (userMatch && userMatch.player1 && userMatch.player2 && userId) {
                      const isPlayer1 = userMatch.player1.id?.toString() === userId || userMatch.player1.id === parseInt(userId);
                      const isPlayer2 = userMatch.player2.id?.toString() === userId || userMatch.player2.id === parseInt(userId);
                      if (isPlayer1 || isPlayer2) {
                        console.log(`[Frontend] FINAL MATCH: Found user in final match:`, {
                          userId,
                          isPlayer1,
                          isPlayer2,
                          player1Id: userMatch.player1.id,
                          player2Id: userMatch.player2.id,
                          roomCode: userMatch.roomCode,
                          matchId: userMatch.id
                        });
                      } else {
                        console.warn(`[Frontend] FINAL MATCH: User not in final match:`, {
                          userId,
                          matchPlayer1Id: userMatch.player1.id,
                          matchPlayer2Id: userMatch.player2.id
                        });
                        userMatch = null;
                      }
                    } else {
                      console.warn('[Frontend] FINAL MATCH: Could not find final match in bracket:', {
                        hasFinalMatch: !!userMatch,
                        hasPlayer1: !!userMatch?.player1,
                        hasPlayer2: !!userMatch?.player2,
                        status: userMatch?.status
                      });
                    }
                  }

                  // Priority 2: If this is Match 1 or Match 2 (Round 1), find the specific match
                  if (!userMatch && (isMatch1 || isMatch2)) {
                    const targetMatchId = message.matchId;
                    userMatch = bracket.find(m => m.id === targetMatchId && m.round === 1);
                    if (userMatch && userMatch.player1 && userMatch.player2 && userId) {
                      const isPlayer1 = userMatch.player1.id?.toString() === userId || userMatch.player1.id === parseInt(userId);
                      const isPlayer2 = userMatch.player2.id?.toString() === userId || userMatch.player2.id === parseInt(userId);
                      if (isPlayer1 || isPlayer2) {
                        console.log(`[Frontend] ${matchLabel}: Found user in ${matchLabel}:`, {
                          userId,
                          isPlayer1,
                          isPlayer2,
                          player1Id: userMatch.player1.id,
                          player2Id: userMatch.player2.id,
                          roomCode: userMatch.roomCode
                        });
                      } else {
                        console.warn(`[Frontend] ${matchLabel}: User not in ${matchLabel}:`, {
                          userId,
                          matchPlayer1Id: userMatch.player1.id,
                          matchPlayer2Id: userMatch.player2.id
                        });
                        userMatch = null;
                      }
                    }
                  }

                  // Priority 2: Find match by roomCode if provided (most accurate)
                  if (!userMatch && receivedRoomCode && userId) {
                    userMatch = bracket.find(m =>
                      m.roomCode === receivedRoomCode &&
                      m.player1 && m.player2 &&
                      (m.player1.id?.toString() === userId || m.player1.id === parseInt(userId) ||
                       m.player2.id?.toString() === userId || m.player2.id === parseInt(userId)) &&
                      (m.status === 'pending' || m.status === 'playing')
                    );
                    if (matchLabel) {
                      console.log(`[Frontend] ${matchLabel}: Looking for match by roomCode:`, {
                        receivedRoomCode,
                        foundMatch: userMatch?.id,
                        matchRoomCode: userMatch?.roomCode
                      });
                    } else {
                      console.log('[Frontend] Looking for match by roomCode:', {
                        receivedRoomCode,
                        foundMatch: userMatch?.id,
                        matchRoomCode: userMatch?.roomCode
                      });
                    }
                  }

                  // Priority 3: If no roomCode match found, find by user ID (fallback)
                  if (!userMatch && userId) {
                    userMatch = bracket.find(m =>
                      m.player1 && m.player2 &&
                      (m.player1.id?.toString() === userId || m.player1.id === parseInt(userId) ||
                       m.player2.id?.toString() === userId || m.player2.id === parseInt(userId)) &&
                      (m.status === 'pending' || m.status === 'playing')
                    );
                    if (matchLabel) {
                      console.log(`[Frontend] ${matchLabel}: Looking for match by user ID (fallback):`, {
                        userId,
                        foundMatch: userMatch?.id,
                        matchRoomCode: userMatch?.roomCode
                      });
                    } else {
                      console.log('[Frontend] Looking for match by user ID (fallback):', {
                        userId,
                        foundMatch: userMatch?.id,
                        matchRoomCode: userMatch?.roomCode
                      });
                    }
                  }

                  if (userMatch) {
                    // DISABLED: Auto-transition for final match (Round 2)
                    // Final match should only start when both winners manually click "Proceed to Final Match"
                    // However, if user is already in the final match (manually transitioned), allow gameState updates
                    if (userMatch.round === 2) {
                      // Check if user is already playing the final match
                      const finalMatchIndex = bracket.findIndex(m => m.id === userMatch.id);
                      const isAlreadyInFinalMatch = finalMatchIndex === currentMatchIndex && tournamentStep === 'playing';

                      if (isAlreadyInFinalMatch) {
                        // User is already in final match - allow gameState updates (don't break)
                        console.log('[Frontend] Final match gameState received - user already in final match, allowing gameState updates');
                        setIsMatchActive(true);
                        // Update currentMatchIndex to final match if not already set
                        if (finalMatchIndex !== currentMatchIndex) {
                          console.log('[Frontend] Updating currentMatchIndex to final match:', finalMatchIndex);
                          setCurrentMatchIndex(finalMatchIndex);
                        }
                      } else {
                        // User not yet in final match - ONLY transition if they've manually clicked
                        // Final match should ONLY start when both winners manually click "Proceed to Final Match"
                        if (startFinalMatchManually && finalMatchIndex !== -1) {
                          // User manually clicked - transition immediately
                          console.log('[Frontend] User manually clicked - transitioning to final match and processing gameState');
                          setCurrentMatchIndex(finalMatchIndex);
                          setTournamentStep('playing');
                          setIsMatchActive(true);
                          setWaitingForOtherWinner(false);
                          setIsReadyForFinalMatch(false);
                          setShowMatchCompletionModal(false);
                          setShowTournamentWinnerMessage(false);
                        } else {
                          // Don't transition - user must manually click "Proceed to Final Match" button
                          console.log('[Frontend] Final match gameState received but user has not manually clicked - waiting for manual action', {
                            startFinalMatchManually
                          });
                          // Break to prevent auto-transition - user must click button first
                          break;
                        }
                      }
                    } else {
                      // Round 1 match - allow auto-transition
                    const matchIndex = bracket.findIndex(m => m.id === userMatch.id);
                    if (matchIndex !== -1) {
                      console.log('[Frontend] Auto-transitioning to playing step for match:', {
                        matchIndex,
                        matchId: userMatch.id,
                        roomCode: userMatch.roomCode,
                          round: userMatch.round,
                          isFinalMatch: userMatch.round === 2
                      });
                      setCurrentMatchIndex(matchIndex);
                      setTournamentStep('playing');
                      setShouldAutoStartMatch(false);
                      setIsMatchActive(true);
                      }
                    }
                  } else {
                    console.warn('[Frontend] Received gameState but could not find user match in bracket:', {
                      userId,
                      receivedRoomCode,
                      bracketMatches: bracket.map(m => ({
                        id: m.id,
                        round: m.round,
                        roomCode: m.roomCode,
                        player1Id: m.player1?.id,
                        player2Id: m.player2?.id,
                        status: m.status
                      }))
                    });
                  }
                }
              }

              // Only set serverGameState if we're on the correct match (bracket step not used for remote)
              if (tournamentStep === 'playing') {
                // CRITICAL: Verify this gameState is for the user's actual match BEFORE accepting it
                // This prevents Match 1 and Match 2 from mixing states
                const userId = user?.id_user?.toString();
                let shouldAcceptGameState = false;

                // Find the match this gameState belongs to
                let targetMatch = null;
                if (receivedRoomCode) {
                  // Priority 1: Find by roomCode (most reliable) - works for both Round 1 and Round 2
                  targetMatch = bracket.find((m: any) => m.roomCode === receivedRoomCode);
                }
                if (!targetMatch && message.matchId) {
                  // Priority 2: Find by matchId - check both Round 1 and Round 2 (final match)
                  targetMatch = bracket.find((m: any) => m.id === message.matchId && (m.round === 1 || m.round === 2));
                }

                // Verify the user is actually in this match
                if (targetMatch && userId) {
                  const isUserInMatch =
                    (targetMatch.player1?.id?.toString() === userId || targetMatch.player1?.id === parseInt(userId)) ||
                    (targetMatch.player2?.id?.toString() === userId || targetMatch.player2?.id === parseInt(userId));

                  if (isUserInMatch) {
                    // Update currentMatchIndex if it's wrong
                    const correctMatchIndex = bracket.findIndex((m: any) => m.id === targetMatch.id);

                    // CRITICAL: For final match (Round 2), check manual click BEFORE setting index or transitioning
                    if (targetMatch.round === 2) {
                      if (tournamentStep === 'playing' && (isMatchActive || correctMatchIndex === currentMatchIndex)) {
                        // User is already playing final match - allow gameState updates
                        console.log('[Frontend] Final match gameState - user already in final match, updating gameState');
                        // Ensure match is marked as active
                        setIsMatchActive(true);
                        shouldAcceptGameState = true;
                        // Update index if needed (user already in match)
                        if (correctMatchIndex !== -1 && correctMatchIndex !== currentMatchIndex) {
                          setCurrentMatchIndex(correctMatchIndex);
                        }
                      } else {
                        // User not yet in final match - ONLY transition if manually initiated
                        if (startFinalMatchManually) {
                          // User manually clicked "Proceed to Final Match" - transition and process gameState
                          console.log('[Frontend] Final match gameState received - user manually clicked button, transitioning and processing gameState');
                          if (correctMatchIndex !== -1) {
                            setCurrentMatchIndex(correctMatchIndex);
                          }
                          setTournamentStep('playing');
                          setIsMatchActive(true);
                          setWaitingForOtherWinner(false);
                          setIsReadyForFinalMatch(false);
                          setShowMatchCompletionModal(false);
                          setShowTournamentWinnerMessage(false);
                          // Allow gameState to be processed
                          shouldAcceptGameState = true;
                        } else {
                          console.log('[Frontend] Final match gameState received but user has not manually clicked button - rejecting gameState');
                          // Don't process gameState or update index until user manually clicks button
                          shouldAcceptGameState = false;
                          // Don't update currentMatchIndex for final match if user hasn't clicked
                        }
                      }
                    } else {
                      // Round 1 match - allow normal index correction and gameState acceptance
                      shouldAcceptGameState = true;
                      if (correctMatchIndex !== -1 && correctMatchIndex !== currentMatchIndex) {
                        console.log('[Frontend] Correcting currentMatchIndex for Round 1 match:', {
                          oldIndex: currentMatchIndex,
                          newIndex: correctMatchIndex,
                          matchId: targetMatch.id,
                          round: targetMatch.round
                        });
                        setCurrentMatchIndex(correctMatchIndex);
                      }
                    }
                  } else {
                    console.warn('[Frontend] Rejecting gameState - user not in this match:', {
                      receivedMatchId: message.matchId,
                      receivedRoomCode,
                      targetMatchId: targetMatch.id,
                      userId,
                      matchPlayer1Id: targetMatch.player1?.id,
                      matchPlayer2Id: targetMatch.player2?.id
                    });
                  }
                } else if (!targetMatch) {
                  // If we can't find the match, log but don't accept (safer)
                  console.warn('[Frontend] Cannot verify match for gameState, rejecting:', {
                    receivedMatchId: message.matchId,
                    receivedRoomCode,
                    bracketMatches: bracket.map((m: any) => ({
                      id: m.id,
                      round: m.round,
                      roomCode: m.roomCode
                    }))
                  });
                }

                // Only set serverGameState if verified
                if (shouldAcceptGameState) {
                  // CRITICAL: Check message timestamp to prevent processing out-of-order messages
                  // This helps prevent race conditions where old messages arrive after new ones
                  const messageTimestamp = message.timestamp || 0;
                  const isMatch1 = message.matchId === 1;
                  const isMatch2 = message.matchId === 2;
                  const isFinalMatch = message.round === 2;
                  const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : (isFinalMatch ? 'FINAL MATCH' : null));

                  if (isMatch1 || isMatch2) {
                    console.log(`[Frontend] ${matchLabel}: Setting serverGameState (VERIFIED)`, {
                      player1Score: message.payload?.player1?.score,
                      player2Score: message.payload?.player2?.score,
                      ballX: message.payload?.ball?.x,
                      ballY: message.payload?.ball?.y,
                      player1Y: message.payload?.player1?.y,
                      player2Y: message.payload?.player2?.y,
                      roomCode: receivedRoomCode,
                      matchId: message.matchId,
                      round: message.round,
                      messageTimestamp,
                      localTimestamp: Date.now()
                    });
                  } else if (isFinalMatch) {
                    console.log(`[Frontend] FINAL MATCH: Setting serverGameState (VERIFIED)`, {
                      player1Score: message.payload?.player1?.score,
                      player2Score: message.payload?.player2?.score,
                      ballX: message.payload?.ball?.x,
                      ballY: message.payload?.ball?.y,
                      ballDx: message.payload?.ball?.dx,
                      ballDy: message.payload?.ball?.dy,
                      player1Y: message.payload?.player1?.y,
                      player2Y: message.payload?.player2?.y,
                      roomCode: receivedRoomCode,
                      matchId: message.matchId,
                      round: message.round,
                      messageTimestamp,
                      localTimestamp: Date.now(),
                      currentMatchIndex,
                      tournamentStep
                    });
                  } else {
                    console.log('[Frontend] Setting serverGameState (VERIFIED)');
                    console.log('[Frontend] GameState payload:', {
                      player1Score: message.payload?.player1?.score,
                      player2Score: message.payload?.player2?.score,
                      ballX: message.payload?.ball?.x,
                      ballY: message.payload?.ball?.y,
                      ballDx: message.payload?.ball?.dx,
                      ballDy: message.payload?.ball?.dy,
                      player1Y: message.payload?.player1?.y,
                      player2Y: message.payload?.player2?.y,
                      roomCode: receivedRoomCode,
                      matchId: message.matchId,
                      round: message.round,
                      messageTimestamp,
                      localTimestamp: Date.now()
                    });
                  }
                  // Only update serverGameState if verified to be for user's match
                  setServerGameState(message.payload);
                } else {
                  const isMatch1 = message.matchId === 1;
                  const isMatch2 = message.matchId === 2;
                  const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : null);
                  if (matchLabel) {
                    console.warn(`[Frontend] ${matchLabel}: Rejected gameState - not for user's match`);
                  }
                }
              } else {
                const isMatch1 = message.matchId === 1;
                const isMatch2 = message.matchId === 2;
                const matchLabel = isMatch1 ? 'MATCH 1' : (isMatch2 ? 'MATCH 2' : null);
                if (matchLabel) {
                  console.warn(`[Frontend] ${matchLabel}: Not setting serverGameState - wrong step:`, {
                    tournamentStep,
                    isMatchActive,
                    expectedStep: 'playing'
                  });
                } else {
                  console.warn('[Frontend] Not setting serverGameState - wrong step:', {
                    tournamentStep,
                    isMatchActive,
                    expectedStep: 'playing'
                  });
                }
              }
            } else {
              console.warn('[Frontend] Ignoring gameState - conditions not met:', {
                tournamentType,
                tournamentStep,
                isMatchActive,
                expectedType: 'remote',
                expectedStep: 'playing or bracket (when match not active)'
              });
            }
            break;

          case 'matchResultRecorded':
            // Backend confirmed match result was recorded
            console.log('[Frontend] Match result recorded:', message.data);
            // The bracket will be updated via tournamentUpdated message
            break;

          case 'gameOver':
            // Handle game over message from backend (match finished)
            console.log('[Frontend] Received gameOver message:', message.payload);
            if (tournamentType === 'remote' && tournamentStep === 'playing' && message.payload) {
              const { winner, finalGameState, finalScore } = message.payload;

              // Update serverGameState with final state to prevent freezing
              if (finalGameState) {
                console.log('[Frontend] Setting final gameState from gameOver message');
                setServerGameState(finalGameState);
              }

              // Find winner player object from current match
              const bracket = gameState.tournament?.bracket || [];
              const currentMatch = bracket[currentMatchIndex];

              if (currentMatch && winner) {
                // Determine which player won
                const winnerPlayer = currentMatch.player1?.name === winner || currentMatch.player1?.username === winner
                  ? currentMatch.player1
                  : currentMatch.player2?.name === winner || currentMatch.player2?.username === winner
                  ? currentMatch.player2
                  : null;

                if (winnerPlayer) {
                  console.log('[Frontend] Match finished, winner:', winnerPlayer.name);
                  // Call handleGameComplete to show completion modal and report result
                  handleGameComplete(winnerPlayer);
                } else {
                  console.warn('[Frontend] Could not find winner player object for:', winner);
                }
              } else {
                console.warn('[Frontend] No current match or winner in gameOver message');
              }
            }
            break;

          case 'opponentLeft':
            // Handle opponent leaving in remote tournament match
            console.log('[Frontend] Received opponentLeft message');
            if (tournamentType === 'remote' && tournamentStep === 'playing') {
              console.log('[Frontend] Setting opponentLeft to true');
              setOpponentLeft(true);
            }
            break;

          case 'tournamentCompleted':
            // Tournament is complete - for remote tournaments
            if (tournamentType === 'remote' && message.data.bracket && message.data.champion) {
              console.log('[Frontend] Tournament completed - updating state and redirecting all players');
              const currentTournament = gameState.tournament;
              if (currentTournament) {
                setTournament({
                  ...currentTournament,
                  bracket: message.data.bracket,
                  status: 'finished',
                  champion: message.data.champion
                });
              }
              // Update remote tournament state with champion
              setRemoteTournament(prev => prev ? {
                ...prev,
                bracket: message.data.bracket,
                status: 'completed' as const,
                champion: message.data.champion
              } : null);
              // Transition to finished screen
              setTournamentStep('finished');

              // Redirect all players to game lobby after showing tournament completion (10 seconds)
              setTimeout(() => {
                console.log('[Frontend] Redirecting all players to game lobby after tournament completion');
                // Leave tournament for all players
                if (socket && tournamentId) {
                  if (isHost) {
                    socket.send(JSON.stringify({
                      type: 'game',
                      action: 'cancelTournament',
                      payload: { tournamentId }
                    }));
                  } else {
                    socket.send(JSON.stringify({
                      type: 'game',
                      action: 'leaveTournament',
                      payload: { tournamentId }
                    }));
                  }
                }
                // Redirect to game lobby
                router.push('/game');
              }, 10000); // 10 seconds to view tournament completion screen
            }
            break;

          case 'tournamentDisbanded':
            // Tournament was disbanded (e.g., host disconnected or cancelled)
            const reason = message.data.reason || 'Tournament was cancelled';
            setTournamentCancelledMessage(reason);
            // Reset all tournament state
            setRemoteTournament(null);
            setTournamentId('');
            setIsHost(false);
            setShowFriendsListExpanded(false);
            setShowRandomOpponentExpanded(false);
            setIsFindingRandomOpponent(false);
            setShouldAutoFindRandomOpponent(false);
            setJoinRequests([]);
            setPendingJoinRequest(null);
            // Auto-redirect after 3 seconds
            setTimeout(() => {
              router.push('/game');
            }, 3000);
            break;

          case 'finalMatchReadiness':
            // Update readiness status when other player clicks
            console.log('[Frontend] Received finalMatchReadiness:', message.data);
            if (tournamentType === 'remote' && message.data) {
              const userId = user?.id_user?.toString();
              const readyPlayers = message.data.readyPlayers || [];
              const bothReady = message.data.bothReady || false;

              // Check if current user is ready
              const userIsReady = readyPlayers.includes(userId);

              if (userIsReady) {
                // Restore waiting state (important for page refresh scenarios)
                setWaitingForOtherWinner(!bothReady);
                setIsReadyForFinalMatch(true);
                // Mark as manually initiated since user was already ready
                setStartFinalMatchManually(true);

                if (bothReady) {
                  console.log('[Frontend] Both players ready! Final match will start soon...');
                } else {
                  console.log('[Frontend] Waiting for other player to click... (state restored)');
                }
              } else {
                // User is not ready yet - this message is just informational
                // Don't update state, but log for debugging
                console.log('[Frontend] Received finalMatchReadiness but user has not clicked yet');
              }
            }
            break;

          case 'finalMatchRoomEnsured':
            // Final match room has been created - both players are ready
            console.log('[Frontend] Received finalMatchRoomEnsured - both players ready, room created:', message.data);
            if (tournamentType === 'remote' && message.data.roomCode) {
              const bracket = gameState.tournament?.bracket || [];
              const finalMatch = bracket.find(m => m.round === 2);

              if (finalMatch && finalMatch.player1 && finalMatch.player2) {
                const userId = user?.id_user?.toString();
                const isPlayer1 = finalMatch.player1.id?.toString() === userId || finalMatch.player1.id === parseInt(userId);
                const isPlayer2 = finalMatch.player2.id?.toString() === userId || finalMatch.player2.id === parseInt(userId);

                // Both players are ready, transition to final match
                if (isPlayer1 || isPlayer2) {
                  console.log('[Frontend] Both players ready - transitioning to final match');
                  setWaitingForOtherWinner(false);
                  setIsReadyForFinalMatch(false);
                  setStartFinalMatchManually(true);
                  const finalMatchIndex = bracket.findIndex((m: any) => m.id === finalMatch.id);
                  if (finalMatchIndex !== -1) {
                    setCurrentMatchIndex(finalMatchIndex);
                    setTournamentStep('playing');
                    setIsMatchActive(true);
                    setShowMatchCompletionModal(false);
                    setShowTournamentWinnerMessage(false);
                  }
                }
              }
            }
            break;

          case 'tournamentCancelled':
            // Host successfully cancelled the tournament
            const cancelMessage = message.data.message || 'Tournament cancelled successfully';
            setTournamentCancelledMessage(cancelMessage);
            // Reset state
            setRemoteTournament(null);
            setTournamentId('');
            setIsHost(false);
            setTournamentStep('setup');
            setShowFriendsListExpanded(false);
            setShowRandomOpponentExpanded(false);
            setIsFindingRandomOpponent(false);
            setShouldAutoFindRandomOpponent(false);
            setJoinRequests([]);
            setPendingJoinRequest(null);
            // Auto-redirect after 3 seconds
            setTimeout(() => {
              router.push('/game');
            }, 3000);
            break;

          case 'tournamentLeft':
            // Player successfully left the tournament
            toast.success(message.data.message || t('game.leftTournament'));
            // Reset tournament state
            setRemoteTournament(null);
            setTournamentId('');
            setIsHost(false);
            setTournamentStep('setup');
            setShowFriendsListExpanded(false);
            setShowRandomOpponentExpanded(false);
            setIsFindingRandomOpponent(false);
            setShouldAutoFindRandomOpponent(false);
            // Redirect to game page
            router.push('/game');
            break;

          case 'tournamentPlayerLeft':
            // A player left the tournament (host receives this)
            if (message.data && message.data.playerName) {
              toast.info(message.data.message || `${message.data.playerName} left the tournament`);
            }
            // The tournamentUpdated message will also be sent to update the player list
            break;

          case 'randomOpponentSearchStarted':
            setIsFindingRandomOpponent(true);
            setShowRandomOpponentExpanded(true);
            break;

          case 'tournamentMatchReady':
            // Navigate to game room for this match
            break;

          case 'tournamentJoinFailed':
            alert(message.data.message);
            break;

          // New handlers for tournament search and join requests
          case 'tournamentsFound':
            setAvailableTournaments(message.data);
            setIsSearching(false);

            // If we're in a tournament, check if our tournament is in the results
            // and update our local state if needed
            if (tournamentId) {
              const ourTournament = message.data.find((t: any) => t.id === tournamentId);
              if (ourTournament) {
                // Update our tournament state with latest data
                setRemoteTournament(ourTournament);
              }
            } else {
              // Check if we're in any tournament (for invited players who just navigated here)
              const ourTournament = message.data.find((t: any) =>
                t.registeredPlayers?.some((p: any) => p.id === user?.id_user?.toString() || p.id === user?.id_user)
              );
              if (ourTournament) {
                // We're in a tournament! Set up the state immediately
                setRemoteTournament(ourTournament);
                setTournamentId(ourTournament.id);
                setTournamentType('remote'); // CRITICAL: Set type to remote
                setIsHost(ourTournament.host.id === user?.id_user?.toString() || ourTournament.host.id === user?.id_user);
                // If not host, go directly to registration (waiting) screen
                if (ourTournament.host.id !== user?.id_user?.toString() && ourTournament.host.id !== user?.id_user) {
                  setTournamentStep('registration');
                } else if (ourTournament.registeredPlayers?.length >= ourTournament.maxPlayers) {
                  // Host and tournament is full - go to customization
                  setTournamentStep('customization');
                } else {
                  // Host but tournament not full - go to registration
                  setTournamentStep('registration');
                }
              }
            }
            break;

          case 'tournamentJoinRequestSent':
            setPendingJoinRequest(message.data.tournamentId);
            alert(message.data.message);
            break;

          case 'tournamentJoinRequestFailed':
            alert(message.data.message);
            break;

          case 'tournamentJoinRequest':
            // Host receives a join request (for private tournaments)
            if (isHost && remoteTournament?.id === message.data.tournamentId) {
              // Check for duplicate requests
              setJoinRequests(prev => {
                const exists = prev.some(req => req.id === message.data.request.id);
                if (exists) {
                  return prev;
                }
                // Add the new request
                const updated = [...prev, message.data.request];
                // Show toast notification to host
                toast.info(t('game.newJoinRequest', { playerName: message.data.request.player.name }) ||
                          `${message.data.request.player.name} wants to join your tournament`);
                return updated;
              });
            }
            break;

          case 'tournamentPlayerJoined':
            // Host receives notification when a player directly joins (for public tournaments)
            if (isHost && remoteTournament?.id === message.data.tournamentId) {
              // Show toast notification to host
              toast.success(t('game.playerJoinedTournament', { playerName: message.data.player.name }) ||
                          `${message.data.player.name} joined your tournament`);
            }
            break;

          case 'tournamentJoinFailed':
            // Player failed to join tournament
            toast.error(message.data.message || t('game.failedToJoinTournament') || 'Failed to join tournament');
            break;

          case 'tournamentJoinApproved':
            // Player's join request was approved
            setRemoteTournament(message.data.tournament);
            setIsHost(false);
            setTournamentId(message.data.tournamentId);
            setTournamentStep('registration');
            setPendingJoinRequest(null);
            break;

          case 'tournamentJoinDeclined':
            // Player's join request was declined
            alert(message.data.message);
            setPendingJoinRequest(null);
            break;

          case 'joinRequestApproved':
            // Host feedback when they approve a request
            setJoinRequests(prev => prev.filter(req => req.id !== message.data.player.id));
            break;

          case 'joinRequestDeclined':
            // Host feedback when they decline a request
            setJoinRequests(prev => prev.filter(req => req.id !== message.data.player.id));
            break;

          case 'joinRequestError':
            alert(message.data.message);
            break;
          case 'tournamentInvite':
            setTournamentInvites(prev => [...prev, message.data]);
            break;

          case 'tournamentInviteDeclined':
            // Host receives notification that an invitation was declined
            if (isHost && message.data.tournamentId === tournamentId) {
              toast.info(message.data.message || 'A player declined your tournament invitation');
            }
            break;
        }
      };

      ws.addEventListener('message', handleMessage);

      // Handle socket reconnection
      const handleOpen = () => {
        // Send user ID for authentication
        if (user?.id_user) {
          ws.send(String(user.id_user));
        }

        // If we're in a tournament, request latest state after a short delay
        // This ensures the socket is fully ready
        setTimeout(() => {
          if (tournamentId && ws.readyState === WebSocket.OPEN) {
            // Request tournament update by searching (which will return current tournament if we're in it)
            ws.send(JSON.stringify({
              type: 'game',
              action: 'searchTournaments',
              payload: {}
            }));
          } else if (!tournamentId && tournamentType === 'remote' && tournamentStep === 'setup') {
            // If we just navigated here from accepting an invite but don't have tournamentId yet,
            // request tournament list to see if we're in one (the backend will include our tournament if we're registered)
            ws.send(JSON.stringify({
              type: 'game',
              action: 'searchTournaments',
              payload: {}
            }));
          }
        }, 500);
      };

      const handleClose = () => {
        console.log('WebSocket closed, will attempt to reconnect...');
        // The globalSocket should handle reconnection automatically
      };

      const handleError = (error: Event) => {
        console.error('WebSocket error:', error);
      };

      ws.addEventListener('open', handleOpen);
      ws.addEventListener('close', handleClose);
      ws.addEventListener('error', handleError);

      // Send username for authentication if already open
      if (ws.readyState === WebSocket.OPEN) {
        if (user?.id_user) {
          ws.send(String(user.id_user));
        }
      }

      // Periodic sync: Request tournament updates every 15 seconds if in a tournament
      // This ensures players stay synchronized even if they miss a broadcast
      const syncInterval = setInterval(() => {
        if (tournamentId && remoteTournament && ws.readyState === WebSocket.OPEN) {
          // Request latest tournament state
          ws.send(JSON.stringify({
            type: 'game',
            action: 'searchTournaments',
            payload: {}
          }));
        }
      }, 15000); // Sync every 15 seconds (matches backend broadcast interval)

      return () => {
        ws.removeEventListener('message', handleMessage);
        ws.removeEventListener('open', handleOpen);
        ws.removeEventListener('close', handleClose);
        ws.removeEventListener('error', handleError);
        clearInterval(syncInterval);
      };
  }, [tournamentType, tournamentId, remoteTournament, user?.id_user, socket, isHost, tournamentStep, playerCount, router, setTournament, setPlayers, setCurrentMatchIndex]);

  // Memoize frequently calculated values for performance
  const currentMatch = useMemo(() => {
    const match = gameState.tournament?.bracket[currentMatchIndex];
    console.log('[Frontend] Current match updated:', {
      currentMatchIndex,
      match: match ? {
        id: match.id,
        round: match.round,
        player1Id: match.player1?.id,
        player2Id: match.player2?.id,
        status: match.status,
        roomCode: match.roomCode
      } : null,
      bracketLength: gameState.tournament?.bracket?.length,
      tournamentStep
    });
    return match;
  }, [gameState.tournament?.bracket, currentMatchIndex, tournamentStep]);

  const currentPlayers = useMemo(() => {
    if (!currentMatch?.player1 || !currentMatch?.player2) return [];
    return [currentMatch.player1, currentMatch.player2];
  }, [currentMatch]);

  const nextMatch = useMemo(() => {
    const bracket = gameState.tournament?.bracket || [];
    // Find the next pending match that's not the current match
    return bracket.find((m, index) =>
      m.status === 'pending' &&
      m.player1 &&
      m.player2 &&
      index !== currentMatchIndex
    );
  }, [gameState.tournament?.bracket, currentMatchIndex]);

  const isLastMatch = useMemo(() => {
    const bracket = gameState.tournament?.bracket || [];
    const currentMatch = bracket[currentMatchIndex];
    if (!currentMatch) return false;

    // Final match is the one with the highest round number
    const maxRound = Math.max(...bracket.map(m => m.round));
    return currentMatch.round === maxRound;
  }, [gameState.tournament?.bracket, currentMatchIndex]);

  // Function to proceed to next match after modal
  // Memoize tournament bracket creation to avoid recreating on every render
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

  const proceedToNextMatch = useCallback(() => {
    const bracket = gameState.tournament?.bracket || [];
    const currentMatch = bracket[currentMatchIndex];

    // For remote tournaments, Round 1 winners need to proceed to final match manually
    if (tournamentType === 'remote' && currentMatch && currentMatch.round === 1) {
      const userId = user?.id_user?.toString();
      const isWinner = matchWinner && userId && (
        matchWinner.id?.toString() === userId ||
        matchWinner.id === parseInt(userId) ||
        matchWinner.id_user?.toString() === userId ||
        matchWinner.id_user === parseInt(userId) ||
        matchWinner.name === user?.username ||
        matchWinner.username === user?.username
      );

      if (isWinner) {
        // Same logic as "Proceed to Final Match" button
        console.log('[Frontend] User clicked "Next Match" (proceedToNextMatch) - treating as Proceed to Final Match for remote tournament');
        setIsReadyForFinalMatch(true);
        setWaitingForOtherWinner(true);
        setStartFinalMatchManually(true); // Mark that user manually initiated final match

        // Check if final match exists and has players (room may or may not be created yet)
        const finalMatch = bracket.find((m: any) => m.round === 2);

        // Validate final match has all required properties including valid roomCode
        const hasValidRoom = finalMatch?.roomCode &&
                           typeof finalMatch.roomCode === 'string' &&
                           finalMatch.roomCode.trim().length > 0;
        const isFinalMatchReady = finalMatch &&
                                 finalMatch.player1 &&
                                 finalMatch.player2 &&
                                 hasValidRoom;

        if (isFinalMatchReady) {
          // Final match is ready with room created (both players clicked), transition immediately
          console.log('[Frontend] Final match is ready with room, transitioning to final match');
          setWaitingForOtherWinner(false);
          setIsReadyForFinalMatch(false);
          const finalMatchIndex = bracket.findIndex((m: any) => m.id === finalMatch.id);
          if (finalMatchIndex !== -1) {
            setCurrentMatchIndex(finalMatchIndex);
            setTournamentStep('playing');
            setIsMatchActive(true);
            setShowMatchCompletionModal(false);
            setShowTournamentWinnerMessage(false);
          }
        } else {
          // Final match not ready yet (no room or players not set), send readiness request
          // This will mark the player as ready and create room when both are ready
          if (socket && tournamentId) {
            socket.send(JSON.stringify({
              type: 'game',
              action: 'ensureFinalMatchRoom',
              payload: {
                tournamentId
              }
            }));
          }
        }
        return;
      }
    }

    // For local tournaments or non-Round-1 matches, use original logic
    setShowTournamentWinnerMessage(false);
    setMatchWinner(null);

    // Find the next match that is ready to be played
    const nextMatch = bracket.find((m, index) =>
      m.status === 'pending' &&
      m.player1 &&
      m.player2 &&
      index !== currentMatchIndex
    );

    if (nextMatch) {
      const nextIndex = bracket.findIndex(m => m.id === nextMatch.id);
      setCurrentMatchIndex(nextIndex);
      setTournamentStep('playing');
    } else {
      // If no more matches are ready, go to the bracket view (only for local tournaments)
      if (tournamentType === 'local') {
      setTournamentStep('bracket');
      }
    }
  }, [
    gameState.tournament?.bracket,
    currentMatchIndex,
    tournamentType,
    matchWinner,
    user?.id_user,
    user?.username,
    socket,
    tournamentId,
    setCurrentMatchIndex,
    setTournamentStep,
    setMatchWinner,
    setShowTournamentWinnerMessage
  ]);
  const startTournament = useCallback((players?: Player[]) => {
    if (tournamentType === 'local') {
      // Local tournament logic - use provided players or registeredPlayers
      const playersToUse = players || registeredPlayers;
      if (playersToUse.length !== playerCount) return;

      const bracket = createTournamentBracket(playersToUse, playerCount);

      setTournament({
        type: tournamentType,
        playerCount,
        status: 'playing',
        currentMatch: 0,
        bracket
      });

      setPlayers(playersToUse);
      setTournamentStep('playing');
      setCurrentMatchIndex(0);
    } else {
      // Remote tournament logic - create as PUBLIC so players can see and join
      createRemoteTournament(false);
    }
  }, [tournamentType, registeredPlayers, playerCount, setTournament, setPlayers, createTournamentBracket]);

  // Use useCallback to prevent function recreation
  const updatePlayer = useCallback((index: number, field: keyof Player, value: string) => {
    setTempPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const handlePlayerRegistrationComplete = useCallback(() => {
    const validPlayers = tempPlayers.filter(p => p.name.trim() !== '');
    if (validPlayers.length === playerCount) {
      setRegisteredPlayers(validPlayers);
      setTournamentStep('customization');
    }
  }, [tempPlayers, playerCount]);

  const handleBackToSetup = useCallback(() => {
    setTournamentStep('setup');
  }, []);

  // Handle game completion - improved with better guards to prevent infinite loops
  const handleGameComplete = useCallback((winner: Player) => {
    const currentMatch = gameState.tournament?.bracket[currentMatchIndex];
    if (!currentMatch || currentMatch.status === 'finished' || !winner || !winner.id) {
      return;
    }

    // Store the match round for use in modal (in case currentMatch changes)
    setFinishedMatchRound(currentMatch.round);

    // Check if current user is the loser
    const userId = user?.id_user?.toString();
    const isLoser = userId && currentMatch.player1 && currentMatch.player2 &&
                    (currentMatch.player1.id?.toString() === userId || currentMatch.player2.id?.toString() === userId) &&
                    winner.id?.toString() !== userId;

    // Set match as inactive (finished)
    setIsMatchActive(false);

    // For REMOTE tournaments, send match result to backend
    if (tournamentType === 'remote' && socket && tournamentId) {
      console.log('[Frontend] Sending match result to backend:', {
        tournamentId,
        matchId: currentMatch.id,
        winner: winner.name
      });
      socket.send(JSON.stringify({
        type: 'game',
        action: 'reportMatchResult',
        payload: {
          tournamentId: tournamentId,
          matchId: currentMatch.id,
          winner: winner
        }
      }));
    }

    // For LOCAL tournaments, update bracket locally
    if (tournamentType === 'local') {
      updateTournamentMatch(currentMatch.id, {
        winner,
        status: 'finished',
      });
    }

    setMatchWinner(winner);
    // REMOVED: No badges or messages for Round 1 winners - they should only see the button
    // Don't show completion modal for Round 1 winners in remote tournaments
    if (!(tournamentType === 'remote' && currentMatch.round === 1)) {
      setShowMatchCompletionModal(true);
      setShowTournamentWinnerMessage(true);
    }

    // Log for debugging button visibility
    console.log('[Frontend] handleGameComplete - Match finished:', {
      matchRound: currentMatch.round,
      finishedMatchRound: currentMatch.round,
      isLastMatch,
      tournamentType,
      winnerName: winner.name,
      willShowButton: !isLastMatch && tournamentType === 'remote' && currentMatch.round === 1 && !isReadyForFinalMatch,
      buttonCondition: {
        notLastMatch: !isLastMatch,
        isRemote: tournamentType === 'remote',
        isRound1: currentMatch.round === 1,
        notReady: !isReadyForFinalMatch
      }
    });

    // If user is the loser and this is Round 1, show loser options modal after a delay
    if (isLoser && currentMatch.round === 1 && tournamentType === 'remote') {
      console.log('[Frontend] User lost Round 1 match, will show loser options');
      setTimeout(() => {
        setShowLoserOptionsModal(true);
      }, 2000); // Show after match completion modal
    }

    // Check if tournament is complete (all matches finished) - for local tournaments
    if (tournamentType === 'local') {
      const bracket = gameState.tournament?.bracket || [];
      // Get updated bracket state after the update
      setTimeout(() => {
        const updatedBracket = gameState.tournament?.bracket || [];
        const isComplete = updatedBracket.every(m => m.status === 'finished');
        if (isComplete && isLastMatch) {
          // Tournament is complete - automatically transition to finished screen after a delay
          setTimeout(() => {
            setTournamentStep('finished');
          }, 2000); // 2 second delay to show the match winner modal first
        }
      }, 100);
    }
  }, [currentMatchIndex, updateTournamentMatch, gameState.tournament?.bracket, tournamentType, isLastMatch, socket, tournamentId]);

  // Effect to advance winner to the next round (for local tournaments)
  useEffect(() => {
    if (tournamentType !== 'local') return; // Only for local tournaments

    const bracket = gameState.tournament?.bracket;
    if (!bracket) return;

    const currentMatch = bracket[currentMatchIndex];

    if (currentMatch && currentMatch.status === 'finished' && currentMatch.winner) {
        const winner = currentMatch.winner;
        const maxRounds = Math.max(...bracket.map(m => m.round));

        if (currentMatch.round < maxRounds) {
            const nextRound = currentMatch.round + 1;

            const roundMatches = bracket.filter(m => m.round === currentMatch.round);
            const matchIndexInRound = roundMatches.findIndex(m => m.id === currentMatch.id);

            const nextMatchIndex = Math.floor(matchIndexInRound / 2);
            const nextRoundMatches = bracket.filter(m => m.round === nextRound);
            const nextMatch = nextRoundMatches[nextMatchIndex];

            if (nextMatch) {
                if (nextMatch.player1?.id === winner.id || nextMatch.player2?.id === winner.id) {
                    return;
                }
                const positionInNext = matchIndexInRound % 2;
                if (positionInNext === 0 && !nextMatch.player1) {
                  updateTournamentMatch(nextMatch.id, { player1: winner });
                } else if (positionInNext === 1 && !nextMatch.player2) {
                  updateTournamentMatch(nextMatch.id, { player2: winner });
                }
            }
        } else {
          // Final match finished - check if tournament is complete (for local tournaments)
            // Only consider matches that have players assigned (are playable)
            const playableMatches = bracket.filter(m => m.player1 && m.player2);
            const isComplete = playableMatches.length > 0 &&
              playableMatches.every(m => m.status === 'finished' && m.winner);
            if (isComplete) {
              // Automatically transition to finished screen after showing match winner modal
              setTimeout(() => {
                setTournamentStep('finished');
              }, 1000); // 2.5 second delay to allow match winner modal to be seen
          }
        }
    }
  }, [gameState.tournament?.bracket, updateTournamentMatch, currentMatchIndex, matchWinner, tournamentType]);


  // Effect to check when both Round 1 matches finish (for remote tournaments)
  // NOTE: We do NOT auto-create the final match room - players must click button
  useEffect(() => {
    if (tournamentType !== 'remote') return;

    const bracket = gameState.tournament?.bracket;
    if (!bracket) return;

    // Check if both Round 1 matches are finished
    const round1Matches = bracket.filter(m => m.round === 1);
    const bothRound1Finished = round1Matches.length === 2 &&
                               round1Matches.every(m => m.status === 'finished' && m.winner);

    if (bothRound1Finished) {
      // Find final match (Round 2)
      const finalMatch = bracket.find(m => m.round === 2);

      // Check if final match has players set (both Round 1 matches finished)
      if (finalMatch && finalMatch.player1 && finalMatch.player2) {
        console.log('[Frontend] Both Round 1 matches finished - final match players set. Waiting for both players to click "Proceed to Final Match" button.');
        // DO NOT auto-request room creation - players must manually click button
        // The button will appear for both Round 1 winners
      }
    }
  }, [gameState.tournament?.bracket, tournamentType]);

  // Effect: Auto-redirect Round 1 losers to game lobby after 5 seconds of seeing losing badge
  useEffect(() => {
    if (!showLoserOptionsModal || tournamentType !== 'remote' || finishedMatchRound !== 1) {
      return;
    }

    // Verify user is actually a loser in Round 1
    const bracket = gameState.tournament?.bracket || [];
    const currentMatch = bracket.find(m => m.round === 1 && (
      (m.player1?.id?.toString() === user?.id_user?.toString() || m.player2?.id?.toString() === user?.id_user?.toString())
    ));

    if (!currentMatch || !currentMatch.winner) return;

    const userId = user?.id_user?.toString();
    const isLoser = userId && currentMatch.winner.id?.toString() !== userId;

    if (!isLoser) return;

    console.log('[Frontend] Round 1 loser detected - will redirect to game lobby in 5 seconds');

    const redirectTimer = setTimeout(() => {
      console.log('[Frontend] Redirecting Round 1 loser to game lobby');
      // Leave tournament
      if (socket && tournamentId) {
        socket.send(JSON.stringify({
          type: 'game',
          action: 'leaveTournament',
          payload: { tournamentId }
        }));
      }
      // Redirect to game lobby
      router.push('/game');
    }, 5000); // 5 seconds after seeing the losing badge

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [showLoserOptionsModal, tournamentType, finishedMatchRound, gameState.tournament?.bracket, user?.id_user, socket, tournamentId, router]);

  // Effect: Auto-redirect all players to game lobby when tournament is completed
  // This ensures all players (not just final match participants) are redirected
  useEffect(() => {
    if (tournamentType !== 'remote') return;

    const bracket = gameState.tournament?.bracket || [];
    const tournament = gameState.tournament;

    // Check if tournament is finished/completed
    const isTournamentFinished = tournament?.status === 'finished' || tournament?.status === 'completed';
    const finalMatch = bracket.find((m: any) => m.round === 2 && m.player1 && m.player2);
    const finalMatchFinished = finalMatch && finalMatch.status === 'finished' && finalMatch.winner;
    const hasChampion = tournament?.champion;

    // Redirect if tournament is finished and we're showing the finished screen
    if (isTournamentFinished && tournamentStep === 'finished' && (finalMatchFinished || hasChampion)) {
      console.log('[Frontend] Tournament finished - will redirect all players to game lobby in 10 seconds');

      const redirectTimer = setTimeout(() => {
        console.log('[Frontend] Redirecting all players to game lobby after tournament completion');

        // Leave tournament for all players (rooms already deleted by backend)
        if (socket && tournamentId) {
          if (isHost) {
            socket.send(JSON.stringify({
              type: 'game',
              action: 'cancelTournament',
              payload: { tournamentId }
            }));
          } else {
            socket.send(JSON.stringify({
              type: 'game',
              action: 'leaveTournament',
              payload: { tournamentId }
            }));
          }
        }

        // Redirect to game lobby
        router.push('/game');
      }, 10000); // 10 seconds to view tournament completion screen

      return () => {
        clearTimeout(redirectTimer);
      };
    }
  }, [tournamentStep, tournamentType, gameState.tournament, socket, tournamentId, isHost, router]);

  // Toggle fullscreen - MUST be defined before any conditional returns
  const toggleFullscreen = useCallback(async () => {
    const container = gameContainerRef.current;
    if (!container) return;

    try {
      if (
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ) {
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
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      }
    } catch (error: any) {
      // Handle permission errors gracefully
      if (error.name === 'NotAllowedError' || error.message?.includes('permission')) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Tournament] Fullscreen permission denied:', error.message);
        }
        // Don't show error to user - they can try again or use F key
      } else {
      console.error('Error toggling fullscreen:', error);
      }
    }
  }, []);

  // Fullscreen change handler
  useEffect(() => {
    if (tournamentStep !== 'playing') return;

    const handleFullscreenChange = () => {
      const isNowFullscreen = !!(
        document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isNowFullscreen);
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
  }, [tournamentStep]);

  // Keyboard shortcut for fullscreen (F key)
  useEffect(() => {
    if (tournamentStep !== 'playing') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [tournamentStep, toggleFullscreen]);

  // Handle winner detection for remote tournament matches
  // This is a fallback in case gameOver message is missed
  // Use ref to prevent multiple triggers
  const winnerDetectionRef = React.useRef(false);

  useEffect(() => {
    // Reset ref when match changes or winner is cleared
    if (!currentMatch || matchWinner) {
      winnerDetectionRef.current = false;
      return;
    }

    if (tournamentType === 'remote' && tournamentStep === 'playing' && serverGameState && currentMatch && !matchWinner && !winnerDetectionRef.current) {
      const WINNING_SCORE = 10;
      const p1Score = serverGameState.player1?.score || 0;
      const p2Score = serverGameState.player2?.score || 0;

      console.log('[Frontend] Checking for winner:', {
        player1Score: p1Score,
        player2Score: p2Score,
        matchWinner,
        hasCurrentMatch: !!currentMatch,
        matchStatus: currentMatch.status
      });

      // Only check if match is not already finished
      if (currentMatch.status !== 'finished' && !winnerDetectionRef.current) {
        if (p1Score >= WINNING_SCORE) {
          // Player 1 won
          console.log('[Frontend] Player 1 won! (detected from gameState)');
          winnerDetectionRef.current = true; // Prevent multiple triggers
          const winner = currentMatch.player1;
          if (winner) {
            handleGameComplete(winner);
          }
        } else if (p2Score >= WINNING_SCORE) {
          // Player 2 won
          console.log('[Frontend] Player 2 won! (detected from gameState)');
          winnerDetectionRef.current = true; // Prevent multiple triggers
          const winner = currentMatch.player2;
          if (winner) {
            handleGameComplete(winner);
          }
        }
      }
    }
  }, [serverGameState, tournamentType, tournamentStep, currentMatch, matchWinner, handleGameComplete]);

  // Auto-fullscreen for tournament matches - FORCE fullscreen for ALL remote tournament matches
  // Use a Map to track fullscreen attempts per match to ensure each match gets fullscreen
  const autoFullscreenAttemptedRef = React.useRef<Map<number, boolean>>(new Map());
  const fullscreenRetryTimersRef = React.useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = React.useRef(true);
  const fullscreenEnabledRef = React.useRef<Map<number, boolean>>(new Map()); // Track per-match success

  useEffect(() => {
    // Track component mount state
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear all retry timers on unmount
      fullscreenRetryTimersRef.current.forEach(timer => clearTimeout(timer));
      fullscreenRetryTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    // Force fullscreen for ALL players in remote tournaments when playing (not just host)
    // This ensures every player gets fullscreen automatically when their match starts
    // Works independently for each player on their own session/computer
    if (tournamentType === 'remote' && tournamentStep === 'playing' && currentMatch) {
      const container = gameContainerRef.current;
      if (!container || !isMountedRef.current) {
        // Retry if container not ready yet (important for non-host players)
        console.log(`[Tournament] Container not ready, retrying in 100ms...`);
        const retryTimer = setTimeout(() => {
          if (gameContainerRef.current && isMountedRef.current && tournamentStep === 'playing') {
            // Re-trigger the effect
            setIsFullscreen(prev => prev);
          }
        }, 0);
        return () => clearTimeout(retryTimer);
      }

      const matchId = currentMatch.id;
      const matchRound = currentMatch.round;
      const isMatch1Round1 = matchId === 1 && matchRound === 1;
      const isMatch2Round1 = matchId === 2 && matchRound === 1;
      const isFinalMatch = matchRound === 2;
      const isRound1Match = isMatch1Round1 || isMatch2Round1;
      const matchLabel = isMatch1Round1 ? 'MATCH 1 ROUND 1' : (isMatch2Round1 ? 'MATCH 2 ROUND 1' : (isFinalMatch ? 'FINAL MATCH (ROUND 2)' : null));

      // Use match ID + round to ensure uniqueness across rounds (Round 1 matches have IDs 1-2, Round 2 has ID 3)
      // This ensures Round 2 final match gets its own fullscreen attempt
      const matchKey = matchId !== undefined && matchId !== null
        ? (matchId * 10 + matchRound) // Combine matchId and round for uniqueness (e.g., Match 1 Round 1 = 11, Match 1 Round 2 = 12)
        : (currentMatchIndex * 100 + (currentMatch.round || 1));

      // Special logging for Round 1 matches and Final match
      if (isRound1Match || isFinalMatch) {
        console.log(`[Tournament] ${matchLabel}: Auto-fullscreen check for this player (independent session)`, {
          matchId,
          round: matchRound,
          matchKey,
          hasContainer: !!container,
          isMounted: isMountedRef.current,
          alreadyAttempted: autoFullscreenAttemptedRef.current.get(matchKey),
          userId: user?.id_user,
          tournamentStep,
          isRemote: tournamentType === 'remote'
        });
      }

      // Check if already attempted for this specific match
      if (autoFullscreenAttemptedRef.current.get(matchKey)) {
        if (isRound1Match || isFinalMatch) {
          console.log(`[Tournament] ${matchLabel}: Fullscreen already attempted for this match`);
        }
        return;
      }

      // Check if already in fullscreen
      const isAlreadyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (isAlreadyFullscreen) {
        autoFullscreenAttemptedRef.current.set(matchKey, true);
        setIsFullscreen(true);
        return;
      }

      // Clear any existing retry timers
      fullscreenRetryTimersRef.current.forEach(timer => clearTimeout(timer));
      fullscreenRetryTimersRef.current = [];

      // Force fullscreen with multiple retry attempts for EACH match
      // This works independently for each player on their own session/computer
      const attemptFullscreen = async (attemptNumber: number = 1) => {
        // Check if already succeeded for this match or component unmounted
        if (fullscreenEnabledRef.current.get(matchKey) || !isMountedRef.current) {
          if (isRound1Match && attemptNumber === 1) {
            console.log(`[Tournament] ${matchLabel}: Skipping - already enabled or unmounted`);
          }
          return;
        }

        // Get fresh container reference
        const currentContainer = gameContainerRef.current;
        if (!currentContainer) {
          if (isRound1Match) {
            console.warn(`[Tournament] ${matchLabel}: Container not available, will retry`);
          }
          return;
        }

        // Special logging for Round 1 matches and Final match
        if ((isRound1Match || isFinalMatch) && attemptNumber === 1) {
          console.log(`[Tournament] ${matchLabel}: Starting fullscreen attempt ${attemptNumber} for this player (works independently)`);
        }

        // Check if already in fullscreen before attempting
        const alreadyFullscreen = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        );

        if (alreadyFullscreen) {
          fullscreenEnabledRef.current.set(matchKey, true);
          autoFullscreenAttemptedRef.current.set(matchKey, true);
          setIsFullscreen(true);
          return;
        }

        try {
          let success = false;
          if (currentContainer.requestFullscreen) {
            await currentContainer.requestFullscreen();
            success = true;
          } else if ((currentContainer as any).webkitRequestFullscreen) {
            await (currentContainer as any).webkitRequestFullscreen();
            success = true;
          } else if ((currentContainer as any).mozRequestFullScreen) {
            await (currentContainer as any).mozRequestFullScreen();
            success = true;
          } else if ((currentContainer as any).msRequestFullscreen) {
            await (currentContainer as any).msRequestFullscreen();
            success = true;
          }

          if (success && isMountedRef.current) {
            currentContainer.focus();
            fullscreenEnabledRef.current.set(matchKey, true);
            autoFullscreenAttemptedRef.current.set(matchKey, true);
            setIsFullscreen(true);
            // Clear all pending retry timers since we succeeded
            fullscreenRetryTimersRef.current.forEach(timer => clearTimeout(timer));
            fullscreenRetryTimersRef.current = [];
            if (isRound1Match || isFinalMatch) {
              console.log(`[Tournament] ✓✓✓ ${matchLabel}: Auto-fullscreen SUCCESS for this player (independent session/computer)`);
            } else {
              console.log(`[Tournament] Auto-fullscreen enabled for Match ${matchId || currentMatchIndex} Round ${matchRound} - ALL players (host and non-host)`);
            }
          }
        } catch (error: any) {
          // Only retry if we haven't succeeded and haven't exceeded max attempts
          if (!fullscreenEnabledRef.current.get(matchKey) && attemptNumber < 5 && tournamentType === 'remote' && isMountedRef.current) {
            const delay = attemptNumber * 200; // 200ms, 400ms, 600ms, 800ms
            if (isRound1Match || isFinalMatch) {
              console.log(`[Tournament] ${matchLabel}: Auto-fullscreen attempt ${attemptNumber} failed, retrying in ${delay}ms...`);
            } else {
              console.log(`[Tournament] Auto-fullscreen attempt ${attemptNumber} failed for Match ${matchId || currentMatchIndex} Round ${matchRound}, retrying in ${delay}ms...`);
            }

            const retryTimer = setTimeout(() => {
              if (isMountedRef.current && !fullscreenEnabledRef.current.get(matchKey)) {
                attemptFullscreen(attemptNumber + 1);
              }
            }, delay);

            fullscreenRetryTimersRef.current.push(retryTimer);
          } else if (!fullscreenEnabledRef.current.get(matchKey)) {
            // After 5 attempts or if component unmounted, silently fail
            if (isMountedRef.current) {
              if (isRound1Match || isFinalMatch) {
                console.warn(`[Tournament] ${matchLabel}: Auto-fullscreen failed after ${attemptNumber} attempts:`, error.message);
              } else {
                console.warn(`[Tournament] Auto-fullscreen failed after ${attemptNumber} attempts for Match ${matchId || currentMatchIndex} Round ${matchRound}:`, error.message);
              }
            }
            autoFullscreenAttemptedRef.current.set(matchKey, true); // Mark as attempted to prevent infinite retries
          }
        }
      };

      // Start attempting fullscreen - only one attempt at a time with sequential retries
      // First attempt immediately - this works for ALL players independently
      // Each player on their own session/computer will trigger this automatically
      // For ALL matches (Round 1 Match 1, Round 1 Match 2, Round 2 Final): All players get fullscreen automatically
      // No isHost check - fullscreen should work for everyone
      requestAnimationFrame(() => {
        if (isMountedRef.current && !fullscreenEnabledRef.current.get(matchKey)) {
          if (isRound1Match || isFinalMatch) {
            console.log(`[Tournament] ${matchLabel}: Initiating auto-fullscreen for this player (independent session)`);
          } else {
            console.log(`[Tournament] Attempting auto-fullscreen for Match ${matchId || currentMatchIndex} Round ${matchRound} - ALL players (not just host)`);
          }
          attemptFullscreen(1);
        }
      });
    }

    // Cleanup function
    return () => {
      // Clear all retry timers when effect dependencies change
      fullscreenRetryTimersRef.current.forEach(timer => clearTimeout(timer));
      fullscreenRetryTimersRef.current = [];
    };
  }, [tournamentStep, currentMatchIndex, tournamentType, currentMatch]);

  // Auto-start match for remote tournaments when shouldAutoStartMatch is true
  useEffect(() => {
    console.log('[Frontend] Auto-start match effect triggered:', {
      shouldAutoStartMatch,
      tournamentType,
      tournamentStep,
      userId: user?.id_user,
      hasBracket: !!gameState.tournament?.bracket,
      bracketLength: gameState.tournament?.bracket?.length
    });

    if (shouldAutoStartMatch && tournamentType === 'remote' && tournamentStep === 'playing' && user?.id_user) {
      const bracket = gameState.tournament?.bracket || [];
      const userId = user.id_user.toString();

      console.log('[Frontend] Looking for user match in bracket:', {
        userId,
        bracket: bracket.map(m => ({
          id: m.id,
          round: m.round,
          player1Id: m.player1?.id,
          player2Id: m.player2?.id,
          status: m.status,
          roomCode: m.roomCode
        }))
      });

      // Find the match the user is in (check both 'pending' and 'playing' status)
      // Backend sets status to 'playing' when room is created, so we need to check both
      // IMPORTANT: Find ALL matches the user is in, then prioritize by roomCode (active games first)
      // This ensures we get the correct match (Match 1 vs Match 2) for Round 1
      // CRITICAL: Only auto-start Round 1 matches - Round 2 (final match) requires manual button click
      const userMatches = bracket.filter(m =>
        m.player1 && m.player2 &&
        m.round === 1 && // ONLY auto-start Round 1 matches, not Round 2 (final match)
        (m.player1.id?.toString() === userId || m.player2.id?.toString() === userId) &&
        (m.status === 'pending' || m.status === 'playing')
      );

      // If user is in multiple matches (shouldn't happen in Round 1, but handle it)
      // Prioritize: 1) matches with roomCode (active games), 2) by match ID (lower = earlier)
      const userMatch = userMatches.length > 0
        ? userMatches.sort((a, b) => {
            // Prioritize matches with roomCode (active games)
            if (a.roomCode && !b.roomCode) return -1;
            if (!a.roomCode && b.roomCode) return 1;
            // Then by match ID (lower ID = earlier match)
            return a.id - b.id;
          })[0]
        : null;

      if (userMatch) {
        console.log('[Frontend] Found user match (Round 1 only for auto-start):', {
          matchId: userMatch.id,
          round: userMatch.round,
          roomCode: userMatch.roomCode,
          status: userMatch.status,
          player1Id: userMatch.player1?.id,
          player2Id: userMatch.player2?.id,
          totalMatchesFound: userMatches.length
        });
        // Small delay to show bracket briefly before auto-starting
      const timer = setTimeout(() => {
          // Only auto-start if match is not already active
          if (!isMatchActive) {
            const matchIndex = bracket.findIndex(m => m.id === userMatch.id);
            console.log('[Frontend] Auto-starting Round 1 match after delay:', { matchIndex, matchId: userMatch.id, round: userMatch.round });
            if (matchIndex !== -1) {
              setCurrentMatchIndex(matchIndex);
              setTournamentStep('playing');
              setShouldAutoStartMatch(false);
              setIsMatchActive(true);
              console.log('[Frontend] Transitioned to playing step, matchIndex:', matchIndex);
            }
          } else {
            console.log('[Frontend] Match already active, skipping auto-start');
          }
        }, 2000); // 2 second delay to show bracket and "Your next match is..." message

        return () => clearTimeout(timer);
      } else {
        // Check if user is in final match (Round 2) - don't auto-start, require manual button click
        const finalMatch = bracket.find(m =>
          m.round === 2 &&
          m.player1 && m.player2 &&
          (m.player1.id?.toString() === userId || m.player2.id?.toString() === userId)
        );
        if (finalMatch) {
          console.log('[Frontend] User is in final match (Round 2) - NOT auto-starting, requires manual button click');
        } else {
          console.warn('[Frontend] No Round 1 match found in bracket. User ID:', userId);
        }
        console.warn('[Frontend] Bracket matches:', bracket.map(m => ({
          id: m.id,
          round: m.round,
          player1Id: m.player1?.id,
          player2Id: m.player2?.id,
          status: m.status
        })));
        setShouldAutoStartMatch(false);
      }
    }
  }, [shouldAutoStartMatch, tournamentType, tournamentStep, user?.id_user, gameState.tournament?.bracket, isMatchActive]);

  // Calculate match players for the current tournament match - stable version
  // const matchPlayers = useMemo(() => {
  //   if (tournamentStep !== 'playing') return [];
  //   const bracket = gameState.tournament?.bracket;
  //   if (!bracket || currentMatchIndex >= bracket.length) return [];
  //   const currentMatch = bracket[currentMatchIndex];
  //   if (!currentMatch?.player1 || !currentMatch?.player2) return [];
  //   return [currentMatch.player1, currentMatch.player2];
  // }, [tournamentStep, currentMatchIndex, gameState.tournament?.bracket?.length]); // Use bracket length instead of bracket object

  const createRemoteTournament = (isPrivate: boolean, name?: string) => {
    // Check if tournament is already created - if so, don't try to create again
    if (remoteTournament && tournamentId) {
      console.log('Tournament already exists:', tournamentId);
      return;
    }

    // Get current socket or get a new one
    let currentSocket = socket;

    // If socket doesn't exist or is closed, get a new one
    if (!currentSocket || currentSocket.readyState === WebSocket.CLOSED || currentSocket.readyState === WebSocket.CLOSING) {
      const ws = getWebSocket();
      currentSocket = ws;
      setSocket(ws);
    }

    // If socket is still connecting, wait for it to open
    if (currentSocket.readyState === WebSocket.CONNECTING) {
      currentSocket.addEventListener('open', () => {
        try {
          currentSocket.send(JSON.stringify({
      type: 'game',
      action: 'createTournament',
      payload: {
        type: tournamentType,
        playerCount,
              playerName: user?.username || 'Host Player',
        avatar: user?.avatar || defaultAvatars[0],
        color: '#3B82F6',
        isPrivate,
        tournamentName: name || tournamentName || `${user?.username || 'Host Player'}'s Tournament`,
      }
    }));
        } catch (error) {
          console.error('Error sending tournament creation message:', error);
          alert('Failed to create tournament. Please try again.');
        }
      }, { once: true });
      return;
    }

    // If socket is open, send immediately
    if (currentSocket.readyState === WebSocket.OPEN) {
      try {
        currentSocket.send(JSON.stringify({
          type: 'game',
          action: 'createTournament',
          payload: {
            type: tournamentType,
            playerCount,
            playerName: user?.username || 'Host Player',
            avatar: user?.avatar || defaultAvatars[0],
            color: '#3B82F6',
            isPrivate,
            tournamentName: name || tournamentName || `${user?.username || 'Host Player'}'s Tournament`,
          }
        }));
      } catch (error) {
        console.error('Error sending tournament creation message:', error);
        alert('Failed to create tournament. Please try again.');
      }
    } else {
      console.error('WebSocket is in an invalid state:', currentSocket.readyState);
      alert('Connection error. Please refresh the page.');
    }
  };

  // New tournament search functions
  const searchTournaments = () => {
    if (!socket) return;
    setIsSearching(true);
    socket.send(JSON.stringify({
      type: 'game',
      action: 'searchTournaments',
      payload: {}
    }));
  };

  const joinTournament = (tournamentId: string) => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'joinTournament',
      payload: {
        tournamentId: tournamentId,
        playerName: user?.username || 'Player',
        avatar: user?.avatar || defaultAvatars[1],
        color: '#10B981'
      }
    }));
  };

  const requestJoinTournament = (tournamentId: string) => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'requestJoinTournament',
      payload: {
        tournamentId: tournamentId,
        playerName: user?.username || 'Player',
        avatar: user?.avatar || defaultAvatars[1],
        color: '#10B981'
      }
    }));
  };

  const approveJoinRequest = (requestId: string) => {
    if (!socket || !tournamentId) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'approveJoinRequest',
      payload: {
        tournamentId: tournamentId,
        requestId: requestId
      }
    }));
  };

  const declineJoinRequest = (requestId: string) => {
    if (!socket || !tournamentId) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'declineJoinRequest',
      payload: {
        tournamentId: tournamentId,
        requestId: requestId
      }
    }));
  };

  const acceptTournamentInvite = (tournamentId: string) => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'acceptTournamentInvite',
      payload: {
        tournamentId,
      }
    }));
  };

  const inviteToTournament = (friendId: string) => {
    if (!socket || !tournamentId) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'inviteToTournament',
      payload: {
        friendId,
        tournamentId: tournamentId
      }
    }));
  };

  const findRandomOpponent = () => {
    if (!socket || !tournamentId) return;

    // Check if tournament is already full
    const currentPlayers = remoteTournament?.registeredPlayers?.length || 0;
    if (currentPlayers >= playerCount) {
      setIsFindingRandomOpponent(false);
      return;
    }

    setIsFindingRandomOpponent(true);
    socket.send(JSON.stringify({
      type: 'game',
      action: 'findRandomOpponent',
      payload: {
        tournamentId: tournamentId,
        playerName: user?.username || 'Player',
        avatar: user?.avatar || defaultAvatars[1],
        color: '#10B981'
      }
    }));
    // Don't auto-reset - let tournamentUpdated handle it
  };

  const cancelTournament = () => {
    if (!socket || !tournamentId || !isHost) return;
    setShowCancelConfirmation(true);
  };

  const confirmCancelTournament = () => {
    if (!socket || !tournamentId || !isHost) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'cancelTournament',
      payload: {
        tournamentId: tournamentId
      }
    }));
    setShowCancelConfirmation(false);
  };

  const leaveTournament = () => {
    if (!socket || !tournamentId || isHost) return;

    if (window.confirm(t('game.confirmLeaveTournament') || 'Are you sure you want to leave this tournament?')) {
      socket.send(JSON.stringify({
        type: 'game',
        action: 'leaveTournament',
        payload: {
          tournamentId: tournamentId
        }
      }));
    }
  };

  const TournamentBracket: React.FC = React.memo(() => {
    const bracket = gameState.tournament?.bracket || [];
    const rounds = Math.max(...bracket.map(m => m.round));
    const maxRound = Math.max(...bracket.map(m => m.round));

    const getRoundMatches = (round: number) => bracket.filter(m => m.round === round);

    const getNextMatch = () => {
      return bracket.find((m, index) =>
        m.status === 'pending' &&
        m.player1 &&
        m.player2 &&
        index !== currentMatchIndex
      );
    };

    const playNextMatch = () => {
      const nextMatch = getNextMatch();
      if (nextMatch) {
        const nextIndex = bracket.findIndex(m => m.id === nextMatch.id);
        setCurrentMatchIndex(nextIndex);
        setTournamentStep('playing');
      }
    };

    // Find the match that the current user is in
    const getUserMatch = () => {
      if (!user?.id_user) return null;
      const userId = user.id_user.toString();
      return bracket.find(m =>
        m.player1 && m.player2 &&
        (m.player1.id?.toString() === userId || m.player2.id?.toString() === userId) &&
        m.status === 'pending'
      );
    };

    const userMatch = getUserMatch();
    // Only consider matches that have players assigned (are playable)
    // A match is "finished" only if it has both players AND status is 'finished' AND has a winner
    const playableMatches = bracket.filter(m => m.player1 && m.player2);
    const isComplete = playableMatches.length > 0 &&
      playableMatches.every(m => m.status === 'finished' && m.winner);
    const champion = isComplete ? bracket[bracket.length - 1]?.winner : null;

    return (
      <div className="w-full bg-gray-800 bg-opacity-90 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-purple-400 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4 text-center">
          {t('game.tournamentBracket')}
        </h3>


        {champion && (
          <div className="text-center mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-lg shadow-xl border-2 border-yellow-300 animate-pulse">
            <FaTrophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-200 mx-auto mb-2 sm:mb-3 animate-bounce" />
            <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{t('game.tournamentChampion')}</h4>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <img src={champion.avatar} alt={champion.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-yellow-300 shadow-lg" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white">{champion.name}</span>
            </div>
          </div>
        )}

        <div className="flex justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
          {Array.from({ length: rounds }, (_, roundIndex) => (
            <div key={roundIndex} className="flex flex-col gap-2 sm:gap-3 min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] flex-shrink-0">
              <h4 className="text-xs sm:text-sm lg:text-md font-semibold text-purple-300 text-center">
                {roundIndex === rounds - 1 ? t('game.finalMatch').replace('!', '') :
                 roundIndex === rounds - 2 ? 'Semi-Final' :
                 'Quarter-Final'}
              </h4>
              {getRoundMatches(roundIndex + 1).map((match) => {
                // Highlight champion's match in the final round
                const isChampionMatch = champion && match.round === maxRound && match.winner?.id === champion.id;
                return (
                <div key={match.id} className={`bg-gray-700 rounded-md sm:rounded-lg p-2 sm:p-3 border ${
                  isChampionMatch ? 'border-yellow-400 border-2 bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 shadow-lg' :
                  match.status === 'finished' ? 'border-green-400' :
                  match.status === 'playing' ? 'border-blue-400' : 'border-gray-500'
                } ${isChampionMatch ? 'ring-2 ring-yellow-300 ring-opacity-50' : ''}`}>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-1 sm:gap-2 p-1 rounded text-xs ${
                      match.winner?.id === match.player1?.id ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {match.player1 ? (
                        <>
                          <img src={match.player1.avatar} alt="" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0" />
                          <span className="text-white truncate text-xs">{match.player1.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">{t('game.tbd')}</span>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 sm:gap-2 p-1 rounded text-xs ${
                      match.winner?.id === match.player2?.id ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {match.player2 ? (
                        <>
                          <img src={match.player2.avatar} alt="" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0" />
                          <span className="text-white truncate text-xs">{match.player2.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">{t('game.tbd')}</span>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    );
  });

  TournamentBracket.displayName = 'TournamentBracket';



  // Cancel Confirmation Modal - Show before any other content
  if (showCancelConfirmation) {
    return (
      <div className="flex items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-md mx-auto bg-gray-900 bg-opacity-95 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl border-2 border-red-500 p-4 xs:p-6 sm:p-8 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <FaTimes className="text-white text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-red-400 mb-2 sm:mb-3">
              {t('game.confirmCancel')}
            </h2>
            <p className="text-white text-sm xs:text-base sm:text-lg mb-6 sm:mb-8">
              {t('game.confirmCancel')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={confirmCancelTournament}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                {t('game.yesCancel')}
              </button>
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                {t('game.noKeep')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tournament Cancelled Message Overlay - Show before any other content
  if (tournamentCancelledMessage) {
    return (
      <div className="flex items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-md mx-auto bg-gray-900 bg-opacity-95 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl border-2 border-red-500 p-4 xs:p-6 sm:p-8 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <FaTimes className="text-white text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-red-400 mb-2 sm:mb-3">
              {t('game.tournamentCancelled')}
            </h2>
            <p className="text-white text-sm xs:text-base sm:text-lg mb-4 sm:mb-6">
              {tournamentCancelledMessage}
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mb-6">
              {t('common.loading')}...
            </p>
            <button
              onClick={() => {
                setTournamentCancelledMessage(null);
                router.push('/game');
              }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
            >
              {t('game.backToGameMenu')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Setup phase
  if (tournamentStep === 'setup') {
    // Check if user is coming from accepting an invite (check sessionStorage)
    // ONLY show loading screen if pendingTournamentId exists (set when accepting invite)
    // Use state instead of direct sessionStorage access to avoid SSR issues
    const pendingTournamentId = pendingTournamentIdFromStorage;
    const isInvitedPlayer = typeof window !== 'undefined' ? sessionStorage.getItem('isInvitedPlayer') === 'true' : false;

    // CRITICAL: If this is an invited friend, they should NEVER see the setup screen
    // Automatically set tournamentType to 'remote' and redirect to Tournament Lobby
    if (isInvitedPlayer && (pendingTournamentId || tournamentId)) {
      // Automatically set tournamentType to 'remote' for invited players
      if (tournamentType !== 'remote') {
        setTournamentType('remote');
      }
      // Redirect to registration (Tournament Lobby) immediately
      setTournamentStep('registration');
      return null; // Prevent rendering setup screen
    }

    // Also check if user is in a remote tournament but not the host
    // This handles cases where sessionStorage was cleared but user is still in tournament
    if (tournamentType === 'remote' && remoteTournament && tournamentId && !isHost && tournamentStep === 'setup') {
      setTournamentStep('registration');
      return null; // Prevent rendering setup screen
    }

    // If user just accepted an invite, show loading screen while waiting for tournament data
    if (pendingTournamentId && tournamentType === 'remote' && !remoteTournament) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-300 mb-4 sm:mb-6"></div>
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-300 mb-2 sm:mb-3 text-center">
                {t('game.joiningTournament')}
              </h2>
              <p className="text-gray-300 text-sm xs:text-base text-center">
                {t('game.pleaseWaitConnect')}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl h-full bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-700 via-purple-900 to-black border-2 border-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-300 mb-2 xs:mb-3 sm:mb-4 md:mb-6 text-center">{t('game.tournamentSetup')}</h1>

          <div className="space-y-2 xs:space-y-3 sm:space-y-4">
            <div>
              <label className="block text-white text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 xs:mb-2 sm:mb-3 md:mb-4">{t('game.tournamentType')}</label>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => setTournamentType('local')}
                  className={`p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    tournamentType === 'local'
                      ? 'border-purple-400 bg-purple-600 bg-opacity-20'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-1 text-xs xs:text-sm md:text-base">{t('game.localTournament')}</h3>
                  <p className="text-gray-300 text-xs xs:text-sm">{t('game.allPlayersSameDevice')}</p>
                </button>
                <button
                  onClick={() => setTournamentType('remote')}
                  className={`p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    tournamentType === 'remote'
                      ? 'border-purple-400 bg-purple-600 bg-opacity-20'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-1 text-xs xs:text-sm md:text-base">{t('game.remoteTournament')}</h3>
                  <p className="text-gray-300 text-xs xs:text-sm">{t('game.playersJoinDifferentDevices')}</p>
                </button>
              </div>
            </div>

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

            {/* Remote tournament options */}
            {tournamentType === 'remote' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="mb-3 sm:mb-4">
                  <label className="block text-white font-semibold text-xs xs:text-sm sm:text-base mb-2">
                    {t('game.tournamentName')}
                  </label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    placeholder={t('game.enterTournamentName') || 'Enter tournament name'}
                    maxLength={50}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
                  />
                  {tournamentName.trim().length === 0 && (
                    <p className="text-yellow-400 text-xs mt-1">{t('game.tournamentNameRequired') || 'Tournament name is required'}</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => {
                      // Validate tournament name
                      if (!tournamentName.trim()) {
                        alert(t('game.pleaseEnterTournamentName') || 'Please enter a tournament name');
                        return;
                      }
                      // Create tournament as PUBLIC (false) so other players can see and request to join
                      // Tournaments are public by default - players can see them and request to join
                      createRemoteTournament(false, tournamentName.trim());
                      setTournamentStep('createOptions');
                    }}
                    disabled={!tournamentName.trim()}
                    className="w-full sm:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    <FaUser className="text-sm" />
                    <span>{t('game.createTournament')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTournamentStep('search');
                      searchTournaments();
                    }}
                    className="w-full sm:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    <FaSearch className="text-sm" />
                    <span>{t('game.joinTournament')}</span>
                </button>
                </div>
                <p className="text-gray-300 text-xs xs:text-sm text-center">
                  {t('game.createOrJoin')}
                </p>
              </div>
            )}
          </div>

            <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-6">
              <button
                onClick={() => router.push('/game')}
                className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-2 xs:order-1"
              >
                {t('game.back')}
              </button>
              {tournamentType === 'local' && (
                <button
                  onClick={() => setTournamentStep('registration')}
                  className="w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2"
                >
                  {t('game.continue')}
                </button>
              )}
            </div>
        </div>
      </div>
    );
  }

  // Create Tournament Options phase (for remote tournaments)
  if (tournamentStep === 'createOptions') {
    // Check if tournament is already created and we're waiting for players
    const isWaitingForPlayers = remoteTournament && (remoteTournament.registeredPlayers?.length || 0) < playerCount;
    const currentPlayerCount = remoteTournament?.registeredPlayers?.length || 0;

    return (
      <div className="flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8 relative">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-3 xs:mb-4 sm:mb-6 text-center">
            {isWaitingForPlayers ? t('game.waitingForPlayers') : t('game.createTournamentTitle')}
          </h2>

          {isWaitingForPlayers ? (
            <>
              <p className="text-white text-sm xs:text-base mb-4 sm:mb-6 text-center">
                {t('game.playersCount', { current: currentPlayerCount, total: playerCount })}
              </p>

              {/* Show current players */}
              {remoteTournament?.registeredPlayers && remoteTournament.registeredPlayers.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-white text-sm sm:text-base mb-2 text-center">{t('game.currentPlayers')}</h3>
                  <div className="grid gap-2 grid-cols-2">
                    {remoteTournament.registeredPlayers.map((player: Player, index: number) => (
                      <div key={player.id || `player-${index}`} className="bg-gray-800 rounded-lg p-2 border border-purple-400">
                        <div className="flex items-center gap-2">
                          <img
                            src={player.avatar || defaultAvatars[index]}
                            alt={player.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-purple-400"
                          />
                          <span className="text-white font-semibold text-xs sm:text-sm truncate">{player.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons - always visible while waiting */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {/* Find Random Opponent - expands inline to show searching state */}
                {!showRandomOpponentExpanded ? (
                  <button
                    onClick={() => {
                      setShowRandomOpponentExpanded(true);
                      setShouldAutoFindRandomOpponent(true);
                      if (tournamentId) {
                        findRandomOpponent();
                      }
                    }}
                    disabled={currentPlayerCount >= playerCount}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3"
                  >
                    <FaSearch className="text-lg" />
                    <div className="text-left">
                      <div className="font-bold">{t('game.findRandomOpponent')}</div>
                      <div className="text-xs sm:text-sm opacity-90">
                        {currentPlayerCount > 0
                          ? t('game.continueSearching', { current: currentPlayerCount, total: playerCount })
                          : t('game.searchForPlayers')}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-yellow-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">{t('game.searchingForRandomOpponent')}</h3>
                      <button
                        onClick={() => {
                          setShowRandomOpponentExpanded(false);
                          setShouldAutoFindRandomOpponent(false);
                          setIsFindingRandomOpponent(false);
                        }}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4">
                      {currentPlayerCount >= playerCount ? (
                        <>
                          <div className="w-8 h-8 mb-3 flex items-center justify-center">
                            <FaCheck className="text-green-400 text-2xl" />
                          </div>
                          <p className="text-green-300 text-sm mb-2 font-semibold">{t('game.tournamentFull')}</p>
                          <p className="text-gray-300 text-xs text-center">
                            {t('game.allPlayersFound', { count: playerCount })}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-3"></div>
                          <p className="text-white text-sm mb-2">{t('game.lookingForPlayers')}</p>
                          <p className="text-gray-300 text-xs text-center">
                            {t('game.foundPlayers', { current: currentPlayerCount, total: playerCount })}
                          </p>
                          {currentPlayerCount > 0 && (
                            <p className="text-yellow-300 text-xs mt-2">{t('game.keepSearching')}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Invite Friend - expands inline to show friends list */}
                {!showFriendsListExpanded ? (
                  <button
                    onClick={() => {
                      // Always expand immediately when clicked
                      setShowFriendsListExpanded(true);
                      // If tournament doesn't exist, create it in the background (PUBLIC so players can see it)
                      if (!remoteTournament || !tournamentId) {
                        setShouldAutoFindRandomOpponent(false);
                        setShouldShowFriendsModalAfterCreation(false);
                        createRemoteTournament(false);
                      }
                    }}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3"
                  >
                    <FaUser className="text-lg" />
                    <div className="text-left">
                      <div className="font-bold">{t('game.inviteFriend')}</div>
                      <div className="text-xs sm:text-sm opacity-90">{t('game.inviteFriendFromList')}</div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-purple-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">{t('game.selectFriendToInvite')}</h3>
                      <button
                        onClick={() => setShowFriendsListExpanded(false)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>
                    {friends.length === 0 ? (
                      <p className="text-gray-300 text-sm text-center py-2">{t('game.noFriendsYet')}</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {friends.map((friend, index) => (
                          <button
                            key={(friend as any).id || (friend as any).id_user || `friend-${index}`}
                            onClick={() => {
                              if (tournamentId) {
                                inviteToTournament((friend as any).id || (friend as any).id_user);
                                setShowFriendsListExpanded(false);
                              } else {
                                alert(t('game.pleaseWaitTournamentCreated'));
                              }
                            }}
                            className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-2 sm:p-3 rounded-lg transition-all"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-purple-400"
                              />
                              <span className="text-white font-semibold text-sm sm:text-base">{friend.name}</span>
                            </div>
                            <div className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs sm:text-sm">
                              {t('game.invite')}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-white text-sm xs:text-base mb-4 sm:mb-6 text-center">
                {t('game.chooseHowToFindPlayers')}
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* Find Random Opponent - expands inline to show searching state */}
                {!showRandomOpponentExpanded ? (
                  <button
                    onClick={() => {
                      setShowRandomOpponentExpanded(true);
                      setShouldAutoFindRandomOpponent(true);
                      if (!remoteTournament || !tournamentId) {
                        // Create as PUBLIC so players can see and request to join
                        createRemoteTournament(false);
                      } else {
                        findRandomOpponent();
                      }
                    }}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3"
                  >
                    <FaSearch className="text-lg" />
                    <div className="text-left">
                      <div className="font-bold">{t('game.findRandomOpponent')}</div>
                      <div className="text-xs sm:text-sm opacity-90">{t('game.searchForPlayers')}</div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-yellow-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">{t('game.searchingForRandomOpponent')}</h3>
                      <button
                        onClick={() => {
                          setShowRandomOpponentExpanded(false);
                          setShouldAutoFindRandomOpponent(false);
                          setIsFindingRandomOpponent(false);
                        }}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4">
                      {(remoteTournament?.registeredPlayers?.length || 0) >= playerCount ? (
                        <>
                          <div className="w-8 h-8 mb-3 flex items-center justify-center">
                            <FaCheck className="text-green-400 text-2xl" />
                          </div>
                          <p className="text-green-300 text-sm mb-2 font-semibold">{t('game.tournamentFull')}</p>
                          <p className="text-gray-300 text-xs text-center">
                            {t('game.allPlayersFound', { count: playerCount })}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-3"></div>
                          <p className="text-white text-sm mb-2">{t('game.lookingForPlayers')}</p>
                          <p className="text-gray-300 text-xs text-center">
                            {t('game.foundPlayers', { current: remoteTournament?.registeredPlayers?.length || 0, total: playerCount })}
                          </p>
                          {(remoteTournament?.registeredPlayers?.length || 0) > 0 && (
                            <p className="text-yellow-300 text-xs mt-2">{t('game.keepSearching')}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Invite Friend - expands inline to show friends list */}
                {!showFriendsListExpanded ? (
                  <button
                    onClick={() => {
                      // Always expand immediately when clicked
                      setShowFriendsListExpanded(true);
                      // If tournament doesn't exist, create it in the background (PUBLIC so players can see it)
                      if (!remoteTournament || !tournamentId) {
                        setShouldAutoFindRandomOpponent(false);
                        setShouldShowFriendsModalAfterCreation(false);
                        createRemoteTournament(false);
                      }
                    }}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3"
                  >
                    <FaUser className="text-lg" />
                    <div className="text-left">
                      <div className="font-bold">{t('game.inviteFriend')}</div>
                      <div className="text-xs sm:text-sm opacity-90">{t('game.inviteFriendFromList')}</div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-purple-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">{t('game.selectFriendToInvite')}</h3>
                      <button
                        onClick={() => setShowFriendsListExpanded(false)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>
                    {friends.length === 0 ? (
                      <p className="text-gray-300 text-sm text-center py-2">{t('game.noFriendsYet')}</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {friends.map((friend, index) => (
                          <button
                            key={(friend as any).id || (friend as any).id_user || `friend-${index}`}
                            onClick={() => {
                              if (tournamentId) {
                                inviteToTournament((friend as any).id || (friend as any).id_user);
                                setShowFriendsListExpanded(false);
                              } else {
                                alert(t('game.pleaseWaitTournamentCreated'));
                              }
                            }}
                            className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-2 sm:p-3 rounded-lg transition-all"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-purple-400"
                              />
                              <span className="text-white font-semibold text-sm sm:text-base">{friend.name}</span>
                            </div>
                            <div className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs sm:text-sm">
                              {t('game.invite')}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            {isHost && (
              <button
                onClick={cancelTournament}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base"
              >
                {t('game.cancelTournament')}
              </button>
            )}
            <button
              onClick={() => {
                setTournamentStep('setup');
                setRemoteTournament(null);
                setTournamentId('');
                setIsHost(false);
                setShowFriendsListExpanded(false);
                setShowRandomOpponentExpanded(false);
              }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base"
            >
              {t('game.back')}
            </button>
          </div>
        </div>

        {/* Friends List Modal */}
        {showFriendsListModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={(e) => {
            // Close modal when clicking outside
            if (e.target === e.currentTarget) {
              setShowFriendsListModal(false);
              setSelectedSlot(null);
            }
          }}>
            <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {t('game.inviteFriendToTournament')}
              </h3>
              {friends.length === 0 ? (
                <div className="py-4">
                  <p className="text-gray-300 text-sm mb-4">{t('game.noFriendsYet')}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {friends.map((friend, index) => (
                    <div key={(friend as any).id || (friend as any).id_user || `friend-${index}`} className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                        <span className="text-white">{friend.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (tournamentId) {
                            inviteToTournament((friend as any).id || (friend as any).id_user);
                          } else {
                            alert(t('game.pleaseWaitTournamentCreated'));
                          }
                          setShowFriendsListModal(false);
                          setSelectedSlot(null);
                        }}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm"
                      >
                        {t('game.invite')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  setShowFriendsListModal(false);
                  setSelectedSlot(null);
                }}
                className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Registration phase
  if (tournamentStep === 'registration') {
    if (tournamentType === 'remote' && (tournamentId || pendingTournamentIdFromStorage)) {
      // Remote tournament registration waiting screen
      const currentPlayerCount = remoteTournament?.registeredPlayers?.length || 0;
      const isFull = currentPlayerCount >= playerCount;

      return (
        <div className="flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-3 xs:mb-4 sm:mb-6 text-center">
              {t('game.tournamentLobby')}
            </h2>

            {/* Special waiting message for non-host players */}
            {!isHost && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-900 bg-opacity-50 border border-purple-400 rounded-lg">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-purple-300"></div>
                  <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-semibold text-purple-200 text-center">
                    {t('game.waitingForTournamentStart')}
                  </h3>
                </div>
                <p className="text-xs xs:text-sm text-gray-300 text-center">
                  {isFull
                    ? t('game.allPlayersJoined')
                    : t('game.waitingForMorePlayers', { current: currentPlayerCount, total: playerCount })}
                </p>
              </div>
            )}

            <div className="text-center mb-3 xs:mb-4 sm:mb-6">
              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl text-white mb-2 xs:mb-3 sm:mb-4">
                {(() => {
                  if (isFull) {
                    return isHost
                      ? t('game.allPlayersReady', { current: currentPlayerCount, total: playerCount })
                      : t('game.allPlayersReadyWaiting', { current: currentPlayerCount, total: playerCount });
                  }
                  return t('game.waitingForPlayersCount', { current: currentPlayerCount, total: playerCount });
                })()}
              </h3>

              {/* Host Actions - Always visible for finding players */}
              {(() => {
                const isHostCondition = isHost;
                const isNotFull = (remoteTournament?.registeredPlayers?.length || 0) < playerCount;
                const shouldShow = isHostCondition && isNotFull;

                if (!shouldShow) {
                  return null;
                }

                return (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-stretch sm:items-center">
                      {!showFriendsListExpanded ? (
                        <button
                          onClick={() => setShowFriendsListExpanded(true)}
                          className="flex-1 sm:flex-initial px-4 py-2 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                          <FaUser className="text-sm" />
                          <span>{t('game.inviteFriend')}</span>
                        </button>
                      ) : (
                        <div className="flex-1 sm:flex-initial bg-gray-800 rounded-lg p-3 border border-purple-400">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold text-xs sm:text-sm">{t('game.selectAFriend')}</h3>
                            <button
                              onClick={() => setShowFriendsListExpanded(false)}
                              className="text-gray-400 hover:text-white"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </div>
                          {friends.length === 0 ? (
                            <p className="text-gray-300 text-xs text-center py-1">{t('game.noFriendsYetShort')}</p>
                          ) : (
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {friends.map((friend, index) => (
                                <button
                                  key={(friend as any).id || (friend as any).id_user || `friend-${index}`}
                                  onClick={() => {
                                    if (tournamentId) {
                                      inviteToTournament(friend.id);
                                      setShowFriendsListExpanded(false);
                                    }
                                  }}
                                  className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-2 rounded text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={friend.avatar}
                                      alt={friend.name}
                                      className="w-6 h-6 rounded-full border border-purple-400"
                                    />
                                    <span className="text-white truncate">{friend.name}</span>
                                  </div>
                                  <span className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs">
                                    {t('game.invite')}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          findRandomOpponent();
                        }}
                        disabled={isFindingRandomOpponent}
                        className="flex-1 sm:flex-initial px-4 py-2 sm:px-6 sm:py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                      >
                        {isFindingRandomOpponent ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>{t('common.loading')}</span>
                          </>
                        ) : (
                          <>
                            <FaSearch className="text-sm" />
                            <span>{t('game.findRandomOpponent')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {remoteTournament?.registeredPlayers && (
                <div className="grid gap-2 xs:gap-3 grid-cols-1 xs:grid-cols-2">
                  {remoteTournament.registeredPlayers.map((player: Player, index: number) => (
                    <div key={player.id || `player-${index}`} className="bg-gray-800 rounded-lg p-2 xs:p-3 border border-purple-400">
                      <div className="flex items-center gap-2 xs:gap-3">
                        <img
                          src={player.avatar || defaultAvatars[index]}
                          alt={player.name}
                          className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-400 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 xs:gap-2 flex-wrap">
                            <span className="text-white font-semibold text-xs xs:text-sm sm:text-base truncate">{player.name}</span>
                            {player.id === remoteTournament.host.id && (
                              <FaCrown className="text-yellow-400 text-sm flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: playerCount - (remoteTournament?.registeredPlayers?.length || 0) }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-gray-700 rounded-lg p-2 xs:p-3 border-2 border-dashed border-gray-500">
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400 text-xs sm:text-sm">{t('game.emptySlot')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Join Requests Management for Host */}
            {isHost && joinRequests.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-yellow-300 mb-3 sm:mb-4 text-center">
                  {t('game.pendingJoinRequests', { count: joinRequests.length })}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {joinRequests.map((request) => (
                    <div key={request.id} className="bg-yellow-900 bg-opacity-30 rounded-lg p-2 sm:p-3 lg:p-4 border border-yellow-500">
                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <img
                            src={request.player.avatar}
                            alt={request.player.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-yellow-400 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-white font-semibold text-xs sm:text-sm lg:text-base truncate">
                              {request.player.name}
                            </h4>
                            <p className="text-gray-300 text-xs sm:text-sm">
                              {t('game.requested', { time: request.timestamp ? new Date(request.timestamp).toLocaleTimeString() : t('game.recently') })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 w-full xs:w-auto">
                          <button
                            onClick={() => approveJoinRequest(request.id)}
                            className="flex-1 xs:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
                          >
                            <FaCheck className="w-3 h-3" />
                            <span className="hidden xs:inline">{t('game.accept')}</span>
                            <span className="xs:hidden">✓</span>
                          </button>
                          <button
                            onClick={() => declineJoinRequest(request.id)}
                            className="flex-1 xs:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
                          >
                            <FaReject className="w-3 h-3" />
                            <span className="hidden xs:inline">{t('game.decline')}</span>
                            <span className="xs:hidden">✗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4">
              {isHost && (
                <button
                  onClick={cancelTournament}
                  className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base"
                >
                  {t('game.cancelTournament')}
                </button>
              )}
              {!isHost && (
                <button
                  onClick={leaveTournament}
                  className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base"
                >
                  {t('game.cancelJoinTournament')}
                </button>
              )}
            </div>
            {showAddPlayerModal && (
              <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('game.addPlayerToSlot', { slot: selectedSlot !== null ? selectedSlot + 1 : '' })}</h3>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => {
                        setShowAddPlayerModal(false);
                        setShowFriendsListExpanded(true);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('game.inviteAFriendButton')}
                    </button>
                    <button
                      onClick={() => {
                        findRandomOpponent();
                        setShowAddPlayerModal(false);
                      }}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('game.findRandomOpponentButton')}
                    </button>
                    <button
                      onClick={() => setShowAddPlayerModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showFriendsListModal && (
              <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={(e) => {
                // Close modal when clicking outside
                if (e.target === e.currentTarget) {
                  setShowFriendsListModal(false);
                  setSelectedSlot(null);
                }
              }}>
                <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    {selectedSlot !== null ? t('game.inviteAFriendToSlot', { slot: selectedSlot + 1 }) : t('game.inviteFriendToTournament')}
                  </h3>
                  {friends.length === 0 ? (
                    <div className="py-4">
                      <p className="text-gray-300 text-sm mb-4">{t('game.noFriendsYet')}</p>
                    </div>
                  ) : (
                  <div className="flex flex-col gap-2">
                      {friends.map((friend, index) => (
                        <div key={(friend as any).id || (friend as any).id_user || `friend-${index}`} className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                            <span className="text-white">{friend.name}</span>
                        </div>
                        <button
                          onClick={() => {
                              if (tournamentId) {
                                inviteToTournament((friend as any).id || (friend as any).id_user);
                              } else {
                                alert(t('game.pleaseWaitTournamentCreated'));
                              }
                            setShowFriendsListModal(false);
                              setSelectedSlot(null);
                          }}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm"
                        >
                          {t('game.invite')}
                        </button>
                      </div>
                    ))}
                  </div>
                  )}
                  <button
                    onClick={() => {
                      setShowFriendsListModal(false);
                      setSelectedSlot(null);
                    }}
                    className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Local tournament registration
      return (
        <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
          <PlayerRegistration
            tempPlayers={tempPlayers}
            defaultAvatars={defaultAvatars}
            playerCount={playerCount}
            updatePlayer={updatePlayer}
            onComplete={handlePlayerRegistrationComplete}
            onBack={handleBackToSetup}
          />
        </div>
      );
    }
  }

  // Starting tournament phase (local only) - show loading screen
  if (isStartingTournament && tournamentType === 'local') {
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

  // Customization phase - Only host can customize when tournament has 4 players
  if (tournamentStep === 'customization') {
    // For local tournaments, always show customization
    // For remote tournaments, only show customization to host, and only if tournament has enough players
    if (tournamentType === 'remote') {
      if (!isHost || (remoteTournament?.registeredPlayers?.length || 0) < playerCount) {
        // If not host or not enough players, go back to registration
        setTournamentStep('registration');
        return null;
      }
    } else if (tournamentType === 'local') {
      // For local tournaments, check if we have registered players
      if (!registeredPlayers || registeredPlayers.length !== playerCount) {
        // If not enough players registered, go back to registration
        setTournamentStep('registration');
        return null;
      }
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <div className="mb-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-2">
            {t('game.customizeTournamentGame')}
          </h2>
          <p className="text-gray-300 text-sm">
            {tournamentType === 'local'
              ? t('game.customizeYourPlayground')
              : t('game.allPlayersReadyCustomize', { count: playerCount })}
          </p>
        </div>
        <GameCustomization
          onBack={() => setTournamentStep('registration')}
          onStartGame={(customization) => {
            setCustomisation(customization);
            // For remote tournaments, send customization to backend and start tournament
            if (tournamentType === 'remote' && socket && tournamentId) {
              // Send customization to backend via WebSocket
              socket.send(JSON.stringify({
                type: 'game',
                action: 'startTournament',
                payload: {
                  tournamentId: tournamentId,
                  customization: customization
                }
              }));
            } else {
              // Local tournament - add delay before starting
              setIsStartingTournament(true);
              setTimeout(() => {
                startTournament(registeredPlayers);
                setIsStartingTournament(false);
              }, 2000); // 2 second delay
            }
          }}
        />
      </div>
    );
  }

  // Playing phase - show the actual game
  if (tournamentStep === 'playing') {
    // Use memoized current match
    if (!currentMatch || !currentMatch.player1 || !currentMatch.player2) {
      // Return loading state while useEffect handles the redirect
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-white">{t('game.loadingNextMatch')}</div>
        </div>
      );
    }

    const userId = user?.id_user?.toString();
    const isUserInMatch = currentMatch.player1?.id?.toString() === userId ||
                         currentMatch.player2?.id?.toString() === userId;

    return (
      <div
        ref={gameContainerRef}
        className={`flex flex-col transition-all duration-300 ${
          isFullscreen
            ? 'h-screen bg-black'
            : 'h-full bg-black opacity-90'
        }`}
      >
        {/* Tournament Header - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="bg-gray-900 border-b border-purple-500 p-2 sm:p-4 ">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-lg sm:text-xl font-bold text-purple-300">{t('game.tournamentMatch')}</h2>
              </div>
              <p className="text-sm text-gray-300">
                {t('game.round')} {currentMatch.round} - {t('game.match')} {currentMatchIndex + 1}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                <img
                  src={currentMatch.player1.avatar}
                  alt={currentMatch.player1.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <span className="text-white font-semibold text-sm sm:text-base">{currentMatch.player1.name}</span>
              </div>
              <span className="text-purple-300 font-bold text-sm sm:text-base">{t('game.vs')}</span>
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                <img
                  src={currentMatch.player2.avatar}
                  alt={currentMatch.player2.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <span className="text-white font-semibold text-sm sm:text-base">{currentMatch.player2.name}</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Game Area */}
        <div className={`relative ${isFullscreen ? 'flex-1 flex items-center justify-center' : 'flex-1'}`}>
          <div
            className={isFullscreen ? 'w-full h-full flex items-center justify-center' : 'w-full h-full'}
            style={isFullscreen ? {
              aspectRatio: '4/3',
              maxWidth: '95vw',
              maxHeight: '95vh',
              width: 'auto',
              height: 'auto'
            } : {}}
          >
            {tournamentType === 'remote' ? (
              // Remote tournament - use WebSocket mode
              <PingPongGame
                tournamentMode={false}
                serverGameState={serverGameState}
                setServerGameState={setServerGameState}
                opponentLeft={opponentLeft}
                isTournamentFinalMatch={isLastMatch}
              />
            ) : (
              // Local tournament - use local mode
            <PingPongGame
              tournamentMode={true}
              tournamentPlayers={currentPlayers}
              onTournamentMatchEnd={handleGameComplete}
            />
            )}
          </div>

          {/* REMOVED: Round 1 Winner Badge - no badge between Round 1 and Round 2 for winners */}

          {/* Minimal "Proceed to Final Match" button for Round 1 winners (no badges/messages) */}
          {tournamentType === 'remote' && !isLastMatch && (() => {
            const bracket = gameState.tournament?.bracket || [];
            const userId = user?.id_user?.toString();

            // Check if user is a winner of any Round 1 match
            const round1Matches = bracket.filter((m: any) => m.round === 1);
            const userRound1Match = round1Matches.find((m: any) =>
              m.status === 'finished' &&
              m.winner &&
              m.player1 && m.player2 &&
              (m.player1.id?.toString() === userId ||
               m.player1.id === parseInt(userId) ||
               m.player2.id?.toString() === userId ||
               m.player2.id === parseInt(userId))
            );

            const isRound1Winner = userRound1Match && userRound1Match.winner && userId && (
              userRound1Match.winner.id?.toString() === userId ||
              userRound1Match.winner.id === parseInt(userId) ||
              userRound1Match.winner.id_user?.toString() === userId ||
              userRound1Match.winner.id_user === parseInt(userId) ||
              userRound1Match.winner.name === user?.username ||
              userRound1Match.winner.username === user?.username
            );

            // Check if final match exists, has players set, but no room created yet
            const finalMatch = bracket.find((m: any) => m.round === 2);
            const finalMatchReadyForButton = finalMatch &&
                                           finalMatch.player1 &&
                                           finalMatch.player2 &&
                                           !finalMatch.roomCode &&
                                           finalMatch.status === 'pending';
            const finalMatchNotFinished = !finalMatch || (finalMatch.status !== 'finished' && finalMatch.status !== 'completed');

            // Show button if:
            // 1. User is Round 1 winner
            // 2. Final match has players set (both Round 1 matches finished)
            // 3. Final match doesn't have room yet (waiting for both players to click)
            // 4. Final match is not finished
            const shouldShowButton = isRound1Winner &&
                                    finalMatchReadyForButton &&
                                    finalMatchNotFinished;

            if (!shouldShowButton) return null;

            return (
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                  {/* Waiting animation when button clicked */}
                  {waitingForOtherWinner && (
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <p className="text-yellow-300 text-sm sm:text-base font-semibold animate-pulse text-center">
                        {t('game.waitingForOtherWinner') || 'Waiting for the other winner...'}
                      </p>
                    </div>
                  )}

                  {/* Proceed to Final Match button - show even when waiting */}
                  <button
                    onClick={() => {
                      if (waitingForOtherWinner) {
                        // Already clicked, do nothing
                        return;
                      }
                      console.log('[Frontend] User clicked "Proceed to Final Match" (minimal UI)');
                      setIsReadyForFinalMatch(true);
                      setWaitingForOtherWinner(true);
                      setStartFinalMatchManually(true);

                      // Send readiness to backend
                      if (socket && tournamentId) {
                        socket.send(JSON.stringify({
                          type: 'game',
                          action: 'ensureFinalMatchRoom',
                          payload: { tournamentId }
                        }));
                      }
                    }}
                    disabled={waitingForOtherWinner}
                    className={`px-6 py-3 rounded-lg font-semibold text-base sm:text-lg transition-all transform shadow-lg ${
                      waitingForOtherWinner
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                    } text-white`}
                  >
                    {waitingForOtherWinner
                      ? (t('game.waitingForOtherWinner') || 'Waiting for the other winner...')
                      : (t('game.proceedToFinalMatch') || 'Proceed to Final Match')
                    }
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Match Completion Modal - Shows match status and other match progress */}
          {/* REMOVED: Don't show modal for Round 1 winners in remote tournaments */}
          {showMatchCompletionModal && matchWinner && currentMatch && !(tournamentType === 'remote' && currentMatch.round === 1) && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
                {/* REMOVED: Final Match Winner/Loser Badges - Round 2 */}

                <FaTrophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-3 sm:mb-4 animate-bounce" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('game.matchWinner')}</h3>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <img
                    src={matchWinner.avatar}
                    alt={matchWinner.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400"
                  />

                  <span className="text-lg sm:text-xl font-semibold text-white">{matchWinner.name}</span>
                </div>

                {/* Show status of other matches */}
                {/* {tournamentType === 'remote' && currentMatch.round === 1 && (
                  <div className="mb-4 p-3 bg-gray-900 bg-opacity-50 rounded-lg">
                    {(() => {
                      const bracket = gameState.tournament?.bracket || [];
                      const round1Matches = bracket.filter(m => m.round === 1);
                      const otherMatch = round1Matches.find(m => m.id !== currentMatch.id);
                      const bothFinished = round1Matches.every(m => m.status === 'finished');

                      if (bothFinished) {
                        const finalMatch = bracket.find(m => m.round === 2);
                        if (finalMatch && finalMatch.player1 && finalMatch.player2) {
                          return (
                            <div>
                              <p className="text-green-300 font-semibold text-sm sm:text-base mb-2">
                                {t('game.finalMatchReady') || 'Final Match Ready!'}
                              </p>
                              <p className="text-gray-300 text-xs sm:text-sm">
                                {finalMatch.player1.name} {t('game.vs')} {finalMatch.player2.name}
                              </p>
                              <p className="text-yellow-300 text-xs sm:text-sm mt-2 animate-pulse">
                                {t('game.startingSoon') || 'Starting soon...'}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <p className="text-yellow-300 text-xs sm:text-sm animate-pulse">
                            {t('game.waitingForFinalMatch') || 'Waiting for final match to start...'}
                          </p>
                        );
                      } else if (otherMatch) {
                        return (
                          <div>
                            <p className="text-gray-300 text-xs sm:text-sm mb-1">
                              {t('game.otherMatchStatus') || 'Other Match Status:'}
                            </p>
                            <p className="text-yellow-300 text-sm sm:text-base font-semibold">
                              {otherMatch.status === 'finished'
                                ? t('game.matchFinished') || 'Match Finished'
                                : t('game.matchStillPlaying') || 'Match Still Playing'}
                            </p>
                            {otherMatch.status === 'playing' && (
                              <p className="text-gray-400 text-xs mt-1">
                                {otherMatch.player1.name} {t('game.vs')} {otherMatch.player2.name}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )} */}

                {/* <p className="text-gray-300 text-sm sm:text-base mb-4">
                  {isLastMatch
                    ? t('game.tournamentComplete')
                    : currentMatch.round === 1 && tournamentType === 'remote'
                    ? t('game.waitingForOtherMatch') || 'Waiting for other match to finish...'
                    : t('game.advancingToNextRound')}
                </p> */}

                {/* Waiting for other winner animation - shown when Round 1 winner clicks "Proceed to Final Match" */}
                {waitingForOtherWinner && tournamentType === 'remote' && currentMatch.round === 1 && (
                  <div className="mt-4 mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-yellow-300 text-sm sm:text-base font-semibold animate-pulse">
                      {t('game.waitingForOtherWinner') || 'Waiting for the other winner...'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {t('game.waitingForFinalMatch') || 'The final match will start when both winners are ready'}
                    </p>
                  </div>
                )}

                {/* Message for Round 1 winners in remote tournaments */}
                {tournamentType === 'remote' && currentMatch.round === 1 && !isLastMatch && !waitingForOtherWinner && (
                  <p className="text-gray-300 text-sm sm:text-base mb-4">
                    {t('game.waitingForOtherMatch') || 'Waiting for other match to finish...'}
                  </p>
                )}

                {/* Manual controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* {!isLastMatch && tournamentType === 'local' && (
                    <button
                      onClick={proceedToNextMatch}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('game.continueToNextMatch')}
                    </button>
                  )} */}
                  {(() => {
                    // Show button only if user is the winner of Round 1 match
                    const userId = user?.id_user?.toString();
                    const isWinner = matchWinner && userId && (
                      matchWinner.id?.toString() === userId ||
                      matchWinner.id === parseInt(userId) ||
                      matchWinner.id_user?.toString() === userId ||
                      matchWinner.id_user === parseInt(userId) ||
                      matchWinner.name === user?.username ||
                      matchWinner.username === user?.username
                    );

                    const shouldShowButton = tournamentType === 'remote' &&
                                            currentMatch.round === 1 &&
                                            !isLastMatch &&
                                            !isReadyForFinalMatch &&
                                            !waitingForOtherWinner &&
                                            isWinner;

                    return shouldShowButton ? (
                    <button
                      onClick={() => {
                          console.log('[Frontend] User clicked "Proceed to Final Match" from match completion modal');
                          setIsReadyForFinalMatch(true);
                          setWaitingForOtherWinner(true);
                          setStartFinalMatchManually(true); // Mark that user manually initiated final match
                          // Check if final match exists and has players (room may or may not be created yet)
                          const bracket = gameState.tournament?.bracket || [];
                          const finalMatch = bracket.find((m: any) => m.round === 2);

                          // Validate final match has all required properties including valid roomCode
                          const hasValidRoom = finalMatch?.roomCode &&
                                             typeof finalMatch.roomCode === 'string' &&
                                             finalMatch.roomCode.trim().length > 0;
                          const isFinalMatchReady = finalMatch &&
                                                   finalMatch.player1 &&
                                                   finalMatch.player2 &&
                                                   hasValidRoom;

                          console.log('[Frontend] Final match validation:', {
                            hasFinalMatch: !!finalMatch,
                            hasPlayer1: !!finalMatch?.player1,
                            hasPlayer2: !!finalMatch?.player2,
                            hasRoomCode: !!finalMatch?.roomCode,
                            roomCodeValid: hasValidRoom,
                            roomCodeValue: finalMatch?.roomCode,
                            status: finalMatch?.status,
                            isReady: isFinalMatchReady
                          });

                          if (isFinalMatchReady) {
                            // Final match is ready with room created, transition immediately
                            console.log('[Frontend] Final match is ready with room, transitioning to final match');
                            setWaitingForOtherWinner(false);
                            setIsReadyForFinalMatch(false);
                            const finalMatchIndex = bracket.findIndex((m: any) => m.id === finalMatch.id);
                            if (finalMatchIndex !== -1) {
                              setCurrentMatchIndex(finalMatchIndex);
                              setTournamentStep('playing');
                              setIsMatchActive(true);
                        setShowMatchCompletionModal(false);
                        setShowTournamentWinnerMessage(false);
                              console.log('[Frontend] ✓ Successfully transitioned to final match (Match Completion Modal):', {
                                finalMatchIndex,
                                roomCode: finalMatch.roomCode,
                                player1: finalMatch.player1.name,
                                player2: finalMatch.player2.name,
                                status: finalMatch.status
                              });
                            } else {
                              console.error('[Frontend] Could not find final match index in bracket!');
                            }
                          } else {
                            // Final match not ready yet (missing room or players)
                            console.log('[Frontend] User ready for final match, but final match room not created yet. Requesting creation...', {
                              missingRoom: !hasValidRoom,
                              missingPlayers: !(finalMatch?.player1 && finalMatch?.player2),
                              missingMatch: !finalMatch,
                              tournamentId,
                              hasSocket: !!socket
                            });

                            // Ask backend to ensure / create final match room
                            if (socket && tournamentId) {
                              socket.send(JSON.stringify({
                                type: 'game',
                                action: 'ensureFinalMatchRoom',
                                payload: {
                                  tournamentId
                                }
                              }));
                            }
                          }
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-all transform hover:scale-105"
                      >
                        {t('game.proceedToFinalMatch') || 'Proceed to Final Match'}
                    </button>
                    ) : null;
                  })()}
                  {isLastMatch && tournamentType === 'local' && (
                    <button
                      onClick={() => {
                        setShowMatchCompletionModal(false);
                        setShowTournamentWinnerMessage(false);
                        setTournamentStep('finished');
                      }}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('game.viewChampion')}
                    </button>
                  )}
                  {tournamentType === 'local' && (
                  <button
                    onClick={() => {
                      setShowMatchCompletionModal(false);
                      setTournamentStep('bracket');
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.viewTournamentBracket')}
                  </button>
                  )}
                  {tournamentType === 'remote' && currentMatch.round === 1 && (
                    <button
                      onClick={() => {
                        setShowMatchCompletionModal(false);
                        // Keep showing winner message but hide completion modal
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('common.close') || 'Close'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Legacy Winner Announcement Modal (for local tournaments or final match) */}
          {/* REMOVED: Don't show modal for Round 1 winners in remote tournaments */}
          {showTournamentWinnerMessage && matchWinner && !showMatchCompletionModal && !(tournamentType === 'remote' && (currentMatch?.round === 1 || finishedMatchRound === 1)) && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
                {/* REMOVED: Final Match Winner/Loser Badges - Round 2 */}

                <FaTrophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('game.matchWinner')}</h3>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <img
                    src={matchWinner.avatar}
                    alt={matchWinner.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                  <span className="text-lg sm:text-xl font-semibold text-white">{matchWinner.name}</span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  {isLastMatch ? t('game.tournamentComplete') : t('game.advancingToNextRound')}
                </p>

                {/* Waiting for other winner animation */}
                {waitingForOtherWinner && tournamentType === 'remote' && (finishedMatchRound === 1 || currentMatch?.round === 1) && (
                  <div className="mt-4 mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-yellow-300 text-sm sm:text-base font-semibold animate-pulse">
                      {t('game.waitingForOtherWinner') || 'Waiting for the other winner...'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {t('game.waitingForFinalMatch') || 'The final match will start when both winners are ready'}
                    </p>
                  </div>
                )}

                {/* Manual controls for match progression */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                  {/* Proceed to Final Match button for Round 1 winners in remote tournaments */}
                  {(() => {
                    // Debug: Log button visibility conditions
                    const bracket = gameState.tournament?.bracket || [];
                    const userId = user?.id_user?.toString();

                    // Check if user is a winner of any Round 1 match
                    const round1Matches = bracket.filter((m: any) => m.round === 1);
                    const userRound1Match = round1Matches.find((m: any) =>
                      m.status === 'finished' &&
                      m.winner &&
                      m.player1 && m.player2 &&
                      (m.player1.id?.toString() === userId ||
                       m.player1.id === parseInt(userId) ||
                       m.player2.id?.toString() === userId ||
                       m.player2.id === parseInt(userId))
                    );

                    const isRound1Winner = userRound1Match && userRound1Match.winner && userId && (
                      userRound1Match.winner.id?.toString() === userId ||
                      userRound1Match.winner.id === parseInt(userId) ||
                      userRound1Match.winner.id_user?.toString() === userId ||
                      userRound1Match.winner.id_user === parseInt(userId) ||
                      userRound1Match.winner.name === user?.username ||
                      userRound1Match.winner.username === user?.username
                    );

                    // Check if final match exists, has players set, but no room created yet
                    const finalMatch = bracket.find((m: any) => m.round === 2);
                    const finalMatchReadyForButton = finalMatch &&
                                                   finalMatch.player1 &&
                                                   finalMatch.player2 &&
                                                   !finalMatch.roomCode &&
                                                   finalMatch.status === 'pending';
                    const finalMatchNotFinished = !finalMatch || (finalMatch.status !== 'finished' && finalMatch.status !== 'completed');

                    // Show button if:
                    // 1. User is Round 1 winner
                    // 2. Final match has players set (both Round 1 matches finished)
                    // 3. Final match doesn't have room yet (waiting for both players to click)
                    // 4. Final match is not finished
                    const shouldShowButton = !isLastMatch &&
                                            tournamentType === 'remote' &&
                                            isRound1Winner &&
                                            finalMatchReadyForButton &&
                                            finalMatchNotFinished;

                    if (tournamentType === 'remote' && isRound1Winner) {
                      console.log('[Frontend] Button visibility check:', {
                        shouldShowButton,
                        isLastMatch,
                        tournamentType,
                        finishedMatchRound,
                        currentMatchRound: currentMatch?.round,
                        isReadyForFinalMatch,
                        isRound1Winner,
                        userId
                      });
                    }

                    return shouldShowButton ? (
                      <button
                        onClick={() => {
                          if (waitingForOtherWinner) {
                            // Already clicked, do nothing
                            return;
                          }
                          console.log('[Frontend] User clicked "Proceed to Final Match" (tournament winner message)');
                          setIsReadyForFinalMatch(true);
                          setWaitingForOtherWinner(true);
                          setStartFinalMatchManually(true);

                          // Send readiness to backend
                          if (socket && tournamentId) {
                            socket.send(JSON.stringify({
                              type: 'game',
                              action: 'ensureFinalMatchRoom',
                              payload: { tournamentId }
                            }));
                          }
                        }}
                        disabled={waitingForOtherWinner}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all transform ${
                          waitingForOtherWinner
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                        } text-white`}
                      >
                        {waitingForOtherWinner
                          ? (t('game.waitingForOtherWinner') || 'Waiting for the other winner...')
                          : (t('game.proceedToFinalMatch') || 'Proceed to Final Match')
                        }
                      </button>
                    ) : null;
                  })()}
                  {!isLastMatch && tournamentType === 'local' && (
                    <button
                      onClick={proceedToNextMatch}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('game.continueToNextMatch')}
                    </button>
                  )}
                  {isLastMatch && tournamentType === 'local' && (
                    <button
                      onClick={() => {
                        setShowTournamentWinnerMessage(false);
                        setTournamentStep('finished');
                      }}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('game.viewChampion')}
                    </button>
                  )}
                  {tournamentType === 'local' && (
                  <button
                    onClick={() => setTournamentStep('bracket')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.viewTournamentBracket')}
                  </button>
                  )}
                  <button
                    onClick={() => router.push('/game')}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.backToGameModes')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loser Options Modal - Shown when user loses Round 1 */}
          {showLoserOptionsModal && tournamentType === 'remote' && (
            <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-red-800 to-orange-800 rounded-xl p-6 sm:p-8 md:p-10 text-center max-w-md mx-4">
                <FaTrophy className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('game.youLost')}</h3>
                <p className="text-gray-200 text-base sm:text-lg mb-6">{t('game.loserOptionsMessage')}</p>

                <div className="flex flex-col gap-4">
                  {/* Option 1: Leave Tournament */}
                  <button
                    onClick={() => {
                      setShowLoserOptionsModal(false);
                      // Leave tournament but keep data
                      if (socket && tournamentId) {
                        socket.send(JSON.stringify({
                          type: 'game',
                          action: 'leaveTournament',
                          payload: { tournamentId }
                        }));
                      }
                      router.push('/game');
                    }}
                    className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span>{t('game.leaveTournament')}</span>
                      <span className="text-sm text-red-200">{t('game.leaveTournamentDescription')}</span>
                    </div>
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tournament Controls - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="bg-gray-900 border-t border-purple-500 p-2 sm:p-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-1">
                <button
                  onClick={() => router.push('/game')}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                >
                  {t('game.backToGameModes')}
                </button>
                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center gap-2"
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? (
                    <>
                      <IoContract className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <IoExpand className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </>
                  )}
                </button>
              {/* View Bracket button - only show for local tournaments after match finishes */}
              {!isMatchActive && tournamentType === 'local' && showTournamentWinnerMessage && (
                <button
                  onClick={() => {
                    setTournamentStep('bracket');
                    setShowMatchCompletionModal(false);
                  }}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                >
                  {t('game.viewBracket')}
                </button>
              )}

              {/* Restart Tournament button - only for local tournaments */}
              {tournamentType === 'local' && (
                <button
                  onClick={() => {
                    if (window.confirm(t('game.restartTournamentConfirm') || 'Are you sure you want to restart the tournament? All progress will be lost.')) {
                      setTournamentStep('setup');
                      setCurrentMatchIndex(0);
                      setMatchWinner(null);
                      setShowTournamentWinnerMessage(false);
                      setRegisteredPlayers([]);
                      setTempPlayers([]);
                    }
                  }}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                >
                  {t('game.restartTournament')}
                </button>
              )}

              {/* Show Next Match button when current match is finished and there are more matches (not final match) */}
              {currentMatch?.status === 'finished' && nextMatch && !isLastMatch && (
                <button
                  onClick={proceedToNextMatch}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                >
                  {t('game.nextMatch')}
                </button>
              )}
            </div>

            {/* Next Match Info */}
            {nextMatch && !showTournamentWinnerMessage && (
              <div className="text-center order-1 sm:order-2">
                <p className="text-gray-300 text-xs sm:text-sm">{t('game.nextMatchLabel')}</p>
                <div className="flex items-center gap-1 sm:gap-2 text-white text-sm">
                  <span className="truncate max-w-16 sm:max-w-none">{nextMatch.player1?.name || t('game.tbd')}</span>
                  <span className="text-purple-300">{t('game.vs')}</span>
                  <span className="truncate max-w-16 sm:max-w-none">{nextMatch.player2?.name || t('game.tbd')}</span>
                </div>
              </div>
            )}

            {/* Tournament Complete Info */}
            {isLastMatch && !showTournamentWinnerMessage && (
              <div className="text-center order-1 sm:order-2">
                <p className="text-green-300 font-semibold text-sm sm:text-base">{t('game.finalMatch')}</p>
                <p className="text-gray-300 text-xs sm:text-sm">{t('game.winnerTakesTournament')}</p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Minimal UI in Fullscreen - Fixed Bottom */}
        {isFullscreen && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-purple-500 shadow-xl">
            <div className="flex items-center gap-4 text-white text-sm flex-wrap justify-center">
              <div>
                <span className="opacity-70">Round {currentMatch.round} - Match {currentMatchIndex + 1}</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <img src={currentMatch.player1.avatar} alt={currentMatch.player1.name} className="w-6 h-6 rounded-full" />
                <span className="font-semibold">{currentMatch.player1.name}</span>
                <span className="mx-2 opacity-50">vs</span>
                <img src={currentMatch.player2.avatar} alt={currentMatch.player2.name} className="w-6 h-6 rounded-full" />
                <span className="font-semibold">{currentMatch.player2.name}</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div>
                <span className="opacity-70">P1: </span>
                <span className="font-semibold">W/S</span>
                <span className="opacity-70 ml-3">P2: </span>
                <span className="font-semibold">↑/↓</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="opacity-70 text-xs">
                Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">F</kbd> to exit fullscreen
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-sm font-medium flex items-center gap-2"
              >
                <IoContract className="w-4 h-4" />
                Exit Fullscreen
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Tournament Finished phase - show champion and statistics (for local and remote tournaments)
  if (tournamentStep === 'finished' && (tournamentType === 'local' || tournamentType === 'remote')) {
    const bracket = gameState.tournament?.bracket || [];
    // Only consider matches that have players assigned (are playable)
    // A match is "finished" only if it has both players AND status is 'finished' AND has a winner
    const playableMatches = bracket.filter(m => m.player1 && m.player2);
    const isComplete = playableMatches.length > 0 &&
      playableMatches.every(m => m.status === 'finished' && m.winner);
    // For remote tournaments, champion may come from backend
    const champion = tournamentType === 'remote' && remoteTournament?.champion
      ? remoteTournament.champion
      : (isComplete ? bracket[bracket.length - 1]?.winner : null);
    const totalMatches = bracket.length;
    const finishedMatches = bracket.filter(m => m.status === 'finished').length;

    // Calculate tournament statistics
    const matchStatistics = bracket.map((match, index) => {
      if (match.status === 'finished' && match.player1 && match.player2) {
        return {
          matchNumber: index + 1,
          round: match.round,
          player1: match.player1.name,
          player2: match.player2.name,
          winner: match.winner?.name || 'Unknown'
        };
      }
      return null;
    }).filter(Boolean);

    if (!champion) {
      // If no champion yet, go back to bracket view (only for local tournaments)
      if (tournamentType === 'local') {
      return (
        <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
          <div className="text-center">
            <p className="text-white text-lg mb-4">{t('game.tournamentNotComplete')}</p>
            <button
              onClick={() => setTournamentStep('bracket')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              {t('game.viewBracket')}
            </button>
          </div>
        </div>
      );
      } else {
        // For remote tournaments, redirect to game lobby
        return (
          <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
            <div className="text-center">
              <p className="text-white text-lg mb-4">{t('game.tournamentNotComplete')}</p>
              <button
                onClick={() => router.push('/game')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                {t('game.backToGameModes')}
            </button>
          </div>
        </div>
      );
      }
    }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-2 sm:p-4 md:p-8 h-full ">
        <div className="w-full h-[100%] b-4 border-white">
          {/* Champion Celebration Section */}
          <div className="text-center mb-4 sm:mb-6 animate-pulse">
            <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl border-2 border-yellow-300">
              <div className="flex justify-center mb-2 sm:mb-3">
                <FaTrophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-yellow-200 animate-bounce" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                🏆 {t('game.tournamentChampion')} 🏆
              </h1>
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <img
                  src={champion.avatar}
                  alt={champion.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-yellow-300 shadow-lg"
                />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {champion.name}
                </h2>
                <div className="bg-yellow-400/20 rounded-lg px-3 py-1 sm:px-4 sm:py-2">
                  <p className="text-yellow-200 text-sm sm:text-base md:text-lg font-semibold">
                    {t('game.tournamentWinner')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Statistics - Removed for remote tournaments */}
          {tournamentType === 'local' && (
          <div className="bg-gray-800/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 shadow-xl border border-purple-400 max-h-[60vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4 text-center">
              {t('game.tournamentStatistics')}
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-300 mb-0.5 sm:mb-1">{totalMatches}</div>
                <div className="text-gray-300 text-xs sm:text-sm">{t('game.totalMatches')}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-300 mb-0.5 sm:mb-1">{finishedMatches}</div>
                <div className="text-gray-300 text-xs sm:text-sm">{t('game.completedMatches')}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-300 mb-0.5 sm:mb-1">{playerCount}</div>
                <div className="text-gray-300 text-xs sm:text-sm">{t('game.totalPlayers')}</div>
              </div>
            </div>

            {/* Match Results */}
            {matchStatistics.length > 0 && (
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-3">
                  {t('game.matchResults')}
                </h4>
                <div className="space-y-1.5 sm:space-y-2">
                  {matchStatistics.map((stat: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3"
                    >
                      <div className="text-center sm:text-left flex-1 min-w-0">
                        <div className="text-purple-300 font-semibold text-xs sm:text-sm truncate">
                          {stat.round === 2 ? t('game.finalMatch') : stat.round === 1 ? 'Semi-Final' : `Match ${stat.matchNumber}`}
                        </div>
                        <div className="text-gray-300 text-xs truncate">
                          {stat.player1} vs {stat.player2}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-600/30 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 flex-shrink-0">
                        <FaTrophy className="text-yellow-400 text-xs" />
                        <span className="text-green-300 font-semibold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{stat.winner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col h-[10%] sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                // Reset tournament state and go back to setup
                setTournamentStep('setup');
                setCurrentMatchIndex(0);
                setMatchWinner(null);
                setShowTournamentWinnerMessage(false);
                setRegisteredPlayers([]);
                setTempPlayers([]);
              }}
              className="px-3 py-3 sm:px-4 sm:py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all hover:scale-105"
            >
              {t('game.newTournament')}
            </button>
            {tournamentType === 'local' && (
            <button
              onClick={() => setTournamentStep('bracket')}
              className="px-3 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all hover:scale-105"
            >
              {t('game.viewBracket')}
            </button>
            )}
            <button
              onClick={() => router.push('/game')}
              className="px-3 py-3 sm:px-8 sm:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all hover:scale-105"
            >
              {t('game.backToGameModes')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game started animation phase
  if (showGameStartedAnimation) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-center">
          <div className="mb-8">
            <FaTrophy className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 animate-pulse">
              {t('game.gameStarted') || 'GAME STARTED!'}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bracket phase - show tournament results and allow navigation
  if (tournamentStep === 'bracket') {
    // Bracket view is only available for local tournaments
    if (tournamentType === 'remote') {
      // Redirect remote tournament users back to playing or setup
      const bracket = gameState.tournament?.bracket || [];
      const currentMatch = bracket[currentMatchIndex];
      if (currentMatch && currentMatch.status === 'playing') {
        setTournamentStep('playing');
      } else {
        router.push('/game');
      }
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-6xl mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 mb-2 sm:mb-4">{t('game.tournamentBracket')}</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {(() => {
                const bracket = gameState.tournament?.bracket || [];
                // Only consider matches that have players assigned (are playable)
                // A match is "finished" only if it has both players AND status is 'finished' AND has a winner
                const playableMatches = bracket.filter(m => m.player1 && m.player2);
                const allPlayableFinished = playableMatches.length > 0 &&
                  playableMatches.every(m => m.status === 'finished' && m.winner);
                return allPlayableFinished
                ? t('game.tournamentComplete')
                  : t('game.tournamentProgress');
              })()}
            </p>
          </div>

          <TournamentBracket />



          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
            {/* Back button for local tournaments - return to match winner modal */}
            {tournamentType === 'local' && (() => {
              const bracket = gameState.tournament?.bracket || [];
              const currentMatch = bracket[currentMatchIndex];
              // Show back button if there's a finished match (came from match winner modal)
              if (currentMatch && currentMatch.status === 'finished') {
                return (
                  <button
                    onClick={() => {
                      setTournamentStep('playing');
                      // Re-show the match winner message if match is finished
                      if (currentMatch.winner) {
                        setMatchWinner(currentMatch.winner);
                        setShowTournamentWinnerMessage(true);
                      }
                    }}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.back')}
                  </button>
                );
              }
              return null;
            })()}

            <button
              onClick={() => router.push('/game')}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
            >
              {t('game.backToGameModes')}
            </button>

            {/* Return to current game if match is in progress */}
            {(() => {
              const bracket = gameState.tournament?.bracket || [];
              const currentMatch = bracket[currentMatchIndex];

              // If current match is pending (in progress), show return to game button
              if (currentMatch && currentMatch.status === 'pending' && currentMatch.player1 && currentMatch.player2) {
                return (
                  <button
                    onClick={() => setTournamentStep('playing')}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.returnToGame')}
                  </button>
                );
              }

              // Bracket view is only for local tournaments - no remote tournament logic here
              return null;
            })()}

            <button
              onClick={() => setTournamentStep('setup')}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
            >
              {t('game.newTournament')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tournament search phase
  if (tournamentStep === 'search') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-6xl bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-700 via-purple-900 to-black border-2 border-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-300 mb-2 xs:mb-3 sm:mb-4 md:mb-6 text-center flex items-center justify-center gap-1 xs:gap-2">
            <FaSearch className="text-yellow-400 text-sm xs:text-base sm:text-lg" />
            <span className="break-words">{t('game.availableTournaments')}</span>
          </h1>

          {isSearching ? (
            <div className="text-center py-6 xs:py-8">
              <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-purple-400 mx-auto mb-3 xs:mb-4"></div>
              <p className="text-white text-sm xs:text-base">{t('game.searchingForTournaments')}</p>
            </div>
          ) : (
            <>
              {availableTournaments.length === 0 ? (
                <div className="text-center py-6 xs:py-8">
                  <p className="text-gray-300 mb-3 xs:mb-4 text-sm xs:text-base">{t('game.noOpenTournaments')}</p>
                  <button
                    onClick={searchTournaments}
                    className="px-3 py-2 xs:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm xs:text-base"
                  >
                    {t('game.refreshSearch')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  {availableTournaments.map((tournament) => (
                    <div
                      key={tournament.id}
                      className="bg-gray-800 rounded-lg p-2 xs:p-3 sm:p-4 border border-gray-600 hover:border-purple-400 transition-all"
                    >
                      <div className="flex flex-col gap-2 xs:gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 xs:gap-3 mb-2">
                            <img
                              src={tournament.host.avatar}
                              alt={tournament.host.name}
                              className="w-6 h-6 xs:w-8 xs:h-8 rounded-full flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h3 className="text-white font-semibold text-xs xs:text-sm sm:text-base truncate">
                                {tournament.name}
                              </h3>
                              <p className="text-gray-400 text-xs sm:text-sm truncate">
                                {t('game.hostedBy', { name: tournament.host.name })}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 xs:gap-2 text-xs">
                            <span className="bg-purple-600 bg-opacity-30 text-purple-300 px-2 py-1 rounded text-xs">
                              {tournament.playerCount || tournament.maxPlayers} {t('game.players')}
                            </span>
                            <span className="bg-blue-600 bg-opacity-30 text-blue-300 px-2 py-1 rounded text-xs">
                              {tournament.registeredPlayers?.length || tournament.currentPlayers}/{tournament.playerCount || tournament.maxPlayers} {t('game.joined')}
                            </span>
                            <span className="bg-green-600 bg-opacity-30 text-green-300 px-2 py-1 rounded text-xs">
                              {tournament.type ? tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1) : t('game.tournament')}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-center xs:justify-end">
                          {pendingJoinRequest === tournament.id ? (
                            <div className="text-center bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded-lg px-2 xs:px-3 py-2 w-full xs:w-auto">
                              <div className="flex items-center justify-center gap-1 xs:gap-2 mb-1">
                                <FaClock className="text-yellow-400 text-xs xs:text-sm" />
                                <span className="text-yellow-400 text-xs xs:text-sm font-semibold">{t('game.requestPending')}</span>
                              </div>
                              <p className="text-gray-400 text-xs">{t('game.waitingForHostApproval')}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => joinTournament(tournament.id)}
                              disabled={(tournament.registeredPlayers?.length || tournament.currentPlayers) >= (tournament.playerCount || tournament.maxPlayers)}
                              className="w-full xs:w-auto px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs xs:text-sm"
                            >
                              {(tournament.registeredPlayers?.length || tournament.currentPlayers) >= (tournament.playerCount || tournament.maxPlayers) ? t('game.full') : t('game.joinTournament')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-6">
            <button
              onClick={() => setTournamentStep('setup')}
              className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base"
            >
              {t('game.backToSetup')}
            </button>
            <button
              onClick={searchTournaments}
              className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base"
            >
              {t('game.refreshSearch')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Return to setup for any other tournament steps
  return (
    <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">{t('game.tournamentFeature')}</h2>
        <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">{t('game.tournamentSetupRegistrationOnly')}</p>
        <button
          onClick={() => router.push('/game')}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
        >
          {t('game.backToGameModes')}
        </button>
      </div>
    </div>
  );
}
