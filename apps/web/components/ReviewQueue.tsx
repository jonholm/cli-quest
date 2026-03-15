'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type DecayedCommand = {
  command_name: string;
  mastery_tier: string;
  last_used_at: string;
};

export default function ReviewQueue() {
  const { user } = useAuth();
  const [decayed, setDecayed] = useState<DecayedCommand[]>([]);

  useEffect(() => {
    if (!supabase || !user) return;

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    supabase
      .from('command_mastery')
      .select('command_name, mastery_tier, last_used_at')
      .eq('user_id', user.id)
      .lt('last_used_at', sevenDaysAgo)
      .neq('mastery_tier', 'learned')
      .order('last_used_at')
      .limit(3)
      .then(({ data }) => {
        setDecayed(data || []);
      });
  }, [user]);

  if (decayed.length === 0) return null;

  const daysAgo = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

  return (
    <div className="bg-cyber-surface border border-cyber-yellow/30 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-cyber-yellow font-bold text-sm">REVIEW NEEDED</span>
        <span className="text-cyber-muted text-xs">Skills getting rusty</span>
      </div>
      <div className="space-y-2">
        {decayed.map((cmd) => (
          <div key={cmd.command_name} className="flex items-center justify-between bg-cyber-bg rounded-lg px-3 py-2">
            <div className="flex items-center gap-3">
              <code className="text-cyber-yellow font-mono text-sm">{cmd.command_name}</code>
              <span className="text-cyber-muted text-xs">
                {cmd.mastery_tier} — unused for {daysAgo(cmd.last_used_at)}d
              </span>
            </div>
            <Link
              href="/sandbox"
              className="text-cyber-yellow text-xs hover:text-cyber-white"
            >
              Practice →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
