'use client'; // kandiroha bash ngolo l NextJs had lcomponent ghadi tkhdm f client side w ghadi tcompila f browser --> client component

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ParticlesBackground from "./components/ParticlesBackground";

import React  from "react";
import "./globals.css";



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Ping Pong Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-[100%] flex flex-col border-5 border-white">
        <Navbar />
        <div className="flex h-[90%] rounded-3xl gap-[10px] p-[10px] z-10 ">
          <Sidebar />
          <div className="w-[100%] md:w-[90%] bg-transparent ">
            {children}
          </div>
        </div>
        <ParticlesBackground id="particles" />
      </body>
    </html>
  );
}





