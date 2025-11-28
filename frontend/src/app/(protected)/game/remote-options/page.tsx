'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RemoteOptionsPage() {
  const router = useRouter();

  const handleSearchRandom = () => {
    router.push('/game/customize');
  };

  const handleInviteFriend = () => {
    router.push('/game/invite-friend');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">Choose Your Opponent</h1>
        <div className="flex space-x-8">
            <button
            onClick={handleSearchRandom}
            className="flex flex-col items-center px-8 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <Image src="/search.png" alt="Search Random" width={100} height={100} />
                <span className="mt-4 text-xl">Search Random Opponent</span>
            </button>
            <button
            onClick={handleInviteFriend}
            className="flex flex-col items-center px-8 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <Image src="/user.png" alt="Invite Friend" width={100} height={100} />
                <span className="mt-4 text-xl">Invite Friend</span>
            </button>
        </div>
    </div>
  );
}
