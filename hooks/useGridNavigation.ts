'use client';

import { useEffect } from 'react';

interface UseGridNavigationOptions {
  itemCount: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onConfirm: () => void;
  additionalKeys?: (e: KeyboardEvent) => boolean;
}

export function useGridNavigation({
  itemCount,
  selectedIndex,
  onSelect,
  onConfirm,
  additionalKeys,
}: UseGridNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (additionalKeys?.(e)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          onSelect((selectedIndex + 1) % itemCount);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          onSelect((selectedIndex - 1 + itemCount) % itemCount);
          break;
        case 'Enter':
          e.preventDefault();
          onConfirm();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itemCount, selectedIndex, onSelect, onConfirm, additionalKeys]);
}
