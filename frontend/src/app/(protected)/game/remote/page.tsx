
  'use client';

import React, { useEffect, useState, useRef } from 'react';
import { globalStore } from '@/components/globalStore';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { getWebSocket } from '@/components/globalSocket';
import PingPongGame from '@/components/PingPongGame';


export default function RemoteGamePage() {
  type GlobalStoreType = {
    socket: WebSocket | null;
    isConnect: boolean;
    username: string | null;
    token: string | null;
    connect: () => void;
  };

  const router = useRouter();
  const { gameState, setGameRoom, setPlayers, setCustomisation, setIsHost, setGameMode } = useGameContext();

  // Component state
  const [gameStatus, setGameStatus] = useState<'menu' | 'waiting' | 'playing'>('menu');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFriendsDropdown, setShowFriendsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock friends list - replace with actual data from your API
  const friendsList = [
    { id: '1', name: 'Alice Johnson', avatar: '/api/placeholder/32/32', isOnline: true },
    { id: '2', name: 'Bob Smith', avatar: '/api/placeholder/32/32', isOnline: false },
    { id: '3', name: 'Carol Williams', avatar: '/api/placeholder/32/32', isOnline: true },
    { id: '4', name: 'David Brown', avatar: '/api/placeholder/32/32', isOnline: true },
    { id: '5', name: 'Emma Wilson', avatar: '/api/placeholder/32/32', isOnline: false },
  ];

  // Handle automatic matchmaking
  const findMatch = () => {
    const username = (globalStore.getState() as GlobalStoreType).username || '';
    if (!socket || !username.trim()) {
      setError('No username found. Please log in.');
      return;
    }
    if (socket.readyState !== WebSocket.OPEN) {
      setError('Connection not ready. Please wait a moment and try again.');
      return;
    }
    setIsSearching(true);
    socket.send(JSON.stringify({
      type: 'game',
      action: 'findMatch',
      payload: {
        playerName: username.trim(),
        avatar: '',
        color: '#3B82F6'
      }
    }));
  };

  // Send direct invitation to a friend (without room codes)
  const sendInvitationToFriend = (friend: any) => {
    const username = (globalStore.getState() as GlobalStoreType).username || '';
    if (!socket || !username.trim()) {
      setError('No username found. Please log in.');
      return;
    }
    if (socket.readyState !== WebSocket.OPEN) {
      setError('Connection not ready. Please wait a moment and try again.');
      return;
    }

    socket.send(JSON.stringify({
      type: 'game',
      action: 'inviteFriend',
      payload: {
        playerName: username.trim(),
        friendId: friend.id,
        friendName: friend.name
      }
    }));

    console.log(`Invitation sent to ${friend.name}`);
  };

  // Set page title and game mode
  useEffect(() => {
    document.title = 'Online Multiplayer Ping Pong';
    setGameMode('remote'); // Ensure remote mode is set
  }, []); // Empty dependency array - only run once on mount

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = getWebSocket();
    setSocket(ws);

    // Register user using username from globalStore
  const username = (globalStore.getState() as GlobalStoreType).username || '';

    const sendUsername = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(username);
      }
    };

    const handleGameMessage = (message: any) => {
      // Handle matchmaking result
      if (message.type === 'matchFound') {
        setIsSearching(false);
        setGameRoom({
          id: message.data.roomId,
          status: 'waiting',
          playerId: message.data.playerId
        });
        setPlayers(message.data.players);
        setGameStatus('waiting');
        setError('');
        setIsHost(message.data.isHost);
        return;
      }
      if (message.type === 'matchNotFound') {
        setIsSearching(false);
        setError('No match found. Please try again.');
        return;
      }
      switch (message.type) {
        case 'roomCreated':
          setGameRoom({
            id: message.data.roomId,
            status: 'waiting',
            playerId: message.data.gameState.players[0].id
          });
          setPlayers(message.data.gameState.players);
          setGameStatus('waiting');
          setError('');
          // Set host flag
          setIsHost(true);

          // Check if there's a friend to auto-invite
          const friendToInviteStr = sessionStorage.getItem('friendToInvite');
          if (friendToInviteStr) {
            try {
              const friendToInvite = JSON.parse(friendToInviteStr);
              sessionStorage.removeItem('friendToInvite');

              // Send invitation automatically
              setTimeout(() => {
                const roomCode = message.data.roomId;
                const inviteLink = `${window.location.origin}/game/remote?room=${roomCode}`;
                const inviteMessage = `Hey ${friendToInvite.name}! Come play Ping Pong with me! Join my game room: ${roomCode}\n\nClick here to join: ${inviteLink}`;

                if (navigator.share) {
                  navigator.share({
                    title: `Ping Pong Game Invitation`,
                    text: `Join my Ping Pong game! Room: ${roomCode}`,
                    url: inviteLink,
                  }).catch(() => {
                    navigator.clipboard.writeText(inviteMessage).then(() => {
                      alert(`Room created! Invitation copied to clipboard for ${friendToInvite.name}.`);
                    });
                  });
                } else {
                  navigator.clipboard.writeText(inviteMessage).then(() => {
                    alert(`Room created! Invitation copied to clipboard for ${friendToInvite.name}.`);
                  });
                }
              }, 500); // Small delay to ensure UI is updated
            } catch (e) {
              console.error('Error parsing friend to invite:', e);
            }
          }
          break;

        case 'roomJoined':
          setGameRoom({
            id: message.data.roomId,
            status: 'waiting',
            playerId: message.data.gameState.players.find((p: any) => p.id !== gameState.gameRoom?.playerId)?.id
          });
          setPlayers(message.data.gameState.players);
          setGameStatus('waiting');
          setError('');
          // Set guest flag
          setIsHost(false);
          break;

        case 'playerJoined':
          setPlayers(message.data.players);
          if (message.data.players.length === 2) {
            setGameStatus('playing');
          }
          break;

        case 'roomJoinFailed':
          setError(message.data.message);
          break;

        case 'gameUpdate':
          // Game state updates will be handled by PingPongGame component
          break;

        case 'gameSettingsUpdated':
          setCustomisation(message.data.settings);
          break;

        default:
          console.log('Unhandled game message:', message);
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendUsername();
    } else {
      ws.addEventListener('open', sendUsername);
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        handleGameMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
      ws.removeEventListener('open', sendUsername);
    };
  }, []); // Keep empty dependency array since we want this to run only once

  const leaveRoom = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'game',
        action: 'leaveRoom',
        payload: {}
      }));
    }
    setGameStatus('menu');
    setGameRoom(undefined);
    setPlayers([]);
    setError('');
  };

  const updateGameSetting = (settingKey: string, value: string) => {
    if (!gameState.isHost || !socket) return;

    const newCustomisation = {
      ...gameState.customisation,
      [settingKey]: value || null
    };

    // Update local state immediately
    setCustomisation(newCustomisation);

    // Send to server
    socket.send(JSON.stringify({
      type: 'game',
      action: 'updateGameSettings',
      payload: {
        settings: {
          [settingKey]: value || null
        }
      }
    }));
  };

  // Handle redirect if mode is not remote
  useEffect(() => {
    if (gameState.mode && gameState.mode !== 'remote') {
      router.push('/game');
    }
  }, [gameState.mode, router]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFriendsDropdown(false);
      }
    };

    if (showFriendsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFriendsDropdown]);

  // Don't render anything if mode is not set yet or not remote
  if (!gameState.mode) {
    return (
      <div className="flex items-center justify-center h-[100%] w-[100%]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (gameState.mode !== 'remote') {
    return null; // Will redirect via useEffect
  }

  if (gameStatus === 'playing') {
    return (
      <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Online Game</h2>
          <p className="text-gray-300">Room: {gameState.gameRoom?.id}</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={leaveRoom}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Leave Game
            </button>
            <button
              onClick={() => router.push('/game')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Back to Game Modes
            </button>
          </div>
        </div>
        <PingPongGame />
      </div>
    );
  }

  if (gameStatus === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-white mb-6">Waiting for Player</h1>

          {/* Game Customization - Only for Host */}
          {gameState.isHost && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Customize Game</h3>

              <div className="space-y-4">
                <button
                  onClick={findMatch}
                  className={`w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold ${isSearching ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching for Opponent...' : 'Find Match (Auto)'}
                </button>
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Table Background
                  </label>
                  <select
                    value={gameState.customisation.tableBg || ''}
                    onChange={(e) => updateGameSetting('tableBg', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Default</option>
                    <option value="space">Space</option>
                    <option value="neon">Neon</option>
                    <option value="retro">Retro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Ball Color
                  </label>
                  <select
                    value={gameState.customisation.ballColor || ''}
                    onChange={(e) => updateGameSetting('ballColor', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Default</option>
                    <option value="#FF0000">Red</option>
                    <option value="#00FF00">Green</option>
                    <option value="#0000FF">Blue</option>
                    <option value="#FFFF00">Yellow</option>
                    <option value="#FF00FF">Purple</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Paddle Color
                  </label>
                  <select
                    value={gameState.customisation.paddleColor || ''}
                    onChange={(e) => updateGameSetting('paddleColor', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Default</option>
                    <option value="#FF0000">Red</option>
                    <option value="#00FF00">Green</option>
                    <option value="#0000FF">Blue</option>
                    <option value="#FFFF00">Yellow</option>
                    <option value="#FF00FF">Purple</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Players ({gameState.players.length}/2)</h3>
            {gameState.players.map((player, index) => (
              <div key={player.id} className="text-gray-300 py-1">
                {index + 1}. {player.name}
              </div>
            ))}
          </div>

          <button
            onClick={leaveRoom}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
      <div className="text-center max-w-lg mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-6">Online Multiplayer</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            <button
              onClick={findMatch}
              className={`w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold ${isSearching ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={isSearching}
            >
              {isSearching ? 'Searching for Opponent...' : 'Find Match (Auto)'}
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-600" />
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            {/* Invite Friends Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowFriendsDropdown(!showFriendsDropdown)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                disabled={isSearching}
              >
                <span>👥</span>
                Invite Friends
                <span className={`ml-2 transform transition-transform ${showFriendsDropdown ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Friends Dropdown */}
              {showFriendsDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  <div className="p-3 border-b border-gray-600">
                    <p className="text-gray-300 text-sm">Select a friend to invite:</p>
                  </div>
                  <div className="py-2">
                    {friendsList.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => {
                          sendInvitationToFriend(friend);
                          setShowFriendsDropdown(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-8 h-8 rounded-full bg-gray-600"
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-gray-700 ${
                                friend.isOnline ? 'bg-green-500' : 'bg-gray-500'
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{friend.name}</p>
                            <p className={`text-xs ${friend.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                              {friend.isOnline ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                        <span className="text-blue-400 text-xs">Invite</span>
                      </div>
                    ))}
                    {friendsList.length === 0 && (
                      <p className="text-gray-400 text-center py-4 text-sm">No friends found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/game')}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Game Modes
        </button>
      </div>
    </div>
  );
}
