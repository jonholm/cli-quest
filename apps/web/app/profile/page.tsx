'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { achievementDefinitions } from '@/lib/achievements';

export default function Profile() {
  const { totalXP, completedLevels, commandsExecuted, currentStreak } = useGameStore();
  const { user } = useAuth();
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [streakFromDB, setStreakFromDB] = useState<{ current: number; longest: number } | null>(null);

  useEffect(() => {
    if (!supabase || !user) return;

    supabase
      .from('achievements')
      .select('achievement_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setUnlockedIds(new Set((data || []).map((a) => a.achievement_id)));
      });

    supabase
      .from('users')
      .select('current_streak, longest_streak')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setStreakFromDB({ current: data.current_streak, longest: data.longest_streak });
      });
  }, [user]);

  const streak = streakFromDB?.current || currentStreak;
  const longestStreak = streakFromDB?.longest || currentStreak;

  const playerLevel =
    totalXP >= 5000 ? 'Principal' :
    totalXP >= 3000 ? 'Staff' :
    totalXP >= 1500 ? 'Senior' :
    totalXP >= 750 ? 'Mid' :
    totalXP >= 250 ? 'Junior' : 'Intern';

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-cyber-purple flex items-center justify-center text-cyber-green text-2xl font-bold">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              (user?.email || 'G')[0].toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-cyber-white">
              {user?.user_metadata?.full_name || user?.email || 'Guest'}
            </h1>
            <div className="text-cyber-green font-medium">{playerLevel}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-green mb-1">{totalXP}</div>
            <div className="text-cyber-muted text-sm">Total XP</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-yellow mb-1">{completedLevels.length}</div>
            <div className="text-cyber-muted text-sm">Levels</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-red mb-1">{streak}</div>
            <div className="text-cyber-muted text-sm">Day Streak</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-teal mb-1">{commandsExecuted}</div>
            <div className="text-cyber-muted text-sm">Commands</div>
          </div>
        </div>

        {longestStreak > 0 && (
          <div className="text-cyber-muted text-sm mb-6">Longest streak: {longestStreak} days</div>
        )}

        <h2 className="text-2xl font-bold text-cyber-white mb-4">
          Achievements ({unlockedIds.size}/{achievementDefinitions.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementDefinitions.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            return (
              <div
                key={a.id}
                className={`border rounded-xl p-4 transition-all ${
                  unlocked
                    ? 'border-cyber-green/50 bg-cyber-green/5'
                    : 'border-cyber-purple/30 bg-cyber-surface opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{a.icon}</div>
                  <div>
                    <div className={`font-bold ${unlocked ? 'text-cyber-white' : 'text-cyber-muted'}`}>
                      {a.title}
                    </div>
                    <div className="text-cyber-muted text-xs">{a.description}</div>
                  </div>
                  {unlocked && <span className="ml-auto text-cyber-green text-sm">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
