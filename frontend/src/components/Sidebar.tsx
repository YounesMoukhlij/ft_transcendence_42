'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IoGameControllerOutline, 
  IoChatbubbleOutline, 
  IoPersonOutline, 
  IoSettingsOutline, 
  IoTrophyOutline,
  IoLogOutOutline 
} from "react-icons/io5";

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { path: '/profile', icon: <IoPersonOutline />, alt: 'Profile' },
    { path: '/chat', icon: <IoChatbubbleOutline />, alt: 'Chat' },
    { path: '/game', icon: <IoGameControllerOutline />, alt: 'Game' },
    { path: '/leaderboard', icon: <IoTrophyOutline />, alt: 'Leaderboard' },
    { path: '/settings', icon: <IoSettingsOutline />, alt: 'Settings' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    // Add logic here (e.g., delete cookie, redirect)
    console.log("Logging out...");
  };

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-24 sticky top-28 h-[calc(100vh-8rem)] items-center justify-center z-40">
      
      {/* REMOVED: 'overflow-hidden' (This was clipping your tooltips)
        UPDATED: 'border-gray-800' to match the updated theme
      */}
      <div className="w-full h-full border border-gray-800 bg-black rounded-3xl py-6 flex flex-col justify-between shadow-2xl relative">
        
        {/* Navigation Group */}
        <div className="flex flex-col items-center space-y-4 w-full px-4">
          {navItems.map((item) => (
            <Link 
              href={item.path} 
              key={item.path} 
              className="relative group w-full flex justify-center"
            >
              <div className={`
                p-3 rounded-xl transition-all duration-300 w-full flex justify-center
                ${isActive(item.path) 
                  ? 'bg-white text-black shadow-lg shadow-gray-900/50 scale-105' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-900' 
                }
              `}>
                <span className="text-2xl lg:text-3xl">
                  {item.icon}
                </span>
              </div>


              <span className="
                absolute left-[80%] ml-4 top-1/2 -translate-y-1/2
                px-3 py-1 rounded bg-gray-400 text-white text-xs font-medium
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
                whitespace-nowrap border border-gray-400 shadow-xl
              ">
                {item.alt}
              </span>
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        <div className="w-full px-4 pt-4 border-t border-gray-800">
            <button 
              onClick={handleLogout}
              className="relative group w-full flex justify-center"
            >
              <div className="
                p-3 rounded-xl transition-all duration-300 w-full flex justify-center
                text-gray-500 hover:text-white hover:bg-gray-900 border border-transparent hover:border-gray-700
              ">
                <span className="text-2xl lg:text-3xl hover:cursor-pointer">
                  <IoLogOutOutline />
                </span>
              </div>

              {/* Logout Tooltip */}
              <span className="
                 absolute left-[80%] ml-4 top-1/2 -translate-y-1/2
                px-3 py-1 rounded bg-gray-400 text-white text-xs font-medium
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
                whitespace-nowrap border border-gray-400 shadow-xl
              ">
                Logout
              </span>
            </button>
        </div>

      </div>
    </aside>
  );
}