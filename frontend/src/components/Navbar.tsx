'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  IoSearchOutline, 
  IoNotificationsOutline, 
  IoPersonCircleOutline, 
  IoMenuOutline, 
  IoCloseOutline, 
  IoLogOutOutline,
  IoGameControllerOutline, 
  IoChatbubbleOutline, 
  IoPersonOutline, 
  IoSettingsOutline 
} from 'react-icons/io5';
import { GiPingPongBat } from 'react-icons/gi';
import Link from 'next/link';
import axios from 'axios';
import { globalStore } from '../components/globalStore';
import Logo from '../components/Logo';

// Define types for TypeScript safety
interface Notification {
  sender_user: string;
  sender_profile_img: string;
}

export default function Navbar() {
  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Refs
  const notificationRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  
  // Global Store
  const { connect, socket, username } = globalStore();

  // Initialize User on Mount
  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      // Safely set state in the store
      globalStore.setState({ username: name });
    }
  }, []);

  // Connect Socket
  useEffect(() => {
    connect();
  }, [connect]);

  // Handle Socket Messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event: MessageEvent) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "notify") {
          setNotifications((prev) => [
            ...prev, 
            { sender_user: data.sender_user, sender_profile_img: data.sender_profile_img }
          ]);
        }
      } catch (e) {
        console.error("Socket message parse error", e);
      }
    };
    
    // Cleanup to avoid duplicate listeners
    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  // Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close Mobile Menu
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      // Close Notifications
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    
    if (mobileMenuOpen || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, showNotifications]);

  // Actions
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const acceptFriendRequest = async (targetUsername: string) => {
    const loginUsername = globalStore.getState().username;
    try {
      await axios.post("http://localhost:4444/AddFriend", { user1: targetUsername, user2: loginUsername });
      // Optional: Remove notification from list after accepting
    } catch (error) {
      console.error("Error accepting friend request", error);
    }
  };

  const sidebarItems = [
    { path: '/game', icon: <IoGameControllerOutline className="text-xl" />, alt: 'Game' },
    { path: '/chat', icon: <IoChatbubbleOutline className="text-xl" />, alt: 'Chat' },
    { path: '/profile', icon: <IoPersonOutline className="text-xl" />, alt: 'Profile' },
    { path: '/settings', icon: <IoSettingsOutline className="text-xl" />, alt: 'Settings' },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main Navbar Container */}
      <nav className="w-full p-2 md:p-4 fixed top-0 z-50 bg-transparent">
        
        {/* Floating Inner Container (Matches Sidebar Style) */}
        <div className="mx-auto w-full max-w-[98%] border-2 border-gray-500 bg-black rounded-3xl px-4 py-3 flex justify-between items-center shadow-xl">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 ml-5">
            <div className='fixed'>
              <Logo />   {/* kan kayakhoud size={40}*/}
            </div>
            {/* <GiPingPongBat 
              className="text-white w-8 h-8 md:w-10 md:h-10 cursor-pointer animate-spin"
              style={{ animation: 'spin 6s linear infinite' }}
            /> */}
          </div>

          {/* Right: Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Search */}
            <div className="border border-white rounded-full p-2 bg-black hover:bg-gray-900 cursor-pointer transition-transform hover:scale-110">
              <IoSearchOutline className="text-white w-5 h-5" />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <div 
                onClick={toggleNotifications}
                className="border border-white rounded-full p-2 bg-black hover:bg-gray-900 cursor-pointer transition-transform hover:scale-110 relative"
              >
                <IoNotificationsOutline className="text-white w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border border-black transform translate-x-1/4 -translate-y-1/4"></span>
                )}
              </div>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-4 w-80 bg-black border-2 border-gray-500 rounded-2xl overflow-hidden shadow-2xl z-50">
                  <div className="p-3 border-b border-gray-700 font-semibold text-white bg-gray-900/50">
                    Notifications
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-gray-400 p-6 text-center text-sm">No new notifications</p>
                    ) : (
                      notifications.map((item, index) => (
                        <div key={index} className="flex flex-col border-b border-gray-800 p-3 hover:bg-gray-900 transition-colors">
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              className="w-10 h-10 rounded-full object-cover border border-gray-600" 
                              src={item.sender_profile_img || '/default-avatar.png'} 
                              alt="profile" 
                            />
                            <div>
                              <p className="text-white text-sm font-bold">{item.sender_user}</p>
                              <p className="text-gray-400 text-xs">Sent a friend request</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => acceptFriendRequest(item.sender_user)} 
                              className="flex-1 bg-white text-black text-xs font-bold py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Confirm
                            </button>
                            <button className="flex-1 bg-transparent border border-gray-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <Link href="/profile">
               <div className="border border-white rounded-full p-2 bg-black hover:bg-gray-900 cursor-pointer transition-transform hover:scale-110">
                <IoPersonCircleOutline className="text-white w-5 h-5" />
              </div>
            </Link>
          </div>

          {/* Right: Mobile Hamburger */}
          <div className="md:hidden relative" ref={hamburgerRef}>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <IoCloseOutline className="w-8 h-8" />
              ) : (
                <IoMenuOutline className="w-8 h-8" />
              )}
            </button>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-4 w-64 bg-black border-2 border-gray-500 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 animate-[slideInFromTop_0.2s_ease-out]">
                
                {/* Navigation Links */}
                <div>
                  <h3 className="text-gray-500 text-xs uppercase font-bold mb-2 px-2">Navigation</h3>
                  {sidebarItems.map((item) => (
                    <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3 p-2 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        {item.icon}
                        <span className="font-medium">{item.alt}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-800 w-full my-1"></div>

                {/* Account Actions */}
                <div>
                  <h3 className="text-gray-500 text-xs uppercase font-bold mb-2 px-2">Account</h3>
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-3 p-2 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-colors">
                        <IoSearchOutline className="text-xl" />
                        <span className="font-medium">Search</span>
                     </div>
                     <div 
                        onClick={() => { toggleNotifications(); setMobileMenuOpen(false); }}
                        className="flex items-center gap-3 p-2 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-colors"
                     >
                        <IoNotificationsOutline className="text-xl" />
                        <span className="font-medium">Notifications</span>
                        {notifications.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {notifications.length}
                          </span>
                        )}
                     </div>
                     <div className="flex items-center gap-3 p-2 rounded-xl text-red-400 hover:bg-gray-800 hover:text-red-300 cursor-pointer transition-colors">
                        <IoLogOutOutline className="text-xl" />
                        <span className="font-medium">Logout</span>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}