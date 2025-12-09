'use client';

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ParticlesBackground from "../components/ParticlesBackground";
import { GameProvider } from "../components/GameContext";
// import SignInUp from "./Auth/page";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import React from "react";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Ping Pong Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      {/* 1. h-screen: Force body to be exactly screen height 
          2. overflow-hidden: Prevent the body itself from scrolling (we scroll inner content instead)
      */}
      <body className="h-screen bg-black overflow-hidden text-white">
        {/* <GameProvider> */}
          {/* Navbar is fixed (z-50), so it sits on top of everything */}
          <Navbar />
          
          {/* Main Container:
             1. pt-24 md:pt-28: Adds TOP padding to account for the fixed Navbar height. 
             2. h-full: Fills the screen height.
             3. overflow-hidden: Ensures no leakage from this container triggers parent scroll.
          */}
          <div className="flex h-full pt-24 md:pt-28 gap-4 p-4 box-border overflow-hidden">
            
            {/* Sidebar Component */}
            <Sidebar />
            
            {/* Content Area:
               1. overflow-y-auto: Scroll ONLY vertically IF content exceeds height ("if needed").
               2. overflow-x-hidden: Prevent horizontal scrolling completely.
               3. w-full: Takes remaining width.
               4. h-full: Fills the flex container's available height.
            */}
            <div className="w-full md:w-[90%] bg-transparent h-full overflow-y-auto overflow-x-hidden rounded-3xl relative z-0">
              {children}
            </div>
          </div>
          
          {/* <ParticlesBackground id="particles" /> */}
        {/* </GameProvider>  */}

        <ToastContainer 
          position="top-right" 
          autoClose={2000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="dark"
        />
      </body>
    </html>
  );
}