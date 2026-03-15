import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/TopNav';
import SyncProvider from '@/components/SyncProvider';
import AchievementToast from '@/components/AchievementToast';

export const metadata: Metadata = {
  title: 'CLI Quest',
  description: 'Master the command line through adventure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <SyncProvider>
          <TopNav />
          <main className="flex-1 flex flex-col">{children}</main>
          <AchievementToast />
        </SyncProvider>
      </body>
    </html>
  );
}
