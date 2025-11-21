'use client';

import styles from './sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline, IoChevronBackCircleOutline, IoTrophyOutline  } from "react-icons/io5";

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
    <>
      <aside className="  md:flex w-[14vw] lg:w-[10%] h-full items-center justify-center bg-transparent rounded-3xl p-1 md:p-2">
        <div className="fixed top-[25%] bottom-20 border-2 border-gray-500  gap-8 md:gap-12 m-1 md:m-3 bg-black rounded-3xl p-2 md:p-5 flex flex-col items-center justify-evenly h-auto ">
          {navItems.map((item) => (
            <Link href={item.path} key={item.path}>
              <span className=" cursor-pointer ">
                {item.icon}
              </span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
