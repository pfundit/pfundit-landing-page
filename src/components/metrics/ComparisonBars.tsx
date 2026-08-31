'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BarItem {
  id?: string | number;
  label: string;
  value: number;
  color?: string;
}

interface ComparisonBarsProps {
  items: BarItem[];
  max?: number;
  className?: string;
}

export function ComparisonBars({ items, max, className }: ComparisonBarsProps) {
  const computedMax = max ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {items.map((it) => {
        const pct = Math.max(0, Math.min(100, (it.value / computedMax) * 100));
        return (
          <div key={it.id ?? it.label} className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-slate-400 w-28">{it.label}</div>
            <div className="relative flex-1 h-3 rounded-full bg-white/6 dark:bg-white/4 overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 bottom-0 rounded-full"
                style={{ background: it.color ?? 'linear-gradient(90deg,#00d4ff,#6b63ff)' }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
            <div className="w-20 text-right text-sm font-medium text-gray-900 dark:text-slate-50">{it.value}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ComparisonBars;
