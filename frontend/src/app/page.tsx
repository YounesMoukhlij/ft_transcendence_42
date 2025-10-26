'use client';

// Imports
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import './globals.css'; 

// Constants
const DEFAULT_PROFILE_IMAGE = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg';

/**
 * The main Home component (or Dashboard)
 */
export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  console.log("image url:", user?.profile_img);
  

  // 1. Client-Side Redirection Logic
  useEffect(() => {
    // Wait until Zustand has finished loading state from localStorage
    if (!hasHydrated) return;
    
    console.log("Home user:", user);

    // If no user object exists, redirect to sign-in page
    if (!user) {
      router.replace('/signIn');
    }
    
  }, [user, hasHydrated, router]);
  
  // Display loading or waiting for hydration
  if (!hasHydrated || !user) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
            <p>Loading user session...</p>
        </div>
    );
  }

  // 2. Logout Handler
  const handleLogout = () => {
    clearUser();
    // Clear the JWT token on logout
    localStorage.removeItem('jwt_token'); 
    router.replace('/signIn');
  };

  // 3. Render authenticated dashboard content
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 p-8 text-white">
      
      <div className="border border-gray-700 bg-gray-800 p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-400">Welcome to the Dashboard!</h1>
        
        <div className='flex flex-col items-center justify-center'>
            <img
                src={`http://localhost:4444` + user.profile_img || DEFAULT_PROFILE_IMAGE}
                alt="Profile"
                // width={150}
                // height={150}
                className=" w-32 h-32 sm:w-36 sm:h-36 rounded-full mx-auto mb-6 border-4 border-white object-cover"
            />
          
            <h2 className="text-3xl font-bold mb-4">{user.username}</h2>
            
            <div className="w-full space-y-2 text-left text-lg">
                <p><strong>Full Name:</strong> {user.fullname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id_user}</p>
                <p><strong>Languages:</strong> {user.languages || 'N/A'}</p>
                <p><strong>Bio:</strong> {user.bio || 'Not set.'}</p>
                
                <p className={`font-semibold ${user.is2FAEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
                    <strong>2FA Enabled:</strong> {user.is2FAEnabled ? 'Yes ✅' : 'No ⚠️'}
                </p>
                
                {/* Displaying token is for debugging/testing only */}
                <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap pt-2">
                    **Token:** {user.access_token ? user.access_token.substring(0, 30) + '...' : 'N/A'}
                </p>
                 <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap pt-2">
                    **Refresh Token:** {user.refresh_token ? user.refresh_token.substring(0, 30) + '...' : 'N/A'}
                </p>
            </div>
            
            <button 
                onClick={handleLogout}
                className="mt-8 w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition duration-300 shadow-md"
            >
                Logout
            </button>
        </div>
      </div>
    </div>
  );
}