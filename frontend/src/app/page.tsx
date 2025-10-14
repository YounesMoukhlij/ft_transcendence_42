'use client';

// import type { Metadata } from "next";

import './globals.css'
import {useUserStore} from '../store/userStore';

const Def = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg'


export default function Home()
{
  const user = useUserStore((state) => state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  console.log("Home user:", user);
  if (!user) {
    // window.location.href = '/signIn'; // Redirect to /signin if no user is found
    return null;
  }

  return (

    <div className="text-white border">
      <h1>This is the opening Page</h1>
      <p>Welcome to the dashboard page!</p>
      <p>Click on the sidebar to navigate.</p>
      <p>Use the navbar for additional options.</p>
      <p>Enjoy your stay!</p>
      {user ? (
        <div className='text-center text-red-500 text-3xl'>
         
          <img
            src={user.profile_img || Def}
            alt="Profile Image"
            width={150}
            height={150}
            className="rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">User Information</h2>
          <p>Username: {user.username}</p>
          <p>Full Name: {user.fullname}</p>
          {/* 2fa */}
          <p>2FA Enabled: {user.is2FAEnabled ? 'Yes' : 'No'}</p>
          <p>Email: {user.email}</p>
          <p>ID: {user.id_user}</p>
          <p>Languages: {user.languages}</p>
          <p>Bio: {user.bio}</p>
          <button 
            onClick={() => {
              clearUser();
              console.log("User after clearing:", useUserStore.getState().user);
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>No user is logged in.</p>
      )}
    </div>
  );
}