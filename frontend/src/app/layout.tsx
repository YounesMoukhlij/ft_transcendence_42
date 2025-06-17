'use client'; // kandiroha bash ngolo l NextJs had lcomponent ghadi tkhdm f client side w ghadi tcompila f browser --> client component

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Image from "next/image";
// import Loading from "./components/Loading";

import React  from "react";
import "./globals.css";



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <html lang="en">
      <body>
        <div className="fixed inset-0 -z-10">
          <Image
            src="/Background.png"
            alt="Background"
            fill
            quality={100}
            className="object-cover"
          />
        </div>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: "1rem" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}





