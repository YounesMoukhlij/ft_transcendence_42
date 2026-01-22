'use client';

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedClient from "./ProtectedClient";
import { useUserStore } from "@/store/userStore";

const logout = () => {
  document.cookie = 'auth_token=; Max-Age=0; path=/;';
  useUserStore.getState().clearUser();
  window.location.href = '/signIn';
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((state) => state.user);

  
  if (!user) {
    logout();
    return null;
  }

  return (
    <ProtectedClient>
      <div className="min-h-screen flex flex-col bg-transparent text-white">
        <Navbar />

        <div className="flex flex-1 pt-28 px-4 pb-4 gap-6 max-w-[98%] mx-auto w-full">
          <Sidebar />

          <main className="flex-1 w-full overflow-y-auto rounded-3xl bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </ProtectedClient>
  );
}
