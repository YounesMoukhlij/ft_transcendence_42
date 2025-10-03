'use client'
import React, { useState, useRef } from 'react'
import { Camera, Save, User, Mail, Lock, FileText, Globe, ChevronDown } from 'lucide-react'

interface UserData {
  id_user: number
  username: string
  fullname: string | null
  bio: string | null
  profile_img: string
  email: string
  langue: string
  auth_method: number
}

interface LanguageOption {
  id: string
  label: string
  flag: string
}

const ProfileSettingsPage = () => {
  const initialUser: UserData = {
    id_user: 15,
    username: "test",
    fullname: null,
    bio: null,
    profile_img: "https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg",
    email: "tes@mail.m",
    langue: "en",
    auth_method: 0,
  }

  const languages: LanguageOption[] = [
    { id: 'en', label: 'En', flag: '🇬🇧' },
    { id: 'es', label: 'Es', flag: '🇪🇸' },
    { id: 'tz', label: 'Tz', flag: 'ⵣ' },
    { id: 'fr', label: 'Fr', flag: '🇫🇷' },
  ]

  const isPasswordAuth = 0 === initialUser.auth_method

  return (
    <div className='min-h-screen w-full  p-4 sm:p-6 lg:p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-6 sm:mb-8'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold  mb-2'>
            Account Settings
          </h1>
          <p className='text-sm sm:text-base '>
            Manage your profile and preferences
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='bg-gray-500 p-6 sm:p-8 flex justify-center'>
            <div 
              className='relative group cursor-pointer'
              // onClick={}
            >
              <img 
                src={initialUser.profile_img} 
                alt="Profile" 
                className='w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:opacity-75 transition-all duration-300'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Camera size={32} className='text-white' />
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className='p-6 sm:p-8 lg:p-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 '>
              <div className='lg:col-span-2  '>
                <label className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'>
                  <Globe size={18} />
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                   
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none text-gray-900 appearance-none bg-white cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.flag} {lang.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div>
                <label htmlFor="username" className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'>
                  <User size={18} />
                  Username
                </label>
                <input 
                  type="text" 
                  id="username" 
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900'
                 
                />
              </div>

              <div>
                <label htmlFor="fullname" className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'>
                  <User size={18} />
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="fullname" 
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900'
                 
                  placeholder="Enter your full name"
                />
              </div>

              <div className='lg:col-span-2'>
                <label htmlFor="email" className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'>
                  <Mail size={18} />
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900'
                  
                />
              </div>

              <div className='lg:col-span-2'>
                <label htmlFor="bio" className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'>
                  <FileText size={18} />
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-900'
                 
                  placeholder="Tell us about yourself..."
                />
              </div>

          
                  <div>
                    <label htmlFor="password" className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'>
                      <Lock size={18} />
                      New Password
                    </label>
                    <input 
                      type="password" 
                      id="password" 
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900'
                     
                      placeholder="Password"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'>
                      <Lock size={18} />
                      Confirm Password
                    </label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900'
                
                      placeholder="Confirmed password"
                    />
                  </div>
            </div>
            <div className='mt-6 text-right'>
              <button
                type="button"
                className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all'
                >
              
                Save Changes
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsPage