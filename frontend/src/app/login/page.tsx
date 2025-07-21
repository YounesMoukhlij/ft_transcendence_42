"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Placeholder login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your email/password login logic here
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#222]">
      <h1 className="text-5xl font-bold text-center text-white py-8">Sign In</h1>
      <div className="flex flex-1 items-center justify-center">
        {/* Left image */}
        <div className="hidden md:block w-1/2 h-full">
          <Image src="/robot.png" alt="Ping Pong Robot" width={600} height={600} className="object-cover w-full h-full rounded-l-2xl" priority />
        </div>
        {/* Right form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-black rounded-r-2xl py-12 px-8">
          <h2 className="text-3xl font-bold mb-2 text-white text-center">Welcome to MallPong</h2>
          <p className="mb-6 text-white text-center">Sign in and experience the game</p>
          <form className="w-full max-w-sm space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full py-3 pl-12 pr-4 rounded-full bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Image src="/file.svg" alt="Email Icon" width={20} height={20} />
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full py-3 pl-12 pr-4 rounded-full bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
                aria-label="Password"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Image src="/window.svg" alt="Password Icon" width={20} height={20} />
              </span>
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-xs text-gray-400 hover:underline">Forgot your password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full py-3 rounded-full bg-[#222] border-2 border-white text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-white hover:text-black transition"
              onClick={() => signIn('42-school')}
            >
              <Image src="/globe.svg" alt="42 Logo" width={24} height={24} />
              Login with <span className="font-bold">42</span>
            </button>
          </form>
          <div className="mt-6 text-center text-white text-sm">
            You do not have an account? <a href="#" className="font-bold underline">Sign up here</a>
          </div>
          <div className="mt-8 flex justify-center">
            <span className="inline-block bg-white rounded-full p-2">
              <Image src="/games.png" alt="Gamepad Icon" width={24} height={24} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
