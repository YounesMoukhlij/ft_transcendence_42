'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext, Player, TournamentMatch } from '@/components/GameContext';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { getWebSocket } from '@/components/globalSocket';
import { useUserStore } from '@/store/userStore';
import { FaUser, FaUpload, FaCrown, FaTrophy, FaGamepad, FaSearch, FaCheck, FaTimes as FaReject, FaClock } from 'react-icons/fa';
import axios from 'axios';

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
  const [tournamentStep, setTournamentStep] = useState<'setup' | 'registration' | 'customization' | 'playing' | 'bracket' | 'finished' | 'search' | 'browse'>('setup');
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
        const response = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/getUserStats`, {
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
          const response = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKEND_IP}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/GetFriends?username=${user.username}`);
          setFriends(response.data);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      }
    };
    fetchFriends();
  }, [user]);

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
  }, []); // Empty dependency array since we only want this to run once

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

  // Separate useEffect for WebSocket management
  useEffect(() => {
    if (tournamentType === 'remote') {
      const ws = getWebSocket();
      setSocket(ws);

      const handleMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'tournamentCreated':
            setRemoteTournament(message.data.tournament);
            setIsHost(true);
            setTournamentId(message.data.tournamentId);
            setTournamentStep('registration');
            break;

          case 'tournamentJoined':
            setRemoteTournament(message.data.tournament);
            setIsHost(false);
            setTournamentId(message.data.tournamentId);
            setTournamentStep('registration');
            break;

          case 'tournamentUpdated':
            setRemoteTournament(message.data);
            if (message.data.status === 'playing') {
              setTournamentStep('bracket');
            }
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
        }
      };

      ws.addEventListener('message', handleMessage);

      // Send username for authentication
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('tournament_user'); // You might want to use actual username
      }

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [tournamentType]);

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
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'game',
      action: 'createTournament',
      payload: {
        type: tournamentType,
        playerCount,
        playerName: user?.username || 'Host Player', // You might want to get this from user context
        avatar: user?.avatar || defaultAvatars[0],
        color: '#3B82F6',
        isPrivate,
      }
    }));
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
    if (!socket) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'inviteToTournament',
      payload: {
        friendId,
      }
    }));
  };

  const findRandomOpponent = () => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: 'game',
      action: 'findRandomOpponent',
      payload: {
        playerName: user?.username || 'Player',
        avatar: user?.avatar || defaultAvatars[1],
        color: '#10B981'
      }
    }));
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

  // Setup phase
  if (tournamentStep === 'setup') {
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
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    createRemoteTournament(true); // create a private tournament by default
                    setTournamentStep('registration');
                  }}
                  className="w-full xs:w-auto px-4 py-2 xs:px-6 xs:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs xs:text-sm sm:text-base order-1 xs:order-2"
                >
                  Continue
                </button>
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

  // Registration phase
  if (tournamentStep === 'registration') {
    if (tournamentType === 'remote') {
      // Remote tournament registration waiting screen
      return (
        <div className="flex flex-col items-center justify-center h-full p-1 xs:p-2 sm:p-4 md:p-8">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border-2 border-purple-500 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-300 mb-3 xs:mb-4 sm:mb-6 text-center">
              Tournament Lobby
            </h2>



            <div className="text-center mb-3 xs:mb-4 sm:mb-6">
              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl text-white mb-2 xs:mb-3 sm:mb-4">
                Waiting for players... ({remoteTournament?.registeredPlayers?.length || 0}/{playerCount})
              </h3>

              {remoteTournament?.registeredPlayers && (
                <div className="grid gap-2 xs:gap-3 grid-cols-1 xs:grid-cols-2">
                  {remoteTournament.registeredPlayers.map((player: Player, index: number) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-2 xs:p-3 border border-purple-400">
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
                        <button
                          onClick={() => {
                            setSelectedSlot((remoteTournament?.registeredPlayers?.length || 0) + index);
                            setShowAddPlayerModal(true);
                          }}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm"
                        >
                          Add Player
                        </button>
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
                        setShowFriendsListModal(true);
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
              <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 sm:p-6 md:p-8 text-center max-w-xs sm:max-w-sm md:max-w-md mx-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Invite a friend to Slot {selectedSlot !== null ? selectedSlot + 1 : ''}</h3>
                  <div className="flex flex-col gap-2">
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                          <span>{friend.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            inviteToTournament(friend.id);
                            setShowFriendsListModal(false);
                          }}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm"
                        >
                          Invite
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowFriendsListModal(false)}
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

  // Customization phase
  if (tournamentStep === 'customization') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-2 sm:p-4 md:p-8">
        <GameCustomization
          onBack={() => setTournamentStep('registration')}
          onStartGame={(customization) => {
            setCustomisation(customization);
            startTournament(registeredPlayers);
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
