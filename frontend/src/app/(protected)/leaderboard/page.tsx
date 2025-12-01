'use client';
'use client';
import React from 'react';
import Link from 'next/link';
import { Trophy, User } from 'lucide-react';
import { useTranslation } from '../../../contexts/LanguageContext';

const defaultProfileImg = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/HeathJoker.png/250px-HeathJoker.png';

const getProfileImageUrl = (currentImg) => {
  if (!currentImg) return defaultProfileImg;
  const API_URL = `http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}`;

  if (currentImg && currentImg.startsWith('/uploads/')) {
    return `${API_URL}${currentImg}`;
  }

  return currentImg;
};

// --- Single Row Component ---
const LeaderboardItem = ({ player, rank }) => (
  <Link href={`/profile/${player.username}`} className="block">
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 last:border-b-0 cursor-pointer">
      <div className="flex items-center gap-4">
        <div
          className={`text-gray-400 font-semibold text-lg ${
            rank === 1
              ? 'text-yellow-400'
              : rank === 2
              ? 'text-gray-400'
              : rank === 3
              ? 'text-yellow-800'
              : 'text-white'
          }`}
        >
          # {rank}
        </div>

        <img
          src={getProfileImageUrl(player.profile_img)}
          alt={player.username}
          className={`w-12 h-12 rounded-full object-cover border-2 border-gray-600 ${
            rank === 1
              ? 'border-yellow-400'
              : rank === 2
              ? 'border-gray-400'
              : rank === 3
              ? 'border-yellow-800'
              : ''
          }`}
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

// --- Page Component ---
export default function LeaderboardPage() {
  const { t } = useTranslation();
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const user = JSON.parse(localStorage.getItem('user-storage') || '{}')?.state?.user;
        if (!user?.access_token) {
          setError(t('leaderboard.failedToLoad'));
          setLoading(false);
          return;
        }

        const res = await fetch(`http://${process.env.NEXT_PUBLIC_BACKENDIP}:${process.env.NEXT_PUBLIC_BACKENDPORT}/leaderboard`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          }
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(t('leaderboard.failedToLoad'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t]);

  const leaderboard = data?.leaderboard || [];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
        <p>{t('common.loading')}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-black text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-bold mb-2">
            <Trophy className="text-blue-400" size={36} color={'white'} />
            {t('leaderboard.title')}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {t('leaderboard.subtitle')}
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="border border-gray-700 rounded-2xl shadow-lg bg-black overflow-hidden">
          {error && (
            <p className="p-6 text-center text-red-500">{error}</p>
          )}

          {!error && leaderboard.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 gap-4 text-gray-500">
              <User size={48} />
              <p className="text-lg font-semibold">{t('leaderboard.noPlayers')}</p>
              <p className="text-sm">{t('leaderboard.empty')}</p>
            </div>
          )}

          {!error && leaderboard.length > 0 && (
            <div className="gap-2">
              {leaderboard.map((player, index) => (
                <LeaderboardItem
                  key={player.username}
                  player={player}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
