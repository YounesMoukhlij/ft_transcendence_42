'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TournamentPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-900 via-purple-900 to-black p-8">
      <div className="w-full max-w-2xl bg-gray-900 bg-opacity-90 rounded-3xl shadow-2xl border-2 border-purple-500 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-purple-300 mb-4 text-center drop-shadow-lg">Tournament Mode</h1>
        <p className="text-lg text-gray-200 mb-8 text-center">
          Compete in a bracket-style tournament! Challenge friends, advance through rounds, and become the Ping Pong Champion.
        </p>
        <div className="w-full flex flex-col items-center gap-6">
          {/* Placeholder for tournament bracket UI */}
          <div className="w-full bg-gradient-to-r from-purple-700 to-blue-700 rounded-xl p-6 flex flex-col items-center shadow-lg border-2 border-purple-400">
            <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
            <p className="text-gray-200 text-center">Tournament brackets, live match updates, and more will be available here soon!</p>
          </div>
        </div>
        <button
          className="mt-10 px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-lg shadow-md transition-all duration-300"
          onClick={() => router.push('/game')}
        >
          Back
        </button>
      </div>
    </div>
  );
}
