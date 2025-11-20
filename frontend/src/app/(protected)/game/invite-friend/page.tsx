'use client';

import { useRouter } from 'next/navigation';

export default function InviteFriendPage() {
  const router = useRouter();

  // TODO: Fetch friend list from the backend

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Invite a Friend</h1>
      <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg">
        <p className="text-center">Friend list will be displayed here.</p>
        {/* TODO: Implement friend list and invitation logic */}
      </div>
      <button
        onClick={() => router.back()}
        className="mt-8 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
      >
        Back
      </button>
    </div>
  );
}
