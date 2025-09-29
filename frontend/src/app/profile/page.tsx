
'use client';

import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaGlobe, FaStar, FaUserFriends, FaGamepad, FaCog, FaEdit } from 'react-icons/fa';

interface UserProfile {
  id_user: number;
  username: string;
  fullname: string;
  profile_img: string;
  xp: number;
  email: string;
  langue: string;
  status: string;
}

interface Friend {
  id_user: number;
  username: string;
  fullname: string;
  profile_img: string;
  status: string;
  xp: number;
}

interface GameHistory {
  game_history_id: number;
  user_win: number;
  win_score: number;
  lose_score: number;
  user_lose: number;
  winner_name: string;
  loser_name: string;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'friends' | 'games'>('overview');

  // For demo purposes, using a hardcoded user ID. In a real app, this would come from authentication
  const currentUserId = 1; // This should come from your auth system

  useEffect(() => {
    fetchUserProfile();
    fetchFriends();
    fetchGameHistory();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:4444/api/users/${currentUserId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:4444/api/users/${currentUserId}/friends`);
      if (response.ok) {
        const friendsData = await response.json();
        setFriends(friendsData);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchGameHistory = async () => {
    try {
      const response = await fetch(`http://localhost:4444/api/users/${currentUserId}/games`);
      if (response.ok) {
        const gamesData = await response.json();
        setGameHistory(gamesData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching game history:', error);
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!userProfile || gameHistory.length === 0) {
      return { wins: 0, losses: 0, winRate: 0, totalGames: 0 };
    }

    const wins = gameHistory.filter(game => game.user_win === userProfile.id_user).length;
    const totalGames = gameHistory.length;
    const losses = totalGames - wins;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    return { wins, losses, winRate, totalGames };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center  rounded-2xl h-full bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center  rounded-2xl border-white h-full bg-black">
        <div className="text-white text-xl">Failed to load profile</div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-full bg-black text-white border-2 border-white rounded-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r  rounded-2xl from-blue-500 to-purple-200 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={userProfile.profile_img || 'https://via.placeholder.com/150'}
                alt={userProfile.fullname}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                userProfile.status === 'online' ? 'bg-green-500' :
                userProfile.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{userProfile.fullname}</h1>
              <p className="text-xl text-blue-100 mb-4">@{userProfile.username}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userProfile.xp}</div>
                  <div className="text-sm text-blue-100">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
                  <div className="text-sm text-blue-100">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
                  <div className="text-sm text-blue-100">Losses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.winRate}%</div>
                  <div className="text-sm text-blue-100">Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FaUser },
              { id: 'friends', label: 'Friends', icon: FaUserFriends },
              { id: 'games', label: 'Game History', icon: FaGamepad }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaUser className="text-blue-400" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div>{userProfile.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Language</div>
                    <div>{userProfile.langue || 'Not specified'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaStar className="text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="capitalize">{userProfile.status}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Statistics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaGamepad className="text-green-400" />
                Game Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">{stats.totalGames}</div>
                  <div className="text-sm text-gray-400">Total Games</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">{userProfile.xp}</div>
                  <div className="text-sm text-gray-400">Total XP</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{stats.wins}</div>
                  <div className="text-sm text-gray-400">Victories</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">{stats.winRate}%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaUserFriends className="text-blue-400" />
              Friends ({friends.length})
            </h2>
            {friends.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaUserFriends className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No friends yet. Start connecting with other players!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <div key={friend.id_user} className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={friend.profile_img || 'https://via.placeholder.com/50'}
                        alt={friend.fullname}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-700 ${
                        friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{friend.fullname}</div>
                      <div className="text-sm text-gray-400">@{friend.username}</div>
                      <div className="text-xs text-yellow-400">{friend.xp} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'games' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaGamepad className="text-green-400" />
              Recent Games ({gameHistory.length})
            </h2>
            {gameHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaGamepad className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No games played yet. Start your first match!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {gameHistory.map((game) => {
                  const isWinner = game.user_win === userProfile.id_user;
                  return (
                    <div key={game.game_history_id} className={`p-4 rounded-lg border-l-4 ${
                      isWinner ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className={`font-semibold ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
                            {isWinner ? 'Victory' : 'Defeat'}
                          </div>
                          <div className="text-sm text-gray-400">
                            vs {isWinner ? game.loser_name : game.winner_name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {game.win_score} - {game.lose_score}
                          </div>
                          <div className="text-sm text-gray-400">
                            {isWinner ? '+140 XP' : '+40 XP'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

