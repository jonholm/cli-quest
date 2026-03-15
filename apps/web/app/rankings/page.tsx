'use client';

import Link from 'next/link';

export default function Rankings() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-cyber-red mb-4">Rankings</h1>
        <p className="text-cyber-muted mb-8">Global leaderboards. Connect to Supabase to see rankings.</p>
        <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-8">
          <p className="text-cyber-muted">Leaderboards will appear here once connected to the backend.</p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-cyber-green hover:underline">← Back to Hub</Link>
        </div>
      </div>
    </div>
  );
}
