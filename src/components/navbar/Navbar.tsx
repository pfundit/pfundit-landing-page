'use client';

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { TalkToUsButton } from '@/components/button';

const navLinks = [
  { id: 'mission', label: 'Company' },
  { id: 'ai-edge', label: 'AI Edge' },
  { id: 'platform', label: 'Platform', href: '/platform' },
  { id: 'leadership', label: 'Founders' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'governance', label: 'Governance' },
];

const companyItems = [
  {
    id: 'mission',
    title: 'Mission & Vision',
    description: 'Why we exist and where we are headed',
  },
  {
    id: 'thesis',
    title: 'What We Are Building',
    description: 'The AI-native credit infrastructure',
  },
];

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      style={{ position: 'relative' }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHiringPage = pathname === '/hiring';
  const isPlatformPage = pathname === '/platform';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isUserClick, setIsUserClick] = useState(false);
  const userClickRef = useRef(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsScrolled(window.scrollY > 20);
    }
  }, []);
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, opacity: 0 });
  const hiringStripRef = useRef<HTMLDivElement>(null);
  const navHeight = useTransform(scrollY, [0, 50], ['88px', '64px']);
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(247, 246, 242, 0.0)', 'rgba(249, 248, 244, 0.96)']
  );
  const navBorderColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(15, 27, 61, 0)', 'rgba(15, 27, 61, 0.12)']
  );

  // Always dark nav since backgrounds are light or forced white
  const showDarkNav = true;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (userClickRef.current) return; // Skip scroll detection if user just clicked
        const offset = headerRef.current?.offsetHeight ?? 88;
        const scrollPos = window.scrollY + offset + 8;
        let current = '';
        for (const link of navLinks) {
          const el = document.getElementById(link.id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) current = link.id;
        }
        setActiveSection(current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      const container = navContainerRef.current;
      if (!container) return setUnderline((u) => ({ ...u, opacity: 0 }));
      const activeEl = navRefs.current[activeSection];
      if (activeEl) {
        const cRect = container.getBoundingClientRect();
        const aRect = activeEl.getBoundingClientRect();
        setUnderline({ left: aRect.left - cRect.left, width: aRect.width, opacity: 1 });
      } else {
        setUnderline({ left: 0, width: 0, opacity: 0 });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeSection]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      void latest;
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setCompanyMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const navNode = navContainerRef.current;
      if (navNode && !navNode.contains(target)) {
        setCompanyMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setCompanyMenuOpen(false);
    if (pathname !== '/') {
      // Navigate back to home page with the hash
      router.push(`/#${id}`);
      return;
    }
    setActiveSection(id);
    userClickRef.current = true;
    setTimeout(() => {
      userClickRef.current = false;
    }, 1200);
    const element = document.getElementById(id);
    if (element) {
      const offset = headerRef.current?.offsetHeight ?? 88;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={headerRef} className="fixed left-0 top-0 z-[100] w-full flex flex-col">
      {/* Hiring strip — hidden on the /hiring page itself */}
      {!isHiringPage && (
        <div
          ref={hiringStripRef}
          className="relative flex min-h-[42px] w-full items-center border-b border-[#d4a437]/25 bg-[#d4a437] text-navy shadow-[0_4px_16px_rgba(212,164,55,0.15)]"
        >
          <div className="layout-shell editorial-container">
            <Link
              href="/hiring"
              scroll={true}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
                const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate: boolean }) => void } }).__lenis;
                if (lenis?.scrollTo) {
                  lenis.scrollTo(0, { immediate: true });
                }
              }}
              className="group relative flex w-full max-w-full items-center justify-center gap-2 py-2 px-4 overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 overflow-hidden w-full max-w-4xl">
                <span className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full p-[1px] bg-navy/15">
                  {/* Glowing revolving border beam */}
                  <span className="absolute inset-[-200%] animate-border-beam bg-border-beam" />

                  {/* Foreground inner content */}
                  <span className="relative z-10 rounded-full bg-navy px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-gold">
                    Hiring
                  </span>
                </span>
                <span className="truncate text-[clamp(0.75rem,2vw,0.9rem)] font-medium tracking-[-0.015em] text-navy/95">
                  — We are building the founding team in India — roles across credit, risk, compliance, technology and business development
                </span>
                <span className="shrink-0 text-navy/95 transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      <motion.nav
        style={{
          height: navHeight,
          backgroundColor: isPlatformPage ? 'rgba(249, 248, 244, 0.96)' : navBackground,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: isPlatformPage ? 'rgba(15, 27, 61, 0.12)' : navBorderColor,
        }}
        className="relative w-full transition-all duration-300 flex items-center"
      >
        <div className="flex w-full items-center justify-between px-4 lg:px-16" style={{ paddingInline: 'clamp(12px, 5vw, 96px)' }}>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              if (pathname !== '/') {
                router.push('/');
                return;
              }

              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center"
            aria-label="Pfundit Home"
          >
            <Image
              src="/logo-main.svg"
              alt="Pfundit"
              width={2378}
              height={699}
              className="h-6 sm:h-[26px] w-auto object-contain"
              priority
            />
          </motion.button>

          <div
            className="relative hidden items-center gap-7 lg:flex"
            ref={navContainerRef}
            onMouseLeave={() => setCompanyMenuOpen(false)}
          >
            <div className="relative">
              {(() => {
                const companyActive = companyMenuOpen || activeSection === 'mission' || activeSection === 'thesis';
                return (
                  <>
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setCompanyMenuOpen((open) => !open)}
                      onMouseEnter={() => setCompanyMenuOpen(true)}
                      onFocus={() => setCompanyMenuOpen(true)}
                      aria-expanded={companyMenuOpen}
                      aria-haspopup="menu"
                      className={`group relative inline-flex items-center gap-2 px-2 py-1 text-[0.92rem] font-medium tracking-[-0.02em] transition-colors duration-300 ${companyActive ? 'text-navy' : 'text-navy/55 hover:text-navy'}`}
                    >
                      <span>Company</span>
                      <motion.svg
                        animate={{ rotate: companyMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-4 w-4 text-gold"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </motion.button>

                    <motion.div
                      className="absolute left-2 right-2 -bottom-0.5 h-[2px] rounded bg-gold"
                      animate={{ opacity: companyActive ? 1 : 0, scaleX: companyActive ? 1 : 0.7 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.7 }}
                      style={{ transformOrigin: 'left' }}
                    />

                    <AnimatePresence>
                      {companyMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute left-0 top-full pt-4 z-50"
                        >
                          <div className="w-[20.5rem] overflow-hidden rounded-[1.25rem] border border-[rgba(15,27,61,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,247,243,0.98))] p-2.5 shadow-[0_20px_44px_rgba(15,27,61,0.12)]">
                            <div className="grid gap-2">
                              {companyItems.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => scrollToSection(item.id)}
                                  className="group flex w-full items-center justify-between gap-4 rounded-[1rem] border border-[rgba(15,27,61,0.08)] bg-white px-4 py-3.5 text-left shadow-[0_6px_18px_rgba(15,27,61,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(212,164,55,0.28)] hover:shadow-[0_12px_28px_rgba(15,27,61,0.09)]"
                                >
                                  <span className="min-w-0">
                                    <span className="block text-[0.96rem] font-semibold tracking-[-0.02em] text-navy transition-colors duration-300 group-hover:text-gold">
                                      {item.title}
                                    </span>
                                    <span className="mt-0.5 block text-[0.82rem] leading-[1.35] text-navy/60">
                                      {item.description}
                                    </span>
                                  </span>
                                  <svg
                                    className="h-4 w-4 shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-0.5"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden="true"
                                  >
                                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                );
              })()}
            </div>

            {navLinks.slice(1).map((link) => (
              <motion.button
                key={link.id}
                ref={(el) => { navRefs.current[link.id] = el; }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  if (link.href) {
                    if (pathname === link.href) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate: boolean }) => void } }).__lenis;
                      if (lenis?.scrollTo) {
                        lenis.scrollTo(0, { immediate: false });
                      }
                    } else {
                      router.push(link.href);
                    }
                  } else {
                    scrollToSection(link.id);
                  }
                }}
                className={`group relative typo-body-sm px-2 py-1 transition-all duration-300 ${activeSection === link.id ? (showDarkNav ? 'text-navy' : 'text-white') : (showDarkNav ? 'text-navy/55' : 'text-white/65')} ${showDarkNav ? 'hover:text-navy' : 'hover:text-white'}`}
                aria-current={activeSection === link.id ? 'page' : undefined}
              >
                <span className="relative z-10">{link.label}</span>
              </motion.button>
            ))}
            <motion.div
              className="absolute -bottom-1 h-[2px] rounded bg-gold"
              animate={{ left: underline.left, width: underline.width, opacity: underline.opacity }}
              transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
              style={{ position: 'absolute' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 sm:gap-6"
          >
            <Magnetic>
              {/* Desktop / tablet CTA */}
              <div className="hidden sm:block">
                <TalkToUsButton onClick={() => scrollToSection('contact')} />
              </div>
            </Magnetic>

            <button
              className="group flex flex-col gap-1.5 p-2 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 7 : 0 }}
                className={`h-[1.5px] w-6 transition-colors duration-300 ${mobileMenuOpen ? 'bg-navy' : (showDarkNav ? 'bg-navy' : 'bg-white')}`}
              />
              <motion.div
                animate={{ opacity: mobileMenuOpen ? 0 : 1, width: mobileMenuOpen ? 0 : 16 }}
                className={`h-[1.5px] transition-colors duration-300 ${mobileMenuOpen ? 'bg-navy' : (showDarkNav ? 'bg-navy' : 'bg-white')}`}
              />
              <motion.div
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -7 : 0 }}
                className={`h-[1.5px] w-6 transition-colors duration-300 ${mobileMenuOpen ? 'bg-navy' : (showDarkNav ? 'bg-navy' : 'bg-white')}`}
              />
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-[linear-gradient(165deg,rgba(250,250,247,0.98),rgba(245,247,252,0.97))] p-6 sm:p-8 lg:hidden"
            >
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-navy shadow-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center gap-10">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      if (link.href) {
                        if (pathname === link.href) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate: boolean }) => void } }).__lenis;
                          if (lenis?.scrollTo) {
                            lenis.scrollTo(0, { immediate: false });
                          }
                          setMobileMenuOpen(false);
                        } else {
                          router.push(link.href);
                          setMobileMenuOpen(false);
                        }
                      } else {
                        scrollToSection(link.id);
                      }
                    }}
                    className="text-[clamp(1.6rem,6vw,2.5rem)] font-bold tracking-tighter text-navy transition-colors hover:text-gold"
                  >
                    {link.label}
                  </button>
                ))}
                <TalkToUsButton onClick={() => scrollToSection('contact')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
