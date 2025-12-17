'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IoGameControllerOutline, 
  IoChatbubbleOutline, 
  IoPersonOutline, 
  IoSettingsOutline, 
  IoTrophyOutline 
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

  return (
    // Responsive: Hidden on Mobile.
    // Sticky: Sticks to the viewport as you scroll.
    // Height: Takes up viewport height minus navbar to center correctly.
    <aside className="hidden md:flex flex-col w-20 lg:w-24 sticky top-28 h-[calc(100vh-8rem)] items-center justify-center">
      
      {/* INNER CONTAINER
        Matches Navbar: border-2 border-gray-500 bg-black rounded-3xl
        Flex-1: Stretches to fill the vertical space of the <aside>
      */}
      <div className="w-full h-full border-2 border-gray-500 bg-black rounded-3xl py-8 flex flex-col items-center justify-evenly shadow-2xl">
        {navItems.map((item) => (
          <Link href={item.path} key={item.path} className="relative group w-full flex justify-center">
            
           

            {/* Icon */}
            <div className={`
              p-3 rounded-xl transition-all duration-300
              ${isActive(item.path) ? 'text-white scale-110' : 'text-gray-500 hover:text-white hover:scale-125'}
            `}>
              <span className="text-2xl lg:text-3xl">
                {item.icon}
              </span>
            </div>

            {/* Tooltip */}
            <span className="
              absolute left-full ml-4 top-1/2 -translate-y-1/2
              px-2 py-1 rounded-md bg-gray-700 text-white text-xs 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
              whitespace-nowrap border border-gray-600
            ">
              {item.alt}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}