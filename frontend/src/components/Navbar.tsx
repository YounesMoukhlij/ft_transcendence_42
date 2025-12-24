'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoPersonCircleOutline, IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5';
import { GiPingPongBat } from 'react-icons/gi';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link';
import axios from 'axios';
import {  toast } from 'sonner';
import { useUserStore } from '../store/userStore';
import '../app/(protected)/chat/page.css';
import {friendRequestType} from '@/app/(protected)/chat/types';
import Logo from '../components/Logo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(false);
  const [notificatiion, setNotification] = useState([]);
  const [unseenCount, SetunseenCount] = useState(0);
  
  const notificationRef = useRef(null);
  const buttonRef = useRef(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  
  const { connect} = useUserStore();
  const setUsername = useUserStore.setState;
  const socket = useUserStore((state) => state.socket);
  const { addFriend, removeFriend, friends, addPendingRequests, addPendingRequestsArray, removePendingRequests, removeSentRequests } = useUserStore();
  const user = useUserStore((state) => state.user);

  function isTimeValid(item : any) {

    const targetTimeString = item.expired;
    const [datePart, timePart] = targetTimeString.split(' ');
    const [yy, mm, dd] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    const fullYear = 2000 + yy;
    const targetTime = new Date(fullYear, mm - 1, dd, hours, minutes, seconds);
    const now = new Date();
    const diffSeconds = (now - targetTime) / 1000;

    if (diffSeconds <= 15) {
      setTimeout(() => {
        const newExpired = ((d => (
          d.setFullYear(d.getFullYear() - 1),
          `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
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
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  async function DelteFriendRequest(notify_id) {
    toast.error('Deleted');
    const sender_id = notificatiion.filter(item => item.notify_id == notify_id)[0].sender_user;
    setNotification(notificatiion => notificatiion.filter(item => item.notify_id !== notify_id));
    const res = await axios.delete(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/DeleteFriendRequest`, {
      params: { id: notify_id },
      headers: { Authorization: `Bearer ${user.access_token}` }
    });
    if (res.status == 200) {
      removePendingRequests(sender_id);
    }
  }

  async function AcceptFriendRequest(item: friendRequestType) {
    const res = await axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/AddFriend`, {
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
    setNotification(notificatiion => notificatiion.filter(items => items.notify_id !== item.notify_id));
  }

  function showNotification() {
    setNotificationIndex(!notificationIndex);
    SetunseenCount(0);
    try {
      axios.post(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/NotificationSeen`,
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
          `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/GetNotification`,
          { headers: { Authorization: `Bearer ${user.access_token}` } }
        );
        setNotification(result.data.reverse());
        addPendingRequestsArray(result.data.filter(object => object.title == "request friend"));
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    }
    get_notify();
  }, [user, friends]);

  useEffect(() => {
    connect();
  }, [user?.id_user]);

  useEffect(() => {
    SetunseenCount(notificatiion.filter(n => !n.is_seen).length);
  }, [notificatiion]);

  useEffect(() => {
    if (!socket) return;
    const handleNotify = (event: MessageEvent) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "notify") {
        if (data.title == "request friend") {
          addPendingRequests({
            sender_user: data.sender_user,
            sender_username: data.sender_username,
            notify_id: data.notify_id,
          });
        } else if (data.title == "friend request accepted") {
          removeSentRequests(data.sender_user);
          addFriend({ id_user: data.sender_user });
        }
        setNotification(prev => [{
          sender_user: data.sender_user,
          title: data.title,
          sender_username: data.sender_username,
          sender_profile_img: data.sender_profile_img,
          notify_id: data.notify_id,
          expired: data.expired
        }, ...prev]);
      } else if (type == "unfriend") {
        removeFriend(data.id_user);
      } else if (type == "rejected") {
        removeSentRequests(data.getter_user);
      } else if (type == "canceled request") {
        removePendingRequests(data.sender_user);
      }
    };
    socket.addEventListener("message", handleNotify);
    return () => {
      socket.removeEventListener("message", handleNotify);
    };
  }, [socket]);

  async function AcceptGameChallenge(item) {
    const res = await axios.delete(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/DeleteNotification`,
      {
        params: { id: item.notify_id },
        headers: { Authorization: `Bearer ${user.access_token}` }
      }
    );
    if (res.status == 200)
      setNotification(notificatiion.filter(object => object.notify_id !== item.notify_id));
  }

  function RejectGameChallenge(item) {
    setNotification(notificatiion.filter(object => object.notify_id !== item.notify_id));
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
           <div className="border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300">
            <IoSearchOutline className="text-gray-400 w-5 h-5 group-hover:text-black transition-colors" />
          </div>

            {/* Notifications */}

            <div className="relative" ref={buttonRef}>
            <div 
              onClick={showNotification}
              className="border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300 relative"
            >
              <IoNotificationsOutline className="text-gray-400 w-5 h-5 group-hover:text-black transition-colors" />
              {notificatiion.length > 0 && (
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
                    {notificatiion.length === 0 ? (
                      <div className="text-center text-gray-400 py-8 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notificatiion.map((item, index) => {
                        if (item.title === "game challenge") {
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 transition"
                            >
                              <img
                                src={item.sender_profile_img}
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

                        if (item.title === "friend request accepted") {
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 border-b border-gray-800 bg-green-900/20 hover:bg-green-800/30 transition"
                            >
                              <img
                                src={item.sender_profile_img}
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
                                  src={item.sender_profile_img}
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