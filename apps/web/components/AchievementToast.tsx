'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

type ToastData = { icon: string; title: string; description: string };

let showToastGlobal: ((data: ToastData) => void) | null = null;

export function triggerAchievementToast(data: ToastData) {
  showToastGlobal?.(data);
}

export default function AchievementToast() {
  const [queue, setQueue] = useState<ToastData[]>([]);
  const [current, setCurrent] = useState<ToastData | null>(null);

  const showNext = useCallback(() => {
    setQueue((q) => {
      if (q.length === 0) {
        setCurrent(null);
        return q;
      }
      const [next, ...rest] = q;
      setCurrent(next);
      return rest;
    });
  }, []);

  useEffect(() => {
    showToastGlobal = (data: ToastData) => {
      setQueue((q) => [...q, data]);
    };
    return () => { showToastGlobal = null; };
  }, []);

  useEffect(() => {
    if (!current && queue.length > 0) {
      showNext();
    }
  }, [queue, current, showNext]);

  useEffect(() => {
    if (current) {
      const timer = setTimeout(() => {
        setCurrent(null);
        setTimeout(showNext, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [current, showNext]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-cyber-surface border-2 border-cyber-green rounded-xl p-4 shadow-2xl max-w-sm flex items-center gap-4">
            <div className="text-3xl">{current.icon}</div>
            <div>
              <div className="text-cyber-green font-bold text-sm">ACHIEVEMENT UNLOCKED</div>
              <div className="text-cyber-white font-medium">{current.title}</div>
              <div className="text-cyber-muted text-xs">{current.description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
