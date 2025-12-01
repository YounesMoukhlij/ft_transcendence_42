'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoPersonCircleOutline, IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5';
import { GiPingPongBat } from 'react-icons/gi';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import  {useUserStore}  from '../store/userStore';
import { useGameContext } from './GameContext';
import { getBackendURL } from '../lib/utils';
import { getWebSocket } from './globalSocket';

import '../app/(protected)/chat/page.css'
import { removeRequestMeta } from 'next/dist/server/request-meta';
import { useTranslation } from '../contexts/LanguageContext';

export default function Navbar()
{
  const { t } = useTranslation();
  const router = useRouter();
  const { setGameMode } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(false);
  const [notificatiion, setNotification] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef<HTMLSpanElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const deletedNotificationIdsRef = useRef<Set<number>>(new Set()); // Track locally deleted notification IDs
  const {connect  , init } = useUserStore();

  const setUsername = useUserStore.setState;
  const socket = useUserStore((state) => state.socket);
  const {addFriend, removeFriend ,friends , addPendingRequests, addPendingRequestsArray, removePendingRequests, removeSentRequests, sentRequests, pendingRequests, addSentRequests} = useUserStore();



  const user = useUserStore((state) => state.user);



function isTimeValid(item: any) {


  const targetTimeString = item.expired;
  const [datePart, timePart] = targetTimeString.split(' ');
  const [yy, mm, dd] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  const fullYear = 2000 + yy;

  const targetTime = new Date(fullYear, mm - 1, dd, hours, minutes, seconds);
  const now = new Date();

  const diffSeconds = (now.getTime() - targetTime.getTime()) / 1000;


  if (diffSeconds <= 15) {

  setTimeout(() => {
    const newExpired = ((d => (
      d.setFullYear(d.getFullYear() - 1),
      `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getFullYear()).slice(-2)} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`
      ))(
        new Date(item.expired.replace(/(\d+)-(\d+)-(\d+)/, "20$3-$2-$1"))
      ));

     setNotification(prev =>
        prev.map(it => it.id === item.id ? { ...it, expired: newExpired } : it)
      );
     return false;
    }, diffSeconds * 10000);
  }
  return diffSeconds <= 15;
}


useEffect(() => {
  setUsername({username: user?.username});
}, []);


const menuRef = useRef(null);
const buttonRef = useRef(null);



useEffect(() => {
  const handleClickOutside = (event : any) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
      setNotificationIndex(false);
    }
    // Close user dropdown when clicking outside
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target) && profileIconRef.current && !profileIconRef.current.contains(event.target)) {
      setUserDropdownOpen(false);
    }
    // Close search when clicking outside
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);

  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);






  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  async function DelteFriendRequest(notify_id){
    toast.error('Deleted');
    const notificationItem = notificatiion.find(item => item.notify_id == notify_id);
    const sender_id = notificationItem?.sender_user;
    console.log("sender id: ", sender_id);
    setNotification(prev => prev.filter(n => n.notify_id !== notify_id));
    const res =  await axios.delete(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/DeleteFriendRequest` , {
      params:{
        id: notify_id,
      },
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
    if (res.status == 200)
    {
      removePendingRequests(sender_id);
    }
  }

  async function AcceptFriendRequest(item : any){

    toast.success('Accepted');

    const object = {
      profile_img: item.sender_profile_img,
      username: item.sender_username,
      fullname:"say hello",
      id_user: item.sender_user,
      status:0,
    }
    const res = await axios.post(`${getBackendURL()}/AddFriend`,{
      Freind_id: item.sender_user ,
    },{
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    }
  );
  if (res.status === 200)
  {
    removePendingRequests(item.sender_user);
    addFriend(object);
    // Remove notification from local state immediately
    setNotification(prev => prev.filter(n => n.notify_id !== item.notify_id));
  }
  };





  function showNotification(){
    const wasOpen = notificationIndex;
    setNotificationIndex(!notificationIndex);

    // Mark all notifications as seen in local state immediately when opening
    if (!wasOpen) { // Only when opening (not closing)
      setNotification(prev => prev.map(n => ({ ...n, is_seen: true })));
      SetunseenCount(0);

      // Also update on backend
      if (user?.access_token) {
        axios.post(`${getBackendURL()}/NotificationSeen`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`
            }
          }
        ).catch(err => {
          console.error('Failed to mark notifications as seen:', err);
        });
      }
    }
  }



  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserIconClick = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    const clearUser = useUserStore.getState().clearUser;
    clearUser();
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user-storage');
    router.push('/signIn');
  };

  // Function to determine friend request button state
  const getFriendButtonState = (resultUser: any) => {
    // Don't show button for self
    if (resultUser.id_user === user?.id_user) {
      return null;
    }

    // Check if already a friend
    const isFriend = friends?.some((f: any) => f.id_user === resultUser.id_user);
    if (isFriend) {
      return { state: 'friend', text: t('navbar.alreadyFriend'), disabled: true };
    }

    // Check if request already sent
    const requestSent = sentRequests?.some((r: any) => r.getter_user === resultUser.id_user);
    if (requestSent) {
      return { state: 'sent', text: t('navbar.friendRequestSent'), disabled: true };
    }

    // Check if there's a pending request from them
    const hasPendingRequest = pendingRequests?.some((r: any) => r.sender_user === resultUser.id_user);
    if (hasPendingRequest) {
      return { state: 'pending', text: t('navbar.pendingRequest'), disabled: true };
    }

    // Can send friend request
    return { state: 'add', text: t('navbar.addFriend'), disabled: false };
  };

  // Function to send friend request
  const handleSendFriendRequest = async (resultUser: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.access_token) {
      toast.error(t('navbar.friendRequestFailed'));
      return;
    }

    try {
      const res = await axios.post(
        `${getBackendURL()}/sendRequestFriend`,
        { friend_id: resultUser.id_user },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      );

      if (res.status === 200) {
        // Add to sent requests
        addSentRequests({
          getter_user: resultUser.id_user,
          notify_id: res.data,
        });
        toast.success(t('navbar.friendRequestSentSuccess', { username: resultUser.username }));
      }
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data?.message || t('navbar.friendRequestFailed'));
    }
  };

  // Function to sync notifications from server
  const syncNotifications = React.useCallback(async () => {
    if (!user?.access_token) return;

    try {
      const result = await axios.get(
        `${getBackendURL()}/GetNotification`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
          timeout: 5000, // 5 second timeout
        }
      );

      // Merge intelligently - update existing, add new, remove deleted
      setNotification(prev => {
        const fetched = result.data.reverse();
        const fetchedIds = new Set(fetched.map(n => n.notify_id));
        const existingIds = new Set(prev.map(n => n.notify_id));
        const deletedIds = deletedNotificationIdsRef.current;

        // Create a map of fetched notifications for quick lookup
        const fetchedMap = new Map(fetched.map(n => [n.notify_id, n]));

        // Update existing notifications with latest data (including is_seen status)
        const updated = prev.map(existing => {
          const fetchedItem = fetchedMap.get(existing.notify_id);
          if (fetchedItem && typeof existing === 'object' && typeof fetchedItem === 'object') {
            // Merge to preserve any local changes while updating from server
            return { ...existing, ...fetchedItem };
          }
          return existing;
        }).filter(n => fetchedIds.has(n.notify_id) && !deletedIds.has(n.notify_id)); // Remove notifications that no longer exist on server or are locally deleted

        // Add new notifications from server (but ignore locally deleted ones)
        const newNotifications = fetched.filter(n => !existingIds.has(n.notify_id) && !deletedIds.has(n.notify_id));

        // Combine: new ones first, then updated existing ones
        return [...newNotifications, ...updated];
      });

      addPendingRequestsArray(result.data.filter(object => object.title == "request friend"));
    } catch (error: any) {
      // Handle network errors and auth errors gracefully
      if (axios.isAxiosError(error)) {
        // Network error (backend unreachable, CORS, etc.)
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          // Silently fail for network errors - backend might be down or unreachable
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to sync notifications: Network error (backend may be unreachable)');
          }
          return;
        }

        // 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
          console.warn('Failed to sync notifications: Unauthorized (token expired or invalid). Stopping further sync attempts.');
          return;
        }
      }

      // Log other errors only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to sync notifications:', error);
      }
    }
  }, [user?.access_token, addPendingRequestsArray]);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    syncNotifications();

    // Set up periodic syncing every 5 seconds to catch any missed updates
    const syncInterval = setInterval(() => {
      syncNotifications();
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [user, syncNotifications]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    if (!user?.access_token) return;

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await axios.get(`${getBackendURL()}/searchUsers`, {
          params: { query: searchQuery.trim() },
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        });
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, user?.access_token]);


  useEffect( () => {
    connect();
  }, [])

  const [unseenCount , SetunseenCount] = useState(0);

  useEffect(()=>{
    SetunseenCount (notificatiion.filter(n => !n.is_seen).length);
  },[notificatiion])

  // Set up WebSocket message listener - this should run whenever socket changes
  useEffect(() => {
    if (!socket) return;

    const handleNotify = (event: MessageEvent) => {
      try {
        const { type, data } = JSON.parse(event.data);
        console.log('[Navbar] WebSocket message received:', type, data);

        if (type === "notify") {
          console.log("Notification data: ", data);

          // Check if notification is in the deleted set - don't re-add deleted notifications
          if (deletedNotificationIdsRef.current.has(data.notify_id)) {
            console.log('[Navbar] Notification was deleted locally, skipping:', data.notify_id);
            return;
          }

          // Check if notification already exists to avoid duplicates
          setNotification(prev => {
            const exists = prev.some(n => n.notify_id === data.notify_id);
            if (exists) {
              console.log('[Navbar] Notification already exists, skipping:', data.notify_id);
              return prev;
            }

            // Add new notification to the beginning of the array
            const newNotification = {
              sender_user: data.sender_user,
              title: data.title,
              sender_username: data.sender_username,
              sender_profile_img: data.sender_profile_img,
              notify_id: data.notify_id,
              expired: data.expired,
              is_seen: false, // New notifications are unseen by default
              tournamentId: data.tournamentId // Include tournamentId for tournament invites
            };

            console.log('[Navbar] Adding new notification:', newNotification);

            // Defer state updates to avoid "Cannot update during render" error
            setTimeout(() => {
              if (data.title == "request friend") {
                addPendingRequests({
                  sender_user: data.sender_user,
                  sender_username: data.sender_username,
                  notify_id: data.notify_id,
                });
              }
              else if (data.title == "friend request accepted") {
                removeSentRequests(data.sender_user);
                addFriend({
                  id_user: data.sender_user,
                });
              }
              else if (data.title == "game challenge") {
                // Show toast for game challenge
                toast.info(t('navbar.invitedToGame', { username: data.sender_username }));
              }
              else if (data.title == "tournament invite") {
                // Show toast for tournament invite
                toast.info(t('navbar.invitedToTournament', { username: data.sender_username }));
              }
            }, 0);

            return [newNotification, ...prev];
          });
        }
        else if (type === "game_invite") {
          // Handle game_invite type (sent before notify)
          console.log('[Navbar] Game invite received:', data);
          // The actual notification will come via "notify" type, so we just log it here
        }
        else if (type == "unfriend") {
          // Defer state update to avoid render issues
          setTimeout(() => {
            removeFriend(data.id_user);
          }, 0);
        }
        else if (type == "rejected") {
          // Defer state updates to avoid render issues
          setTimeout(() => {
            removeSentRequests(data.getter_user);
          }, 0);
          // Remove the rejected friend request notification
          setNotification(prev => prev.filter(n =>
            !(n.title === "request friend" && n.sender_user === data.getter_user)
          ));
        }
        else if (type == "canceled request") {
          // Defer state updates to avoid render issues
          setTimeout(() => {
            removePendingRequests(data.sender_user);
          }, 0);
          // Remove the canceled friend request notification
          setNotification(prev => prev.filter(n =>
            !(n.title === "request friend" && n.sender_user === data.sender_user)
          ));
        }
        else if (type === "game_challenge_accepted") {
          // Inviter receives this when friend accepts
          console.log('[Navbar] Received game_challenge_accepted:', data);
          toast.success(t('navbar.gameChallengeAccepted', { username: data.acceptedByUsername }));

          // Store challengeId for later use
          if (data.challengeId) {
            console.log('[Navbar] Storing challengeId from game_challenge_accepted:', data.challengeId);
            localStorage.setItem('pendingChallengeId', data.challengeId);
          } else {
            console.warn('[Navbar] game_challenge_accepted message missing challengeId:', data);
          }

          // Note: The acceptor (User B) already removed their notification when they clicked Accept
          // This message is sent to the inviter (User A), so we don't need to remove any notifications here
          // The inviter wasn't viewing a notification - they sent the invitation

          // Navigate to customization page
          setGameMode('remote');
          router.push('/game/customize');
        }
        else if (type === "game_challenge_declined") {
          // Inviter receives this when friend declines
          toast.error(t('navbar.gameChallengeDeclined', { username: data.declinedByUsername }));
          // Clear any pending challenge
          localStorage.removeItem('pendingChallengeId');
          // Track and remove the game challenge notification since it was declined
          setNotification(prev => {
            const filtered = prev.filter(n => {
              if (n.title === "game challenge" && n.sender_user === data.declinedBy) {
                deletedNotificationIdsRef.current.add(n.notify_id);
                return false; // Remove this notification
              }
              return true;
            });
            return filtered;
          });
        }
        else if (type === "start_game") {
          // Acceptor receives this - navigate to customization
          // Store challengeId for later use
          console.log('[Navbar] Received start_game message:', data);
          if (data.challengeId) {
            console.log('[Navbar] Storing challengeId from start_game:', data.challengeId);
            localStorage.setItem('pendingChallengeId', data.challengeId);
          } else {
            console.warn('[Navbar] start_game message missing challengeId:', data);
          }
          setGameMode('remote');
          router.push('/game/customize');
        }
        else if (type === "notification_deleted") {
          // Remove notification from state when it's deleted by the other user
          const notifyId = data.notify_id;
          console.log('[Navbar] Notification deleted by other user:', notifyId);
          setNotification(prev => prev.filter(n => n.notify_id !== notifyId));
        }
        else if (type === "notification_updated") {
          // Handle notification updates (e.g., is_seen status changed)
          console.log('[Navbar] Notification updated:', data);
          setNotification(prev => prev.map(n =>
            n.notify_id === data.notify_id ? { ...n, ...data } : n
          ));
        }
        else if (type === "notifications_synced") {
          // Backend sent a sync signal - refresh notifications
          console.log('[Navbar] Notifications sync signal received');
          syncNotifications();
        }
      } catch (error) {
        console.error('[Navbar] Error parsing WebSocket message:', error);
      }
    };

    // Set up listener based on socket state
    let openHandler: (() => void) | null = null;
    let syncTimeout: NodeJS.Timeout | null = null;

    const setupListener = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.addEventListener("message", handleNotify);

        // Request fresh notifications after socket is ready to ensure we have the latest
        // This handles cases where notifications were sent before the listener was set up
        if (user?.access_token) {
          syncTimeout = setTimeout(() => {
            syncNotifications();
          }, 1500); // Wait 1.5 seconds after socket is ready to request notifications (gives backend time to send)
        }
      }
    };

    // If socket is already open, set up listener immediately
    if (socket.readyState === WebSocket.OPEN) {
      setupListener();
    } else if (socket.readyState === WebSocket.CONNECTING) {
      // Wait for socket to open
      openHandler = () => {
        setupListener();
        if (openHandler) {
          socket.removeEventListener('open', openHandler);
        }
      };
      socket.addEventListener('open', openHandler);
    }

    return () => {
      socket.removeEventListener("message", handleNotify);
      if (openHandler) {
        socket.removeEventListener('open', openHandler);
      }
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
    };
  }, [socket, router, setGameMode, user?.access_token, addPendingRequestsArray, addPendingRequests, removeSentRequests, addFriend, removeFriend, removePendingRequests, t, syncNotifications]);




  async function AcceptGameChallenge(item){
    console.log('[AcceptGameChallenge] Starting accept process for challenge:', {
      notify_id: item.notify_id,
      sender_user: item.sender_user,
      sender_username: item.sender_username
    });

    if (!user?.access_token) {
      toast.error('You must be logged in to accept game challenges');
      return;
    }

    // Track this notification as deleted to prevent syncNotifications from re-adding it
    deletedNotificationIdsRef.current.add(item.notify_id);

    // Remove notification from local state immediately (optimistic update)
    setNotification(prev => prev.filter(n => n.notify_id !== item.notify_id));

    // Close notification dropdown for better UX
    setNotificationIndex(false);

    try {
      // Call backend API to accept the challenge
      console.log('[AcceptGameChallenge] Calling /startGame API with Friend_id:', item.sender_user);
      const res = await axios.post(
        `${getBackendURL()}/startGame`,
        { Friend_id: item.sender_user },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      );

      console.log('[AcceptGameChallenge] API response:', {
        status: res.status,
        data: res.data
      });

      if (res.status === 200) {
        // Store challengeId for matching with the inviter
        // This is critical for the game to start properly
        if (res.data?.challengeId) {
          console.log('[AcceptGameChallenge] Storing challengeId:', res.data.challengeId);
          localStorage.setItem('pendingChallengeId', res.data.challengeId);
        } else {
          console.warn('[AcceptGameChallenge] No challengeId in response:', res.data);
        }

        // Delete the notification from backend
        try {
          await axios.delete(
            `${getBackendURL()}/DeleteNotification`,
            {
              params: { notifyId: item.notify_id },
              headers: {
                Authorization: `Bearer ${user.access_token}`
              }
            }
          );
        } catch (deleteError) {
          console.error('Error deleting notification:', deleteError);
          // Continue even if deletion fails - already removed from UI
        }

        // Set game mode and navigate to customization
        // The WebSocket message will also trigger navigation, but this ensures it happens
        setGameMode('remote');
        router.push('/game/customize');
      }
    } catch (error: any) {
      console.error('Error accepting game challenge:', error);
      toast.error(error.response?.data?.message || 'Failed to accept game challenge');
      // Re-add notification if error occurred (though navigation might prevent this)
      setNotification(prev => {
        if (!prev.find(n => n.notify_id === item.notify_id)) {
          return [...prev, item];
        }
        return prev;
      });
    }
  }

  async function RejectGameChallenge(item){
    if (!user?.access_token) {
      toast.error('You must be logged in to decline game challenges');
      return;
    }

    // Track this notification as deleted to prevent syncNotifications from re-adding it
    deletedNotificationIdsRef.current.add(item.notify_id);

    // Remove notification from local state immediately (optimistic update)
    setNotification(prev => prev.filter(n => n.notify_id !== item.notify_id));

    // Close notification dropdown for better UX
    setNotificationIndex(false);

    // Notify the inviter via WebSocket immediately
    console.log('[RejectGameChallenge] Sending decline notification to inviter:', {
      declinedBy: user.id_user,
      declinedByUsername: user.username,
      friendId: item.sender_user,
      socketReady: socket?.readyState === WebSocket.OPEN
    });

    if (socket && socket.readyState === WebSocket.OPEN) {
      const declineMessage = {
        type: 'game_challenge_declined',
        data: {
          declinedBy: user.id_user,
          declinedByUsername: user.username,
          friendId: item.sender_user
        }
      };
      socket.send(JSON.stringify(declineMessage));
      console.log('[RejectGameChallenge] Decline message sent:', declineMessage);
    } else {
      console.warn('[RejectGameChallenge] Cannot send decline message - socket not ready:', {
        hasSocket: !!socket,
        readyState: socket?.readyState
      });
    }

    try {
      // Delete the notification from backend
      await axios.delete(
        `${getBackendURL()}/DeleteNotification`,
        {
          params: { notifyId: item.notify_id },
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      );

      toast.info('Game challenge declined');
    } catch (error: any) {
      console.error('Error declining game challenge:', error);
      // Continue even if deletion fails - notification already removed from UI and sender notified
      // Re-add notification if error occurred
      setNotification(prev => {
        if (!prev.find(n => n.notify_id === item.notify_id)) {
          return [...prev, item];
        }
        return prev;
      });
    }
  }

  async function AcceptTournamentInvite(item: any){
    if (!user?.access_token) {
      toast.error('You must be logged in to accept tournament invitations');
      return;
    }

    try {
      // Get tournamentId from notification data (stored when invitation was sent)
      const tournamentId = item.tournamentId;

      if (!tournamentId) {
        toast.error('Tournament ID not found in invitation');
        return;
      }

      // Get game WebSocket (different from user socket)
      const gameSocket = getWebSocket();

      // Wait for socket to be ready
      if (gameSocket.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve) => {
          gameSocket.addEventListener('open', resolve, { once: true });
        });
      }

      if (gameSocket.readyState === WebSocket.OPEN) {
        // Send user ID for authentication
        if (user?.id_user) {
          gameSocket.send(String(user.id_user));
        }

        // Small delay to ensure authentication is processed
        await new Promise(resolve => setTimeout(resolve, 100));

        // Send accept message via game WebSocket
        gameSocket.send(JSON.stringify({
          type: 'game',
          action: 'acceptTournamentInvite',
          payload: {
            tournamentId: tournamentId,
            avatar: user.avatar,
            color: '#10B981'
          }
        }));
      } else {
        toast.error('Connection not available. Please refresh the page.');
        return;
      }

      // Delete the notification
      await axios.delete(
        `${getBackendURL()}/DeleteNotification`,
        {
          params: { notifyId: item.notify_id },
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      );

      // Remove from local state immediately
      setNotification(prev => prev.filter(n => n.notify_id !== item.notify_id));

      // Wait for the tournamentJoined message before navigating
      // This ensures the tournament page receives the correct state
      toast.success(t('navbar.tournamentInviteAccepted'));

      // Set up a listener for tournamentJoined message
      const handleTournamentJoined = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'tournamentJoined') {
            // Remove the listener
            gameSocket.removeEventListener('message', handleTournamentJoined);
            // Navigate to tournament page - it will receive the tournamentJoined message
            setGameMode('tournament');
            // Store tournament info in sessionStorage so the page can detect it on load
            // Mark that this is an invited player (not host) so they see waiting screen
            if (message.data.tournamentId && message.data.tournament) {
              sessionStorage.setItem('pendingTournamentId', message.data.tournamentId);
              sessionStorage.setItem('pendingTournament', JSON.stringify(message.data.tournament));
              sessionStorage.setItem('isInvitedPlayer', 'true'); // Mark as invited player
              sessionStorage.setItem('tournamentStep', 'registration'); // Force waiting screen
            }
            // Redirect to tournament page - it will show waiting screen (registration phase) for invited players
            router.push('/game/tournament');
          }
        } catch (err) {
          // Ignore parse errors
        }
      };

      // Add listener for tournamentJoined message
      gameSocket.addEventListener('message', handleTournamentJoined);

      // Fallback: if we don't receive tournamentJoined within 2 seconds, navigate anyway
      // The tournament page will request the state via WebSocket
      setTimeout(() => {
        gameSocket.removeEventListener('message', handleTournamentJoined);
        setGameMode('tournament');
        // Mark as invited player for fallback redirect too
        sessionStorage.setItem('isInvitedPlayer', 'true');
        sessionStorage.setItem('tournamentStep', 'registration'); // Force waiting screen
        router.push('/game/tournament');
      }, 2000);
    } catch (error: any) {
      console.error('Error accepting tournament invite:', error);
      toast.error(error.response?.data?.message || 'Failed to accept tournament invitation');
    }
  }

  async function RejectTournamentInvite(item: any){
    if (!user?.access_token) {
      toast.error('You must be logged in to decline tournament invitations');
      return;
    }

    try {
      // Get tournamentId from notification data
      const tournamentId = item.tournamentId;

      if (!tournamentId) {
        toast.error('Tournament ID not found in invitation');
        return;
      }

      // Get game WebSocket (different from user socket)
      const gameSocket = getWebSocket();

      // Wait for socket to be ready
      if (gameSocket.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve) => {
          gameSocket.addEventListener('open', resolve, { once: true });
        });
      }

      if (gameSocket.readyState === WebSocket.OPEN) {
        // Send user ID for authentication
        if (user?.id_user) {
          gameSocket.send(String(user.id_user));
        }

        // Small delay to ensure authentication is processed
        await new Promise(resolve => setTimeout(resolve, 100));

        // Send decline message via game WebSocket
        gameSocket.send(JSON.stringify({
          type: 'game',
          action: 'declineTournamentInvite',
          payload: {
            tournamentId: tournamentId
          }
        }));
      } else {
        toast.error('Connection not available. Please refresh the page.');
        return;
      }

      // Delete the notification
      await axios.delete(
        `${getBackendURL()}/DeleteNotification`,
        {
          params: { notifyId: item.notify_id },
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      );

      // Remove from local state immediately
      setNotification(prev => prev.filter(n => n.notify_id !== item.notify_id));

      toast.info('Tournament invitation declined');
    } catch (error: any) {
      console.error('Error declining tournament invite:', error);
      toast.error('Failed to decline tournament invitation');
    }
  }

  // Close mobile menu when clicking outside the list
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        hamburgerRef.current &&
        !(hamburgerRef.current as HTMLElement).contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const sidebarItems = [
    { path: '/game', icon: <IoGameControllerOutline className="text-white text-2xl" />, alt: 'Game', key: 'game' },
    { path: '/chat', icon: <IoChatbubbleOutline className="text-white text-2xl" />, alt: 'Chat', key: 'chat' },
    { path: '/profile', icon: <IoPersonOutline className="text-white text-2xl" />, alt: 'Profile', key: 'profile' },
    { path: '/settings', icon: <IoSettingsOutline className="text-white text-2xl" />, alt: 'Settings', key: 'settings' },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <nav className="m-2 md:m-[10px] p-2 md:p-3 z-50 h-[4vh] bg-transparent">
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-center gap-1 md:gap-2">
            {/* <GiPingPongBat
              className="text-white w-15 h-15  cursor-pointer animate-spin"
              style={{
                animation: 'spin 6s linear infinite'
              }}
            /> */}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex flex-row items-center justify-center gap-2 md:gap-5">
            {/* Search Icon and Dropdown */}
            <div className="relative" ref={searchRef}>
              <div
                className="relative border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400"
                onClick={handleSearchClick}
              >
                <IoSearchOutline className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-125 transition-all duration-400" />
              </div>

              {/* Search Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-black border-2 border-white rounded-2xl shadow-2xl z-50">
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder={t('navbar.searchUsers')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />

                    {isSearching && (
                      <div className="mt-4 text-center text-gray-400">
                        <p>{t('navbar.searching')}</p>
                      </div>
                    )}

                    {!isSearching && searchQuery.trim().length >= 2 && (
                      <div className="mt-4 max-h-96 overflow-y-auto">
                        {searchResults.length === 0 ? (
                          <div className="text-center text-gray-400 py-6">
                            <p>{t('navbar.noUsersFound')}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {searchResults.map((result) => {
                              const buttonState = getFriendButtonState(result);
                              return (
                                <div
                                  key={result.id_user}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                                >
                                  <Link
                                    href={`/profile/${result.username}`}
                                    onClick={() => {
                                      setSearchOpen(false);
                                      setSearchQuery('');
                                      setSearchResults([]);
                                    }}
                                    className="flex items-center gap-3 flex-1 cursor-pointer"
                                  >
                                    <img
                                      src={result.profile_img || '/profileface.png'}
                                      alt={result.username}
                                      className="w-10 h-10 rounded-full border border-gray-600"
                                    />
                                    <div className="flex-1">
                                      <p className="text-white font-semibold">{result.username}</p>
                                      {result.fullname && (
                                        <p className="text-gray-400 text-sm">{result.fullname}</p>
                                      )}
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${result.status === 1 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                  </Link>
                                  {buttonState && (
                                    <button
                                      onClick={(e) => handleSendFriendRequest(result, e)}
                                      disabled={buttonState.disabled}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                        buttonState.disabled
                                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                          : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                                      }`}
                                    >
                                      {buttonState.text}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {searchQuery.trim().length < 2 && (
                      <div className="mt-4 text-center text-gray-400 py-6">
                        <p>{t('navbar.typeToSearch')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Icon and Dropdown */}
            <div className="relative" ref={buttonRef}>
              <div
                className="relative border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400"
                onClick={showNotification}
              >
                <IoNotificationsOutline className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-125 transition-all duration-400" />
                {unseenCount > 0 && (
                  <div className='absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                    <p>{unseenCount}</p>
                  </div>
                )}
              </div>

              {/* Desktop Notification Dropdown - Only visible on md+ screens */}
              {notificationIndex && (
                <div ref={menuRef} className="hidden md:block z-50 absolute right-0 top-full mt-2 w-96 max-h-[70vh] rounded-2xl bg-black text-white border-2 overflow-y-auto gap-2 p-2 shadow-2xl">
                  {notificatiion.length === 0 ? (
                    <div className="text-center text-gray-400 py-6 text-lg font-medium">
                      {t('common.noNotifications')}
                    </div>
                  ) : (
                    [...notificatiion].map((item, index) => {
                      if (item.title === "game challenge") {
                        return (
                          <div
                            key={item.notify_id || index}
                            className="flex items-center gap-3 p-3 border border-gray-700 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 transition"
                          >
                            <img
                              src={item.sender_profile_img}
                              alt="profile"
                              className="w-12 h-12 rounded-full border border-gray-600"
                            />
                            <div className="flex flex-col flex-1">
                              <p className="text-lg font-semibold text-white">
                                {item.sender_username}
                              </p>
                              <p className="text-sm text-gray-400">
                                {t('navbar.invitedTo1v1')}{" "}
                                <span className="text-blue-400 font-medium">1 vs 1 {t('common.game')}</span>
                              </p>
                            </div>
                            {isTimeValid(item) ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => AcceptGameChallenge(item)}
                                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                >
                                  {t('common.accept')}
                                </button>
                                <button
                                  onClick={() => RejectGameChallenge(item)}
                                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                >
                                  {t('common.decline')}
                                </button>
                              </div>
                            ) : (
                              <div className='flex justify-center'><p>{t('navbar.expired')}</p></div>
                            )}
                          </div>
                        );
                      }

                      if (item.title === "friend request accepted") {
                        return (
                          <div
                            key={item.notify_id || index}
                            className="flex items-center gap-3 p-3 border border-green-700 bg-green-900/20 rounded-xl hover:bg-green-800/30 transition"
                          >
                            <img
                              src={item.sender_profile_img}
                              alt="profile"
                              className="w-12 h-12 rounded-full border border-green-500"
                            />
                            <div className="flex flex-col">
                              <p className="text-white text-lg font-medium">
                                {item.sender_username}
                              </p>
                              <p className="text-green-400 text-sm">
                                {t('navbar.acceptedFriendRequest')}
                              </p>
                            </div>
                          </div>
                        );
                      }

                      if (item.title === "tournament invite") {
                        return (
                          <div
                            key={item.notify_id || index}
                            className="flex items-center gap-3 p-3 border border-purple-700 rounded-xl bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 transition"
                          >
                            <img
                              src={item.sender_profile_img}
                              alt="profile"
                              className="w-12 h-12 rounded-full border border-purple-600"
                            />
                            <div className="flex flex-col flex-1">
                              <p className="text-lg font-semibold text-white">
                                {item.sender_username}
                              </p>
                              <p className="text-sm text-gray-400">
                                {t('navbar.invitedToTournamentText')}{" "}
                                <span className="text-purple-400 font-medium">{t('common.game')}</span>
                              </p>
                            </div>
                            {isTimeValid(item) ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => AcceptTournamentInvite(item)}
                                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                >
                                  {t('common.accept')}
                                </button>
                                <button
                                  onClick={() => RejectTournamentInvite(item)}
                                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                >
                                  {t('common.decline')}
                                </button>
                              </div>
                            ) : (
                              <div className='flex justify-center'><p>{t('navbar.expired')}</p></div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item.notify_id || index}
                          className="flex flex-col border-t border-gray-700 py-3 px-2 bg-black/40 hover:bg-black/60 rounded-xl transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img
                                src={item.sender_profile_img}
                                alt="profile"
                                className="w-12 h-12 rounded-full border border-gray-600"
                              />
                              <p className="text-white text-lg ml-3">
                                {item.sender_username}
                              </p>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {item.timeAgo || "1d"}
                            </p>
                          </div>

                          <div className="flex justify-between mt-3">
                            <button
                              onClick={() => AcceptFriendRequest(item)}
                              className="w-[48%] bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg border border-green-400"
                            >
                              {t('common.confirm')}
                            </button>
                            <button
                              onClick={() => DelteFriendRequest(item.notify_id)}
                              className="w-[48%] bg-gray-100 hover:bg-gray-200 text-black py-1.5 rounded-lg border border-white"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
            {/* User Icon and Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <div
                className="relative border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400"
                onClick={handleUserIconClick}
              >
                <span ref={profileIconRef}>
                  <IoPersonCircleOutline
                    className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-125 transition-all duration-400"
                    style={{ cursor: 'pointer' }}
                  />
                </span>
              </div>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-black border-2 border-white rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="py-2">
                    {/* User Info */}
                    {user && (
                      <div className="px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profile_img || '/profileface.png'}
                            alt={user.username}
                            className="w-10 h-10 rounded-full border border-gray-600"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{user.username}</p>
                            <p className="text-gray-400 text-sm truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href={`/profile/${user?.username}`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition cursor-pointer"
                      >
                        <IoPersonOutline className="text-xl" />
                        <span>{t('common.profile')}</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition cursor-pointer"
                      >
                        <IoSettingsOutline className="text-xl" />
                        <span>{t('common.settings')}</span>
                      </Link>

                      <div
                        onClick={() => {
                          handleLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 transition cursor-pointer border-t border-gray-700 mt-2"
                      >
                        <IoLogOutOutline className="text-xl" />
                        <span>{t('common.logout')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search and Notifications - Show when opened from mobile menu */}
          {searchOpen && (
            <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
              <div className="relative w-full max-w-md bg-black border-2 border-white rounded-2xl shadow-2xl z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">{t('common.search')}</h3>
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="text-white hover:text-gray-400"
                    >
                      <IoCloseOutline className="text-2xl" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={t('navbar.searchUsers')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />

                  {isSearching && (
                    <div className="mt-4 text-center text-gray-400">
                      <p>{t('navbar.searching')}</p>
                    </div>
                  )}

                  {!isSearching && searchQuery.trim().length >= 2 && (
                    <div className="mt-4 max-h-96 overflow-y-auto">
                      {searchResults.length === 0 ? (
                        <div className="text-center text-gray-400 py-6">
                          <p>{t('navbar.noUsersFound')}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {searchResults.map((result) => {
                            const buttonState = getFriendButtonState(result);
                            return (
                              <div
                                key={result.id_user}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                              >
                                <Link
                                  href={`/profile/${result.username}`}
                                  onClick={() => {
                                    setSearchOpen(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                  }}
                                  className="flex items-center gap-3 flex-1 cursor-pointer"
                                >
                                  <img
                                    src={result.profile_img || '/profileface.png'}
                                    alt={result.username}
                                    className="w-10 h-10 rounded-full border border-gray-600"
                                  />
                                  <div className="flex-1">
                                    <p className="text-white font-semibold">{result.username}</p>
                                    {result.fullname && (
                                      <p className="text-gray-400 text-sm">{result.fullname}</p>
                                    )}
                                  </div>
                                  <div className={`w-3 h-3 rounded-full ${result.status === 1 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                </Link>
                                {buttonState && (
                                  <button
                                    onClick={(e) => handleSendFriendRequest(result, e)}
                                    disabled={buttonState.disabled}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                      buttonState.disabled
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                                    }`}
                                  >
                                    {buttonState.text}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {searchQuery.trim().length < 2 && (
                    <div className="mt-4 text-center text-gray-400 py-6">
                      <p>{t('navbar.typeToSearch')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {notificationIndex && (
            <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
              <div ref={menuRef} className="relative w-full max-w-md bg-black border-2 border-white rounded-2xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">{t('common.notifications')}</h3>
                    <button
                      onClick={() => {
                        setNotificationIndex(false);
                      }}
                      className="text-white hover:text-gray-400"
                    >
                      <IoCloseOutline className="text-2xl" />
                    </button>
                  </div>
                  {notificatiion.length === 0 ? (
                    <div className="text-center text-gray-400 py-6 text-lg font-medium">
                      {t('common.noNotifications')}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...notificatiion].map((item, index) => {
                        if (item.title === "game challenge") {
                          return (
                            <div
                              key={item.notify_id || index}
                              className="flex items-center gap-3 p-3 border border-gray-700 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 transition"
                            >
                              <img
                                src={item.sender_profile_img}
                                alt="profile"
                                className="w-12 h-12 rounded-full border border-gray-600"
                              />
                              <div className="flex flex-col flex-1">
                                <p className="text-lg font-semibold text-white">
                                  {item.sender_username}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {t('navbar.invitedTo1v1')}{" "}
                                  <span className="text-blue-400 font-medium">1 vs 1 {t('common.game')}</span>
                                </p>
                              </div>
                              {isTimeValid(item) ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => AcceptGameChallenge(item)}
                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                  >
                                    {t('common.accept')}
                                  </button>
                                  <button
                                    onClick={() => RejectGameChallenge(item)}
                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                  >
                                    {t('common.decline')}
                                  </button>
                                </div>
                              ) : (
                                <div className='flex justify-center'><p>{t('navbar.expired')}</p></div>
                              )}
                            </div>
                          );
                        }

                        if (item.title === "friend request accepted") {
                          return (
                            <div
                              key={item.notify_id || index}
                              className="flex items-center gap-3 p-3 border border-green-700 bg-green-900/20 rounded-xl hover:bg-green-800/30 transition"
                            >
                              <img
                                src={item.sender_profile_img}
                                alt="profile"
                                className="w-12 h-12 rounded-full border border-green-500"
                              />
                              <div className="flex flex-col">
                                <p className="text-white text-lg font-medium">
                                  {item.sender_username}
                                </p>
                                <p className="text-green-400 text-sm">
                                  {t('navbar.acceptedFriendRequest')}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        if (item.title === "tournament invite") {
                          return (
                            <div
                              key={item.notify_id || index}
                              className="flex items-center gap-3 p-3 border border-purple-700 rounded-xl bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 transition"
                            >
                              <img
                                src={item.sender_profile_img}
                                alt="profile"
                                className="w-12 h-12 rounded-full border border-purple-600"
                              />
                              <div className="flex flex-col flex-1">
                                <p className="text-lg font-semibold text-white">
                                  {item.sender_username}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {t('navbar.invitedToTournamentText')}{" "}
                                  <span className="text-purple-400 font-medium">{t('common.game')}</span>
                                </p>
                              </div>
                              {isTimeValid(item) ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => AcceptTournamentInvite(item)}
                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                  >
                                    {t('common.accept')}
                                  </button>
                                  <button
                                    onClick={() => RejectTournamentInvite(item)}
                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                                  >
                                    {t('common.decline')}
                                  </button>
                                </div>
                              ) : (
                                <div className='flex justify-center'><p>{t('navbar.expired')}</p></div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={item.notify_id || index}
                            className="flex flex-col border-t border-gray-700 py-3 px-2 bg-black/40 hover:bg-black/60 rounded-xl transition"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <img
                                  src={item.sender_profile_img}
                                  alt="profile"
                                  className="w-12 h-12 rounded-full border border-gray-600"
                                />
                                <p className="text-white text-lg ml-3">
                                  {item.sender_username}
                                </p>
                              </div>
                              <p className="text-gray-400 text-sm">
                                {item.timeAgo || "1d"}
                              </p>
                            </div>

                            <div className="flex justify-between mt-3">
                              <button
                                onClick={() => AcceptFriendRequest(item)}
                                className="w-[48%] bg-green-600 hover:bg-green-500 text-white py-1.5 rounded-lg border border-green-400"
                              >
                                {t('common.confirm')}
                              </button>
                              <button
                                onClick={() => DelteFriendRequest(item.notify_id)}
                                className="w-[48%] bg-gray-100 hover:bg-gray-200 text-black py-1.5 rounded-lg border border-white"
                              >
                                {t('common.delete')}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden relative" ref={hamburgerRef}>
            <button
              onClick={toggleMobileMenu}
              className="relative  p-3 bg-black cursor-pointer hover:scale-125 transition-all duration-400"
            >
              {mobileMenuOpen ? (
                <IoCloseOutline className="text-white h-8 w-8" />
              ) : (
                <IoMenuOutline className="text-white h-9 w-9" />
              )}
            </button>

            {/* Mobile Menu Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-64 bg-black border-2 border-white rounded-lg p-4 z-50 transition-all duration-300 ease-in-out transform ${
                mobileMenuOpen
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Sidebar Items */}
                <div className="border-b border-gray-600 pb-4">
                  <h3 className="text-white text-sm font-semibold mb-3">{t('navbar.navigation')}</h3>
                  <div className="flex flex-col gap-3">
                    {sidebarItems.map((item, index) => (
                      <Link href={item.path} key={item.path} onClick={() => setMobileMenuOpen(false)}>
                        <div
                          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 ${
                            mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                          }`}
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          {item.icon}
                          <span className="text-white">{t(`common.${item.key}`)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* User Info Section */}
                {user && (
                  <div className="border-b border-gray-600 pb-4">
                    <h3 className="text-white text-sm font-semibold mb-3">{t('navbar.userInfo') || 'User Info'}</h3>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
                      <img
                        src={user.profile_img || '/profileface.png'}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border border-gray-600"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{user.username}</p>
                        <p className="text-gray-400 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navbar Right Section Items */}
                <div>
                  <h3 className="text-white text-sm font-semibold mb-3">{t('navbar.actions')}</h3>
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/profile/${user?.username}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '500ms'
                      }}
                    >
                      <IoPersonCircleOutline className="text-white text-xl" />
                      <span className="text-white">{t('common.profile')}</span>
                    </Link>
                    <div
                      onClick={() => {
                        setSearchOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '600ms'
                      }}
                    >
                      <IoSearchOutline className="text-white text-xl" />
                      <span className="text-white">{t('common.search')}</span>
                    </div>
                    <div
                      onClick={() => {
                        showNotification();
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '700ms'
                      }}
                    >
                      <IoNotificationsOutline className="text-white text-xl" />
                      <span className="text-white">{t('common.notifications')}</span>
                      {unseenCount > 0 && (
                        <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {unseenCount}
                        </span>
                      )}
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '750ms'
                      }}
                    >
                      <IoSettingsOutline className="text-white text-xl" />
                      <span className="text-white">{t('common.settings')}</span>
                    </Link>
                    <div
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer text-red-400 ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '800ms'
                      }}
                    >
                      <IoLogOutOutline className="text-white text-xl" />
                      <span className="text-white">{t('common.logout')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
