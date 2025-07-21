"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess(false);
    try {
      const res = await fetch("http://localhost:4444/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSignupSuccess(true);
        setTimeout(() => router.push("/"), 1500);
      } else {
        setSignupError(data.error || "Signup failed");
      }
    } catch (err) {
      setSignupError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#222]">
      <h1 className="text-5xl font-bold text-center text-white py-8">Sign Up</h1>
      <div className="flex flex-1 items-center justify-center">
        {/* Left image */}
        <div className="hidden md:block w-1/2 h-full">
          <Image src="/robot.png" alt="Ping Pong Robot" width={600} height={600} className="object-cover w-full h-full rounded-l-2xl" priority />
        </div>
        {/* Right form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-black rounded-r-2xl py-12 px-8">
          <h2 className="text-3xl font-bold mb-2 text-white text-center">Create your MallPong account</h2>
          <form className="w-full max-w-sm space-y-4" onSubmit={handleSignup}>
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full py-3 pl-12 pr-4 rounded-full bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={e => setUsername(e.target.value)}
                aria-label="Username"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaUser size={20} />
              </span>
            </div>
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
                <MdEmail size={20} />
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
                <RiLockPasswordFill size={20} />
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition"
            >
              Sign Up
            </button>
          </form>
          {signupError && (
            <div className="text-red-500 text-center mt-2">{signupError}</div>
          )}
          {signupSuccess && (
            <div className="text-green-500 text-center mt-2">Signup successful! Redirecting...</div>
          )}
          <div className="mt-6 text-center text-white text-sm">
            Already have an account? <Link href="/" className="font-bold underline">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
