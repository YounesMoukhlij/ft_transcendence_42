'use client'
import React, { useState } from 'react'
import { Camera } from 'lucide-react'

const ProfileSettingsPage = () => {
  const [user, setUser] = useState({
    idUser: 1,
    username: 'li kwak',
    email: 'likwak@9alwa.com',
    password: '',
    confirmPassword: '',
    bio: 'Li 3waj ngado zaml boh',
    profile: 'avatar'
  });

  

  const handleSaveChanges = () => {
    // Add your save logic here
    console.log('Saving user data:', user);
  };

  return (
    <div className='p-4 w-full h-full flex flex-col gap-4 justify-center items-center'>
      <div className='w-full max-w-2xl p-6 bg-gray-400 rounded-lg shadow-md flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-black'>Settings</h1>
          <p className='text-black'>Manage your account settings here.</p>
        </div>
        

        <div className='flex flex-col gap-2 bg-red-500 rounded-md w-1/2'>
        <div className=''>
          {/* Clickable Avatar with Camera Overlay */}
          <div 
            className='relative w-24 h-24 mb-4 cursor-pointer'
            // onClick={}
          >
            <img 
              src={user.profile} 
              alt="Profile" 
              className='w-24 h-24 rounded-full object-cover border-2 group-hover:opacity-75 transition-opacity duration-200'
            />
            {/* Camera Overlay */}
            <div className='absolute inset-0 flex items-center justify-center bg-opacity-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              <input type="file" className="absolute inset-0 rounded-full opacity-0" />
              <Camera size={24} className='text-black' />
            </div>
          </div>
        </div>

          <label htmlFor="username" className='block text-sm font-medium text-black'>Username</label>
          <input 
            type="text" 
            id="username" 
            className='mt-1 p-2 w-full border rounded-md text-black'
            value={user.username}
            onChange={(e) => setUser(prev => ({ ...prev, username: e.target.value }))}
          />
          
          <label htmlFor="email" className='block text-sm font-medium text-black'>Email</label>
          <input 
            type="email" 
            id="email" 
            className='mt-1 p-2 w-full border rounded-md text-black'
            value={user.email}
            onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
          />

          <label htmlFor="bio" className='block text-sm font-medium text-black'>Bio</label>
          <textarea
            id="bio"
            className='mt-1 p-2 w-full border rounded-md text-black'
            value={user.bio}
            onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
          />

          <label htmlFor="password" className='block text-sm font-medium text-black'>Password</label>
          <input 
            type="password" 
            id="password" 
            className='mt-1 p-2 w-full border rounded-md text-black'
            value={user.password}
            onChange={(e) => setUser(prev => ({ ...prev, password: e.target.value }))}
          />
          
          <label htmlFor="confirm-password" className='block text-sm font-medium text-black'>Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password" 
            className='mt-1 p-2 w-full border rounded-md text-black'
            value={user.confirmPassword}
            onChange={(e) => setUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </div>
        
        <div className='mt-6 text-center'>
          <button 
          className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800'
          onClick={handleSaveChanges}
          >Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsPage