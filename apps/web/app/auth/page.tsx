'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const router = useRouter();
  const { user, signInWithGitHub, signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Already signed in — redirect
  if (user) {
    router.push('/');
    return null;
  }

  const handleEmailSignIn = async () => {
    if (!email) return;
    await signInWithEmail(email);
    setEmailSent(true);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyber-green mb-2 glow-green">CLI QUEST</h1>
          <p className="text-cyber-muted">Sign in to save your progress across devices</p>
        </div>

        <div className="bg-cyber-surface border border-cyber-purple rounded-xl p-6 space-y-4">
          <button
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-cyber-bg border border-cyber-purple rounded-lg hover:border-cyber-green transition-colors"
            onClick={signInWithGitHub}
          >
            <svg className="w-5 h-5 text-cyber-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span className="text-cyber-white font-medium">Continue with GitHub</span>
          </button>

          <button
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-cyber-bg border border-cyber-purple rounded-lg hover:border-cyber-green transition-colors"
            onClick={signInWithGoogle}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-cyber-white font-medium">Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyber-purple" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cyber-surface text-cyber-muted">or</span>
            </div>
          </div>

          {emailSent ? (
            <div className="text-center py-4">
              <div className="text-cyber-green font-bold mb-2">Check your email!</div>
              <p className="text-cyber-muted text-sm">
                We sent a magic link to <span className="text-cyber-white">{email}</span>
              </p>
            </div>
          ) : (
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 bg-cyber-bg border border-cyber-purple rounded-lg text-cyber-white placeholder-cyber-muted focus:outline-none focus:border-cyber-green"
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSignIn()}
              />
              <button
                onClick={handleEmailSignIn}
                className="w-full mt-3 px-4 py-3 bg-cyber-green text-cyber-bg font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Send Magic Link
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-cyber-muted text-sm hover:text-cyber-white"
          >
            Continue as Guest →
          </button>
          <p className="text-cyber-muted text-xs mt-2">
            Guest progress is saved locally. Sign in to sync across devices.
          </p>
        </div>
      </div>
    </div>
  );
}
