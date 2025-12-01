'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from 'react-toastify'
import '../globals.css'
//zustand or recoil
import { useUserStore } from "../../store/userStore"
import { getBackendURL } from "../../lib/utils"

export default function AuthLayout() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setIsSignUp(path.includes('signUp'))
    }
  }, [])

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

        <motion.div
          className="hidden md:block absolute w-1/2 h-screen z-10"
          initial={false}
          animate={{ left: isSignUp ? '50%' : '0%' }}
          transition={{ type: "spring", stiffness: 150, damping: 20, duration: 1 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {/* <FlyingSaucer /> */}
          </div>
        </motion.div>

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

interface SignUpFormProps {
  onToggle: () => void
}

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

function SignUpForm({ onToggle }: SignUpFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // const setUser = useUserStore((state) => state.setUser) // Not needed here, user state is set on sign-in

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      const errorMessage = 'All fields are required'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }

    if (password !== confirmPassword) {
      const errorMessage = 'Passwords do not match'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }

    if (password.length < 8) {
      const errorMessage = 'Password must be at least 8 characters long'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const errorMessage = 'Please enter a valid email address'
      setError(errorMessage)
      toast.error(errorMessage)
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

      const response = await fetch(`${getBackendURL()}/AddUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username.trim(),
          email: userData.email.trim(),
          password: userData.password
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMessage = data.message || 'Failed to create user'
        setError(errorMessage)
        toast.error(errorMessage)
        return
      }

      // No need to set the user state here; they must sign in first.
      toast.success('Account created successfully! Please sign in.')
      setFormData({ username: '', email: '', password: '', confirmPassword: '' })

      onToggle()
      setTimeout(() => {
        router.push('/signIn')
      }, 1500)

    } catch (error: any) {
      console.error('Error during sign up:', error)
      console.error('Attempted backend URL:', getBackendURL())

      // Handle network errors specifically
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        const errorMessage = 'Request timed out. Please check your connection and try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const backendUrl = getBackendURL()
        const errorMessage = `Cannot connect to server at ${backendUrl}. Please ensure:
1. The backend is running
2. The backend is accessible from your network
3. No firewall is blocking the connection`
        setError(errorMessage)
        toast.error('Cannot connect to server. Check console for details.')
      } else {
        const errorMessage = 'An unexpected error occurred. Please try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
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

interface SignInFormProps {
  onToggle: () => void
}

function SignInForm({ onToggle }: SignInFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useUserStore((state) => state.setUser)

  // Ref to prevent OAuth effects from running twice in Strict Mode
  const googleAuthEffectRef = useRef(false)
  const fortyTwoAuthEffectRef = useRef(false)


  // Handle Google OAuth callback
  useEffect(() => {
    const userId = searchParams.get('userId')
    const authError = searchParams.get('error')
    const isNewUser = searchParams.get('isNewUser')

    // Skip if no OAuth parameters present
    if (!userId && !authError) {
      return
    }

    // Prevents double execution in React Strict Mode (Dev)
    if (googleAuthEffectRef.current) {
      return
    }
    googleAuthEffectRef.current = true

    if (authError) {
      const errorMessages: Record<string, string> = {
        'no_code': 'Google authentication failed: No authorization code',
        'token_failed': 'Failed to exchange authorization code',
        'user_failed': 'Failed to retrieve user information',
        'auth_failed': 'Google authentication failed. Please try again.'
      }
      toast.error(errorMessages[authError] || 'An error occurred during authentication')
      // Clean URL
      router.replace('/signIn')
      return
    }

    if (userId) {
      // Fetch user data from backend using the ID
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${getBackendURL()}/getUserById/${userId}`, {
            signal: AbortSignal.timeout(10000) // 10 second timeout
          })

          if (!response.ok) {
            toast.error('Failed to retrieve user data')
            router.replace('/signIn')
            return
          }

          const userData = await response.json()

          console.log('Google OAuth user data:', userData)

          // Update global user state (Zustand)
          setUser(userData, userData.refresh_token) //
          // set auth_token cookie? (handled in middleware)
          document.cookie = `auth_token=${userData.access_token}; 4`;

          // Display success message based on whether user is new
          const message = isNewUser === 'true'
            ? `Welcome ${userData.username}! Account created successfully.`
            : `Welcome back, ${userData.username}!`

          toast.success(message)

          // Clean URL first to prevent re-running
          router.replace('/signIn')

          // Redirect to home after a short delay
          setTimeout(() => {
            router.push('/')
          }, 1500)

        } catch (err: any) {
          console.error('Failed to fetch user data:', err)

          // Handle network errors specifically
          if (err.name === 'AbortError' || err.name === 'TimeoutError') {
            toast.error('Request timed out. Please check your connection and try again.')
          } else if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
            toast.error('Cannot connect to server. Please check your network connection.')
          } else {
            toast.error('Failed to retrieve user information')
          }
          router.replace('/signIn')
        }
      }

      fetchUserData()
    }

  }, [searchParams, router, setUser]) // Added dependencies

  const handleGoogleAuth = () => {
    // Redirect to backend OAuth initiation
    window.location.href = `${getBackendURL()}/auth/google`
  }

  // Handle 42 OAuth callback
  useEffect(() => {
    const fortyTwoAuth = searchParams.get('42Auth')
    const userId = searchParams.get('userId')
    const isNewUser = searchParams.get('isNewUser')
    const authError = searchParams.get('error')

    // Skip if no OAuth parameters present
    if (!fortyTwoAuth && !authError) {
      return
    }

    // Prevents double execution in React Strict Mode (Dev)
    if (fortyTwoAuthEffectRef.current) {
      return
    }
    fortyTwoAuthEffectRef.current = true

    if (authError) {
      const errorMessages: Record<string, string> = {
        'no_code': '42 authentication failed: No authorization code',
        'token_failed': 'Failed to exchange authorization code',
        'user_failed': 'Failed to retrieve user information',
        'auth_failed': '42 authentication failed. Please try again.'
      }
      toast.error(errorMessages[authError] || 'An error occurred during authentication')
      // Clean URL
      router.replace('/signIn')
      return
    }

    if (fortyTwoAuth === 'success' && userId) {
      // Fetch user data from backend using the ID
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${getBackendURL()}/getUserById/${userId}`, {
            signal: AbortSignal.timeout(10000) // 10 second timeout
          })

          if (!response.ok) {
            toast.error('Failed to retrieve user data')
            router.replace('/signIn')
            return
          }

          const userData = await response.json()

          console.log('42 OAuth user data:', userData)

          // Update global user state (Zustand)
          setUser(userData, userData.refresh_token) //
          // set auth_token cookie? (handled in middleware)
          document.cookie = `auth_token=${userData.access_token}; path=/`;


          // Display success message based on whether user is new
          const message = isNewUser === 'true'
            ? `Welcome ${userData.username}! Account created successfully.`
            : `Welcome back, ${userData.username}!`

          toast.success(message)

          // Clean URL first to prevent re-running
          router.replace('/signIn')

          // Redirect to home after a short delay
          setTimeout(() => {
            router.push('/')
          }, 1500)

        } catch (err: any) {
          console.error('Failed to fetch user data:', err)

          // Handle network errors specifically
          if (err.name === 'AbortError' || err.name === 'TimeoutError') {
            toast.error('Request timed out. Please check your connection and try again.')
          } else if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
            toast.error('Cannot connect to server. Please check your network connection.')
          } else {
            toast.error('Failed to retrieve user information')
          }
          router.replace('/signIn')
        }
      }

      fetchUserData()
    }

  }, [searchParams, router, setUser]) // Added dependencies

  const handle42Auth = () => {
    window.location.href = `${getBackendURL()}/auth/42`
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${getBackendURL()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || 'Login failed. Please try again.'
        setError(errorMessage)
        toast.error(errorMessage)
        return
      }

      console.log('Login response data:', data.user)
      if (data.user) {
        // zustand
        setUser(data.user) //
        // set auth_token cookie? (handled in middleware)
        document.cookie = `auth_token=${data.user.access_token}; path=/`;
        // localStorage.setItem('user', JSON.stringify(data.user)) // Removed: Rely on Zustand for state management
      }

      toast.success('Login successful!')
      setUsername('')
      setPassword('')
      setError('')

      setTimeout(() => {
        router.push('/')
      }, 1000)

    } catch (error: any) {
      console.error('Network error during login:', error)
      console.error('Attempted backend URL:', getBackendURL())

      // Handle network errors specifically
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        const errorMessage = 'Request timed out. Please check your connection and try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const backendUrl = getBackendURL()
        const errorMessage = `Cannot connect to server at ${backendUrl}. Please ensure:
1. The backend is running
2. The backend is accessible from your network
3. No firewall is blocking the connection`
        setError(errorMessage)
        toast.error('Cannot connect to server. Check console for details.')
      } else {
        const errorMessage = 'Network error. Please check your connection.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

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
