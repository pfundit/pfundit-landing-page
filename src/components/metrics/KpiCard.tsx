'use client';

import React from 'react';
import AnimatedNumber from './AnimatedNumber';
import LineChart from './LineChart';
import { ScrollReveal } from '@/animations';

interface KpiCardProps {
  title: string;
  value: number;
  change?: number; // percent
  subtitle?: string;
  sparkline?: number[];
  className?: string;
}

export function KpiCard({ title, value, change, subtitle, sparkline = [], className }: KpiCardProps) {
  const changeColor = change && change >= 0 ? 'text-[#027a48]' : 'text-[#b42318]';

  return (
    <ScrollReveal>
      <article className={`surface-card rounded-xl p-6 ${className || ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[0.84rem] font-semibold tracking-[0.02em] leading-[1.4] text-[#667085]">{title}</div>
            <div className="flex items-baseline gap-3">
              <div className="text-[clamp(1.34rem,1.23rem+0.54vw,1.72rem)] font-[560] leading-[1.2] tracking-[-0.018em] text-[#101828]">
                <AnimatedNumber value={value} duration={1200} />
              </div>
              {typeof change === 'number' && (
                <div className={`text-[0.88rem] font-medium ${changeColor}`}>{change > 0 ? `+${change}%` : `${change}%`}</div>
              )}
            </div>
            {subtitle && <div className="mt-1 text-[0.9rem] leading-[1.55] text-[#667085]">{subtitle}</div>}
          </div>

          <div className="w-32 h-12 flex items-center justify-end opacity-90">
            <LineChart data={sparkline} width={120} height={48} stroke="#175cd3" strokeWidth={1.75} />
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default KpiCard;
