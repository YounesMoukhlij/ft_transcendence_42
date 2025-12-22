'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
import { globalStore } from '../components/globalStore';
import Logo from '../components/Logo';

interface Notification {
  sender_user: string;
  sender_profile_img: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  
  const { connect, socket } = globalStore();

  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) globalStore.setState({ username: name });
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event: MessageEvent) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "notify") {
          setNotifications((prev) => [...prev, { sender_user: data.sender_user, sender_profile_img: data.sender_profile_img }]);
        }
      } catch (e) { console.error(e); }
    };
    return () => { socket.onmessage = null; };
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const sidebarItems = [
    { path: '/game', icon: <IoGameControllerOutline />, alt: 'Game' },
    { path: '/chat', icon: <IoChatbubbleOutline />, alt: 'Chat' },
    { path: '/profile', icon: <IoPersonOutline />, alt: 'Profile' },
    { path: '/settings', icon: <IoSettingsOutline />, alt: 'Settings' },
  ];

  return (
    // Fixed Top Container
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pt-4 px-2 h-24">
      
      {/* INNER CONTAINER 
        Matches Sidebar: border border-gray-800 bg-black rounded-3xl 
      */}
      <div className="w-full max-w-[98%] md:max-w-[96%] h-full border border-gray-800 bg-black rounded-3xl px-6 flex justify-between items-center shadow-2xl relative">
        
        {/* Left: Logo */}
        <div className="flex items-center">
             <Logo /> 
        </div>

        {/* Right: Desktop Actions (Circles) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Search */}
          <div className="border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300">
            <IoSearchOutline className="text-gray-400 w-5 h-5 group-hover:text-black transition-colors" />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <div 
              onClick={toggleNotifications}
              className="border border-gray-700 rounded-full p-2.5 bg-black hover:bg-white hover:border-white group cursor-pointer transition-all duration-300 relative"
            >
              <IoNotificationsOutline className="text-gray-400 w-5 h-5 group-hover:text-black transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border border-black transform translate-x-1/4 -translate-y-1/4 animate-pulse"></span>
              )}
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-50">
                <div className="p-3 border-b border-gray-800 font-semibold text-white bg-gray-900">
                  Notifications
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 p-6 text-center text-sm">No new notifications</p>
                  ) : (
                    notifications.map((item, index) => (
                      <div key={index} className="flex flex-col border-b border-gray-800 p-3 hover:bg-gray-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <img className="w-10 h-10 rounded-full border border-gray-700 object-cover" src={item.sender_profile_img || '/default-avatar.png'} alt="profile" />
                          <div>
                            <p className="text-white text-sm font-bold">{item.sender_user}</p>
                            <p className="text-gray-400 text-xs">Friend request</p>
                          </div>
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
  );
}