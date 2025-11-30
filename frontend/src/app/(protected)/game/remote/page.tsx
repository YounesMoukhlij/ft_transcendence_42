'use client';

import React, { useEffect, useState, useRef } from 'react';
import { globalStore } from '@/components/globalStore';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/components/GameContext';
import { getWebSocket } from '@/components/globalSocket';
import PingPongGame from '@/components/PingPongGame';
import GameCustomization from '@/components/GameCustomization';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { getBackendURL } from '@/lib/utils';


export default function RemoteGamePage() {
  type GlobalStoreType = {
    socket: WebSocket | null;
    isConnect: boolean;
    username: string | null;
    token: string | null;
    connect: () => void;
  };

  const router = useRouter();
      const { gameState, setRoomCode, setPlayers, setCustomisation, setGameMode } = useGameContext();

    // Component state
        const [gameStatus, setGameStatus] = useState<'menu' | 'waiting' | 'playing'>('menu');
        const [socket, setSocket] = useState<WebSocket | null>(null);
        const [socketStatus, setSocketStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
        const [error, setError] = useState('');
        const [isSearching, setIsSearching] = useState(false);
        const [showFriendsDropdown, setShowFriendsDropdown] = useState(false);
        const [showCustomization, setShowCustomization] = useState(false);
        const dropdownRef = useRef<HTMLDivElement>(null);
        const [serverGameState, setServerGameState] = useState<any | null>(null);
        const [opponentLeft, setOpponentLeft] = useState(false);
        const [selection, setSelection] = useState<'menu' | 'invite'>('menu');
        const [friendsList, setFriendsList] = useState<any[]>([]);
        const [pendingInvitation, setPendingInvitation] = useState<any>(null);
        const { user } = useUserStore();

        const findMatch = () => {
          if (socketStatus !== 'open') {
            setError('Connecting to the server... Please wait a moment.');
            return;
          }
          setError('');
          setShowCustomization(true);
        };

        // Show customization before inviting friend
        const handleInviteFriendClick = () => {
          if (socketStatus !== 'open') {
            setError('Connecting to the server... Please wait a moment.');
            return;
          }
          setError('');
          setShowCustomization(true);
          // Set a flag to know we're inviting a friend (not searching random)
          setSelection('invite');
        };

        // Handle automatic matchmaking
        const startMatchmaking = () => {
          setShowCustomization(false);
          const username = (globalStore.getState() as GlobalStoreType).username || '';
          const userStore = globalStore.getState() as any;
          if (!socket || !username.trim()) {
            setError('No username found. Please log in.');
            return;
          }
          if (socket.readyState !== WebSocket.OPEN) {
            setError('Socket not connected. Please try again.');
            return;
          }
          setIsSearching(true);

          const { tableBg, ballColor, paddleColor } = gameState.customisation;

          socket.send(JSON.stringify({
            type: 'findMatch',
            payload: {
              username: username.trim(),
              customization: {
                tableBg,
                ballColor,
                paddleColor,
              },
            },
          }));
        };

        // Send direct invitation to a friend
        const sendInvitationToFriend = (friend: any) => {
          const username = (globalStore.getState() as GlobalStoreType).username || user?.username || '';
          if (!socket || !username.trim()) {
            setError('No username found. Please log in.');
            return;
          }
          if (socket.readyState !== WebSocket.OPEN) {
            setError('Connection not ready. Please wait a moment and try again.');
            return;
          }

          // Get customization from gameState, with defaults if not set
          const { tableBg, ballColor, paddleColor } = gameState.customisation || {};

          // Use defaults if customization not set
          const customization = {
            tableBg: tableBg || '#15803d', // Default green table
            ballColor: ballColor || '#ffffff', // Default white ball
            paddleColor: paddleColor || '#f87171' // Default red paddle
          };

          socket.send(JSON.stringify({
            type: 'inviteFriend',
            payload: {
              username: username.trim(),
              friendId: parseInt(friend.id_user || friend.id),
              customization
            }
          }));

          setPendingInvitation({ friend, timestamp: Date.now() });
          setError('');
          console.log(`Invitation sent to ${friend.username || friend.name}`);
        };

        // Set page title and game mode
        useEffect(() => {
          document.title = 'Online Multiplayer Ping Pong';
          setGameMode('remote'); // Ensure remote mode is set
        }, [setGameMode]);

        // Initialize WebSocket connection
        useEffect(() => {
          const ws = getWebSocket();
          setSocket(ws);
          setSocketStatus('connecting');

          ws.onopen = () => {
            setSocketStatus('open');
            setError('');
          };

          ws.onclose = () => {
            setSocketStatus('closed');
          };

          ws.onerror = () => {
            setSocketStatus('closed');
            setError('WebSocket connection failed. Please refresh the page.');
          }

          const handleMessage = (event: MessageEvent) => {
            try {
              const message = JSON.parse(event.data);

              if (message.type === 'matchFound') {
                setIsSearching(false);
                setRoomCode(message.payload.roomCode);
                const players = message.payload.players.map((p: any) => ({ name: p.username, avatar: '', color: '' }));
                setPlayers(players);
                setGameStatus('playing');
                setError('');
                setPendingInvitation(null);
                // Navigate to game room
                router.push(`/game/remote/${message.payload.roomCode}`);
              } else if (message.type === 'searching') {
                setIsSearching(true);
              } else if (message.type === 'gameState') {
                setServerGameState(message.payload);
              } else if (message.type === 'opponentLeft') {
                setOpponentLeft(true);
              } else if (message.type === 'gameInvitationSent') {
                // Invitation sent successfully
                setError('');
              } else if (message.type === 'gameInvitation') {
                // Received game invitation from friend
                const inviter = message.payload.from;
                const roomCode = message.payload.roomCode;
                const inviterCustomization = message.payload.customization || {};

                const accept = window.confirm(`${inviter.username} invited you to play a game. Accept?`);

                if (accept) {
                  // Get customization from gameState, with defaults if not set
                  const { tableBg, ballColor, paddleColor } = gameState.customisation || {};

                  // Use defaults if customization not set
                  const customization = {
                    tableBg: tableBg || '#15803d', // Default green table
                    ballColor: ballColor || '#ffffff', // Default white ball
                    paddleColor: paddleColor || '#f87171' // Default red paddle
                  };

                  socket.send(JSON.stringify({
                    type: 'acceptInvitation',
                    payload: {
                      roomCode,
                      customization
                    }
                  }));

                  // Show waiting message
                  setIsSearching(true);
                  setError('');
                } else {
                  socket.send(JSON.stringify({
                    type: 'declineInvitation',
                    payload: { roomCode }
                  }));
                }
              } else if (message.type === 'gameInvitationAccepted') {
                // Friend accepted our invitation
                setPendingInvitation(null);
                setIsSearching(true);
                setError('');
                console.log('Friend accepted invitation, waiting for match...');
              } else if (message.type === 'gameInvitationDeclined') {
                setPendingInvitation(null);
                setIsSearching(false);
                alert('Your friend declined the game invitation.');
                setError('');
              } else if (message.type === 'gameInvitationSent') {
                // Confirmation that invitation was sent
                setError('');
                console.log('Invitation sent successfully');
              } else if (message.type === 'error') {
                setError(message.message || 'An error occurred');
                setIsSearching(false);
                setPendingInvitation(null);
              }

            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          };

          ws.addEventListener('message', handleMessage);

          return () => {
            ws.removeEventListener('message', handleMessage);
            ws.onopen = null;
            ws.onclose = null;
            ws.onerror = null;
          };
        }, [setGameMode, setPlayers, setRoomCode, router, gameState.customisation]);

        // Fetch friends list
        useEffect(() => {
          const fetchFriends = async () => {
            if (!user?.username || !user?.access_token) return;

            try {
              const response = await axios.get(
                `${getBackendURL()}/GetFriends`,
                {
                  params: { username: user.username },
                  headers: {
                    Authorization: `Bearer ${user.access_token}`
                  }
                }
              );
              setFriendsList(response.data || []);
            } catch (error) {
              console.error('Error fetching friends:', error);
            }
          };

          fetchFriends();
        }, [user]);

        const leaveRoom = () => {
          if (socket && socket.readyState === WebSocket.OPEN && gameState.roomCode) {
            socket.send(JSON.stringify({
              type: 'leaveRoom',
              payload: { roomCode: gameState.roomCode }
            }));
          }
          setGameStatus('menu');
          setRoomCode('');
          setPlayers([]);
          setError('');
          setServerGameState(null);
          setOpponentLeft(false);
        };

        const updateGameSetting = (settingKey: string, value: string) => {
          // This is now handled server side based on what the player sends on findMatch
          // We can keep this for local display if needed
          const newCustomisation = {
            ...gameState.customisation,
            [settingKey]: value || null
          };
          setCustomisation(newCustomisation);
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

      if (showCustomization) {
        return (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="w-full max-w-md">
              <GameCustomization
                onBack={() => {
                  setShowCustomization(false);
                  setSelection('menu');
                }}
                onStartGame={(customization) => {
                  setCustomisation(customization);
                  setShowCustomization(false);
                  // If we're in invite mode, show friend list; otherwise start matchmaking
                  if (selection === 'invite') {
                    // Friend list will be shown, customization is already set
                  } else {
                    startMatchmaking();
                  }
                }}
                isSocketConnected={socketStatus === 'open'}
              />
            </div>
          </div>
        );
      }

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
            <PingPongGame serverGameState={serverGameState} opponentLeft={opponentLeft} />
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

      if (gameStatus === 'menu') {
        if (selection === 'menu') {
          return (
            <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
              <div className="text-center max-w-lg mx-auto p-8">
                <h1 className="text-4xl font-bold text-white mb-6">Online Multiplayer</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="space-y-4">
                  <button
                    onClick={handleInviteFriendClick}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Invite a Friend
                  </button>
                  <button
                    onClick={findMatch}
                    className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    Search Random Opponent
                  </button>
                </div>
                <button
                  onClick={() => router.push('/game')}
                  className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Game Modes
                </button>
              </div>
            </div>
          );
        }

        if (selection === 'invite') {
          return (
            <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
              <div className="text-center max-w-lg mx-auto p-8">
                <h1 className="text-4xl font-bold text-white mb-6">Invite a Friend</h1>
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                  <div className="py-2 max-h-64 overflow-y-auto">
                    {friendsList.length === 0 ? (
                      <p className="text-gray-400 text-center py-4 text-sm">No friends found</p>
                    ) : (
                      friendsList.map((friend) => {
                        const isPending = pendingInvitation?.friend?.id_user === friend.id_user ||
                                        pendingInvitation?.friend?.id === friend.id_user;
                        return (
                          <div
                            key={friend.id_user || friend.id}
                            className={`flex items-center justify-between px-3 py-2 hover:bg-gray-600 transition-colors ${
                              isPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            onClick={() => {
                              if (!isPending) {
                                sendInvitationToFriend(friend);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={friend.profile_img || '/user.png'}
                                  alt={friend.username || friend.name}
                                  className="w-8 h-8 rounded-full bg-gray-600 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/user.png';
                                  }}
                                />
                                <div
                                  className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-gray-700 ${
                                    friend.status ? 'bg-green-500' : 'bg-gray-500'
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {friend.username || friend.name}
                                </p>
                                <p className={`text-xs ${friend.status ? 'text-green-400' : 'text-gray-400'}`}>
                                  {friend.status ? 'Online' : 'Offline'}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs ${isPending ? 'text-yellow-400' : 'text-blue-400'}`}>
                              {isPending ? 'Invited...' : 'Invite'}
                            </span>
                          </div>
                        );
                      })
                    )}
                    {friendsList.length === 0 && (
                      <p className="text-gray-400 text-center py-4 text-sm">No friends found</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelection('menu')}
                  className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          );
        }
      }

      return null;
    }
