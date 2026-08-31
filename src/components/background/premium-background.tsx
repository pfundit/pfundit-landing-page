'use client';

import { motion } from 'framer-motion';

export function PremiumBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 10% 4%, rgba(212,164,55,0.1), transparent 34%), radial-gradient(circle at 94% 12%, rgba(15,27,61,0.08), transparent 32%), radial-gradient(circle at 78% 84%, rgba(25,42,79,0.06), transparent 36%), linear-gradient(180deg, #fbfaf8 0%, #f6f7fb 44%, #f6f6f2 100%)',
        }}
      />

      <motion.div
        className="absolute -left-40 -top-28 h-[min(78vw,34rem)] w-[min(78vw,34rem)] rounded-full"
        style={{ background: 'radial-gradient(circle at center, rgba(212,164,55,0.14), transparent 72%)' }}
        animate={{ x: [0, 14, 0], y: [0, 10, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute right-[-10rem] top-[18%] h-[min(80vw,33rem)] w-[min(80vw,33rem)] rounded-full"
        style={{ background: 'radial-gradient(circle at center, rgba(15,27,61,0.11), transparent 70%)' }}
        animate={{ x: [0, -14, 0], y: [0, -9, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute bottom-[-12rem] left-[28%] h-[min(70vw,28rem)] w-[min(70vw,28rem)] rounded-full"
        style={{ background: 'radial-gradient(circle at center, rgba(114,130,168,0.08), transparent 70%)' }}
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />

      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 16%, rgba(212,164,55,0.12), transparent 22%), radial-gradient(circle at 84% 72%, rgba(15,27,61,0.09), transparent 24%)',
          filter: 'blur(36px)',
        }}
      />

      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,24,40,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,24,40,0.04) 1px, transparent 1px)',
          backgroundSize: 'clamp(24px, 5vw, 44px) clamp(24px, 5vw, 44px)',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.55), transparent 84%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-28"
        style={{
          backgroundImage: 'radial-gradient(rgba(16,24,40,0.08) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 74%)',
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.26, 0.38, 0.26] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(65% 45% at 16% 8%, rgba(255,255,255,0.26), transparent 70%), radial-gradient(55% 42% at 90% 3%, rgba(255,255,255,0.2), transparent 72%)',
        }}
      />
    </div>
  );
}
