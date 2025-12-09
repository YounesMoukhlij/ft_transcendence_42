'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from 'react-toastify'
import axios from 'axios'
import { useUserStore } from "../../store/userStore"

const API_URL = 'http://localhost:4444'

interface SignInFormProps {
  onToggle: () => void
}

export default function SignInForm({ onToggle }: SignInFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useUserStore((state) => state.setUser)
  
  // Refs to prevent StrictMode double execution
  const googleAuthEffectRef = useRef(false) 
  const fortyTwoAuthEffectRef = useRef(false)

  // 2FA State
  const [show2FAInput, setShow2FAInput] = useState(false)
  const [twoFACode, setTwoFACode] = useState('')
  const [tempUserId, setTempUserId] = useState<string | null>(null)

  // --- Helper: Fetch User Data (Shared by OAuth flows) ---
  const fetchUserData = async (token: string, isNewUser: string | null) => {
    try {
      // --- AXIOS REFACTOR: GET Request with Bearer Token ---
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      console.log('OAuth user data:', userData)
      
      setUser(userData, userData.refresh_token) 
      document.cookie = `auth_token=${userData.access_token}; path=/`;
      
      const message = isNewUser === 'true' 
        ? `Welcome ${userData.username}! Account created successfully.`
        : `Welcome back, ${userData.username}!`
      
      toast.success(message)
      router.push('/')
    } catch (err) {
      console.error('Failed to fetch user data:', err)
      toast.error('Failed to retrieve user information')
    }
  }

  // --- GOOGLE OAUTH EFFECT ---
  useEffect(() => {
    const userId = searchParams.get('userId')
    const authError = searchParams.get('error')
    const isNewUser = searchParams.get('isNewUser')
    const twoFARequired = searchParams.get('2fa_required')
    const token = searchParams.get('token')

    // Handle 2FA required from OAuth
    if (twoFARequired === 'true' && userId) {
      if (googleAuthEffectRef.current) return;
      googleAuthEffectRef.current = true;
      
      setTempUserId(userId);
      setShow2FAInput(true);
      toast.info('Please enter your 2FA code to complete login.');
      return;
    }

    if (!userId && !authError) return
    if (googleAuthEffectRef.current) return
    googleAuthEffectRef.current = true

    if (authError) {
      const errorMessages: Record<string, string> = {
        'no_code': 'Google authentication failed: No authorization code',
        'token_failed': 'Failed to exchange authorization code',
        'user_failed': 'Failed to retrieve user information',
        'auth_failed': 'Google authentication failed. Please try again.'
      }
      toast.error(errorMessages[authError] || 'An error occurred during authentication')
      return
    }

    if (userId && token) {
      fetchUserData(token, isNewUser)
    }
  }, [searchParams, router, setUser])

  
  // --- 42 OAUTH EFFECT ---
  useEffect(() => {
    const fortyTwoAuth = searchParams.get('42Auth')
    const userId = searchParams.get('userId')
    const isNewUser = searchParams.get('isNewUser')
    const authError = searchParams.get('error')
    const twoFARequired = searchParams.get('2fa_required')
    const token = searchParams.get('token')
    
    // Check !fortyTwoAuth to avoid conflict with google effect
    if (twoFARequired === 'true' && userId && !fortyTwoAuth) { 
      if (fortyTwoAuthEffectRef.current) return;
      fortyTwoAuthEffectRef.current = true;
      
      setTempUserId(userId);
      setShow2FAInput(true);
      return;
    }

    if (!fortyTwoAuth && !authError && !twoFARequired) return
    if (fortyTwoAuthEffectRef.current) return
    fortyTwoAuthEffectRef.current = true

    if (authError) {
      const errorMessages: Record<string, string> = {
        'no_code': '42 authentication failed: No authorization code',
        'token_failed': 'Failed to exchange authorization code',
        'user_failed': 'Failed to retrieve user information',
        'auth_failed': '42 authentication failed. Please try again.'
      }
      toast.error(errorMessages[authError] || 'An error occurred during authentication')
      return
    }

    if (fortyTwoAuth === 'success' && userId && token) {
      fetchUserData(token, isNewUser)
    }
  }, [searchParams, router, setUser])


  // --- HANDLERS ---
  const handleGoogleAuth = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  const handle42Auth = () => {
    window.location.href = `${API_URL}/auth/42`
  }

  const validateForm = () => {
    if (!username.trim() || !password) {
      const errorMessage = 'Both username and password are required'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }
    return true
  }

  // --- STANDARD LOGIN SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      // --- AXIOS REFACTOR: POST Login ---
      const response = await axios.post(`${API_URL}/login`, { 
        username: username.trim(), 
        password: password 
      })

      const data = response.data

      // Check if 2FA is triggered
      if (data.twoFA_required) {
        setTempUserId(data.userId.toString())
        setShow2FAInput(true)
        setPassword('')
        setError('')
      } else {
        // Successful Standard Login
        console.log('Login response data:', data.user)
        if (data.user) {
          setUser(data.user) 
          document.cookie = `auth_token=${data.user.access_token}; path=/`;
        }
        toast.success('Login successful!')
        setUsername('')
        setPassword('')
        setError('')
        router.push('/')
      }
      
    } catch (error: any) {
      console.error('Network error during login:', error)
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // --- 2FA VERIFY SUBMIT ---
  const handle2FALoginVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFACode || twoFACode.length < 6 || !tempUserId) {
      const msg = 'Please enter a valid 6-digit code.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // --- AXIOS REFACTOR: POST 2FA Verify ---
      const response = await axios.post(`${API_URL}/2fa/login-verify`, {
        userId: parseInt(tempUserId),
        token: twoFACode
      })

      const data = response.data

      if (!data.success) {
        throw new Error(data.message || 'Invalid 2FA code')
      }

      if (data.user) {
        setUser(data.user);
        document.cookie = `auth_token=${data.user.access_token}; path=/`;
      }

      toast.success('Login successful!');
      setTwoFACode('');
      setTempUserId(null);
      setShow2FAInput(false);
      setError('');
      router.push('/')

    } catch (error: any) {
      console.error('Network error during 2FA login:', error);
      const errorMessage = error.response?.data?.message || 'Invalid 2FA code. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER: 2FA FORM ---
  if (show2FAInput) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center bg-amber-400">
        <div className='flex flex-col gap-2 sm:gap-3 items-center justify-center text-center'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
            Verify Your Identity
          </h1>
          <h2 className='text-sm sm:text-base md:text-lg text-center max-w-md lg:max-w-lg'>
            Open your Google Authenticator app and enter the 6-digit code.
          </h2>
        </div>
        
        <form 
          className='w-full gap-4 sm:gap-6 flex flex-col items-center justify-center'
          onSubmit={handle2FALoginVerify}
        >
          <input 
            type="text" 
            name="2fa-code"
            placeholder='XXXXXX'
            maxLength={6}
            className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out text-center tracking-[0.5em]' 
            value={twoFACode}
            disabled={isLoading}
            onChange={(e) => {
              setTwoFACode(e.target.value.replace(/[^0-9]/g, '')) 
              if (error) setError('')
            }}
          />
          
          {error && (
            <div className="w-full text-center text-red-500 text-sm bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center w-full'>
            <button 
              type="submit"
              disabled={isLoading || twoFACode.length < 6}
              className={`w-full p-3 sm:p-4 rounded-2xl transition-all duration-300 ease-in-out text-sm sm:text-base ${
                isLoading || twoFACode.length < 6
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-100 text-black hover:bg-gray-400 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer'
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          
          <div className='flex gap-2 items-center justify-center'>
            <h3 
              className='text-xs sm:text-sm text-gray-500 hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer'
              onClick={() => {
                setShow2FAInput(false);
                setTempUserId(null);
                setError('');
                setPassword('');
              }}
            > 
              Back to login
            </h3>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER: STANDARD LOGIN FORM ---
  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <div className='flex flex-col gap-2 sm:gap-3 items-center justify-center text-center'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
          Hey there, space champ!
        </h1>
        <h2 className='text-sm sm:text-base md:text-lg text-center max-w-md lg:max-w-lg'>
          Join GalaxyPong to smash, chat, and climb the leaderboard.
        </h2>
        <h2 className='text-sm sm:text-base md:text-lg text-center max-w-md lg:max-w-lg'>
          Sign in and let the games begin!
        </h2>
      </div>
      
      <form 
        className='w-full gap-4 sm:gap-6 flex flex-col items-center justify-center'
        onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          name="username"
          placeholder='Username' 
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          value={username}
          disabled={isLoading}
          onChange={(e) => {
            setUsername(e.target.value)
            if (error) setError('')
          }}
        />
        
        <input 
          type="password" 
          name="password"
          placeholder='Password' 
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          value={password}
          disabled={isLoading}
          onChange={(e) => {
            setPassword(e.target.value)
            if (error) setError('')
          }}
        />
        
        <div className='flex items-start w-full'>
          <h3 className='text-xs sm:text-sm text-gray-500 hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer'
              onClick={() => router.push('/forgot-password')}
            >
            Forgot your password?
          </h3>
        </div>
        
        {error && (
          <div className="w-full text-center text-red-500 text-sm bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center w-full'>
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 sm:p-4 rounded-2xl transition-all duration-300 ease-in-out text-sm sm:text-base ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-100 text-black hover:bg-gray-400 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Login'}
          </button>
          
          <div className='flex gap-2 w-full sm:w-auto'>
            {/* Google Button */}
            <button 
              type="button"
              disabled={isLoading}
              onClick={handleGoogleAuth}
              className='w-1/2 sm:w-12 lg:w-16 p-3 sm:p-4 rounded-2xl bg-gray-100 transition-all duration-300 ease-in-out text-black flex items-center justify-center gap-2 hover:bg-gray-400 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.90 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
                <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
                <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
                <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
              </svg>
            </button>
            
            {/* 42 Button */}
            <button 
              type="button"
              disabled={isLoading}
              onClick={handle42Auth}
              className="w-1/2 sm:w-12 lg:w-16 p-3 sm:p-4 rounded-2xl bg-gray-100 transition-all duration-300 ease-in-out text-black flex items-center justify-center gap-2 hover:bg-gray-400 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 -200 960 960" width="20" height="20" className="sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
                <polygon points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1 32,279.1" />
                <polygon points="597.9,114.2 762.7,-51.1 597.9,-51.1" />
                <polygon points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1" />
                <polygon points="928,279.1 762.7,443.9 928,443.9" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className='flex gap-2 items-center justify-center'>
          <h3 className='text-xs sm:text-sm text-gray-500'>
            Don&apos;t have an account?
          </h3>
          <h3 
            className='text-xs sm:text-sm hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer'
            onClick={onToggle}
          > 
            Sign up
          </h3>
        </div>
      </form>
    </div>
  )
}