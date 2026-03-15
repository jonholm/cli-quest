'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function XPGain({ amount, show }: { amount: number; show: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed top-20 right-8 z-50 pointer-events-none"
        >
          <div className="text-cyber-yellow text-2xl font-bold glow-green">
            +{amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
