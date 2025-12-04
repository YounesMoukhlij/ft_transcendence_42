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
         2. overflow-hidden: Prevent the whole page from scrolling (we scroll inner content instead)
      */}
      <body className="h-screen bg-black overflow-hidden text-white">
        <GameProvider>
          {/* Navbar is fixed (z-50), so it sits on top of everything */}
          <Navbar />
          
          {/* Main Container:
             1. pt-24 md:pt-28: Adds TOP padding to account for the fixed Navbar height. 
                This prevents content from being hidden behind the navbar.
             2. h-full: Fills the screen height.
             3. flex: Positions Sidebar and Content side-by-side.
          */}
          <div className="flex h-full pt-24 md:pt-28 gap-4 p-4 box-border">
            
            {/* Sidebar Component */}
            <Sidebar />
            
            {/* Content Area:
               1. overflow-y-auto: Only this part scrolls.
               2. w-full: Takes remaining width.
               3. relative z-0: Ensures it stays behind any dropdowns/modals.
            */}
            <div className="w-full md:w-[90%] bg-transparent h-full overflow-y-auto rounded-3xl relative z-0 no-scrollbar">
              {children}
            </div>
          </div>
          
          {/* <ParticlesBackground id="particles" /> */}
        </GameProvider> 

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