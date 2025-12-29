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
import { useTranslation } from '@/contexts/LanguageContext';
import { ServerGameState } from '@/types/game';
import Image from 'next/image';

interface Friend {
  id_user?: number;
  id?: number;
  username?: string;
  name?: string;
  profile_img?: string;
  status?: boolean | number;
}


export default function RemoteGamePage() {
  const { t } = useTranslation();
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
        const [serverGameState, setServerGameState] = useState<ServerGameState | null>(null);
        const [opponentLeft, setOpponentLeft] = useState(false);
        const [selection, setSelection] = useState<'menu' | 'invite'>('menu');
        const [friendsList, setFriendsList] = useState<Friend[]>([]);
        const [pendingInvitation, setPendingInvitation] = useState<{ friend: Friend; timestamp: number } | null>(null);
        const { user } = useUserStore();

        const findMatch = () => {
          if (socketStatus !== 'open') {
            setError(t('game.connectingToServer'));
            return;
          }
          setError('');
          setShowCustomization(true);
        };

        // Show customization before inviting friend
        const handleInviteFriendClick = () => {
          if (socketStatus !== 'open') {
            setError(t('game.connectingToServer'));
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
          if (!socket || !username.trim()) {
            setError(t('game.noUsernameFound'));
            return;
          }
          if (socket.readyState !== WebSocket.OPEN) {
            setError(t('game.socketNotConnected'));
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
        const sendInvitationToFriend = (friend: Friend) => {
          const username = (globalStore.getState() as GlobalStoreType).username || user?.username || '';
          if (!socket || !username.trim()) {
            setError(t('game.noUsernameFound'));
            return;
          }
          if (socket.readyState !== WebSocket.OPEN) {
            setError(t('game.connectionNotReady'));
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

          const friendId = friend.id_user ?? friend.id;
          if (typeof friendId !== 'number') {
            setError(t('game.somethingWentWrong'));
            return;
          }

          socket.send(JSON.stringify({
            type: 'inviteFriend',
            payload: {
              username: username.trim(),
              friendId,
              customization
            }
          }));

          setPendingInvitation({ friend, timestamp: Date.now() });
          setError('');
          console.log(`Invitation sent to ${friend.username || friend.name}`);
        };

        // Set page title and game mode
        useEffect(() => {
          document.title = t('game.onlineMultiplayerPingPong');
          setGameMode('remote'); // Ensure remote mode is set
        }, [setGameMode, t]);

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
            setError(t('game.websocketConnectionFailed'));
          }

          const handleMessage = (event: MessageEvent) => {
            try {
              const message = JSON.parse(event.data);

              if (message.type === 'matchFound') {
                setIsSearching(false);
                setRoomCode(message.payload.roomCode);
                const players = message.payload.players.map((p: { username: string }) => ({ name: p.username, avatar: '', color: '' }));
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

                const accept = window.confirm(t('game.invitedToPlayGame', { username: inviter.username }));

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
                alert(t('game.friendDeclinedInvitation'));
                setError('');
              } else if (message.type === 'gameInvitationSent') {
                // Confirmation that invitation was sent
                setError('');
                console.log('Invitation sent successfully');
              } else if (message.type === 'error') {
                setError(message.message || t('game.anErrorOccurred'));
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
        }, [setGameMode, setPlayers, setRoomCode, router, gameState.customisation, socket, t]);

        // Fetch friends list
        useEffect(() => {
          const fetchFriends = async () => {
            if (!user?.username || !user?.access_token) return;

            try {
              const response = await axios.get(
                `${getBackendURL()}/api/GetFriends`,
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
            <div className="text-white">{t('common.loading')}</div>
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
              <h2 className="text-2xl font-bold text-white mb-2">{t('game.onlineGame')}</h2>
              <p className="text-gray-300">{t('game.room')}: {gameState.gameRoom?.id}</p>
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={leaveRoom}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  {t('game.leaveGame')}
                </button>
                <button
                  onClick={() => router.push('/game')}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  {t('game.backToGameModes')}
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
              <h1 className="text-4xl font-bold text-white mb-6">{t('game.waitingForPlayer')}</h1>

              {/* Game Customization - Only for Host */}
              {gameState.isHost && (
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">{t('game.customizeGame')}</h3>

                  <div className="space-y-4">
                    <button
                      onClick={findMatch}
                      className={`w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold ${isSearching ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={isSearching}
                    >
                      {isSearching ? t('game.searchingForOpponentDots') : t('game.findMatchAuto')}
                    </button>
                    <div>
                      <label className="block text-white text-sm font-bold mb-2">
                        {t('game.tableBackground')}
                      </label>
                      <select
                        value={gameState.customisation.tableBg || ''}
                        onChange={(e) => updateGameSetting('tableBg', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t('game.default')}</option>
                        <option value="space">Space</option>
                        <option value="neon">Neon</option>
                        <option value="retro">Retro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-bold mb-2">
                        {t('game.ballColor')}
                      </label>
                      <select
                        value={gameState.customisation.ballColor || ''}
                        onChange={(e) => updateGameSetting('ballColor', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t('game.default')}</option>
                        <option value="#FF0000">Red</option>
                        <option value="#00FF00">Green</option>
                        <option value="#0000FF">Blue</option>
                        <option value="#FFFF00">Yellow</option>
                        <option value="#FF00FF">Purple</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-bold mb-2">
                        {t('game.paddleColor')}
                      </label>
                      <select
                        value={gameState.customisation.paddleColor || ''}
                        onChange={(e) => updateGameSetting('paddleColor', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t('game.default')}</option>
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
                <h3 className="text-lg font-semibold text-white mb-2">{t('game.players')} ({gameState.players.length}/2)</h3>
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
                {t('game.cancelGame')}
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
                <h1 className="text-4xl font-bold text-white mb-6">{t('game.onlineMultiplayerPingPong')}</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="space-y-4">
                  <button
                    onClick={handleInviteFriendClick}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    {t('game.inviteAFriend')}
                  </button>
                  <button
                    onClick={findMatch}
                    className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    {t('game.searchRandomOpponentButton')}
                  </button>
                </div>
                <button
                  onClick={() => router.push('/game')}
                  className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {t('game.backToGameModes')}
                </button>
              </div>
            </div>
          );
        }

        if (selection === 'invite') {
          return (
            <div className="flex flex-col items-center justify-center h-[100%] w-[100%] bg-transparent">
              <div className="text-center max-w-lg mx-auto p-8">
                <h1 className="text-4xl font-bold text-white mb-6">{t('game.inviteAFriend')}</h1>
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                  <div className="py-2 max-h-64 overflow-y-auto">
                    {friendsList.length === 0 ? (
                      <p className="text-gray-400 text-center py-4 text-sm">{t('game.noFriendsFound')}</p>
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
                                <Image
                                  src={friend.profile_img || '/user.png'}
                                  alt={friend.username || friend.name || 'Friend'}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full bg-gray-600 object-cover"
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
                                  {friend.status ? t('game.online') : t('game.offline')}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs ${isPending ? 'text-yellow-400' : 'text-blue-400'}`}>
                              {isPending ? t('game.sending') : t('game.invite')}
                            </span>
                          </div>
                        );
                      })
                    )}
                    {friendsList.length === 0 && (
                      <p className="text-gray-400 text-center py-4 text-sm">{t('game.noFriendsFound')}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelection('menu')}
                  className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {t('game.back')}
                </button>
              </div>
            </div>
          );
        }
      }

      return null;
    }
