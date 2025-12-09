'use client';

import styles from './sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline, IoChevronBackCircleOutline, IoTrophyOutline, IoExitOutline } from "react-icons/io5";

export default function Sidebar()
{
  const pathname = usePathname();
  const navItems = [
    { path: '/profile', icon: <IoPersonOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Profile' },
    { path: '/game', icon: <IoGameControllerOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Game' },
    { path: '/chat', icon: <IoChatbubbleOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Chat' },
    { path: '/leaderboard', icon: <IoTrophyOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Leaderboard' },
    { path: '/settings', icon: <IoSettingsOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-gray-500 " />, alt: 'Settings' },
  ];

  return (
      <aside className="  md:flex w-[8vw] lg:w-[6%] h-full items-center justify-center  rounded-3xl p-1 md:p-2 gap-4">
        <div className="fixed border-2 border-gray-500  gap-8 md:gap-10  md:m-3 rounded-3xl p-2 md:p-5 flex flex-col items-center justify-evenly h-auto ">
          {navItems.map((item) => (
            <Link href={item.path} key={item.path}>
              <span className=" cursor-pointer ">
                {item.icon}
              </span>
            </Link>
          ))}
        </div>
        {/* <div className='fixed bottom-[5%] border-red-400 border-2 p-3 rounded-full flex items-center justify-center hover:cursor-pointer'>
          <button
            onClick={() => console.log("Logout clicked")}
            className="text-red-400 hover:scale-125 transition-all duration-300 hover:cursor-pointer hover:text-red-500"
            >
            <IoExitOutline 
            className="w-6 h-6 md:w-8 md:h-8"
             />
          </button>
        </div> */}
      </aside>
  );
}
