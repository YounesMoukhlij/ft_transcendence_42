import Link from 'next/link';
import Image from 'next/image';
import { Trophy, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {getProfileImageUrl} from '@/lib/utils'

interface Player {
  username: string;
  profile_img: string;
  xp: number;
}
// const BACK_API = 'http://localhost:4444';
// const defaultProfileImg = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg';



// --- Updated data fetching function with Pagination ---
async function getLeaderboardData(token: string, page: number) {
  const limit = 10;
  // We pass ?page=X&limit=10 to the backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_API}/api/leaderboard?page=${page}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (res.status === 401) {
    return null;
  }
  
  if (!res.ok) {
    console.log("======================> " , res);
    // If backend doesn't support pagination queries yet, it might just return all data.
    // That is fine, but for true pagination, backend must handle these params.
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

const LeaderboardItem = ({ player, rank }: { player: Player, rank: number }) => {
  console.log("The image url is:", getProfileImageUrl(player.profile_img));
  return (
    <Link href={`/profile/${player.username}`} className="block">
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-900 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`font-semibold text-lg w-8 ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-yellow-800' : 'text-gray-400'}`}>
          #{rank}
        </div>
        <Image
          src={getProfileImageUrl(player.profile_img)}
          alt={player.username}
          width={48}
          height={48}
          unoptimized
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
)};

// --- The main async Page Component ---
// Next.js App Router pages receive 'searchParams' as a prop
export default async function LeaderboardPage({ searchParams }) {
  // page logic here

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/signIn');
  }

  // 1. Get current page from URL, default to 1
  // Await searchParams because in Next.js 15+ strictly it might be a promise, 
  // but usually in page props it's accessible.
  // Note: If you are on Next.js 15, searchParams is a Promise.
  // If older Next.js 13/14, you can use it directly. Assuming typical usage:
  const params = await searchParams; 
  const currentPage = Number(params?.page) || 1;

  let data;
  let error = null;

  try {
    data = await getLeaderboardData(token, currentPage);

    if (data === null) {
      redirect('/signIn');
    }
  } catch (err) {
    if (err.message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.error("Leaderboard fetch error:", err);
    error = 'Failed to load leaderboard. Please try again later.';
  }

  const leaderboard = data?.leaderboard || [];
  
  // Logic to determine if we can go next (assuming backend returns empty array if no more data)
  const hasMore = leaderboard.length === 10; 

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-bold mb-2">
            <Trophy className="text-blue-400" size={36} color={'white'} />
            Leaderboard
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            See who is on top of the game
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="border border-gray-700 rounded-2xl shadow-lg bg-black overflow-hidden mb-6">
          {error && (
            <p className="p-6 text-center text-red-500">{error}</p>
          )}

          {!error && leaderboard.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 gap-4 text-gray-500">
              <User size={48} />
              <p className="text-lg font-semibold">No players found</p>
              <p className="text-sm">Page {currentPage} is empty.</p>
            </div>
          )}

          {!error && leaderboard.length > 0 && (
            <div className='gap-2'>
              {leaderboard.map((player: Player, index: number) => (
                <LeaderboardItem
                  key={player.username}
                  player={player}
                  // Calculate absolute rank based on page number
                  // Page 1: 1-10, Page 2: 11-20
                  rank={(currentPage - 1) * 10 + (index + 1)}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- Simple Pagination Controls --- */}
        <div className="flex items-center justify-center gap-4">
          {/* Previous Button */}
          <Link
            href={currentPage > 1 ? `/leaderboard?page=${currentPage - 1}` : '#'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-black transition-colors ${
              currentPage <= 1
                ? 'opacity-50 cursor-not-allowed text-gray-600'
                : 'hover:bg-gray-900 text-white'
            }`}
            aria-disabled={currentPage <= 1}
          >
            <ChevronLeft size={20} />
          </Link>

          <span className="text-gray-400 font-mono">
            Page {currentPage}
          </span>

          {/* Next Button */}
          <Link
            href={hasMore ? `/leaderboard?page=${currentPage + 1}` : '#'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 bg-black transition-colors ${
              !hasMore
                ? 'opacity-50 cursor-not-allowed text-gray-600'
                : 'hover:bg-gray-900 text-white'
            }`}
            aria-disabled={!hasMore}
          >
            <ChevronRight size={20} />
          </Link>
        </div>

      </div>
    </div>
  );
}