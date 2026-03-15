'use client';

import Link from 'next/link';

export default function DailyChallenge() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-cyber-red mb-4">Daily Challenge</h1>
        <p className="text-cyber-muted mb-8">New challenges every day. Coming soon.</p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-6">
            <div className="text-cyber-green font-bold mb-2">Quick</div>
            <div className="text-cyber-muted text-sm">~2 minutes</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-6">
            <div className="text-cyber-yellow font-bold mb-2">Standard</div>
            <div className="text-cyber-muted text-sm">~5 minutes</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-6">
            <div className="text-cyber-red font-bold mb-2">Hard</div>
            <div className="text-cyber-muted text-sm">~10 minutes</div>
          </div>
        </div>
        <Link href="/" className="text-cyber-green hover:underline">← Back to Hub</Link>
      </div>
    </div>
  );
}
