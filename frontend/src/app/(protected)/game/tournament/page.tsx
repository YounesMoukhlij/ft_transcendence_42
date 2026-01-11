'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TournamentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to local tournament page
    router.replace('/game/local-tournament');
  }, [router]);

  return null;
}
