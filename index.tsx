<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Flipping coin on table (CSS)</title>
<style>
  :root{
    --table-color: #6b4f2b; /* wood */
    --coin-size: 120px;
    --coin-thickness: 12px;
    --shadow-size: 160px;
  }

  body {// ============================================================================
// IMPORTS & CONFIGURATION
// ============================================================================
'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from 'react-toastify'
import axios from 'axios' // Replaced fetch with axios
import '../globals.css'
import { useUserStore } from "../../store/userStore"

// Define API Base URL
const API_URL = 'http://localhost:4444'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface AuthFormProps {
  onToggle: () => void
}

// ============================================================================
// MAIN COMPONENT: AUTH LAYOUT
// ============================================================================

export default function AuthLayout() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure component only renders on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check URL path to determine initial state (Sign In vs Sign Up)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setIsSignUp(path.includes('signUp'))
    }
  }, [])

  // Toggle between Sign In and Sign Up modes with URL update
  const toggleAuthMode = (mode: 'signIn' | 'signUp') => {
    setIsSignUp(mode === 'signUp')
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/${mode}`)
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="relative flex min-h-screen w-full">
        
        {/* Animated Background / Decoration (Hidden on mobile) */}
        <motion.div
          className="hidden md:block absolute w-1/2 h-screen z-10"
          initial={false}
          animate={{ left: isSignUp ? '50%' : '0%' }}
          transition={{ type: "spring", stiffness: 150, damping: 20, duration: 1 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {/* Background content or 3D elements can go here */}
          </div>
        </motion.div>

        {/* Sign In Form Container */}
        <motion.div
          className="absolute w-full md:w-1/2 h-screen flex items-center justify-center z-20"
          initial={false}
          animate={{
            right: isSignUp ? '50%' : '0%',
            y: isSignUp ? '100vh' : '0vh',
            opacity: isSignUp ? 0 : 1
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20, duration: 1, opacity: { duration: 0.5 } }}
          style={{ pointerEvents: isSignUp ? 'none' : 'auto' }}
        >
          <div className="w-full max-w-md px-4">
            <SignInForm onToggle={() => toggleAuthMode('signUp')} />
          </div>
        </motion.div>

        {/* Sign Up Form Container */}
        <motion.div
          className="absolute w-full md:w-1/2 h-screen flex items-center justify-center z-20"
          initial={false}
          animate={{
            left: isSignUp ? '0%' : '50%',
            y: isSignUp ? '0vh' : '-100vh',
            opacity: isSignUp ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20, duration: 1, opacity: { duration: 0.5 } }}
          style={{ pointerEvents: isSignUp ? 'auto' : 'none' }}
        >
          <div className="w-full max-w-md px-4">
            <SignUpForm onToggle={() => toggleAuthMode('signIn')} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: SIGN UP FORM
// ============================================================================

function SignUpForm({ onToggle }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData
    
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      const msg = 'All fields are required'
      setError(msg)
      toast.error(msg)
      return false
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match'
      setError(msg)
      toast.error(msg)
      return false
    }

    if (password.length < 8) {
      const msg = 'Password must be at least 8 characters long'
      setError(msg)
      toast.error(msg)
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const msg = 'Please enter a valid email address'
      setError(msg)
      toast.error(msg)
      return false
    }

    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const { confirmPassword, ...userData } = formData
      
      // REPLACED FETCH WITH AXIOS
      await axios.post(`${API_URL}/AddUser`, {
        username: userData.username.trim(),
        email: userData.email.trim(),
        password: userData.password
      })

      // If successful (axios throws on error status codes automatically)
      toast.success('Account created successfully! Please sign in.') 
      setFormData({ username: '', email: '', password: '', confirmPassword: '' })
      
      onToggle()
      router.push('/signIn')
      
    } catch (error: any) {
      console.error('Error during sign up:', error)
      const errorMessage = error.response?.data?.message || 'Failed to create user'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <div className='flex flex-col gap-2 sm:gap-3 items-center justify-center text-center'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold'>
          Welcome to the Sign Up Page
        </h2>
        <p className='text-sm sm:text-base md:text-lg'>
          Please fill in the details below to create an account.
        </p>
      </div>
      
      <form 
        className='w-full gap-4 sm:gap-6 flex flex-col items-center justify-center'
        onSubmit={handleSignUp}
      >
        <input 
          type="text" 
          placeholder='Username'
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          disabled={isLoading}
          value={formData.username}
          onChange={handleInputChange('username')}
        />
        
        <input 
          type="email" 
          placeholder='Email'
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          disabled={isLoading}
          value={formData.email}
          onChange={handleInputChange('email')}
        />
        
        <input 
          type="password" 
          placeholder='Password'
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          disabled={isLoading}
          value={formData.password}
          onChange={handleInputChange('password')}
        />
        
        <input
          type='password'
          placeholder='Confirm Password'
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out'
          disabled={isLoading}
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
        />

        {error && (
          <div className="w-full text-center text-red-500 text-sm bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full p-3 sm:p-4 rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out ${
            isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gray-500 hover:bg-gray-400'
          }`}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <div className='flex gap-2 items-center justify-center'>
          <h3 className='text-xs sm:text-sm text-gray-500'>
            Already have an account? 
          </h3>
          <h3 
            className='text-xs sm:text-sm hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer'
            onClick={onToggle}
          > 
            Sign In
          </h3>
        </div>
      </form>
    </div>
  )
}

