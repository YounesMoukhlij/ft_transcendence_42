'use client';

import styles from './sidebar.module.css';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { IoGameControllerOutline, IoChatbubbleOutline, IoPersonOutline, IoSettingsOutline, IoChevronForwardCircleOutline, IoChevronBackCircleOutline } from "react-icons/io5";

export default function Sidebar()
{
  const pathname = usePathname();
  const navItems = [
    { path: '/game', icon: <IoGameControllerOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-white text-2xl" />, alt: 'Game' },
    { path: '/chat', icon: <IoChatbubbleOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-white text-2xl" />, alt: 'Chat' },
    { path: '/profile', icon: <IoPersonOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-white text-2xl" />, alt: 'Profile' },
    { path: '/settings', icon: <IoSettingsOutline className=" w-6 h-6 md:w-8 md:h-8  hover:scale-125 md:hover:scale-125 transition-all duration-300 text-white text-2xl" />, alt: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile since navigation is in hamburger menu */}
      <aside className=" hidden md:flex w-[14vw] lg:w-[10%] h-full items-center justify-center bg-transparent rounded-3xl p-1 md:p-2">
        <div className="relative border-2 border-white  overflow-hidden h-[10%] md:h-[50%] gap-8 md:gap-12 m-1 md:m-3 bg-black rounded-3xl p-2 md:p-5 flex flex-col items-center justify-center ">
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
