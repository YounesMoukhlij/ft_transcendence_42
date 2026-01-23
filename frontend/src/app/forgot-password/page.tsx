'use client';
import { useState } from 'react';
import React from 'react';
import { toast } from 'react-toastify';
import { Lock } from 'lucide-react'


const STEPS = { ENTER_EMAIL: 'ENTER_EMAIL', VERIFY_CODE: 'VERIFY_CODE', RESET_PASSWORD: 'RESET_PASSWORD'};

const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.ENTER_EMAIL);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  // router for navigation


  // General UI state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generic handler to update state from input fields
  const handleStateChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(null);
  };

  // Step 1: API call to send verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/api/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send code.');
      }

      toast.success(data.message);
      setCurrentStep(STEPS.VERIFY_CODE);

    } catch (err) {
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Step 2: API call to verify the code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/api/verifyCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Code verification failed.');
      }

      toast.success(data.message);
      setResetToken(data.resetToken);
      setCurrentStep(STEPS.RESET_PASSWORD);

    } catch (err) {
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: API call to reset the password using the token
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (newPassword.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/api/resetPasswordWithToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      toast.success('Password has been reset successfully!');
      window.location.href = '/signIn';

    } catch (err) {
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case STEPS.ENTER_EMAIL:
        return (
          <>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 md:mb-8">
              Enter your gmail to receive a verification code.
            </p>
            <form className="flex flex-col space-y-3 sm:space-y-4" onSubmit={handleSendCode}>
              <input type="email" placeholder="Gmail" className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out" value={email} onChange={handleStateChange(setEmail)} required disabled={loading} />
              <button type="submit" disabled={loading} className="bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          </>
        );
      case STEPS.VERIFY_CODE:
        return (
          <>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 md:mb-8">
              A 6-digit code was sent to <span className="font-semibold text-white">{email}</span>. It expires in 5 minutes.
            </p>
            <form className="flex flex-col space-y-3 sm:space-y-4" onSubmit={handleVerifyCode}>
              <input type="text" placeholder="XXX-XXX" className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-xl font-bold sm:text-base transition-all duration-300 ease-in-out text-center" value={code} onChange={handleStateChange(setCode)} required maxLength={6} disabled={loading} />
              <button type="submit" disabled={loading} className="bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </>
        );
      case STEPS.RESET_PASSWORD:
        return (
          <>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 md:mb-8">
              Code verified. Please enter your new password.
            </p>
            <form className="flex flex-col space-y-3 sm:space-y-4" onSubmit={handleResetPassword}>
              <input type="password" placeholder="New Password" className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out" value={newPassword} onChange={handleStateChange(setNewPassword)} required disabled={loading} />
              <input type="password" placeholder="Confirm New Password" className="w-full p-3 sm:p-3.5 md:p-4 pl-4 sm:pl-5 rounded-xl md:rounded-2xl border border-gray-300 outline-0 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 bg-gray-100 text-black text-sm sm:text-base transition-all duration-300 ease-in-out" value={confirmPassword} onChange={handleStateChange(setConfirmPassword)} required disabled={loading} />
              <button type="submit" disabled={loading} className="bg-gray-600 hover:bg-gray-500 active:bg-gray-700 w-full p-3 sm:p-3.5 md:p-4 rounded-xl md:rounded-2xl text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out hover:cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center max-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 rounded-lg md:rounded-xl shadow-md sm:shadow-lg md:shadow-xl">
        <div className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-xs mx-auto mb-2 sm:mb-4 flex justify-center">
          <Lock size={60} className=" text-gray-300  " />
        </div>
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
            Forgot Password
          </h1>
        </div>
        <div>
          {renderFormContent()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
