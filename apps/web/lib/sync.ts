'use client';

import { supabase } from './supabase';

export async function syncLevelCompletion(
  levelId: string,
  commandsUsed: number,
  hintsUsed: number,
  parAchieved: boolean,
  timeSeconds: number,
  xpReward: number
) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Upsert level completion
  await supabase.from('user_progress').upsert(
    {
      user_id: user.id,
      level_id: levelId,
      commands_used: commandsUsed,
      hints_used: hintsUsed,
      par_achieved: parAchieved,
      time_seconds: timeSeconds,
    },
    { onConflict: 'user_id,level_id' }
  );

  // Update user XP (fetch current then add)
  const { data: profile } = await supabase
    .from('users')
    .select('total_xp')
    .eq('id', user.id)
    .single();

  if (profile) {
    await supabase
      .from('users')
      .update({ total_xp: profile.total_xp + xpReward })
      .eq('id', user.id);
  }
}

export async function syncCommandMastery(commandsUsed: string[]) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Count occurrences
  const counts: Record<string, number> = {};
  for (const cmd of commandsUsed) {
    counts[cmd] = (counts[cmd] || 0) + 1;
  }

  for (const [command, count] of Object.entries(counts)) {
    const { data: existing } = await supabase
      .from('command_mastery')
      .select('times_used')
      .eq('user_id', user.id)
      .eq('command_name', command)
      .single();

    const newCount = (existing?.times_used || 0) + count;
    const tier = newCount >= 25 ? 'mastered' : newCount >= 10 ? 'practiced' : 'learned';

    await supabase.from('command_mastery').upsert(
      {
        user_id: user.id,
        command_name: command,
        times_used: newCount,
        mastery_tier: tier,
        last_used_at: new Date().toISOString(),
        decay_notified: false,
      },
      { onConflict: 'user_id,command_name' }
    );
  }
}

export async function updateStreak() {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from('users')
    .select('current_streak, longest_streak, last_active_date, streak_freezes_remaining')
    .eq('id', user.id)
    .single();

  if (!profile) return;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.last_active_date;

  if (lastActive === today) return; // Already active today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak: number;

  if (lastActive === yesterday) {
    // Consecutive day
    newStreak = profile.current_streak + 1;
  } else if (lastActive && lastActive < yesterday && profile.streak_freezes_remaining > 0) {
    // Missed a day but have freeze
    newStreak = profile.current_streak + 1;
    await supabase.from('users').update({
      streak_freezes_remaining: profile.streak_freezes_remaining - 1,
    }).eq('id', user.id);
  } else {
    // Streak broken
    newStreak = 1;
  }

  await supabase.from('users').update({
    current_streak: newStreak,
    longest_streak: Math.max(newStreak, profile.longest_streak),
    last_active_date: today,
  }).eq('id', user.id);
}

export async function loadProgressFromSupabase(): Promise<{
  completedLevels: string[];
  totalXP: number;
  commandsExecuted: number;
} | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [progressResult, profileResult] = await Promise.all([
    supabase.from('user_progress').select('level_id').eq('user_id', user.id),
    supabase.from('users').select('total_xp').eq('id', user.id).single(),
  ]);

  const completedLevels = (progressResult.data || []).map((p) => p.level_id);
  const totalXP = profileResult.data?.total_xp || 0;

  return { completedLevels, totalXP, commandsExecuted: 0 };
}

export async function migrateGuestProgress(
  completedLevels: string[],
  totalXP: number
) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Insert level completions that don't exist server-side
  for (const levelId of completedLevels) {
    await supabase.from('user_progress').upsert(
      { user_id: user.id, level_id: levelId, commands_used: 0, hints_used: 0 },
      { onConflict: 'user_id,level_id' }
    );
  }

  // Update XP
  await supabase.from('users').update({ total_xp: totalXP }).eq('id', user.id);
}
