'use client';

import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import ReviewQueue from '@/components/ReviewQueue';
import PageTransition from '@/components/PageTransition';

export default function Home() {
  const { completedLevels, totalXP, commandsExecuted } = useGameStore();

  const tutorialCompleted = completedLevels.filter(l => l.startsWith('tutorial')).length;
  const ghostCompleted = completedLevels.filter(l => l.startsWith('ghost')).length;
  const missionCompleted = completedLevels.filter(l => l.startsWith('mission')).length;
  const startupCompleted = completedLevels.filter(l => l.startsWith('startup')).length;
  const heistCompleted = completedLevels.filter(l => l.startsWith('heist')).length;
  const hasStarted = completedLevels.length > 0;

  return (
    <PageTransition>
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-cyber-green mb-4 tracking-wider glow-green">
            CLI QUEST
          </h1>
          <p className="text-xl text-cyber-white mb-2">
            Master the Command Line Through Adventure
          </p>
          <p className="text-cyber-muted">
            Learn real CLI skills through narrative-driven challenges
          </p>
        </div>

        {/* Start / Continue */}
        {!hasStarted ? (
          <div className="text-center mb-8">
            <Link
              href="/play/tutorial-1"
              className="inline-block px-8 py-4 bg-cyber-green text-cyber-bg font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
            >
              Start Your Journey
            </Link>
            <p className="text-cyber-muted text-sm mt-3">
              No experience needed — we&apos;ll teach you everything
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Tutorial Card */}
          <Link
            href={tutorialCompleted >= 10 ? '/arcs/tutorial' : `/play/tutorial-${Math.min(tutorialCompleted + 1, 10)}`}
            className="bg-cyber-gradient border border-cyber-green/40 rounded-xl p-6 hover:border-cyber-green transition-colors group"
          >
            <div className="text-cyber-green text-sm font-medium mb-2">TUTORIAL</div>
            <h2 className="text-2xl font-bold text-cyber-white mb-2 group-hover:text-cyber-green transition-colors">
              Learn the Basics
            </h2>
            <p className="text-cyber-muted text-sm mb-4">
              A gentle introduction to the command line. Perfect for beginners.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-cyber-surface rounded-full h-2 flex-1">
                <div
                  className="bg-cyber-green rounded-full h-2 transition-all"
                  style={{ width: `${(tutorialCompleted / 10) * 100}%` }}
                />
              </div>
              <span className="text-cyber-muted text-xs">{tutorialCompleted}/10</span>
            </div>
          </Link>

          {/* Story Arc Card */}
          <Link
            href={ghostCompleted > 0 ? '/arcs/ghost' : '/play/ghost-1-1'}
            className="bg-cyber-gradient border border-purple-500/40 rounded-xl p-6 hover:border-purple-400 transition-colors group"
          >
            <div className="text-purple-400 text-sm font-medium mb-2">STORY ARC</div>
            <h2 className="text-2xl font-bold text-cyber-white mb-2 group-hover:text-purple-400 transition-colors">
              Ghost in the Machine
            </h2>
            <p className="text-cyber-muted text-sm mb-4">
              A cybersecurity thriller. Investigate anomalous server activity at NovaCorp.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-cyber-surface rounded-full h-2 flex-1">
                <div
                  className="bg-purple-500 rounded-full h-2 transition-all"
                  style={{ width: `${(ghostCompleted / 18) * 100}%` }}
                />
              </div>
              <span className="text-cyber-muted text-xs">{ghostCompleted}/18</span>
            </div>
          </Link>

          {/* Mission Control Card */}
          <Link
            href={missionCompleted > 0 ? '/arcs/mission' : '/play/mission-1-1'}
            className="bg-cyber-gradient border border-cyber-teal/40 rounded-xl p-6 hover:border-cyber-teal transition-colors group"
          >
            <div className="text-cyber-teal text-sm font-medium mb-2">STORY ARC</div>
            <h2 className="text-2xl font-bold text-cyber-white mb-2 group-hover:text-cyber-teal transition-colors">
              Mission Control
            </h2>
            <p className="text-cyber-muted text-sm mb-4">
              Maintain and repair Space Station Artemis. Your commands keep the crew alive.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-cyber-surface rounded-full h-2 flex-1">
                <div
                  className="bg-cyber-teal rounded-full h-2 transition-all"
                  style={{ width: `${(missionCompleted / 9) * 100}%` }}
                />
              </div>
              <span className="text-cyber-muted text-xs">{missionCompleted}/9</span>
            </div>
          </Link>

          {/* Startup Mode Card */}
          <Link
            href={startupCompleted > 0 ? '/arcs/startup' : '/play/startup-1-1'}
            className="bg-cyber-gradient border border-cyber-red/40 rounded-xl p-6 hover:border-cyber-red transition-colors group"
          >
            <div className="text-cyber-red text-sm font-medium mb-2">STORY ARC</div>
            <h2 className="text-2xl font-bold text-cyber-white mb-2 group-hover:text-cyber-red transition-colors">
              Startup Mode
            </h2>
            <p className="text-cyber-muted text-sm mb-4">
              Solo DevOps at a viral startup. Fix everything before the investors notice.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-cyber-surface rounded-full h-2 flex-1">
                <div
                  className="bg-cyber-red rounded-full h-2 transition-all"
                  style={{ width: `${(startupCompleted / 9) * 100}%` }}
                />
              </div>
              <span className="text-cyber-muted text-xs">{startupCompleted}/9</span>
            </div>
          </Link>

          {/* Data Heist Card */}
          <Link
            href={heistCompleted > 0 ? '/arcs/heist' : '/play/heist-1-1'}
            className="bg-cyber-gradient border border-cyber-yellow/40 rounded-xl p-6 hover:border-cyber-yellow transition-colors group"
          >
            <div className="text-cyber-yellow text-sm font-medium mb-2">STORY ARC</div>
            <h2 className="text-2xl font-bold text-cyber-white mb-2 group-hover:text-cyber-yellow transition-colors">
              Data Heist
            </h2>
            <p className="text-cyber-muted text-sm mb-4">
              Digital forensics. Trace a data breach and build the case for prosecution.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-cyber-surface rounded-full h-2 flex-1">
                <div
                  className="bg-cyber-yellow rounded-full h-2 transition-all"
                  style={{ width: `${(heistCompleted / 9) * 100}%` }}
                />
              </div>
              <span className="text-cyber-muted text-xs">{heistCompleted}/9</span>
            </div>
          </Link>
        </div>

        {/* Review Queue */}
        <ReviewQueue />

        {/* Daily Challenge Card */}
        <Link
          href="/daily"
          className="block bg-cyber-gradient border border-cyber-red/30 rounded-xl p-6 hover:border-cyber-red transition-colors group mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-cyber-red text-sm font-medium mb-1">TODAY&apos;S CHALLENGE</div>
              <h2 className="text-xl font-bold text-cyber-white group-hover:text-cyber-red transition-colors">
                Daily Challenge
              </h2>
              <p className="text-cyber-muted text-sm mt-1">
                A new challenge every day. Three difficulty tiers. Compete on the leaderboard.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-cyber-surface text-cyber-green px-2 py-1 rounded text-xs">Quick</span>
              <span className="bg-cyber-surface text-cyber-yellow px-2 py-1 rounded text-xs">Standard</span>
              <span className="bg-cyber-surface text-cyber-red px-2 py-1 rounded text-xs">Hard</span>
            </div>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-green mb-1">{totalXP}</div>
            <div className="text-cyber-muted text-sm">Total XP</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-yellow mb-1">{completedLevels.length}</div>
            <div className="text-cyber-muted text-sm">Levels Complete</div>
          </div>
          <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-cyber-teal mb-1">{commandsExecuted}</div>
            <div className="text-cyber-muted text-sm">Commands Run</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/arcs"
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 hover:border-cyber-green transition-colors text-center"
          >
            <div className="text-cyber-green font-medium">All Arcs</div>
            <div className="text-cyber-muted text-xs mt-1">Browse chapters</div>
          </Link>
          <Link
            href="/sandbox"
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 hover:border-cyber-teal transition-colors text-center"
          >
            <div className="text-cyber-teal font-medium">Sandbox</div>
            <div className="text-cyber-muted text-xs mt-1">Free exploration</div>
          </Link>
          <Link
            href="/skills"
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 hover:border-cyber-yellow transition-colors text-center"
          >
            <div className="text-cyber-yellow font-medium">Skill Tree</div>
            <div className="text-cyber-muted text-xs mt-1">Track mastery</div>
          </Link>
          <Link
            href="/rankings"
            className="bg-cyber-surface border border-cyber-purple rounded-xl p-4 hover:border-cyber-red transition-colors text-center"
          >
            <div className="text-cyber-red font-medium">Rankings</div>
            <div className="text-cyber-muted text-xs mt-1">Leaderboards</div>
          </Link>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
