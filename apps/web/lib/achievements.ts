import { supabase } from './supabase';
import { triggerAchievementToast } from '@/components/AchievementToast';
import { playAchievementSound } from './sounds';

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (ctx: AchievementContext) => boolean;
};

type AchievementContext = {
  completedLevels: string[];
  totalXP: number;
  commandsExecuted: number;
  commandsUsed: string[];
};

export const achievementDefinitions: AchievementDef[] = [
  // Progression
  { id: 'first_steps', title: 'First Steps', description: 'Complete your first level', icon: '🌱', check: (c) => c.completedLevels.length >= 1 },
  { id: 'getting_started', title: 'Getting Started', description: 'Complete 5 levels', icon: '📗', check: (c) => c.completedLevels.length >= 5 },
  { id: 'committed', title: 'Committed', description: 'Complete 10 levels', icon: '📘', check: (c) => c.completedLevels.length >= 10 },
  { id: 'dedicated', title: 'Dedicated', description: 'Complete 20 levels', icon: '📕', check: (c) => c.completedLevels.length >= 20 },
  { id: 'completionist', title: 'Completionist', description: 'Complete all 28 levels', icon: '👑', check: (c) => c.completedLevels.length >= 28 },

  // Tutorial
  { id: 'tutorial_done', title: 'Graduate', description: 'Complete the tutorial track', icon: '🎓', check: (c) => c.completedLevels.filter(l => l.startsWith('tutorial')).length >= 10 },

  // Story arc
  { id: 'ch1_done', title: 'Orientation Complete', description: 'Finish Chapter 1 of Ghost in the Machine', icon: '🔍', check: (c) => ['ghost-1-1','ghost-1-2','ghost-1-3','ghost-1-4','ghost-1-5'].every(l => c.completedLevels.includes(l)) },
  { id: 'ch4_done', title: 'Case Closed', description: 'Finish the entire Ghost in the Machine arc', icon: '🏆', check: (c) => c.completedLevels.filter(l => l.startsWith('ghost')).length >= 18 },

  // Skill-based
  { id: 'pipe_dream', title: 'Pipe Dream', description: 'Use a pipe command', icon: '🔗', check: (c) => c.commandsUsed.some(cmd => cmd === 'wc' || cmd === 'sort' || cmd === 'uniq') },
  { id: 'redirect_master', title: 'Redirect Master', description: 'Use echo with output redirection', icon: '↗️', check: (c) => c.commandsUsed.includes('echo') && c.completedLevels.includes('ghost-3-4') },
  { id: 'search_expert', title: 'Search Expert', description: 'Use both grep and find', icon: '🔎', check: (c) => c.commandsUsed.includes('grep') && c.commandsUsed.includes('find') },
  { id: 'env_hacker', title: 'Environment Hacker', description: 'Use export to set a variable', icon: '⚙️', check: (c) => c.commandsUsed.includes('export') },

  // XP
  { id: 'xp_500', title: 'XP Hunter', description: 'Earn 500 XP', icon: '⭐', check: (c) => c.totalXP >= 500 },
  { id: 'xp_1000', title: 'XP Master', description: 'Earn 1000 XP', icon: '🌟', check: (c) => c.totalXP >= 1000 },
  { id: 'xp_2000', title: 'XP Legend', description: 'Earn 2000 XP', icon: '💫', check: (c) => c.totalXP >= 2000 },

  // Commands
  { id: 'explorer_100', title: 'Explorer', description: 'Execute 100 commands', icon: '🗺️', check: (c) => c.commandsExecuted >= 100 },
  { id: 'power_user', title: 'Power User', description: 'Execute 500 commands', icon: '⚡', check: (c) => c.commandsExecuted >= 500 },

  // Hidden
  { id: 'hidden_finder', title: 'Hidden Finder', description: 'Discover hidden files with ls -a', icon: '👁️', check: (c) => c.completedLevels.includes('ghost-4-4') },
  { id: 'no_hints_ch1', title: 'Self Sufficient', description: 'Complete Chapter 1 without using hints', icon: '💪', check: () => false }, // Needs hint tracking per level
  { id: 'speed_demon', title: 'Speed Demon', description: 'Complete a level under par', icon: '🏎️', check: () => false }, // Needs par tracking
];

export async function checkAndUnlockAchievements(ctx: AchievementContext) {
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get already unlocked
  const { data: existing } = await supabase
    .from('achievements')
    .select('achievement_id')
    .eq('user_id', user.id);

  const unlocked = new Set((existing || []).map(a => a.achievement_id));
  const newlyUnlocked: AchievementDef[] = [];

  for (const achievement of achievementDefinitions) {
    if (unlocked.has(achievement.id)) continue;
    if (achievement.check(ctx)) {
      await supabase.from('achievements').insert({
        user_id: user.id,
        achievement_id: achievement.id,
      });
      newlyUnlocked.push(achievement);
      triggerAchievementToast({
        icon: achievement.icon,
        title: achievement.title,
        description: achievement.description,
      });
      playAchievementSound();
    }
  }

  return newlyUnlocked;
}
