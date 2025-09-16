'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FlyingSaucer from './flyingsaucer'
import '../globals.css'
import { toast } from 'react-toastify';
import { log } from 'console'
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { asyncWrapProviders } from 'async_hooks'

// function twoFactorAuth() {

//   return
//   {
//     <div className='w-full h-full flex items-center justify-center'>
//       <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
//         Two Factor Authentication
//       </h1>

//       <form className='w-full max-w-md flex flex-col gap-4 sm:gap-6 items-center justify-center'>
//        {/* 8 numbers input  */}
//         <input 
//           type="text" 
//           name="2fa"
//           placeholder='Enter 2FA Code' 
//           className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
//         />

//         <button 
//           type="submit"
//           className='w-full p-3 sm:p-4 rounded-2xl bg-gray-100 transition-all duration-300 ease-in-out text-black hover:bg-gray-400 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer'
//         >
//           Verify
//         </button>
//       </form>

//     </div>
//   }
// }

export default function AuthLayout() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Listen for route changes to update the state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setIsSignUp(path.includes('signUp'))
    }
  }, [])

  const toggleAuthMode = (mode: 'signIn' | 'signUp') => {
    setIsSignUp(mode === 'signUp')
    // Update URL without page reload
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/Auth/${mode}`)
    }
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Animation */}
      {/* <StarAnimation /> */}
      
      {/* Main Container - 3 divs but only 2 visible */}
      <div className="relative flex min-h-screen w-full">
        
        {/* UFO Container - Moves left to right */}
        <motion.div
          className="hidden md:block absolute w-1/2 h-screen z-10"
          initial={false}
          animate={{
            left: isSignUp ? '50%' : '0%'
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            duration: 1
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <FlyingSaucer />
          </div>
        </motion.div>

        {/* Sign In Form Container - Slides down when switching to SignUp */}
        <motion.div
          className="absolute w-full md:w-1/2 h-screen flex items-center justify-center z-20"
          initial={false}
          animate={{
            right: isSignUp ? '50%' : '0%',
            y: isSignUp ? '100vh' : '0vh',
            opacity: isSignUp ? 0 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            duration: 1,
            opacity: { duration: 0.5 }
          }}
          style={{
            pointerEvents: isSignUp ? 'none' : 'auto'
          }}
        >
          <div className="w-full max-w-md px-4">
            <SignInForm onToggle={() => toggleAuthMode('signUp')} />
          </div>
        </motion.div>

        {/* Sign Up Form Container - Slides up when switching from SignIn */}
        <motion.div
          className="absolute w-full md:w-1/2 h-screen flex items-center justify-center z-20"
          initial={false}
          animate={{
            left: isSignUp ? '0%' : '50%',
            y: isSignUp ? '0vh' : '-100vh',
            opacity: isSignUp ? 1 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            duration: 1,
            opacity: { duration: 0.5 }
          }}
          style={{
            pointerEvents: isSignUp ? 'auto' : 'none'
          }}
        >
          <div className="w-full max-w-md px-4">
            <SignUpForm onToggle={() => toggleAuthMode('signIn')} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}


// http://10.11.9.5:4444/GoogleAuth

interface SignInFormProps {
  onToggle: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

function SignInForm({ onToggle }: SignInFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // Validation function
  const validateForm = () => {
    if (!username.trim() || !password) {
      const errorMessage = 'Both username and password are required';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
    return true;
  };

  // Clear form function
  const clearForm = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://10.11.9.5:4444/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password 
        }),
      });

      // Parse response data first
      const data = await response.json();
      console.log('Response data:', data);

      let errorMessage = 'Login failed. Please try again later.';

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          errorMessage = data.message || 'Invalid username or password';
        } else if (response.status === 400) {
          errorMessage = data.message || 'Please check your login details';
        } else if (response.status >= 500) {
          errorMessage = data.message || 'Server error. Please try again later.';
        }
        
        setError(errorMessage);
        // toast.error(errorMessage);
        return;
      }

      // Success case
      console.log('Login successful:', data);
      toast.success('Login successful!');
      clearForm();
      
      // Store user data or token if needed
      if (data.user) {
        // Example: store in localStorage or context
        // localStorage.setItem('user', JSON.stringify(data.user));
        // Or update your app's user state
      }
      
      // Redirect after successful login
      // window.location.href = '/dashboard';
      window.location.href = 'https://www.youtube.com/watch?v=XXl20VmOnXs&list=RDXXl20VmOnXs&start_radio=1';
      
    } catch (error) {
      console.error('Network error during login:', error);
      
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
      // redirect to google.com for testing
      window.location.href = 'https://www.xnxx.com';
    }
  };

  // Handle input changes
  const handleUsernameChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (field : keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const googleAuth = () => {
    const clientId = '629752026404-2e0sltbkobghdg6mqov2p8gsjtbpu4la.apps.googleusercontent.com';
    // window.location.href = 'http://

  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <div className='flex flex-col gap-2 sm:gap-3 items-center justify-center text-center'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
          Hey there, space champ! 🚀
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
          onChange={handleUsernameChange('username')}
        />
        
        <input 
          type="password" 
          name="password"
          placeholder='Password' 
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          value={password}
          disabled={isLoading}
          onChange={handlePasswordChange('password')}
        />
        
        <div className='flex items-start w-full'>
          <h3 className='text-xs sm:text-sm text-gray-500 hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer'>
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
              className='w-1/2 sm:w-12 lg:w-16 p-3 sm:p-4 rounded-2xl bg-gray-100 transition-all duration-300 ease-in-out text-black flex items-center justify-center gap-2 hover:bg-gray-400 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={googleAuth}
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
              className="w-1/2 sm:w-12 lg:w-16 p-3 sm:p-4 rounded-2xl bg-gray-100 transition-all duration-300 ease-in-out text-black flex items-center justify-center gap-2 hover:bg-gray-400 hover:text-white hover:shadow-lg hover:scale-105 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                viewBox="0 -200 960 960"
                width="20"
                height="20"
                className="sm:w-6 sm:h-6"
                xmlns="http://www.w3.org/2000/svg"
              >
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
  );
}


// Sign Up Form Component


interface SignUpFormProps {
  onToggle: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}


function SignUpForm({ onToggle }: SignUpFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      const errorMessage = 'All fields are required';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }

    if (password !== confirmPassword) {
      const errorMessage = 'Passwords do not match';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }

    // Additional validation
    if (password.length < 8) {
      const errorMessage = 'Password must be at least 8 characters long';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMessage = 'Please enter a valid email address';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }

    return true;
  };

  const createUser = async (userData: Omit<FormData, 'confirmPassword'>): Promise<void> => {
    const response = await fetch('http://10.11.9.5:4444/AddUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {

      if (response.status === 409) {
        setError('Username or email already exists');
        toast.error('Username or email already exists');
      } else {

        try {
          const errorData = await response.json();

          setError(errorData || 'Failed to create user');
          toast.error(errorData || 'Failed to create user');
        } catch {
          setError('Failed to create user');
          toast.error('Failed to create user');
          
        }
      }  
      throw new Error('Failed to create user');
    }

    return response.json();
  };

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  // Main form submission handler
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();

    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...userData } = formData;
      
      const cleanedUserData = {
        username: userData.username.trim(),
        email: userData.email.trim(),
        password: userData.password
      };

      await createUser(cleanedUserData);
      
      toast.success('Account created successfully!');
      clearForm();
      
    } catch (error) {
      console.error('Error during sign up:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      
    } finally {
      setIsLoading(false);
      window.location.href = '/Auth/signIn';
    }
  };

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
          name='username'
          placeholder='Username'
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          required
          disabled={isLoading}
          value={formData.username}
          onChange={handleInputChange('username')}
        />
        
        <input 
          type="email" 
          name='email'
          placeholder='Email'
          required
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          disabled={isLoading}
          value={formData.email}
          onChange={handleInputChange('email')}
        />
        
        <input 
          type="password" 
          name='password'
          placeholder='Password'
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out' 
          required
          disabled={isLoading}
          minLength={8}
          value={formData.password}
          onChange={handleInputChange('password')}
        />
        
        <input
          type='password'
          name='confirmPassword'
          placeholder='Confirm Password'
          className='w-full p-3 sm:p-4 pl-5 rounded-2xl border outline-0 focus:border-gray-500 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out'
          required
          disabled={isLoading}
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
        />

        {error && (
          <div className="w-full text-center text-red-500 text-sm bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        <div className='w-full'>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full p-3 sm:p-4 rounded-2xl border border-transparent text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out ${
              isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gray-500 hover:bg-gray-400 hover:cursor-pointer'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
        
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
  );
}


