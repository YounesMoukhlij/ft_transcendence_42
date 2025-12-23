"use client"
import React from 'react'
import { useState } from 'react';

const TwoFA = () => {
const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle code verification logic here
    console.log("Verifying code:", code);
    console.log("Code verified successfully!");

  };
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-black p-3 sm:p-4 md:p-6 lg:p-8'>
       <div className="flex flex-col items-center justify-center h-screen bg-black
       p-3 border-2 border-gray-400 rounded-2xl shadow-2xl max-w-md mx-auto max-h-100 ">
        <h1 className="mb-4 text-2xl font-bold">Two-Factor Authentication</h1>
        <p className="mb-8 text-center text-gray-500 text-xl">
            Please enter the 6-digit code from your authenticator app to continue.
        </p>
        <form className="w-full max-w-sm mb-4 flex flex-col items-around gap-4"
            onSubmit={handleSubmit}
        >
            {/* 6 input each one contain 1 digit */}
            <div className="mb-4 flex justify-between">
                {[...Array(6)].map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 rounded border border-gray-300 p-2 text-center text-xl focus:border-gray-500 focus:outline-none"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9]$/.test(value)) {
                                setCode((prev) => prev + value);
                                // Move to next input
                                const nextInput = e.target.nextElementSibling as HTMLInputElement;
                                if (nextInput) {
                                    nextInput.focus();
                                }
                            } else {
                                e.target.value = "";
                            }
                        }}
                    />
                ))}
            </div>
            <div className='mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3'>
                <button
                    type="submit"
                    className="w-full rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 hover:cursor-pointer active:scale-95 "
                    >
                    Verify
                </button>
            </div>
        </form>

    </div>
    </div>
  )
}

export default TwoFA
