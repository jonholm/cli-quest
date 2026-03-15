'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'Play' },
  { href: '/skills', label: 'Skill Tree' },
  { href: '/daily', label: 'Daily' },
  { href: '/rankings', label: 'Rankings' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { totalXP, completedLevels } = useGameStore();

  // Hide nav during gameplay
  const isPlaying = pathname.startsWith('/play/');

  if (isPlaying) return null;

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
        <span className="text-cyber-muted text-sm">{completedLevels.length} levels</span>
        <Link
          href="/profile"
          className="w-8 h-8 rounded-full bg-cyber-purple flex items-center justify-center text-cyber-green text-xs font-bold hover:bg-cyber-purple-light transition-colors"
        >
          U
        </Link>
      </div>
    </nav>
  );
}
