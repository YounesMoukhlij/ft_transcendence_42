'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import api from "@/lib/api"
import axios from 'axios';
import { getBackendURL } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from '@/contexts/LanguageContext';
import {getProfileImageUrl} from '@/lib/utils';


interface Friend {
  id_user: number;
  username?: string;
  name?: string;
  profile_img?: string;
  status?: boolean | number;
}

export default function InviteFriendPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const { socket } = useUserStore();
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingInvitation, setSendingInvitation] = useState<number | null>(null); // Track which friend invitation is being sent
  const [declinedFriends, setDeclinedFriends] = useState<Set<number>>(new Set()); // Track declined invitations
  const [sentInvitations, setSentInvitations] = useState<Set<number>>(new Set()); // Track successfully sent invitations
  const declineTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map()); // Track timeouts for declined friends
  const invitationExpirationsRef = useRef<Map<number, number>>(new Map()); // Track invitation expiration timestamps (friendId -> expirationTime)

  // Fetch friends list
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.username || !user?.access_token) {
        setLoading(false);
        return;
      }

      // Validate token format before making request
      const token = user.access_token.trim();
      if (!token || token.length < 10) {
        console.warn('[InviteFriend] Invalid token format, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `${getBackendURL()}/api/GetFriends`,
          {
            params: { username: user.username },
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 5000 // 5 second timeout
          }
        );
        setFriendsList(response.data || []);
        setError(''); // Clear any previous errors on success
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            // Unauthorized - token is invalid or expired
            console.warn('[InviteFriend] 401 Unauthorized - token invalid or expired');

            // Clear user state and redirect to login
            clearUser();
            router.push('/signIn');
            return;
          } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            // Network timeout
            if (process.env.NODE_ENV === 'development') {
              console.warn('[InviteFriend] Request timeout while fetching friends');
            }
            setError(t('game.networkError') || 'Network error. Please try again.');
          } else if (error.response?.status === 500) {
            // Server error
            if (process.env.NODE_ENV === 'development') {
              console.error('[InviteFriend] Server error fetching friends:', error.response.data);
            }
            setError(t('game.serverError') || 'Server error. Please try again later.');
          } else {
            // Other errors
            if (process.env.NODE_ENV === 'development') {
              console.error('[InviteFriend] Error fetching friends:', error.response?.data || error.message);
            }
            setError(t('game.failedToLoadFriends') || 'Failed to load friends list.');
          }
        } else {
          // Non-axios error
          if (process.env.NODE_ENV === 'development') {
            console.error('[InviteFriend] Unexpected error:', error);
          }
          setError(t('game.failedToLoadFriends') || 'Failed to load friends list.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user, t, router, clearUser]);

  // Listen for WebSocket messages (game challenge declines and status updates)
  useEffect(() => {
    if (!socket) {
      console.log('[InviteFriend] No socket available, cannot listen for messages');
      return;
    }

    // Capture the ref value at effect time (for cleanup function)
    const timeoutMap = declineTimeoutRef.current;

    // Log socket state
    console.log('[InviteFriend] Setting up WebSocket listener, socket state:', {
      readyState: socket.readyState,
      readyStateName: socket.readyState === WebSocket.OPEN ? 'OPEN' :
                     socket.readyState === WebSocket.CONNECTING ? 'CONNECTING' :
                     socket.readyState === WebSocket.CLOSING ? 'CLOSING' :
                     socket.readyState === WebSocket.CLOSED ? 'CLOSED' : 'UNKNOWN'
    });

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[InviteFriend] Received WebSocket message:', message.type, message.data);

        // Handle game challenge decline
        if (message.type === 'game_challenge_declined') {
          console.log('[InviteFriend] Processing game challenge decline:', message.data);
          const friendId = message.data?.declinedBy;

          if (friendId) {
            console.log('[InviteFriend] Friend declined challenge, friendId:', friendId);

            // Clear any existing timeout for this friend
            const existingTimeout = declineTimeoutRef.current.get(friendId);
            if (existingTimeout) {
              clearTimeout(existingTimeout);
            }

            setDeclinedFriends(prev => new Set([...prev, friendId]));
            // Remove from sent invitations so user can re-invite
            setSentInvitations(prev => {
              const newSet = new Set(prev);
              newSet.delete(friendId);
              return newSet;
            });
            // Remove expiration tracking
            invitationExpirationsRef.current.delete(friendId);

            const declinedByUsername = message.data?.declinedByUsername || 'Friend';
            toast.error(t('game.friendDeclinedChallenge', { username: declinedByUsername }));

            // Set timeout to automatically reset after 2 seconds
            const timeoutId = setTimeout(() => {
              console.log('[InviteFriend] Resetting declined status for friend:', friendId);
              setDeclinedFriends(prev => {
                const newSet = new Set(prev);
                newSet.delete(friendId);
                return newSet;
              });
              declineTimeoutRef.current.delete(friendId);
            }, 2000); // 2 seconds

            declineTimeoutRef.current.set(friendId, timeoutId);
          } else {
            console.warn('[InviteFriend] game_challenge_declined message missing declinedBy:', message.data);
          }
        }
        // Handle game challenge accepted
        else if (message.type === 'game_challenge_accepted') {
          console.log('[InviteFriend] Friend accepted challenge:', message.data);
          const friendId = message.data?.acceptedBy;
          if (friendId) {
            console.log('[InviteFriend] Clearing invitation state for friend:', friendId);
            // Clear sent invitation state since they accepted and are going to play
            setSentInvitations(prev => {
              const newSet = new Set(prev);
              newSet.delete(friendId);
              return newSet;
            });
            // Remove expiration tracking
            invitationExpirationsRef.current.delete(friendId);
            // Remove from declined list if it was there
            setDeclinedFriends(prev => {
              const newSet = new Set(prev);
              newSet.delete(friendId);
              return newSet;
            });

            // Store challengeId if provided (for navigation/matching)
            if (message.data?.challengeId) {
              console.log('[InviteFriend] Storing challengeId for accepted challenge:', message.data.challengeId);
              localStorage.setItem('pendingChallengeId', message.data.challengeId);
            }
          } else {
            console.warn('[InviteFriend] game_challenge_accepted message missing acceptedBy:', message.data);
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
      // Cleanup any pending timeouts on unmount using captured value
      timeoutMap.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutMap.clear();
    };
  }, [socket, t]);

  // Check for expired invitations and reset buttons
  useEffect(() => {
    const checkExpiredInvitations = () => {
      const now = Date.now();
      const expiredFriends: number[] = [];

      // Check all tracked invitations
      invitationExpirationsRef.current.forEach((expirationTime, friendId) => {
        if (now >= expirationTime) {
          console.log(`[InviteFriend] Invitation to friend ${friendId} has expired`);
          expiredFriends.push(friendId);
          invitationExpirationsRef.current.delete(friendId);
        }
      });

      // Remove expired invitations from sentInvitations to reset buttons
      if (expiredFriends.length > 0) {
        setSentInvitations(prev => {
          const newSet = new Set(prev);
          expiredFriends.forEach(friendId => {
            newSet.delete(friendId);
            console.log(`[InviteFriend] Removing expired invitation for friend ${friendId}`);
          });
          return newSet;
        });
      }
    };

    // Check every 5 seconds for expired invitations
    const intervalId = setInterval(checkExpiredInvitations, 5000);

    // Also check immediately on mount
    checkExpiredInvitations();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Send game invitation to a friend
  const sendInvitation = async (friend: Friend) => {
    if (!user?.access_token) {
      setError(t('game.mustBeLoggedIn'));
      return;
    }

    // Check if friend is online before sending invitation
    if (!friend.status) {
      toast.error(t('game.friendMustBeOnline') || 'Friend must be online to send invitation');
      return;
    }

    if (sendingInvitation === friend.id_user) {
      return; // Already sending
    }

    setSendingInvitation(friend.id_user);
    setError('');

    try {
      const response = await api.post(
        `/api/sendGameChallenge`,
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

        // Add to sent invitations
        setSentInvitations(prev => new Set([...prev, friend.id_user]));

        // Store expiration time: 1 minute 30 seconds = 90 seconds from now
        const expirationTime = Date.now() + (90 * 1000); // 90 seconds in milliseconds
        invitationExpirationsRef.current.set(friend.id_user, expirationTime);
        console.log(`[InviteFriend] Invitation sent to friend ${friend.id_user}, expires at:`, new Date(expirationTime).toISOString());

        // Remove from declined list if it was there
        setDeclinedFriends(prev => {
          const newSet = new Set(prev);
          newSet.delete(friend.id_user);
          return newSet;
        });
      }
    } catch (error: unknown) {
      console.error('Error sending invitation:', error);
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 401) {
          setError(t('game.mustBeLoggedIn'));
        } else {
          setError(axiosError.response?.data?.message || t('game.failedToSendInvitation'));
        }
      } else {
        setError(t('game.failedToSendInvitation'));
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
    <div className="flex flex-col items-center justify-center min-h-full bg-transparent text-white p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center">{t('game.inviteFriendToPlay')}</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        <div className="bg-[#1a1f2e]/40 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('game.yourFriends')}</h2>

          {friendsList.length === 0 ? (
            <div className="text-center py-8 ">
              <p className="text-gray-400 text-lg mb-2">{t('game.noFriendsFound')}</p>
              <p className="text-gray-500 text-sm">{t('game.addFriendsToInvite')}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {friendsList.map((friend) => {
                const isSending = sendingInvitation === friend.id_user;
                const wasDeclined = declinedFriends.has(friend.id_user);
                const wasSent = sentInvitations.has(friend.id_user);
                const isOnline = friend.status === 1 || friend.status === true;
                const canInvite = isOnline && !isSending && !wasSent;

                return (
                  <div
                    key={friend.id_user}
                    className={`flex items-center justify-between p-4 rounded-lg border border-gray-800 transition-all bg-gray-950/40 ${
                      isSending
                        ? 'bg-gray-700 border-gray-600 opacity-60 cursor-not-allowed'
                        : !isOnline
                        ? 'bg-gray-800/50 border-gray-700 opacity-75 cursor-not-allowed'
                        : wasSent
                        ? 'bg-gray-700/50 border-green-500/50 cursor-default'
                        : wasDeclined
                        ? 'bg-gray-700/50 border-red-500/50 hover:bg-gray-700 hover:border-red-500 cursor-pointer'
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-blue-500 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (canInvite && !wasSent) {
                        sendInvitation(friend);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <Image
                          src={getProfileImageUrl(friend.profile_img)}
                          alt={friend.username || friend.name || 'Friend'}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full bg-gray-600 object-cover border-2 border-gray-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://i.pravatar.cc/150?img=4';
                          }}
                          unoptimized
                        />
                        {/* Online status indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                            friend.status ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                          title={friend.status ? t('game.online') : t('game.offline')}
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
                      {!isOnline && (
                        <span className="text-xs text-gray-500">{t('game.offline')}</span>
                      )}
                      <button
                        disabled={!canInvite && !wasSent}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                          isSending
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                            : !isOnline
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                            : wasSent
                            ? 'bg-green-600 hover:bg-green-500 text-white cursor-default'
                            : wasDeclined
                            ? 'bg-orange-600 hover:bg-orange-500 text-white'
                            : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                        title={!isOnline ? t('game.friendMustBeOnline') : wasSent ? t('game.invitationSent') : ''}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canInvite && !wasSent && !wasDeclined) {
                            sendInvitation(friend);
                          }
                        }}
                      >
                        {isSending
                          ? t('game.sending')
                          : wasSent
                          ? t('game.sent')
                          : t('game.invite')}
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
            className="px-6 py-3 bg-[#1a1f2e]/90 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer font-semibold"
          >
            {t('game.back')}
          </button>
          <button
            onClick={() => router.push('/game')}
            className="px-6 py-3 bg-[#1a1f2f]/90 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer font-semibold"
          >
            {t('game.gameMenu')}
          </button>
        </div>
      </div>
    </div>
  );
}
