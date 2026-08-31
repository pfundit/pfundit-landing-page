'use client';

import React from 'react';
import { motion } from 'framer-motion';

type TalkToUsButtonProps = {
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export function TalkToUsButton({ onClick, type = 'button', className = '' }: TalkToUsButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D4A437] px-8 py-3.5 text-[0.95rem] font-bold text-[#0f1b3d] shadow-[0_4px_14px_rgba(212,164,55,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e8b541] hover:shadow-[0_6px_20px_rgba(212,164,55,0.5)] ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">Write to Us</span>
    </motion.button>
  );
}

export default TalkToUsButton;