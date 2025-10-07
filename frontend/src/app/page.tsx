'use client';

// import type { Metadata } from "next";

import './globals.css'
import {useUserStore} from '../store/userStore';
import { useEffect } from 'react';



export default function Home()
{
 const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  
  return (

    <div className="text-white border">
      <h1>This is the opening Page</h1>
      <p>Welcome to the dashboard page!</p>
      <p>Click on the sidebar to navigate.</p>
      <p>Use the navbar for additional options.</p>
      <p>Enjoy your stay!</p>
      {user ? (
        <div className='text-center text-red-500 text-3xl'>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <img src={user.profile_img} alt="Profile Image" />
        </div>
      ) : (
        <p>No user is logged in.</p>
      )}
    </div>
  );
}