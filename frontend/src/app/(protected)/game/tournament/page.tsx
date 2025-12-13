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
  const [isMatchActive, setIsMatchActive] = useState(false); // Prevent auto-switching during active match
  const gameContainerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStartingTournament, setIsStartingTournament] = useState(false);

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
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);



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
        // If no valid match and match is not active, go back to bracket view
        if (!isMatchActive) {
          setTournamentStep('bracket');
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
              } else if (!isHost && tournamentStep !== 'playing' && tournamentStep !== 'bracket') {
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
                setCurrentMatchIndex(0);
              }

              // Only show animation and transition if not already in a match
              if (!isMatchActive && tournamentStep !== 'playing') {
                // Show "Game started" animation first, then go to bracket
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
              }
            }

            // Update bracket when matches finish (for remote tournaments)
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
                console.log('[Frontend] Bracket updated - matches finished or final match started');
                // Update tournament bracket
                setTournament({
                  ...gameState.tournament!,
                  bracket: updatedBracket
                });
              }
            }

            // For remote tournaments, sync bracket updates during gameplay
            // Update bracket when matches finish (for remote tournaments)
            // Don't auto-switch to bracket if match is active
            if (tournamentType === 'remote' && message.data.bracket && !isMatchActive) {
              // Update bracket state from backend
              const updatedBracket = message.data.bracket;
              const currentTournament = gameState.tournament;
              if (currentTournament) {
                setTournament({
                  ...currentTournament,
                  bracket: updatedBracket
                });
              }

              // Update game context bracket
              const currentMatch = updatedBracket[currentMatchIndex];
              if (currentMatch && currentMatch.status === 'finished' && currentMatch.winner) {
                // Match is finished - update local state
                setMatchWinner(currentMatch.winner);
                setShowTournamentWinnerMessage(true);
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
            console.log('[Frontend] Received gameState message:', {
              tournamentType,
              tournamentStep,
              hasPayload: !!message.payload,
              roomCode: roomCode,
              player1Id: message.payload?.player1?.id,
              player2Id: message.payload?.player2?.id,
              currentUserId: user?.id_user
            });

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
            // If we're on bracket step but receiving gameState, it means the game has started - transition to playing
            if (tournamentType === 'remote' && (tournamentStep === 'playing' || (tournamentStep === 'bracket' && !isMatchActive))) {
              // Verify roomCode matches current match if available
              const receivedRoomCode = message.roomCode;
              const bracket = gameState.tournament?.bracket || [];
              const currentMatch = bracket[currentMatchIndex];

              // If we have roomCode, verify it matches the current match
              if (receivedRoomCode && currentMatch && currentMatch.roomCode && currentMatch.roomCode !== receivedRoomCode) {
                console.warn('[Frontend] Received gameState for different room:', {
                  receivedRoomCode,
                  expectedRoomCode: currentMatch.roomCode,
                  currentMatchIndex,
                  currentMatchId: currentMatch.id
                });
                // Don't process if it's for a different match
                break;
              }

              // If we're still on bracket step but receiving gameState, transition to playing
              if (tournamentStep === 'bracket' && !isMatchActive) {
                console.log('[Frontend] Received gameState while on bracket step - auto-transitioning to playing');
                // Find the match the user is in and transition
                const userId = user?.id_user?.toString();
                if (userId) {
                  const userMatch = bracket.find(m =>
                    m.player1 && m.player2 &&
                    (m.player1.id?.toString() === userId || m.player2.id?.toString() === userId) &&
                    (m.status === 'pending' || m.status === 'playing') &&
                    (!receivedRoomCode || m.roomCode === receivedRoomCode) // Match roomCode if provided
                  );
                  if (userMatch) {
                    const matchIndex = bracket.findIndex(m => m.id === userMatch.id);
                    if (matchIndex !== -1) {
                      console.log('[Frontend] Auto-transitioning to playing step for match:', matchIndex);
                      setCurrentMatchIndex(matchIndex);
                      setTournamentStep('playing');
                      setShouldAutoStartMatch(false);
                      setIsMatchActive(true);
                    }
                  } else {
                    console.warn('[Frontend] Received gameState but could not find user match in bracket');
                  }
                }
              }

              // Only set serverGameState if we're on the correct match or transitioning to it
              if (tournamentStep === 'playing' || (tournamentStep === 'bracket' && !isMatchActive)) {
                console.log('[Frontend] Setting serverGameState');
                console.log('[Frontend] GameState payload:', {
                  player1Score: message.payload?.player1?.score,
                  player2Score: message.payload?.player2?.score,
                  ballX: message.payload?.ball?.x,
                  ballY: message.payload?.ball?.y,
                  roomCode: receivedRoomCode
                });
                setServerGameState(message.payload);
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
              const currentTournament = gameState.tournament;
              if (currentTournament) {
                setTournament({
                  ...currentTournament,
                  bracket: message.data.bracket,
                  status: 'finished'
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
    setShowTournamentWinnerMessage(false);
    setMatchWinner(null);

    const bracket = gameState.tournament?.bracket || [];

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
      // If no more matches are ready, go to the bracket view
      setTournamentStep('bracket');
    }
  }, [
    gameState.tournament?.bracket,
    currentMatchIndex,
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
    setShowMatchCompletionModal(true);
    setShowTournamentWinnerMessage(true);

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
          const isComplete = bracket.every(m => m.status === 'finished');
          if (isComplete) {
            // Automatically transition to finished screen after showing match winner modal
            setTimeout(() => {
              setTournamentStep('finished');
            }, 2500); // 2.5 second delay to allow match winner modal to be seen
          }
        }
    }
  }, [gameState.tournament?.bracket, updateTournamentMatch, currentMatchIndex, matchWinner, tournamentType]);

  // Effect to auto-advance to final match when both Round 1 matches finish (for remote tournaments)
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

      // Check if final match has players (status can be 'pending' or 'playing')
      if (finalMatch && finalMatch.player1 && finalMatch.player2 &&
          (finalMatch.status === 'playing' || finalMatch.status === 'pending')) {
        // Final match is ready - check if user is in it
        const userId = user?.id_user?.toString();
        const userInFinal = userId && (
          finalMatch.player1.id?.toString() === userId ||
          finalMatch.player2.id?.toString() === userId
        );

        if (userInFinal && tournamentStep !== 'playing' && finalMatch.status === 'playing') {
          console.log('[Frontend] Both Round 1 matches finished. Auto-advancing to final match');
          const finalMatchIndex = bracket.findIndex(m => m.id === finalMatch.id);
          if (finalMatchIndex !== -1) {
            setCurrentMatchIndex(finalMatchIndex);
            setTournamentStep('playing');
            setShowMatchCompletionModal(false);
            setIsMatchActive(true);
          }
        }
      }
    }
  }, [gameState.tournament?.bracket, tournamentType, tournamentStep, user?.id_user, currentMatchIndex]);

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
      // Hide fullscreen prompt if we successfully entered fullscreen
      if (isNowFullscreen) {
        setShowFullscreenPrompt(false);
      }
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
  useEffect(() => {
    if (tournamentType === 'remote' && tournamentStep === 'playing' && serverGameState && currentMatch) {
      const WINNING_SCORE = 10;
      console.log('[Frontend] Checking for winner:', {
        player1Score: serverGameState.player1?.score,
        player2Score: serverGameState.player2?.score,
        matchWinner,
        hasCurrentMatch: !!currentMatch
      });
      if (serverGameState.player1.score >= WINNING_SCORE && !matchWinner) {
        // Player 1 won
        console.log('[Frontend] Player 1 won!');
        const winner = currentMatch.player1;
        handleGameComplete(winner);
      } else if (serverGameState.player2.score >= WINNING_SCORE && !matchWinner) {
        // Player 2 won
        console.log('[Frontend] Player 2 won!');
        const winner = currentMatch.player2;
        handleGameComplete(winner);
      }
    }
  }, [serverGameState, tournamentType, tournamentStep, currentMatch, matchWinner, handleGameComplete]);

  // Auto-fullscreen for tournament matches (both local and remote)
  const autoFullscreenAttemptedRef = React.useRef(false);
  useEffect(() => {
    if (tournamentStep === 'playing' && !isFullscreen && !autoFullscreenAttemptedRef.current) {
      const container = gameContainerRef.current;
      if (!container) return;

      // Check if already in fullscreen
      const isAlreadyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (isAlreadyFullscreen) {
        autoFullscreenAttemptedRef.current = true;
        return;
      }

      // Mark as attempted immediately
      autoFullscreenAttemptedRef.current = true;

      // Use requestAnimationFrame to ensure we're in interaction context
      // This helps with permission checks, but may still fail if no user interaction occurred
      const attemptFullscreen = async () => {
        try {
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
        } catch (error: any) {
          // Permission error is expected if no user interaction occurred
          // Show a prompt for user to click to enter fullscreen
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Tournament] Auto-fullscreen blocked (permission check failed):', error.message);
          }
          // Show fullscreen prompt button
          setShowFullscreenPrompt(true);
          // Reset flag so user can try again manually
          autoFullscreenAttemptedRef.current = false;
        }
      };

      // Small delay to ensure container is ready, then use requestAnimationFrame
      const timer = setTimeout(() => {
        requestAnimationFrame(attemptFullscreen);
      }, 300);

      return () => clearTimeout(timer);
    }

    // Reset the flag when leaving playing step or when match changes
    if (tournamentStep !== 'playing') {
      autoFullscreenAttemptedRef.current = false;
    }
  }, [tournamentStep, isFullscreen, currentMatchIndex]);

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

    if (shouldAutoStartMatch && tournamentType === 'remote' && tournamentStep === 'bracket' && user?.id_user) {
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
      const userMatch = bracket.find(m =>
        m.player1 && m.player2 &&
        (m.player1.id?.toString() === userId || m.player2.id?.toString() === userId) &&
        (m.status === 'pending' || m.status === 'playing')
      );

      if (userMatch) {
        console.log('[Frontend] Found user match:', {
          matchId: userMatch.id,
          round: userMatch.round,
          roomCode: userMatch.roomCode,
          status: userMatch.status
        });
        // Small delay to show bracket briefly before auto-starting
        const timer = setTimeout(() => {
          // Only auto-start if match is not already active
          if (!isMatchActive) {
            const matchIndex = bracket.findIndex(m => m.id === userMatch.id);
            console.log('[Frontend] Auto-starting match after delay:', { matchIndex, matchId: userMatch.id });
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
        console.warn('[Frontend] No user match found in bracket. User ID:', userId);
        console.warn('[Frontend] Bracket matches:', bracket.map(m => ({
          id: m.id,
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
    const isComplete = bracket.every(m => m.status === 'finished');
    const champion = isComplete ? bracket[bracket.length - 1]?.winner : null;

    return (
      <div className="w-full bg-gray-800 bg-opacity-90 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-purple-400 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4 text-center">
          {t('game.tournamentBracket')}
        </h3>

        {/* Show "Your next match is..." message for remote tournaments */}
        {tournamentType === 'remote' && userMatch && userMatch.player1 && userMatch.player2 && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg border-2 border-purple-400 animate-pulse">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <FaGamepad className="text-yellow-300 text-lg sm:text-xl" />
              <p className="text-white font-semibold text-sm sm:text-base lg:text-lg text-center">
                {t('game.yourNextMatchIs') || 'Your next match is:'} <span className="text-yellow-300">
                  {userMatch.player1.name} {t('game.vs')} {userMatch.player2.name}
                </span>
              </p>
            </div>
          </div>
        )}

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

        {/* Next Match button - only show for remote tournaments, not local */}
        {tournamentType !== 'local' && (
          <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            {!isComplete && getNextMatch() && (
              <button
                onClick={playNextMatch}
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs sm:text-sm"
              >
                <FaGamepad />
                <span className="hidden sm:inline">{t('game.nextMatch')}</span>
                <span className="sm:hidden">{t('game.nextMatch')}</span>
              </button>
            )}
          </div>
        )}
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
              {remoteTournament?.status === 'playing' && (
                <button
                  onClick={() => setTournamentStep('bracket')}
                  className="w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2"
                >
                  {t('game.viewBracket')}
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
              <h2 className="text-lg sm:text-xl font-bold text-purple-300">{t('game.tournamentMatch')}</h2>
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
          {/* Fullscreen prompt - shown if auto-fullscreen fails */}
          {showFullscreenPrompt && !isFullscreen && (
            <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-6 sm:p-8 text-center max-w-md mx-4">
                <IoExpand className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t('game.enterFullscreen') || 'Enter Fullscreen'}</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-6">
                  {t('game.clickToEnterFullscreen') || 'Click the button below to enter fullscreen mode for the best gaming experience.'}
                </p>
                <button
                  onClick={async () => {
                    await toggleFullscreen();
                    setShowFullscreenPrompt(false);
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base sm:text-lg"
                >
                  {t('game.enterFullscreen') || 'Enter Fullscreen'}
                </button>
                <button
                  onClick={() => setShowFullscreenPrompt(false)}
                  className="mt-3 px-4 py-2 text-gray-300 hover:text-white text-sm"
                >
                  {t('game.skip') || 'Skip'}
                </button>
              </div>
            </div>
          )}

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

          {/* Match Completion Modal - Shows match status and other match progress */}
          {showMatchCompletionModal && matchWinner && currentMatch && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
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
                {tournamentType === 'remote' && currentMatch.round === 1 && (
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
                )}

                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  {isLastMatch
                    ? t('game.tournamentComplete')
                    : currentMatch.round === 1 && tournamentType === 'remote'
                    ? t('game.waitingForOtherMatch') || 'Waiting for other match to finish...'
                    : t('game.advancingToNextRound')}
                </p>

                {/* Manual controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                        setShowMatchCompletionModal(false);
                        setShowTournamentWinnerMessage(false);
                        setTournamentStep('finished');
                      }}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      {t('game.viewChampion')}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowMatchCompletionModal(false);
                      setTournamentStep('bracket');
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.viewTournamentBracket')}
                  </button>
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
          {showTournamentWinnerMessage && matchWinner && !showMatchCompletionModal && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
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

                {/* Manual controls for match progression */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                  {!isLastMatch && (
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
                  <button
                    onClick={() => setTournamentStep('bracket')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.viewTournamentBracket')}
                  </button>
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
              {/* View Bracket button - only show for remote tournaments or after match finishes (local) */}
              {/* View Bracket button - only show when match is not active */}
              {!isMatchActive && (tournamentType === 'remote' || showTournamentWinnerMessage) && (
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
    const isComplete = bracket.every(m => m.status === 'finished');
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
      // If no champion yet, go back to bracket view
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

          {/* Tournament Statistics */}
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
            <button
              onClick={() => setTournamentStep('bracket')}
              className="px-3 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base sm:text-lg transition-all hover:scale-105"
            >
              {t('game.viewBracket')}
            </button>
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
    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-6xl mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 mb-2 sm:mb-4">{t('game.tournamentBracket')}</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {gameState.tournament?.bracket?.every(m => m.status === 'finished')
                ? t('game.tournamentComplete')
                : t('game.tournamentProgress')}
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

              // Otherwise, show continue tournament for next match if available (only for remote tournaments)
              if (tournamentType === 'remote') {
                const nextMatch = bracket.find((m, index) =>
                  m.status === 'pending' &&
                  m.player1 &&
                  m.player2 &&
                  index !== currentMatchIndex
                );
                return nextMatch ? (
                  <button
                    onClick={() => {
                      const nextIndex = bracket.findIndex(m => m.id === nextMatch.id);
                      setCurrentMatchIndex(nextIndex);
                      setTournamentStep('playing');
                    }}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    {t('game.continueTournament')}
                  </button>
                ) : null;
              }
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
