'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { getBackendURL } from '@/lib/utils';
import { useGameContext } from '@/components/GameContext';
import { toast } from 'sonner';
import { useTranslation } from '@/contexts/LanguageContext';

export default function InviteFriendPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useUserStore();
  const { gameState, setCustomisation } = useGameContext();
  const { socket } = useUserStore();
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingInvitation, setSendingInvitation] = useState<number | null>(null); // Track which friend invitation is being sent
  const [declinedFriends, setDeclinedFriends] = useState<Set<number>>(new Set()); // Track declined invitations

  // Fetch friends list
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.username || !user?.access_token) {
        setLoading(false);
        return;
      }

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
        setError(t('game.failedToSendInvitation'));
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user, t]);

  // Listen for WebSocket messages (game challenge declines and status updates)
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);

        // Handle game challenge decline
        if (message.type === 'game_challenge_declined') {
          const friendId = message.data?.declinedBy;
          if (friendId) {
            setDeclinedFriends(prev => new Set([...prev, friendId]));
            toast.error(t('game.friendDeclinedChallenge', { username: message.data.declinedByUsername }));
          }
        }
        // Handle friend status updates (online/offline)
        else if (message.type === 'status') {
          const { friend: friendId, status } = message.data;
          if (friendId) {
            // Update friend status in real-time
            setFriendsList(prev =>
              prev.map(friend =>
                friend.id_user === friendId
                  ? { ...friend, status: status ? 1 : 0 }
                  : friend
              )
            );
            console.log(`[InviteFriend] Friend ${friendId} status updated: ${status ? 'online' : 'offline'}`);
          }
        }
      } catch (error) {
        console.error('[InviteFriend] Error parsing WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  // Send game invitation to a friend
  const sendInvitation = async (friend: any) => {
    if (!user?.access_token) {
      setError(t('game.mustBeLoggedIn'));
      return;
    }

    if (sendingInvitation === friend.id_user) {
      return; // Already sending
    }

    setSendingInvitation(friend.id_user);
    setError('');

    try {
      const response = await axios.post(
        `${getBackendURL()}/sendGameChallenge`,
        { Friend_id: friend.id_user },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      );

      if (response.data) {
        // Success - invitation sent
        // The notification will appear in the Navbar notification area
        toast.success(t('game.gameInvitationSent', { username: friend.username || friend.name }));
        // Remove from declined list if it was there
        setDeclinedFriends(prev => {
          const newSet = new Set(prev);
          newSet.delete(friend.id_user);
          return newSet;
        });
      }
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      if (error.response?.status === 401) {
        setError(t('game.mustBeLoggedIn'));
      } else {
        setError(error.response?.data?.message || t('game.failedToSendInvitation'));
      }
    } finally {
      setSendingInvitation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-400">{t('game.loadingFriends')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center">{t('game.inviteFriendToPlay')}</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('game.yourFriends')}</h2>

          {friendsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg mb-2">{t('game.noFriendsFound')}</p>
              <p className="text-gray-500 text-sm">{t('game.addFriendsToInvite')}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {friendsList.map((friend) => {
                const isSending = sendingInvitation === friend.id_user;
                const wasDeclined = declinedFriends.has(friend.id_user);
                return (
                  <div
                    key={friend.id_user || friend.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      isSending
                        ? 'bg-gray-700 border-gray-600 opacity-60 cursor-not-allowed'
                        : wasDeclined
                        ? 'bg-gray-700/50 border-red-500/50 hover:bg-gray-700 hover:border-red-500 cursor-pointer'
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-blue-500 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isSending) {
                        sendInvitation(friend);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <img
                          src={friend.profile_img || '/user.png'}
                          alt={friend.username || friend.name}
                          className="w-12 h-12 rounded-full bg-gray-600 object-cover border-2 border-gray-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/user.png';
                          }}
                        />
                        {/* Online status indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                            friend.status ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                          title={friend.status ? 'Online' : 'Offline'}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-white text-lg font-medium">
                          {friend.username || friend.name}
                        </p>
                        <p className={`text-sm ${friend.status ? 'text-green-400' : 'text-gray-400'}`}>
                          {friend.status ? t('game.online') : t('game.offline')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {wasDeclined && (
                        <span className="text-xs text-red-400">{t('game.declined')}</span>
                      )}
                      <button
                        disabled={isSending}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          isSending
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : wasDeclined
                            ? 'bg-orange-600 hover:bg-orange-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {isSending ? t('game.sending') : wasDeclined ? t('game.reInvite') : t('game.invite')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-6">
          <p className="text-blue-200 text-sm">
            <strong>{t('game.note')}:</strong> {t('game.inviteNotificationNote')}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            {t('game.back')}
          </button>
          <button
            onClick={() => router.push('/game')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-semibold"
          >
            {t('game.gameMenu')}
          </button>
        </div>
      </div>
    </div>
  );
}
