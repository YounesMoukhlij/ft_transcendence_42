'use client';

// import type { Metadata } from "next";

import './globals.css'
// import useUserStore from '../store/useUserStore';



export default function Home()
{
  // get user from localStorage
  // const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  // console.log('User from localStorage:', user);
  // const parsedUser = user ? JSON.parse(user) : null;
  // const user = useUserStore((state: { user: string }) => state.user);
  // console.log('User from Zustand store:', user);
  return (

    <div className="text-white border">
      <h1>This is the opening Page</h1>
      <p>Welcome to the dashboard page!</p>
      <p>Click on the sidebar to navigate.</p>
      <p>Use the navbar for additional options.</p>
      <p>Enjoy your stay!</p>
      <h1 className="text-3xl font-bold underline text-red-500">
        {/* {user} */}
      </h1>
    </div>
  );
}