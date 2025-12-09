'use client'

import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import { toast } from 'react-toastify'
import axios from 'axios'

// Define the shape of the form data
interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface SignUpFormProps {
  onToggle: () => void
}

const API_URL = 'http://localhost:4444'

export default function SignUpForm({ onToggle }: SignUpFormProps) {
  // State for form inputs
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Handle input changes dynamically
  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  // Client-side validation
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

  // Handle Form Submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const { confirmPassword, ...userData } = formData
      
      // --- AXIOS REFACTOR: POST Request ---
      const response = await axios.post(`${API_URL}/AddUser`, {
        username: userData.username.trim(),
        email: userData.email.trim(),
        password: userData.password
      })

      // Axios automatically throws for non-2xx status, so if we reach here, it succeeded
      toast.success('Account created successfully! Please sign in.') 
      setFormData({ username: '', email: '', password: '', confirmPassword: '' })
      
      // Switch to sign-in view
      onToggle()
      router.push('/signIn')
      
    } catch (error: any) {
      console.error('Error during sign up:', error)
      
      // --- AXIOS ERROR HANDLING ---
      // Extract the message from the backend response if available
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