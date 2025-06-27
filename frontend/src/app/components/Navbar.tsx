'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoPersonCircleOutline, IoMenuOutline, IoCloseOutline, IoLogOutOutline } from 'react-icons/io5';
import { GiPingPongBat } from 'react-icons/gi';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link';

export default function Navbar()
{
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef<HTMLSpanElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
    { path: '/game', icon: <IoGameControllerOutline className="text-white text-2xl" />, alt: 'Game' },
    { path: '/chat', icon: <IoChatbubbleOutline className="text-white text-2xl" />, alt: 'Chat' },
    { path: '/profile', icon: <IoPersonOutline className="text-white text-2xl" />, alt: 'Profile' },
    { path: '/settings', icon: <IoSettingsOutline className="text-white text-2xl" />, alt: 'Settings' },
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
      <nav className="m-2 md:m-[10px] p-2 md:p-3 z-50 h-[10vh] bg-transparent">
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-center gap-1 md:gap-2">
            <GiPingPongBat
              className="text-white w-15 h-15  cursor-pointer animate-spin"
              style={{
                animation: 'spin 6s linear infinite'
              }}
            />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex flex-row items-center justify-center gap-2 md:gap-5">
            <div className="relative border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400">
              <IoSearchOutline className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8  cursor-pointer hover:scale-125 transition-all duration-400" />
            </div>
            <div className="relative border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400">
              <IoNotificationsOutline className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8  cursor-pointer hover:scale-125 transition-all duration-400" />
            </div>
            <div className="relative  border-2 border-white rounded-2xl p-2 bg-black cursor-pointer hover:scale-90 transition-all duration-400" ref={dropdownRef}>
              <span ref={profileIconRef}>
                <IoPersonCircleOutline
                  className="text-white h-5 w-5 md:w-6 md:h-6 lg:w-8 lg:h-8  cursor-pointer hover:scale-125 transition-all duration-400"
                  style={{ cursor: 'pointer' }}
                />
              </span>
            </div>
          </div>

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
                  <h3 className="text-white text-sm font-semibold mb-3">Navigation</h3>
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
                          <span className="text-white">{item.alt}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navbar Right Section Items */}
                <div>
                  <h3 className="text-white text-sm font-semibold mb-3">Actions</h3>
                  <div className="flex flex-col gap-3">
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '500ms'
                      }}
                    >
                      <IoPersonCircleOutline className="text-white text-xl" />
                      <span className="text-white">Profile</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '600ms'
                      }}
                    >
                      <IoSearchOutline className="text-white text-xl" />
                      <span className="text-white">Search</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '700ms'
                      }}
                    >
                      <IoNotificationsOutline className="text-white text-xl" />
                      <span className="text-white">Notifications</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
                        mobileMenuOpen ? 'animate-[slideInFromTop_0.3s_ease-out_forwards]' : ''
                      }`}
                      style={{
                        animationDelay: '800ms'
                      }}
                    >
                      <IoLogOutOutline className="text-white text-xl" />
                      <span className="text-white">Logout</span>
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
