'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type LeaderboardEntry = {
  username: string;
  display_name: string;
  total_xp: number;
  rank: number;
};

export default function Rankings() {
  const [tab, setTab] = useState<'weekly' | 'daily'>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const query = tab === 'weekly'
      ? supabase.from('weekly_xp_leaderboard').select('*').order('rank').limit(50)
      : supabase.from('daily_leaderboard').select('*').order('rank').limit(50);

    query.then(({ data }) => {
      setEntries((data || []) as LeaderboardEntry[]);
      setLoading(false);
    });
  }, [tab]);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-cyber-red mb-6">Rankings</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'weekly' ? 'bg-cyber-purple text-cyber-white' : 'text-cyber-muted hover:text-cyber-white'
            }`}
          >
            Weekly XP
          </button>
          <button
            onClick={() => setTab('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'daily' ? 'bg-cyber-purple text-cyber-white' : 'text-cyber-muted hover:text-cyber-white'
            }`}
          >
            Daily Challenge
          </button>
        </div>

        <div className="bg-cyber-surface border border-cyber-purple rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-cyber-muted">Loading...</div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-cyber-muted mb-2">No rankings yet</div>
              <div className="text-cyber-muted text-sm">Complete levels and daily challenges to appear on the leaderboard!</div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-purple">
                  <th className="text-left px-4 py-3 text-cyber-muted text-xs uppercase">Rank</th>
                  <th className="text-left px-4 py-3 text-cyber-muted text-xs uppercase">Player</th>
                  <th className="text-right px-4 py-3 text-cyber-muted text-xs uppercase">
                    {tab === 'weekly' ? 'XP' : 'Time'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={i}
                    className={`border-b border-cyber-purple/30 ${
                      entry.rank <= 3 ? 'bg-cyber-purple/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className={`font-bold ${
                        entry.rank === 1 ? 'text-cyber-yellow' :
                        entry.rank === 2 ? 'text-gray-400' :
                        entry.rank === 3 ? 'text-amber-600' :
                        'text-cyber-muted'
                      }`}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-cyber-white font-medium">{entry.display_name || entry.username}</div>
                      <div className="text-cyber-muted text-xs">@{entry.username}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-cyber-green font-bold">{entry.total_xp} XP</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
