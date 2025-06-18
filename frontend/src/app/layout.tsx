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
      <body>
        <Navbar />
        <div className="fullContainer">
          <Sidebar />
          <div className="child">
            {children}
          </div>
        </div>
        <ParticlesBackground id="particles" />
      </body>
    </html>
  );
}





