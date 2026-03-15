import type { Metadata } from 'next';
import './globals.css';
import TopNav from '@/components/TopNav';

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
        <TopNav />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
