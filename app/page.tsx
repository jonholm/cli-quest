'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/hub');
  }, [router]);

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
      <div className="text-terminal-green text-2xl">Loading CLI Quest...</div>
    </div>
  );
}
