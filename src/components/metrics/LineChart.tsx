'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  fill?: string | null;
}

function buildPath(data: number[], w: number, h: number) {
  if (!data || data.length === 0) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1 || 1);
  return data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export function LineChart({ data, width = 140, height = 40, stroke = '#00d4ff', strokeWidth = 2, className, fill = null }: LineChartProps) {
  const d = useMemo(() => buildPath(data, width, height), [data, width, height]);

  return (
    <motion.svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {fill ? <path d={`${d} L ${width} ${height} L 0 ${height} Z`} fill={fill} opacity={0.06} /> : null}
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export default LineChart;
