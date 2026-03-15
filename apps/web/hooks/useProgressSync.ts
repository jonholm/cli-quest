'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useGameStore } from '@/lib/store';
import { loadProgressFromSupabase, migrateGuestProgress } from '@/lib/sync';

export function useProgressSync() {
  const { user } = useAuth();
  const synced = useRef(false);

  useEffect(() => {
    if (!user || synced.current) return;
    synced.current = true;

    const store = useGameStore.getState();
    const guestLevels = store.completedLevels;
    const guestXP = store.totalXP;

    // If guest has progress, migrate it
    if (guestLevels.length > 0) {
      migrateGuestProgress(guestLevels, guestXP);
    }

    // Load server progress (server wins for conflicts)
    loadProgressFromSupabase().then((serverProgress) => {
      if (!serverProgress) return;

      // Merge: union of completed levels, max XP
      const mergedSet = new Set([...guestLevels, ...serverProgress.completedLevels]);
      const merged = Array.from(mergedSet);
      const maxXP = Math.max(guestXP, serverProgress.totalXP);

      useGameStore.setState({
        completedLevels: merged,
        totalXP: maxXP,
      });
    });
  }, [user]);
}
