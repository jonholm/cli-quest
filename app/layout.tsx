import type { Metadata } from 'next';
import './globals.css';
import TerminalWindow from '@/components/TerminalWindow';

export const metadata: Metadata = {
  title: 'CLI Quest',
  description: 'Master the command line through play',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TerminalWindow>{children}</TerminalWindow>
      </body>
    </html>
  );
}
