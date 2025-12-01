'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from '@/contexts/LanguageContext';

export default function RemoteOptionsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSearchRandom = () => {
    router.push('/game/customize');
  };

  const handleInviteFriend = () => {
    router.push('/game/invite-friend');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">{t('game.chooseYourOpponent')}</h1>
        <div className="flex space-x-8">
            <button
            onClick={handleSearchRandom}
            className="flex flex-col items-center px-8 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <Image src="/search.png" alt={t('game.searchRandomOpponent')} width={100} height={100} />
                <span className="mt-4 text-xl">{t('game.searchRandomOpponent')}</span>
            </button>
            <button
            onClick={handleInviteFriend}
            className="flex flex-col items-center px-8 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <Image src="/user.png" alt={t('game.inviteFriend')} width={100} height={100} />
                <span className="mt-4 text-xl">{t('game.inviteFriend')}</span>
            </button>
        </div>
    </div>
  );
}
