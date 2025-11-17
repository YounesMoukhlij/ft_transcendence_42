// app/leaderboard/page.tsx
import Link from 'next/link';
import { Trophy, User } from 'lucide-react';

// --- Re-using your constants for consistency ---
const API_URL = 'http://localhost:4444';
const BACK_API = 'http://localhost:4444';
const defaultProfileImg = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg';

// --- Helper function from your settings page to handle image paths ---
const getProfileImageUrl = (currentImg) => {
    console.log('Current Image:', currentImg);
  if (!currentImg) {
    return defaultProfileImg;
  }
  if (currentImg && currentImg.startsWith('/uploads/')) {
    return `${BACK_API}${currentImg}`;
  }
  
  return currentImg;
};

// --- Simplified data fetching function ---
async function getLeaderboardData() {
  // Fetch the default leaderboard (e.g., page 1, limit 10)
  const res = await fetch(`${API_URL}/leaderboard`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

// --- A styled component for each leaderboard row ---
const LeaderboardItem = ({ player, rank }) => (
    <Link href={`/profile/${player.username}`} className="block">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 last:border-b-0 cursor-pointer ">
            
            <div className="flex items-center gap-4">
                <div className={`text-gray-400 font-semibold text-lg ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-yellow-800' : 'text-white'}`}># {rank}</div>
                <img
                    src={getProfileImageUrl(player.profile_img)}
                    alt={player.username}
                    className={`w-12 h-12 rounded-full object-cover border-2 border-gray-600 ${rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-gray-400' : rank === 3 ? 'border-yellow-800' : ''}`}
                />
                <div>
                    <h2 className="text-white font-semibold text-base sm:text-lg">
                        {player.username}
                    </h2>
                </div>
            </div>
            <div className="text-right">
                <p className="text-gray-400 font-bold text-lg">{player.xp} XP</p>
            </div>
        </div>
    </Link>
);

// --- The main async Page Component (no searchParams) ---
export default async function LeaderboardPage() {
  let data;
  let error = null;

  try {
    data = await getLeaderboardData();
  } catch (err) {
    error = 'Failed to load leaderboard. Please try again later.';
  }

  const leaderboard = data?.leaderboard || [];

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-bold mb-2">
            <Trophy className="text-blue-400" size={36} color ={'white'} />
            Leaderboard
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            See who's on top of the game
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="border border-gray-700 rounded-2xl shadow-lg bg-black overflow-hidden ">
          {error && (
            <p className="p-6 text-center text-red-500">{error}</p>
          )}

          {!error && leaderboard.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 gap-4 text-gray-500">
              <User size={48} />
              <p className="text-lg font-semibold">No players found</p>
              <p className="text-sm">The leaderboard is currently empty.</p>
            </div>
          )}

          {!error && leaderboard.length > 0 && (
            <div className='gap-2'>
              {leaderboard.map((player, index) => (
                <LeaderboardItem
                  key={player.username}
                  player={player}
                  rank={index + 1}
                />
              ))}
            </div>
          )}

          {/* Pagination is removed */}
        </div>
      </div>
    </div>
  );
}