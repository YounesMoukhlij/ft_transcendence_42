'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline, IoTrophyOutline} from "react-icons/io5";

export default function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { path: '/profile', icon: <IoPersonOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Profile' },
    { path: '/chat', icon: <IoChatbubbleOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Chat' },
    { path: '/game', icon: <IoGameControllerOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Game' },
    { path: '/leaderboard', icon: <IoTrophyOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Leaderboard' },
    { path: '/settings', icon: <IoSettingsOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Settings' },
  ];

  return (
    <aside className="hidden md:flex w-[14vw] lg:w-[10%] h-full items-center justify-center bg-transparent rounded-3xl p-1 md:p-2">
      <div className="fixed border-2 border-gray-500 gap-8 md:gap-12 m-1 md:m-3 bg-black rounded-3xl p-2 md:p-5 flex flex-col items-center justify-evenly">
        {navItems.map((item) => (
          <Link href={item.path} key={item.path}>
            <span className="relative group cursor-pointer">
              {item.icon}

              <span className="
                absolute left-1/2 -bottom-8 -translate-x-1/2 
                whitespace-nowrap
                px-2 py-1 rounded-md
                bg-gray-700 text-white text-xs opacity-0
                group-hover:opacity-100 transition-opacity duration-200
              ">
                {item.alt}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
