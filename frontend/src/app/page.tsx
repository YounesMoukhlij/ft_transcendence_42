'use client';

// import type { Metadata } from "next";

import './globals.css'
import {useUserStore} from '../store/userStore';
import { useEffect } from 'react';



export default function Home()
{
  const { user } = useUserStore();
  const data = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("Home user:", user);
  }, [data, user]);

  return (

    <div className="text-white border">
      <h1>This is the opening Page</h1>
      <p>Welcome to the dashboard page!</p>
      <p>Click on the sidebar to navigate.</p>
      <p>Use the navbar for additional options.</p>
      <p>Enjoy your stay!</p>
      {data ? (
        <div className='text-center text-red-500 text-3xl'>
          <p>Username: {data.username}</p>
          <p>Email: {data.email}</p>
          <img src={data.profile_img} alt="Profile Image" />
        </div>
      ) : (
        <p>No user is logged in.</p>
      )}
    </div>
  );
}