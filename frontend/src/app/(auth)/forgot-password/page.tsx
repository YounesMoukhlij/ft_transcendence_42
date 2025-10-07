'use client';
import React from 'react';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  const resetPass = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const errorMessage = 'Please enter a valid email address';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    toast.success('Password reset link sent to your email');
    router.push('/signIn');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 rounded-lg md:rounded-xl shadow-md sm:shadow-lg md:shadow-xl">
        
        {/* Logo/Image */}
        <div className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-xs mx-auto mb-2 sm:mb-4">
          <img 
            src="../wallpaper.jpg" 
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md"
            >
              Send Reset Link
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;