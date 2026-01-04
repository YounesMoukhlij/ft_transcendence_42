'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoPersonCircleOutline, IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {  toast } from 'sonner';
import { useUserStore } from '../store/userStore';
import '../app/(protected)/chat/page.css';
import {friendRequestType} from '@/app/(protected)/chat/types';
import Logo from '../components/Logo';
import { getProfileImageUrl } from '@/lib/utils';
import { getWebSocket } from './globalSocket';
import { useGameContext } from './GameContext';
import { useTranslation } from '../contexts/LanguageContext';


interface SearchResult {
  id_user: number;
  username: string;
  fullname?: string;
  profile_img?: string;
  status: number;
}


export default function Navbar() {
  const router = useRouter();
  const { setGameMode } = useGameContext();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(false);

  const [unseenCount, SetunseenCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const notificationRef = useRef(null);
  const buttonRef = useRef(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const setUsername = useUserStore.setState;
  const { addFriend,  friends,  addPendingRequestsArray, removePendingRequests, sentRequests, pendingRequests, addSentRequests , 
          notifications , deleteNotification ,setnotifications} = useUserStore();
  const user = useUserStore((state) => state.user);

  function isTimeValid(item) {

    const expiredStr = item?.expired;
    if (!expiredStr || typeof expiredStr !== 'string') return true;

    // Backend stores timestamps like "YY-MM-DD HH:MM:SS" or "YYYY-MM-DD HH:MM:SS".
    // Parse them consistently as UTC to avoid timezone-related "instant expiry".
    const toUtcDate = (s: string) => {
      const trimmed = s.trim();
      if (!trimmed) return null;

      // ISO (already parseable)
      if (trimmed.includes('T')) {
        const d = new Date(trimmed);
        return isNaN(d.getTime()) ? null : d;
      }

      const parts = trimmed.split(' ');
      if (parts.length < 2) return null;
      // let [datePart, timePart] = parts;
      let datePart = parts[0];
      const timePart = parts[1];

      // YY-MM-DD -> YYYY-MM-DD
      if (/^\d{2}-\d{2}-\d{2}$/.test(datePart)) {
        datePart = `20${datePart}`;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;
      if (!/^\d{2}:\d{2}:\d{2}$/.test(timePart)) return null;

      const d = new Date(`${datePart}T${timePart}Z`);
      return isNaN(d.getTime()) ? null : d;
    };

    const expiresAt = toUtcDate(expiredStr);
    if (!expiresAt) return true; // be permissive if parsing fails

    return new Date().getTime() < expiresAt.getTime();
  }

  useEffect(() => {
    setUsername({ username: user?.username });
  }, []);

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;

    if (
      notificationRef.current &&
      !notificationRef.current.contains(target) &&
      buttonRef.current &&
      !buttonRef.current.contains(target)
    ) {
      setNotificationIndex(false);
    }

    if (
      hamburgerRef.current &&
      !hamburgerRef.current.contains(target)
    ) {
      setMobileMenuOpen(false);
    }

    if (searchRef.current && !searchRef.current.contains(target)) {
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    if (!user?.access_token) return;

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await axios.get(
          `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/searchUsers`,
          {
            params: { query: searchQuery.trim() },
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        );
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, user?.access_token]);

  const getFriendButtonState = (resultUser: SearchResult) => {
    if (resultUser.id_user === user?.id_user) return null;

    const isFriend = friends?.some((f: { id_user: number }) => f.id_user === resultUser.id_user);
    if (isFriend) return { text: t('navbar.alreadyFriend'), disabled: true };

    const requestSent = sentRequests?.some((r: { getter_user: number }) => r.getter_user === resultUser.id_user);
    if (requestSent) return { text: t('navbar.friendRequestSent'), disabled: true };

    const hasPendingRequest = pendingRequests?.some((r: { sender_user: number }) => r.sender_user === resultUser.id_user);
    if (hasPendingRequest) return { text: t('navbar.pendingRequest'), disabled: true };

    return { text: t('navbar.addFriend'), disabled: false };
  };

  const handleSendFriendRequest = async (resultUser: SearchResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.access_token) {
      toast.error(t('navbar.friendRequestFailed'));
      return;
    }

    try {
      const res = await axios.post(
        `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/sendRequestFriend`,
        { id: resultUser.id_user },
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      if (res.status === 200) {
        addSentRequests({ getter_user: resultUser.id_user, notify_id: res.data });
        toast.success(t('navbar.friendRequestSentSuccess', { username: resultUser.username }));
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error?.response?.data?.message || t('navbar.friendRequestFailed'));
    }
  };


  async function DelteFriendRequest(notify_id) {
    toast.error('Deleted');
    const sender_id = notifications.filter(item => item.notify_id == notify_id)[0].sender_user;
    // deleteNotification(notify_id);
    deleteNotification(notify_id);
    // setNotification(notificatiion => notificatiion.filter(item => item.notify_id !== notify_id));
    const res = await axios.delete(`https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/DeleteFriendRequest`, {
      params: { id: notify_id },
      headers: { Authorization: `Bearer ${user.access_token}` }
    });
    if (res.status == 200) {
      removePendingRequests(sender_id);
    }
  }

  async function AcceptFriendRequest(item: friendRequestType) {
    const res = await axios.post(`https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/AddFriend`, {
      id: item.sender_user,
    }, {
      headers: { Authorization: `Bearer ${user.access_token}` }
    });
    if (res.status === 200) {
      const object = {
        profile_img: item.sender_profile_img,
        username: item.sender_username,
        id_user: item.sender_user,
        conversation_id: res.data.lastInsertRowid,
        status: 0,
      }
      removePendingRequests(item.sender_user);
      addFriend(object);
    }
    // console.log("item ------< " , item);
    deleteNotification(item.notify_id);

  }

  function showNotification() {
    const wasOpen = notificationIndex;
    setNotificationIndex(!notificationIndex);

    // When opening, mark all as seen locally for correct dot behavior
    if (!wasOpen) {
      // setNotifications((prev) => prev.map((n) => ({ ...n, is_seen: true })));
      SetunseenCount(0);
    }
    try {
      axios.post(`https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/NotificationSeen`,
        {},
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    if (!user) return;
    async function get_notify() {
      try {
        const result = await axios.get(
          `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/GetNotification`,
          { headers: { Authorization: `Bearer ${user.access_token}` } }
        );
        // setNotification(result.data.reverse());
        console.log(result.data);
        setnotifications(result.data);

        addPendingRequestsArray(result.data.filter(object => object.title == "request friend"));
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    }
    get_notify();
  }, [user, friends]);



  useEffect(() => {
    // console.log("notification -===> " , notifications);
    SetunseenCount(notifications.filter(n => !n.is_seen).length);




    console.log("new notification =======+>" , notifications);
  }, [notifications]);

  // useEffect(() => {
  //   if (!socket) return;
  //   const handleNotify = (event: MessageEvent) => {
  //     const { type, data } = JSON.parse(event.data);
      
  //   socket.addEventListener("message", handleNotify);
  //   return () => {
  //     socket.removeEventListener("message", handleNotify);
  //   };
  // }, [socket]);

  async function AcceptGameChallenge(item) {
    if (!user?.access_token) return;

    try {
      // Backend will:
      // - send WS `game_challenge_accepted` to the inviter
      // - send WS `start_game` to the acceptor
      // We also navigate immediately for a smoother UX.
      const res = await axios.post(
        `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/startGame`,
        { id: item.sender_user },
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );

      const challengeId = res?.data?.challengeId;
      if (challengeId && typeof window !== 'undefined') {
        localStorage.setItem('pendingChallengeId', String(challengeId));
      }

      setGameMode('remote');

      // Delete notification (best-effort)
      try {
        await axios.delete(
          `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/DeleteNotification`,
          {
            params: { notifyId: item.notify_id },
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        );
      } catch (e) {
        console.log(e);
      }

      // setNotification(notificatiion.filter(object => object.notify_id !== item.notify_id));
      deleteNotification(item.notify_id);
      setNotificationIndex(false);
      router.push('/game/customize');
    } catch (err) {
      console.error(err);
      toast.error('Failed to accept game challenge');
    }
  }

  async function RejectGameChallenge(item) {
    if (!user?.access_token) return;

    // setNotification(notificatiion.filter(object => object.notify_id !== item.notify_id));
    deleteNotification(item.notify_id);
    setNotificationIndex(false);

    try {
      await axios.delete(
        `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/DeleteNotification`,
        {
          params: { notifyId: item.notify_id },
          headers: { Authorization: `Bearer ${user.access_token}` }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function AcceptTournamentInvite(item) {
    if (!user?.access_token) return;

    try {
      const tournamentId = item.tournamentId;
      if (!tournamentId) {
        toast.error('Tournament ID not found in invitation');
        return;
      }

      const gameSocket = getWebSocket();

      if (gameSocket.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve) => {
          gameSocket.addEventListener('open', resolve, { once: true });
        });
      }

      if (gameSocket.readyState === WebSocket.OPEN) {
        if (user?.id_user) gameSocket.send(String(user.id_user));
        await new Promise(resolve => setTimeout(resolve, 100));

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

      // Delete notification (best-effort)
      try {
        await axios.delete(
          `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/DeleteNotification`,
          {
            params: { notifyId: item.notify_id },
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        );
      } catch (err) {
        console.log(err);
      }

      // setNotification(notificatiion.filter(object => object.notify_id !== item.notify_id));
      deleteNotification(item.notify_id);
      setNotificationIndex(false);
      router.push('/game/tournament');
    } catch (err) {
      console.error(err);
      toast.error('Failed to accept tournament invitation');
    }
  }

  async function RejectTournamentInvite(item) {
    if (!user?.access_token) return;

    try {
      const tournamentId = item.tournamentId;
      if (!tournamentId) {
        toast.error('Tournament ID not found in invitation');
        return;
      }

      const gameSocket = getWebSocket();

      if (gameSocket.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve) => {
          gameSocket.addEventListener('open', resolve, { once: true });
        });
      }

      if (gameSocket.readyState === WebSocket.OPEN) {
        if (user?.id_user) gameSocket.send(String(user.id_user));
        await new Promise(resolve => setTimeout(resolve, 100));

        gameSocket.send(JSON.stringify({
          type: 'game',
          action: 'declineTournamentInvite',
          payload: {
            tournamentId: tournamentId
          }
        }));
      }

      // setNotification(notificatiion.filter(object => object.notify_id !== item.notify_id));
            deleteNotification(item.notify_id);

      setNotificationIndex(false);

      try {
        await axios.delete(
          `https://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/api/DeleteNotification`,
          {
            params: { notifyId: item.notify_id },
            headers: { Authorization: `Bearer ${user.access_token}` }
          }
        );
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to decline tournament invitation');
    }
  }

  const sidebarItems = [
    { path: '/game', icon: <IoGameControllerOutline className="text-xl" />, alt: 'Game' },
    { path: '/chat', icon: <IoChatbubbleOutline className="text-xl" />, alt: 'Chat' },
    { path: '/profile', icon: <IoPersonOutline className="text-xl" />, alt: 'Profile' },
    { path: '/settings', icon: <IoSettingsOutline className="text-xl" />, alt: 'Settings' },
  ];

  return (
    <>
      {/* Fixed Top Container */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 px-2 h-24">
        {/* Inner Container - Matches Sidebar Style */}
      <div className="w-full max-w-[98%] md:max-w-[96%] h-full border border-gray-800 bg-black rounded-3xl px-6 flex justify-between items-center shadow-2xl relative">
        
        {/* Left: Logo */}
        <div className="flex items-center">
             <Logo /> 
        </div>

          {/* Right: Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
           <div className="relative" ref={searchRef}>
             <div
               onClick={handleSearchClick}
               className="border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300"
             >
               <IoSearchOutline className="text-gray-400 w-5 h-5 group-hover:text-black transition-colors" />
             </div>

             {searchOpen && (
               <div className="absolute right-0 top-full mt-4 w-80 bg-black border-2 border-gray-500 rounded-2xl overflow-hidden shadow-2xl z-50">
                 <div className="p-4">
                   <input
                     type="text"
                     placeholder={t('navbar.searchUsers')}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gray-400"
                     autoFocus
                   />

                   {isSearching && (
                     <div className="mt-4 text-center text-gray-400 text-sm">{t('navbar.searching')}</div>
                   )}

                   {!isSearching && searchQuery.trim().length < 2 && (
                     <div className="mt-4 text-center text-gray-500 text-sm">{t('navbar.typeToSearch')}</div>
                   )}

                   {!isSearching && searchQuery.trim().length >= 2 && (
                     <div className="mt-4 max-h-96 overflow-y-auto custom-scrollbar">
                       {searchResults.length === 0 ? (
                         <div className="text-center text-gray-400 py-6 text-sm">{t('navbar.noUsersFound')}</div>
                       ) : (
                         <div className="space-y-2">
                           {searchResults.map((result) => {
                             const buttonState = getFriendButtonState(result);
                             return (
                               <div
                                 key={result.id_user}
                                 className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition"
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
                                     src={getProfileImageUrl(result.profile_img)}
                                     alt={result.username}
                                     className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                                   />
                                   <div className="flex-1">
                                     <p className="text-white font-semibold">{result.username}</p>
                                     {result.fullname && (
                                       <p className="text-gray-400 text-sm">{result.fullname}</p>
                                     )}
                                   </div>
                                   <div className={`w-3 h-3 rounded-full ${result.status === 1 ? 'bg-green-500' : 'bg-gray-600'}`} />
                                 </Link>
                                 {buttonState && (
                                   <button
                                     onClick={(e) => handleSendFriendRequest(result, e)}
                                     disabled={buttonState.disabled}
                                     className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                                       buttonState.disabled
                                         ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
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
                 </div>
               </div>
             )}
           </div>

            {/* Notifications */}

            <div className="relative" ref={buttonRef}>
            <div 
              onClick={showNotification}
              className="border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300 relative"
            >
              <IoNotificationsOutline className="text-gray-400 w-5 h-5 group-hover:text-black transition-colors" />
              {unseenCount > 0 && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border border-black transform translate-x-1/4 -translate-y-1/4 animate-pulse"></span>
              )}
            </div>

              {/* Notification Dropdown */}
              {notificationIndex && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 top-full mt-4 w-96 max-h-[500px] bg-black border-2 border-gray-500 rounded-2xl overflow-hidden shadow-2xl z-50"
                >
                  <div className="p-3 border-b border-gray-700 font-semibold text-white bg-gray-900/50">
                    Notifications
                  </div>
                  <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="text-center text-gray-400 py-8 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((item, index) => {
                        if (item.title === "game challenge") {
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 transition"
                            >
                              <img
                                src={getProfileImageUrl(item.sender_profile_img)}
                                alt="profile"
                                className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                              />
                              <div className="flex flex-col flex-1">
                                <p className="text-white font-semibold">
                                  {item.sender_username}
                                </p>
                                <p className="text-sm text-gray-400">
                                  invited you to a <span className="text-blue-400 font-medium">1 vs 1 game</span>
                                </p>
                              </div>
                              {isTimeValid(item) ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => AcceptGameChallenge(item)}
                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => RejectGameChallenge(item)}
                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">expired</p>
                              )}
                            </div>
                          );
                        }

                        if (item.title === "tournament invite") {
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 transition"
                            >
                              <img
                                src={getProfileImageUrl(item.sender_profile_img)}
                                alt="profile"
                                className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                              />
                              <div className="flex flex-col flex-1">
                                <p className="text-white font-semibold">
                                  {item.sender_username}
                                </p>
                                <p className="text-sm text-gray-400">
                                  invited you to a <span className="text-blue-400 font-medium">tournament</span>
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => AcceptTournamentInvite(item)}
                                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => RejectTournamentInvite(item)}
                                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          );
                        }

                        if (item.title === "friend request accepted") {
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 border-b border-gray-800 bg-green-900/20 hover:bg-green-800/30 transition"
                            >
                              <img
                                src={getProfileImageUrl(item.sender_profile_img)}
                                alt="profile"
                                className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
                              />
                              <div className="flex flex-col">
                                <p className="text-white font-semibold">
                                  {item.sender_username}
                                </p>
                                <p className="text-green-400 text-sm">
                                  accepted your friend request
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={index}
                            className="flex flex-col p-4 border-b border-gray-800 hover:bg-gray-900/50 transition"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getProfileImageUrl(item.sender_profile_img)}
                                  alt="profile"
                                  className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                                />
                                <p className="text-white font-semibold">
                                  {item.sender_username}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => AcceptFriendRequest(item)}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => DelteFriendRequest(item.notify_id)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
           <Link href="/profile">
             <div className="border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300">
              <IoPersonCircleOutline className="text-gray-400 w-5 h-5 group-hover:text-black transition-colors" />
            </div>
          </Link>
        </div>

        {/* Right: Mobile Hamburger */}
        <div className="md:hidden relative" ref={hamburgerRef}>
          <button onClick={toggleMobileMenu} className="p-2 text-white hover:bg-gray-800 rounded-full transition-colors">
            {mobileMenuOpen ? <IoCloseOutline className="w-7 h-7" /> : <IoMenuOutline className="w-7 h-7" />}
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute right-0 top-full mt-4 w-64 bg-black border border-gray-800 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 z-50">
              <div>
                <h3 className="text-gray-500 text-xs uppercase font-bold mb-2 px-2">Menu</h3>
                {sidebarItems.map((item) => (
                  <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white hover:text-black transition-colors">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.alt}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="h-px bg-gray-800 w-full"></div>
              <div className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
                 <IoLogOutOutline className="text-xl" />
                 <span className="font-medium">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
}