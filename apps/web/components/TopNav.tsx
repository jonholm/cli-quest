'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/', label: 'Play' },
  { href: '/arcs', label: 'Arcs' },
  { href: '/skills', label: 'Skill Tree' },
  { href: '/daily', label: 'Daily' },
  { href: '/rankings', label: 'Rankings' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { totalXP, completedLevels, currentStreak } = useGameStore();
  const { user, signOut } = useAuth();

  // Hide nav during gameplay
  if (pathname.startsWith('/play/')) return null;

  return (
    <nav className="h-12 bg-cyber-surface border-b border-cyber-purple flex items-center px-4 justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-cyber-green font-bold text-lg tracking-wider">
          CLI QUEST
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-cyber-purple text-cyber-white'
                    : 'text-cyber-muted hover:text-cyber-white hover:bg-cyber-purple/30'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/sandbox"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              pathname === '/sandbox'
                ? 'bg-cyber-purple text-cyber-white'
                : 'text-cyber-muted hover:text-cyber-white hover:bg-cyber-purple/30'
            }`}
          >
            Sandbox
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-cyber-yellow text-sm font-medium">{totalXP} XP</span>
        {currentStreak > 0 && <span className="text-cyber-red text-sm">🔥 {currentStreak}</span>}
        <span className="text-cyber-muted text-sm">{completedLevels.length} levels</span>
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-cyber-purple flex items-center justify-center text-cyber-green text-xs font-bold hover:bg-cyber-purple-light transition-colors overflow-hidden"
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (user.user_metadata?.preferred_username || user.email || 'U')[0].toUpperCase()
              )}
            </Link>
            <button
              onClick={signOut}
              className="text-cyber-muted text-xs hover:text-cyber-white"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="px-3 py-1.5 bg-cyber-green text-cyber-bg text-sm font-bold rounded-md hover:opacity-90 transition-opacity"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
