'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import '../globals.css'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import Loading from '@/components/Loading/page.tsx'

export default function AuthLayout() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure hydration matches for Framer Motion and client logic
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check URL path on mount to determine initial state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setIsSignUp(path.includes('signUp'))
    }
  }, [])

  // Toggle function passed down to child forms
  const toggleAuthMode = (mode: 'signIn' | 'signUp') => {
    setIsSignUp(mode === 'signUp')
    if (typeof window !== 'undefined') {

      // Update browser URL without reloading
      window.history.pushState({}, '', `/${mode}`)
      
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
      <div className="relative flex min-h-screen w-full">
        
        {/* Animated Background Block */}
        <motion.div
          className="hidden md:block absolute w-1/2 h-screen z-10"
          initial={false}
          animate={{ left: isSignUp ? '50%' : '0%' }}
          transition={{ type: "spring", stiffness: 150, damping: 20, duration: 1 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {/* Visual elements like FlyingSaucer go here */}
            <Loading/>
          </div>
        </motion.div>

        {/* Sign In Container */}
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

        {/* Sign Up Container */}
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