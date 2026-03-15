'use client';

import { useProgressSync } from '@/hooks/useProgressSync';

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  useProgressSync();
  return <>{children}</>;
}
