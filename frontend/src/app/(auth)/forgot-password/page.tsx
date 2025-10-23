'use client';
import React from 'react';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // EmailJS configuration - REPLACE THESE WITH YOUR ACTUAL VALUES
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_olzq7jd', // From Step 2
    TEMPLATE_ID: 'template_y4x9xld', // From Step 3
    PUBLIC_KEY: '8TLmc-F4eClurvKNU' // From Step 4
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const sendPasswordResetEmail = async (newPassword: string, username: string) => {
    try {
      const templateParams = {
        to_email: email,
        username: username,
        password: newPassword,
        from_name: 'ft_transcendence_42',
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      return true;
    } catch (error) {
      console.error('EmailJS error:', error);
      return false;
    }
  };

  const resetPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const errorMessage = 'Please enter a valid email address';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://10.11.2.13:4444/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('New password sent to your email');
        router.push('/signIn');
      } else {
        const errorMessage = data.message || 'Email not found';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'An error occurred. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 rounded-lg md:rounded-xl shadow-md sm:shadow-lg md:shadow-xl">
        
        {/* Logo/Image */}
        <div className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-xs mx-auto mb-2 sm:mb-4">
          <img 
            src="https://media1.tenor.com/m/5ot5ADGxJdAAAAAd/hello.gif" 
            alt="Logo" 
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Header Text */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
            Forgot Password
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 md:mb-8">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <div>
          <form className="flex flex-col space-y-3 sm:space-y-4" onSubmit={resetPass}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;