// ============================================================================
// COMPONENT: SIGN IN FORM
// ============================================================================

function SignInForm({ onToggle }: AuthFormProps) {
  // --- STATE ---
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // --- 2FA STATE ---
  const [show2FAInput, setShow2FAInput] = useState(false)
  const [twoFACode, setTwoFACode] = useState('')
  const [tempUserId, setTempUserId] = useState<string | null>(null)

  // --- HOOKS ---
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useUserStore((state) => state.setUser)
  
  // Refs to prevent double execution in Strict Mode
  const googleAuthEffectRef = useRef(false) 
  const fortyTwoAuthEffectRef = useRef(false)

  // --- OAUTH CALLBACK HANDLER (GOOGLE) ---
  useEffect(() => {
    const userId = searchParams.get('userId')
    const authError = searchParams.get('error')
    const isNewUser = searchParams.get('isNewUser')
    const twoFARequired = searchParams.get('2fa_required')
    const token = searchParams.get('token')

    // Handle 2FA requirement immediately
    if (twoFARequired === 'true' && userId) {
      if (googleAuthEffectRef.current) return;
      googleAuthEffectRef.current = true;
      
      setTempUserId(userId);
      setShow2FAInput(true);
      toast.info('Please enter your 2FA code to complete login.');
      return;
    }

    if (!userId && !authError) return;
    if (googleAuthEffectRef.current) return;
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

    // Fetch user data if login successful (no 2FA)
    if (userId) {
      const fetchUserData = async () => {
        try {
          // REPLACED FETCH WITH AXIOS
          const response = await axios.get(`${API_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const userData = response.data
          console.log('Google OAuth user data:', userData)
          
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

      fetchUserData()
    }
  }, [searchParams, router, setUser])

  // --- OAUTH CALLBACK HANDLER (42) ---
  useEffect(() => {
    const fortyTwoAuth = searchParams.get('42Auth')
    const userId = searchParams.get('userId')
    const isNewUser = searchParams.get('isNewUser')
    const authError = searchParams.get('error')
    const twoFARequired = searchParams.get('2fa_required')
    const token = searchParams.get('token')
    
    // Handle 2FA requirement
    if (twoFARequired === 'true' && userId && !fortyTwoAuth) {
      if (fortyTwoAuthEffectRef.current) return;
      fortyTwoAuthEffectRef.current = true;
      
      setTempUserId(userId);
      setShow2FAInput(true);
      return;
    }

    if (!fortyTwoAuth && !authError && !twoFARequired) return;
    if (fortyTwoAuthEffectRef.current) return;
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

    // Fetch user data if login successful
    if (fortyTwoAuth === 'success' && userId) {
      const fetchUserData = async () => {
        try {
          // REPLACED FETCH WITH AXIOS
          const response = await axios.get(`${API_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const userData = response.data
          console.log('42 OAuth user data:', userData)
          
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

      fetchUserData()
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
      const msg = 'Both username and password are required'
      setError(msg)
      toast.error(msg)
      return false
    }
    return true
  }

  // --- HANDLER: STANDARD LOGIN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      // REPLACED FETCH WITH AXIOS
      const response = await axios.post(`${API_URL}/login`, { 
        username: username.trim(), 
        password: password 
      })

      const data = response.data

      // Check for 2FA Requirement from backend
      if (data.twoFA_required) {
        setTempUserId(data.userId.toString());
        setShow2FAInput(true);
        setPassword(''); // Clear sensitive data
        setError('');
      } else {
        // Standard Success Flow
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

  // --- HANDLER: 2FA VERIFICATION ---
  const handle2FALoginVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFACode || twoFACode.length < 6 || !tempUserId) {
      setError('Please enter a valid 6-digit code.');
      toast.error('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // REPLACED FETCH WITH AXIOS
      const response = await axios.post(`${API_URL}/2fa/login-verify`, { 
        userId: parseInt(tempUserId), 
        token: twoFACode 
      });

      const data = response.data;

      // 2FA Success Flow
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

  // --- RENDER: 2FA INPUT FORM ---
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
              setTwoFACode(e.target.value.replace(/[^0-9]/g, '')) // Only allow numbers
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
            {/* GOOGLE AUTH BUTTON */}
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
                <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(#8aa, #6a9);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  }

  /* Table surface */
  .table {
    width: 80%;
    max-width: 900px;
    height: 420px;
    background: linear-gradient(180deg, var(--table-color), #4e3621 60%);
    border-radius: 12px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.45), inset 0 6px 18px rgba(255,255,255,0.03);
    display: flex;
    align-items: center;
    justify-content: center;

    /* perspective so coin has proper 3D */
    perspective: 1200px;
    position: relative;
    overflow: hidden;
  }

  /* optional table grain lines */
  .table::after {
    content:"";
    position:absolute;
    inset:0;
    background-image:
      linear-gradient(transparent 40%, rgba(255,255,255,0.02) 41%, transparent 42%),
      linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
    background-size: 100% 30px, 60px 100%;
    opacity: 0.08;
    pointer-events: none;
  }

  /* coin container to position on table surface */
  .coin-wrap {
    width: var(--coin-size);
    height: calc(var(--coin-size) + var(--coin-thickness));
    position: relative;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    cursor: pointer;
  }

  /* shadow on table */
  .coin-shadow {
    position: absolute;
    left: 50%;
    top: calc(50% + 36px);
    transform: translateX(-50%);
    width: var(--shadow-size);
    height: 18px;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, transparent 70%);
    filter: blur(12px);
    opacity: 0.9;
    transition: transform 400ms ease, opacity 400ms ease;
    pointer-events: none;
  }

  /* the coin - thin cylinder with 2 faces */
  .coin {
    width: var(--coin-size);
    height: var(--coin-size);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    transform-style: preserve-3d;
    perspective: 800px;
  }

  .coin .face {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    backface-visibility: hidden;
    border-radius: 50%;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35), inset 0 -6px 14px rgba(255,255,255,0.06);
    font-weight: 700;
    font-size: 34px;
    color: #222;
    user-select: none;
  }

  .coin .heads {
    background: radial-gradient(circle at 30% 30%, #ffd966, #f0b32a 60%);
    transform: translateZ(calc(var(--coin-thickness) / 2));
  }

  .coin .tails {
    background: radial-gradient(circle at 70% 70%, #f6f6f6, #dfe6e9 60%);
    transform: rotateY(180deg) translateZ(calc(var(--coin-thickness) / 2));
  }

  /* thin edge to simulate thickness */
  .coin .edge {
    position: absolute;
    width: calc(var(--coin-thickness));
    height: calc(var(--coin-size) - 6px);
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) rotateX(90deg) translateZ(calc(var(--coin-size)/2 - var(--coin-thickness)/2));
    transform-origin: center;
    border-radius: calc(var(--coin-thickness) / 2);
    background: linear-gradient(90deg,#c9a43d,#8b6b2b);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
  }

  /* continuous spin */
  .spin .coin-wrap { animation: spinY 1.8s linear infinite; }
  @keyframes spinY {
    from { transform: rotateX(8deg) rotateY(0); }
    to   { transform: rotateX(8deg) rotateY(360deg); }
  }

  /* flip animation (one-time when class .flipping is added) */
  .coin-wrap.flipping {
    animation: flipAnim 1s cubic-bezier(.25,.9,.2,1) forwards;
  }
  @keyframes flipAnim {
    0% {
      transform: translateY(0) rotateX(8deg) rotateY(0);
    }
    40% {
      transform: translateY(-40px) rotateX(70deg) rotateY(540deg);
    }
    70% {
      transform: translateY(-10px) rotateX(20deg) rotateY(720deg);
    }
    100% {
      transform: translateY(0) rotateX(8deg) rotateY(720deg);
    }
  }

  /* while flipping reduce shadow and shift it */
  .coin-wrap.flipping ~ .coin-shadow {
    transform: translateX(-50%) scale(0.6);
    opacity: 0.45;
  }

  /* small hover hint */
  .coin-wrap:hover { transform: translateY(-6px) rotateX(8deg); transition: transform 160ms ease; }

  /* responsive smaller coin */
  @media (max-width:600px){
    :root{ --coin-size: 88px; --shadow-size: 120px; }
    .table{ height: 320px; }
  }
</style>
</head>
<body>
  <div class="table" aria-label="Wood table surface">
    <!-- coin + wrap -->
    <div class="coin-wrap" id="coin" title="Click to flip or press 's' to toggle spin">
      <div class="coin">
        <div class="face heads">H</div>
        <div class="face tails">T</div>
        <div class="edge" aria-hidden="true"></div>
      </div>
    </div>

    <!-- shadow on table -->
    <div class="coin-shadow" id="shadow" aria-hidden="true"></div>
  </div>

<script>
  // JS: click to flip once; press 's' to toggle continuous spin.
  const coinWrap = document.getElementById('coin');
  const table = document.querySelector('.table');

  let flipping = false;
  coinWrap.addEventListener('click', () => {
    if (flipping) return; // avoid double-trigger
    flipping = true;
    // add flipping class which has the keyframes animation
    coinWrap.classList.add('flipping');

    // remove flipping class after animation ends so it can be replayed
    setTimeout(() => {
      coinWrap.classList.remove('flipping');
      flipping = false;
      // leave final rotated state consistent with number of rotations (we rotate 720deg -> 2 full turns)
      // no extra action required; animation brings it back to same orientation as start
    }, 1050);
  });

  // toggle continuous spin with keyboard 's' or double click
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') toggleSpin();
  });
  coinWrap.addEventListener('dblclick', toggleSpin);

  function toggleSpin(){
    table.classList.toggle('spin');
  }

  // accessibility: allow Enter/Space to flip when coin has focus
  coinWrap.tabIndex = 0;
  coinWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      coinWrap.click();
    }
  });
</script>
</body>
</html>
