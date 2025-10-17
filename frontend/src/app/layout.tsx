// 'use client'; // kandiroha bash ngolo l NextJs had lcomponent ghadi tkhdm f client side w ghadi tcompila f browser --> client component

import ParticlesBackground from "../components/ParticlesBackground";
// import SignInUp from "./Auth/page";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      <body className="h-[100vh] bg-black">
        <div className="h-full bg-transparent ">
          {children}
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
      </body>
    </html>
  );
}





