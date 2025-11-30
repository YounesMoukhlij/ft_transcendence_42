'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext, Player, TournamentMatch } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { getWebSocket } from '@/components/globalSocket';
import { useUserStore } from '@/store/userStore';
import { FaUser, FaUpload, FaCrown, FaTrophy, FaGamepad, FaSearch, FaCheck, FaTimes as FaReject, FaClock, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { getBackendURL } from '@/lib/utils';
import { toast } from 'sonner';

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
  status: 'waiting' | 'in-progress' | 'finished' | 'playing';
  isPrivate: boolean;
  registeredPlayers?: Player[];
  playerCount?: number;
  type?: string;
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
  return (
    <div className="w-full max-w-6xl mx-auto h-full bg-gray-900 bg-opacity-90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-3 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300 mb-4 sm:mb-6 text-center">Register Players</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {tempPlayers.map((player, index) => (
          <div key={player.id} className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-400">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={player.avatar}
                  alt={`Player ${index + 1}`}
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
                    {index === 0 ? 'Host Player' : `Player ${index + 1}`}
                  </span>
                  {index === 0 && <FaCrown className="text-yellow-400 text-sm" />}
                </div>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                  placeholder={`Enter name for Player ${index + 1}`}
                  className="w-full px-2 py-2 sm:px-3 text-sm sm:text-base bg-gray-700 text-white rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={index === 0} // Host name is pre-filled
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs sm:text-sm text-gray-300 mb-2">Choose Avatar:</label>
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
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={tempPlayers.filter(p => p.name.trim() !== '').length !== playerCount}
          className="px-6 py-2 sm:px-8 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm sm:text-base"
        >
          Start Tournament
        </button>
      </div>
    </div>
  );
});

PlayerRegistration.displayName = 'PlayerRegistration';

export default function TournamentPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const { gameState, setGameMode, setPlayers, setTournament, updateTournamentMatch, setCustomisation } = useGameContext();
  const [tournamentStep, setTournamentStep] = useState<'setup' | 'registration' | 'customization' | 'playing' | 'bracket' | 'finished' | 'search' | 'browse' | 'createOptions'>('setup');
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

  // New state for tournament search and join requests
  const [availableTournaments, setAvailableTournaments] = useState<RemoteTournament[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [pendingJoinRequest, setPendingJoinRequest] = useState<string | null>(null);
  const [friends, setFriends] = useState<Player[]>([]);
  const [tournamentInvites, setTournamentInvites] = useState<any[]>([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showFriendsListModal, setShowFriendsListModal] = useState(false);
  const [isFindingRandomOpponent, setIsFindingRandomOpponent] = useState(false);
  const [shouldAutoFindRandomOpponent, setShouldAutoFindRandomOpponent] = useState(false);
  const [shouldShowFriendsModalAfterCreation, setShouldShowFriendsModalAfterCreation] = useState(false);
  const [showFriendsListExpanded, setShowFriendsListExpanded] = useState(false);
  const [showRandomOpponentExpanded, setShowRandomOpponentExpanded] = useState(false);
  const [tournamentCancelledMessage, setTournamentCancelledMessage] = useState<string | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);



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

  useEffect(() => {
    setGameMode('tournament');

    // Check if user is coming from accepting an invite (check sessionStorage)
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
        // Always go to registration (waiting) screen for invited players
        // If they're the host, they'll be redirected to customization when tournament is full
        // Use saved step if available, otherwise default to registration
        setTournamentStep(savedTournamentStep === 'registration' ? 'registration' : 'registration');

        // Clear sessionStorage
        sessionStorage.removeItem('pendingTournamentId');
        sessionStorage.removeItem('pendingTournament');
        sessionStorage.removeItem('isInvitedPlayer');
        sessionStorage.removeItem('tournamentStep');
      } catch (err) {
        console.error('Error parsing pending tournament:', err);
        sessionStorage.removeItem('pendingTournamentId');
        sessionStorage.removeItem('pendingTournament');
        sessionStorage.removeItem('isInvitedPlayer');
        sessionStorage.removeItem('tournamentStep');
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
        // If no valid match, go back to bracket view
        setTournamentStep('bracket');
      }
    }
  }, [tournamentStep, currentMatchIndex, gameState.tournament?.bracket?.length]);

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
            setIsHost(false);
            setTournamentId(message.data.tournamentId);
            setTournamentType('remote'); // CRITICAL: Set type to remote
            // Always go to registration page to wait for tournament to start
            setTournamentStep('registration');
            setIsFindingRandomOpponent(false);
            setShowFriendsListExpanded(false);
            setShowRandomOpponentExpanded(false);
            break;

          case 'tournamentUpdated':
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
              // Tournament has started - set bracket and players in game context
              if (message.data.bracket && message.data.registeredPlayers) {
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
              setTournamentStep('bracket');
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
            // Host receives a join request
            if (isHost && remoteTournament?.id === message.data.tournamentId) {
              setJoinRequests(prev => [...prev, message.data.request]);
            }
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
    return gameState.tournament?.bracket[currentMatchIndex];
  }, [gameState.tournament?.bracket, currentMatchIndex]);

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
      // Remote tournament logic
      createRemoteTournament(true);
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

    updateTournamentMatch(currentMatch.id, {
      winner,
      status: 'finished',
    });

    setMatchWinner(winner);
    setShowTournamentWinnerMessage(true);
  }, [currentMatchIndex, updateTournamentMatch, gameState.tournament?.bracket]);

  // Effect to advance winner to the next round
  useEffect(() => {
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
        }
    }
  }, [gameState.tournament?.bracket, updateTournamentMatch, currentMatchIndex, matchWinner]);

  // Calculate match players for the current tournament match - stable version
  // const matchPlayers = useMemo(() => {
  //   if (tournamentStep !== 'playing') return [];
  //   const bracket = gameState.tournament?.bracket;
  //   if (!bracket || currentMatchIndex >= bracket.length) return [];
  //   const currentMatch = bracket[currentMatchIndex];
  //   if (!currentMatch?.player1 || !currentMatch?.player2) return [];
  //   return [currentMatch.player1, currentMatch.player2];
  // }, [tournamentStep, currentMatchIndex, gameState.tournament?.bracket?.length]); // Use bracket length instead of bracket object

  const createRemoteTournament = (isPrivate: boolean) => {
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

  const TournamentBracket: React.FC = React.memo(() => {
    const bracket = gameState.tournament?.bracket || [];
    const rounds = Math.max(...bracket.map(m => m.round));

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

    const isComplete = bracket.every(m => m.status === 'finished');
    const winner = isComplete ? bracket[bracket.length - 1]?.winner : null;    return (
      <div className="w-full bg-gray-800 bg-opacity-90 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-purple-400 p-3 sm:p-4 lg:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4 text-center">
          Tournament Bracket
        </h3>

        {winner && (
          <div className="text-center mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg">
            <FaTrophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-300 mx-auto mb-2 sm:mb-3" />
            <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Tournament Champion!</h4>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <img src={winner.avatar} alt={winner.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white">{winner.name}</span>
            </div>
          </div>
        )}

        <div className="flex justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
          {Array.from({ length: rounds }, (_, roundIndex) => (
            <div key={roundIndex} className="flex flex-col gap-2 sm:gap-3 min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] flex-shrink-0">
              <h4 className="text-xs sm:text-sm lg:text-md font-semibold text-purple-300 text-center">
                {roundIndex === rounds - 1 ? 'Final' :
                 roundIndex === rounds - 2 ? 'Semi-Final' :
                 'Quarter-Final'}
              </h4>
              {getRoundMatches(roundIndex + 1).map((match) => (
                <div key={match.id} className={`bg-gray-700 rounded-md sm:rounded-lg p-2 sm:p-3 border ${
                  match.status === 'finished' ? 'border-green-400' :
                  match.status === 'playing' ? 'border-blue-400' : 'border-gray-500'
                }`}>
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
                        <span className="text-gray-400 text-xs">TBD</span>
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
                        <span className="text-gray-400 text-xs">TBD</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
          {!isComplete && getNextMatch() && (
            <button
              onClick={playNextMatch}
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs sm:text-sm"
            >
              <FaGamepad />
              <span className="hidden sm:inline">Play Next Match</span>
              <span className="sm:hidden">Next</span>
            </button>
          )}
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
              Cancel Tournament?
            </h2>
            <p className="text-white text-sm xs:text-base sm:text-lg mb-6 sm:mb-8">
              Are you sure you want to cancel this tournament? All players will be notified.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={confirmCancelTournament}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                Yes, Cancel Tournament
              </button>
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                No, Keep Tournament
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
              Tournament Cancelled
            </h2>
            <p className="text-white text-sm xs:text-base sm:text-lg mb-4 sm:mb-6">
              {tournamentCancelledMessage}
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mb-6">
              Redirecting to game page in a few seconds...
            </p>
            <button
              onClick={() => {
                setTournamentCancelledMessage(null);
                router.push('/game');
              }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
            >
              Go to Game Page Now
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
    const pendingTournamentId = sessionStorage.getItem('pendingTournamentId');

    // If user just accepted an invite, show loading screen while waiting for tournament data
    if (pendingTournamentId && tournamentType === 'remote' && !remoteTournament) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-300 mb-4 sm:mb-6"></div>
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-300 mb-2 sm:mb-3 text-center">
                Joining Tournament...
              </h2>
              <p className="text-gray-300 text-sm xs:text-base text-center">
                Please wait while we connect you to the tournament.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl h-full bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-700 via-purple-900 to-black border-2 border-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-300 mb-2 xs:mb-3 sm:mb-4 md:mb-6 text-center">Tournament Setup</h1>

          <div className="space-y-2 xs:space-y-3 sm:space-y-4">
            <div>
              <label className="block text-white text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 xs:mb-2 sm:mb-3 md:mb-4">Tournament Type</label>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => setTournamentType('local')}
                  className={`p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    tournamentType === 'local'
                      ? 'border-purple-400 bg-purple-600 bg-opacity-20'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-1 text-xs xs:text-sm md:text-base">Local Tournament</h3>
                  <p className="text-gray-300 text-xs xs:text-sm">All players on the same device</p>
                </button>
                <button
                  onClick={() => setTournamentType('remote')}
                  className={`p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    tournamentType === 'remote'
                      ? 'border-purple-400 bg-purple-600 bg-opacity-20'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-1 text-xs xs:text-sm md:text-base">Remote Tournament</h3>
                  <p className="text-gray-300 text-xs xs:text-sm">Players join from different devices</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 xs:mb-2 sm:mb-3 md:mb-4">Player Count</label>
              <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => setPlayerCount(4)}
                  className={`p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    playerCount === 4
                      ? 'border-purple-400 bg-purple-600 bg-opacity-20'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-1 text-xs xs:text-sm md:text-base">4 Players</h3>
                  <p className="text-gray-300 text-xs xs:text-sm">Semi-finals → Final</p>
                </button>
              </div>
            </div>

            {/* Remote tournament options */}
            {tournamentType === 'remote' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => {
                      // Create tournament immediately, then navigate to options
                      createRemoteTournament(true);
                      setTournamentStep('createOptions');
                    }}
                    className="w-full sm:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    <FaUser className="text-sm" />
                    <span>Create Tournament</span>
                  </button>
                  <button
                    onClick={() => {
                      setTournamentStep('search');
                      searchTournaments();
                    }}
                    className="w-full sm:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    <FaSearch className="text-sm" />
                    <span>Join Tournament</span>
                </button>
                </div>
                <p className="text-gray-300 text-xs xs:text-sm text-center">
                  Create your own tournament or join an existing one
                </p>
              </div>
            )}
          </div>

            <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-6">
              <button
                onClick={() => router.push('/game')}
                className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-2 xs:order-1"
              >
                Back
              </button>
              {tournamentType === 'local' && (
                <button
                  onClick={() => setTournamentStep('registration')}
                  className="w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2"
                >
                  Continue
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
            {isWaitingForPlayers ? 'Waiting for Players...' : 'Create Tournament'}
          </h2>

          {isWaitingForPlayers ? (
            <>
              <p className="text-white text-sm xs:text-base mb-4 sm:mb-6 text-center">
                Players: {currentPlayerCount}/{playerCount}
              </p>

              {/* Show current players */}
              {remoteTournament?.registeredPlayers && remoteTournament.registeredPlayers.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-white text-sm sm:text-base mb-2 text-center">Current Players:</h3>
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
                      <div className="font-bold">Find Random Opponent</div>
                      <div className="text-xs sm:text-sm opacity-90">
                        {currentPlayerCount > 0
                          ? `Continue searching (${currentPlayerCount}/${playerCount} players)`
                          : 'Search for players looking to join tournaments'}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-yellow-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Searching for Random Opponent</h3>
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
                          <p className="text-green-300 text-sm mb-2 font-semibold">Tournament Full!</p>
                          <p className="text-gray-300 text-xs text-center">
                            All {playerCount} players found. Tournament is ready to start.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-3"></div>
                          <p className="text-white text-sm mb-2">Looking for available players...</p>
                          <p className="text-gray-300 text-xs text-center">
                            Found: {currentPlayerCount}/{playerCount} players
                          </p>
                          {currentPlayerCount > 0 && (
                            <p className="text-yellow-300 text-xs mt-2">Keep searching for more players...</p>
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
                      // If tournament doesn't exist, create it in the background
                      if (!remoteTournament || !tournamentId) {
                        setShouldAutoFindRandomOpponent(false);
                        setShouldShowFriendsModalAfterCreation(false);
                        createRemoteTournament(true);
                      }
                    }}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3"
                  >
                    <FaUser className="text-lg" />
                    <div className="text-left">
                      <div className="font-bold">Invite Friend</div>
                      <div className="text-xs sm:text-sm opacity-90">Invite a friend from your friends list</div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-purple-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Select a Friend to Invite</h3>
                      <button
                        onClick={() => setShowFriendsListExpanded(false)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>
                    {friends.length === 0 ? (
                      <p className="text-gray-300 text-sm text-center py-2">You don't have any friends yet.</p>
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
                                alert('Please wait for the tournament to be created first.');
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
                              Invite
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
                Choose how you want to find players for your tournament
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* Find Random Opponent - expands inline to show searching state */}
                {!showRandomOpponentExpanded ? (
                  <button
                    onClick={() => {
                      setShowRandomOpponentExpanded(true);
                      setShouldAutoFindRandomOpponent(true);
                      if (!remoteTournament || !tournamentId) {
                        createRemoteTournament(true);
                      } else {
                        findRandomOpponent();
                      }
                    }}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3"
                  >
                    <FaSearch className="text-lg" />
                    <div className="text-left">
                      <div className="font-bold">Find Random Opponent</div>
                      <div className="text-xs sm:text-sm opacity-90">Search for players looking to join tournaments</div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-yellow-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Searching for Random Opponent</h3>
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
                          <p className="text-green-300 text-sm mb-2 font-semibold">Tournament Full!</p>
                          <p className="text-gray-300 text-xs text-center">
                            All {playerCount} players found. Tournament is ready to start.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-3"></div>
                          <p className="text-white text-sm mb-2">Looking for available players...</p>
                          <p className="text-gray-300 text-xs text-center">
                            Found: {remoteTournament?.registeredPlayers?.length || 0}/{playerCount} players
                          </p>
                          {(remoteTournament?.registeredPlayers?.length || 0) > 0 && (
                            <p className="text-yellow-300 text-xs mt-2">Keep searching for more players...</p>
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
                      // If tournament doesn't exist, create it in the background
                      if (!remoteTournament || !tournamentId) {
                        setShouldAutoFindRandomOpponent(false);
                        setShouldShowFriendsModalAfterCreation(false);
                        createRemoteTournament(true);
                      }
                    }}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-3"
                  >
                    <FaUser className="text-lg" />
                    <div className="text-left">
                      <div className="font-bold">Invite Friend</div>
                      <div className="text-xs sm:text-sm opacity-90">Invite a friend from your friends list</div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full bg-gray-800 rounded-lg p-3 sm:p-4 border border-purple-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Select a Friend to Invite</h3>
                      <button
                        onClick={() => setShowFriendsListExpanded(false)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>
                    {friends.length === 0 ? (
                      <p className="text-gray-300 text-sm text-center py-2">You don't have any friends yet.</p>
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
                                alert('Please wait for the tournament to be created first.');
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
                              Invite
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
                Cancel Tournament
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
              Back
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
                Invite a Friend to Tournament
              </h3>
              {friends.length === 0 ? (
                <div className="py-4">
                  <p className="text-gray-300 text-sm mb-4">You don't have any friends yet.</p>
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
                            alert('Please wait for the tournament to be created first.');
                          }
                          setShowFriendsListModal(false);
                          setSelectedSlot(null);
                        }}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm"
                      >
                        Invite
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
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Registration phase
  if (tournamentStep === 'registration') {
    if (tournamentType === 'remote') {
      // Remote tournament registration waiting screen
      const currentPlayerCount = remoteTournament?.registeredPlayers?.length || 0;
      const isFull = currentPlayerCount >= playerCount;

      return (
        <div className="flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-3 xs:mb-4 sm:mb-6 text-center">
              Tournament Lobby
            </h2>

            {/* Special waiting message for non-host players */}
            {!isHost && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-900 bg-opacity-50 border border-purple-400 rounded-lg">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-purple-300"></div>
                  <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-semibold text-purple-200 text-center">
                    Waiting for Tournament to Start...
                  </h3>
                </div>
                <p className="text-xs xs:text-sm text-gray-300 text-center">
                  {isFull
                    ? "All players have joined! The host will start the tournament soon."
                    : `Waiting for more players to join... (${currentPlayerCount}/${playerCount})`}
                </p>
              </div>
            )}

            <div className="text-center mb-3 xs:mb-4 sm:mb-6">
              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl text-white mb-2 xs:mb-3 sm:mb-4">
                {(() => {
                  if (isFull) {
                    return isHost
                      ? `All players ready! (${currentPlayerCount}/${playerCount}) - Customize game to start`
                      : `All players ready! (${currentPlayerCount}/${playerCount}) - Waiting for host to start...`;
                  }
                  return `Waiting for players... (${currentPlayerCount}/${playerCount})`;
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
                          <span>Invite Friend</span>
                        </button>
                      ) : (
                        <div className="flex-1 sm:flex-initial bg-gray-800 rounded-lg p-3 border border-purple-400">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold text-xs sm:text-sm">Select a Friend</h3>
                            <button
                              onClick={() => setShowFriendsListExpanded(false)}
                              className="text-gray-400 hover:text-white"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </div>
                          {friends.length === 0 ? (
                            <p className="text-gray-300 text-xs text-center py-1">No friends yet.</p>
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
                                    Invite
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
                            <span>Searching...</span>
                          </>
                        ) : (
                          <>
                            <FaSearch className="text-sm" />
                            <span>Find Random Opponent</span>
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
                        <span className="text-gray-400 text-xs sm:text-sm">Empty Slot</span>
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
                  Pending Join Requests ({joinRequests.length})
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
                              Requested {request.timestamp ? new Date(request.timestamp).toLocaleTimeString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-2 w-full xs:w-auto">
                          <button
                            onClick={() => approveJoinRequest(request.id)}
                            className="flex-1 xs:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
                          >
                            <FaCheck className="w-3 h-3" />
                            <span className="hidden xs:inline">Accept</span>
                            <span className="xs:hidden">✓</span>
                          </button>
                          <button
                            onClick={() => declineJoinRequest(request.id)}
                            className="flex-1 xs:flex-initial px-2 py-1.5 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
                          >
                            <FaReject className="w-3 h-3" />
                            <span className="hidden xs:inline">Decline</span>
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
                  Cancel Tournament
                </button>
              )}
              <button
                onClick={() => setTournamentStep('setup')}
                className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-2 xs:order-1"
              >
                Back to Setup
              </button>
              {remoteTournament?.status === 'playing' && (
                <button
                  onClick={() => setTournamentStep('bracket')}
                  className="w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2"
                >
                  View Bracket
                </button>
              )}
            </div>
            {showAddPlayerModal && (
              <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Add Player to Slot {selectedSlot !== null ? selectedSlot + 1 : ''}</h3>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => {
                        setShowAddPlayerModal(false);
                        setShowFriendsListExpanded(true);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      Invite a friend
                    </button>
                    <button
                      onClick={() => {
                        findRandomOpponent();
                        setShowAddPlayerModal(false);
                      }}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      Find random opponent
                    </button>
                    <button
                      onClick={() => setShowAddPlayerModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      Cancel
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
                    {selectedSlot !== null ? `Invite a friend to Slot ${selectedSlot + 1}` : 'Invite a Friend to Tournament'}
                  </h3>
                  {friends.length === 0 ? (
                    <div className="py-4">
                      <p className="text-gray-300 text-sm mb-4">You don't have any friends yet.</p>
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
                                alert('Please wait for the tournament to be created first.');
                              }
                            setShowFriendsListModal(false);
                              setSelectedSlot(null);
                          }}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm"
                        >
                          Invite
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
                    Cancel
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

  // Customization phase - Only host can customize when tournament has 4 players
  if (tournamentStep === 'customization') {
    // Only show customization to host, and only if tournament has 4 players
    if (!isHost || (remoteTournament?.registeredPlayers?.length || 0) < playerCount) {
      // If not host or not enough players, go back to registration
      setTournamentStep('registration');
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <div className="mb-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-2">
            Customize Tournament Game
          </h2>
          <p className="text-gray-300 text-sm">
            All {playerCount} players are ready. Customize the game settings to start the tournament.
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
              // Local tournament
              startTournament(registeredPlayers);
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
          <div className="text-white">Loading next match...</div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-black opacity-90">
        {/* Tournament Header */}
        <div className="bg-gray-900 border-b border-purple-500 p-2 sm:p-4 ">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold text-purple-300">Tournament Match</h2>
              <p className="text-sm text-gray-300">
                Round {currentMatch.round} - Match {currentMatchIndex + 1}
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
              <span className="text-purple-300 font-bold text-sm sm:text-base">VS</span>
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

        {/* Game Area */}
        <div className="flex-1 relative">
          <PingPongGame
            tournamentMode={true}
            tournamentPlayers={currentPlayers}
            onTournamentMatchEnd={handleGameComplete}
          />

          {/* Winner Announcement Modal */}
          {showTournamentWinnerMessage && matchWinner && (
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
                <FaTrophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Match Winner!</h3>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <img
                    src={matchWinner.avatar}
                    alt={matchWinner.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                  <span className="text-lg sm:text-xl font-semibold text-white">{matchWinner.name}</span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  {isLastMatch ? 'Tournament Complete!' : 'Advancing to next round...'}
                </p>

                {/* Manual controls for match progression */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                  {!isLastMatch && (
                    <button
                      onClick={proceedToNextMatch}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                    >
                      Continue to Next Match
                    </button>
                  )}
                  <button
                    onClick={() => setTournamentStep('bracket')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    View Tournament Bracket
                  </button>
                  <button
                    onClick={() => router.push('/game')}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                  >
                    Back to Game Modes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tournament Controls */}
        <div className="bg-gray-900 border-t border-purple-500 p-2 sm:p-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-1">
              <button
                onClick={() => router.push('/game')}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                Back to Game Modes
              </button>
              <button
                onClick={() => setTournamentStep('bracket')}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                View Bracket
              </button>

              {/* Show Next Match button when current match is finished and there are more matches (not final match) */}
              {currentMatch?.status === 'finished' && nextMatch && !isLastMatch && (
                <button
                  onClick={proceedToNextMatch}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm sm:text-base"
                >
                  Next Match
                </button>
              )}
            </div>

            {/* Next Match Info */}
            {nextMatch && !showTournamentWinnerMessage && (
              <div className="text-center order-1 sm:order-2">
                <p className="text-gray-300 text-xs sm:text-sm">Next Match:</p>
                <div className="flex items-center gap-1 sm:gap-2 text-white text-sm">
                  <span className="truncate max-w-16 sm:max-w-none">{nextMatch.player1?.name || 'TBD'}</span>
                  <span className="text-purple-300">vs</span>
                  <span className="truncate max-w-16 sm:max-w-none">{nextMatch.player2?.name || 'TBD'}</span>
                </div>
              </div>
            )}

            {/* Tournament Complete Info */}
            {isLastMatch && !showTournamentWinnerMessage && (
              <div className="text-center order-1 sm:order-2">
                <p className="text-green-300 font-semibold text-sm sm:text-base">Final Match!</p>
                <p className="text-gray-300 text-xs sm:text-sm">Winner takes the tournament</p>
              </div>
            )}
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 mb-2 sm:mb-4">Tournament Bracket</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {gameState.tournament?.bracket?.every(m => m.status === 'finished')
                ? 'Tournament Complete!'
                : 'Tournament Progress'}
            </p>
          </div>

          <TournamentBracket />

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={() => router.push('/game')}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
            >
              Back to Game Modes
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
                    Return to Game
                  </button>
                );
              }

              // Otherwise, show continue tournament for next match if available
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
                  Continue Tournament
                </button>
              ) : null;
            })()}

            <button
              onClick={() => setTournamentStep('setup')}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base"
            >
              New Tournament
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
            <span className="break-words">Available Tournaments</span>
          </h1>

          {isSearching ? (
            <div className="text-center py-6 xs:py-8">
              <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-purple-400 mx-auto mb-3 xs:mb-4"></div>
              <p className="text-white text-sm xs:text-base">Searching for tournaments...</p>
            </div>
          ) : (
            <>
              {availableTournaments.length === 0 ? (
                <div className="text-center py-6 xs:py-8">
                  <p className="text-gray-300 mb-3 xs:mb-4 text-sm xs:text-base">No open tournaments found</p>
                  <button
                    onClick={searchTournaments}
                    className="px-3 py-2 xs:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm xs:text-base"
                  >
                    Refresh Search
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
                                Hosted by {tournament.host.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 xs:gap-2 text-xs">
                            <span className="bg-purple-600 bg-opacity-30 text-purple-300 px-2 py-1 rounded text-xs">
                              {tournament.playerCount || tournament.maxPlayers} Players
                            </span>
                            <span className="bg-blue-600 bg-opacity-30 text-blue-300 px-2 py-1 rounded text-xs">
                              {tournament.registeredPlayers?.length || tournament.currentPlayers}/{tournament.playerCount || tournament.maxPlayers} Joined
                            </span>
                            <span className="bg-green-600 bg-opacity-30 text-green-300 px-2 py-1 rounded text-xs">
                              {tournament.type ? tournament.type.charAt(0).toUpperCase() + tournament.type.slice(1) : 'Tournament'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-center xs:justify-end">
                          {pendingJoinRequest === tournament.id ? (
                            <div className="text-center bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded-lg px-2 xs:px-3 py-2 w-full xs:w-auto">
                              <div className="flex items-center justify-center gap-1 xs:gap-2 mb-1">
                                <FaClock className="text-yellow-400 text-xs xs:text-sm" />
                                <span className="text-yellow-400 text-xs xs:text-sm font-semibold">Request Pending</span>
                              </div>
                              <p className="text-gray-400 text-xs">Waiting for host approval</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => requestJoinTournament(tournament.id)}
                              disabled={(tournament.registeredPlayers?.length || tournament.currentPlayers) >= (tournament.playerCount || tournament.maxPlayers)}
                              className="w-full xs:w-auto px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs xs:text-sm"
                            >
                              {(tournament.registeredPlayers?.length || tournament.currentPlayers) >= (tournament.playerCount || tournament.maxPlayers) ? 'Full' : 'Request to Join'}
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
              Back to Setup
            </button>
            <button
              onClick={searchTournaments}
              className="w-full xs:w-auto px-3 py-2 xs:px-4 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base"
            >
              Refresh Search
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
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Tournament Feature</h2>
        <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Tournament setup and registration only</p>
        <button
          onClick={() => router.push('/game')}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm sm:text-base"
        >
          Back to Game Modes
        </button>
      </div>
    </div>
  );
}
