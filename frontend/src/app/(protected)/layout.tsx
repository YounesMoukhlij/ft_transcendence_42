import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { GameProvider } from "../../components/GameContext";
import { LanguageProvider } from "../../contexts/LanguageContext";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <LanguageProvider>
      <GameProvider>
        <Navbar />
        <div className="flex h-[90%] rounded-3xl gap-[10px] p-[10px] z-10 ">
          <Sidebar />
          <div className="w-[100%] md:w-[90%] bg-transparent ">
            {children}
          </div>
        </div>
      </GameProvider>
    </LanguageProvider>
  );
}


