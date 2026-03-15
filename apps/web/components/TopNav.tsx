'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/', label: 'Play' },
  { href: '/arcs', label: 'Arcs' },
  { href: '/skills', label: 'Skills' },
  { href: '/daily', label: 'Daily' },
  { href: '/rankings', label: 'Rankings' },
  { href: '/sandbox', label: 'Sandbox' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { totalXP, completedLevels, currentStreak } = useGameStore();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname.startsWith('/play/')) return null;

  return (
    <>
      <nav className="h-12 bg-cyber-surface border-b border-cyber-purple flex items-center px-4 justify-between relative z-50">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-cyber-green font-bold text-lg tracking-wider">
            CLI QUEST
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-cyber-purple text-cyber-white'
                    : 'text-cyber-muted hover:text-cyber-white hover:bg-cyber-purple/30'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyber-yellow text-sm font-medium">{totalXP} XP</span>
          {currentStreak > 0 && <span className="text-cyber-red text-sm hidden sm:inline">🔥 {currentStreak}</span>}
          <span className="text-cyber-muted text-sm hidden sm:inline">{completedLevels.length} lvl</span>
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
              <button onClick={signOut} className="text-cyber-muted text-xs hover:text-cyber-white hidden sm:block">
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
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-cyber-muted hover:text-cyber-white p-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {mobileOpen ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cyber-surface border-b border-cyber-purple px-4 py-2 space-y-1 z-40">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm ${
                pathname === item.href
                  ? 'bg-cyber-purple text-cyber-white'
                  : 'text-cyber-muted hover:text-cyber-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-cyber-muted text-sm">
              Sign out
            </button>
          )}
        </div>
      )}
    </>
  );
}
