'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import { useTranslation } from '../../contexts/LanguageContext';

const DEFAULT_PROFILE_IMAGE = 'https://cdn.intra.42.fr/users/9ae5b3303aaceb68d7a6e580c60545a4/yzoullik.jpg';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace('/signIn');
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <p>{t('home.loadingSession')}</p>
      </div>
    );
  }

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('jwt_token');
    router.replace('/signIn');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <div className="border border-gray-700 bg-gray-800 p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-400">{t('home.welcome')}</h1>
        <div className='flex flex-col items-center justify-center'>
          <img
            src={user.profile_img || DEFAULT_PROFILE_IMAGE}
            alt="Profile"
            width={150}
            height={150}
            className="rounded-full mx-auto mb-6 border-4 border-white object-cover"
          />
          <h2 className="text-3xl font-bold mb-4">{user.username}</h2>
          <div className="w-full space-y-2 text-left text-lg">
            <p><strong>{t('home.fullName')}:</strong> {user.fullname}</p>
            <p><strong>{t('home.email')}:</strong> {user.email}</p>
            <p><strong>{t('home.id')}:</strong> {user.id_user}</p>
            <p><strong>{t('home.languages')}:</strong> {user.languages || 'N/A'}</p>
            <p><strong>{t('home.bio')}:</strong> {user.bio || t('home.notSet')}</p>
            <p className={`font-semibold ${user.is2FAEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
              <strong>{t('home.2FAEnabled')}:</strong> {user.is2FAEnabled ? t('home.yes') + ' ✅' : t('home.no') + ' ⚠️'}
            </p>
            <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap pt-2">
              **{t('home.token')}:** {user.access_token ? user.access_token.substring(0, 30) + '...' : 'N/A'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-8 w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition duration-300 shadow-md"
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}


