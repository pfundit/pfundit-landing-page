'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const pillars = [
  { title: "Technology-First Core", description: "Credit decisioning built on data and technology from the first loan — not layered onto an existing workflow." },
  { title: "Human-in-the-Loop", description: "Mandatory human oversight at every consequential decision point. Technology operates. Humans govern." },
  { title: "Regulatory Compliant by Design", description: "Regulatory compliance is an architectural constraint, not a retrofit. Built in from inception." },
  { title: "Proprietary Workflows", description: "Credit, collections and monitoring workflows that deepen as a competitive advantage with every loan originated." },
];

export function PlatformOverview() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const ctx = gsap.context(() => {
      // Simple fade-in animations for the content
      gsap.fromTo('.platform-reveal', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
      
      // Diagram animations
      gsap.to('.diagram-ring', { rotation: 360, duration: 40, repeat: -1, ease: 'linear', transformOrigin: 'center' });
      gsap.to('.diagram-ring-reverse', { rotation: -360, duration: 30, repeat: -1, ease: 'linear', transformOrigin: 'center' });
      gsap.fromTo('.diagram-pill', 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)', delay: 0.5 }
      );
      
      // Floating dots
      gsap.to('.diagram-dot', { y: -4, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.2 });
      
      // Center Core Pulse
      gsap.to('.diagram-core', {
        scale: 1.03,
        boxShadow: '0 0 60px rgba(212,164,55,0.45), inset 0 0 25px rgba(212,164,55,0.25)',
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      gsap.to('.diagram-logo', {
        textShadow: '0 0 12px rgba(212,164,55,0.7)',
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center bg-[#0d142b] py-24 text-white overflow-hidden pt-36 pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flowDash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -20; }
        }
        .diagram-line-flow {
          animation: flowDash 8s linear infinite;
        }
      `}} />
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#D4A437]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#1a2850]/40 blur-[150px]" />
      </div>

      <div className="layout-shell w-full relative z-10 px-6 sm:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* LEFT: 2x2 Pillars Grid */}
          <div>
            <div className="mb-12 platform-reveal">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4A437]" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4A437]">THE PLATFORM</span>
              </div>
              <h2 className="font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.03em] text-white">
                Engineered for <br/>
                <span className="text-[#C9A84C]">Structural Advantage</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
              {pillars.map((pillar, i) => (
                <div key={pillar.title} className="platform-reveal group relative">
                  {/* Icon & Animated Gold Line */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(212,164,55,0.3)] bg-[rgba(212,164,55,0.05)] text-[#D4A437] transition-transform duration-500 group-hover:scale-110 group-hover:bg-[rgba(212,164,55,0.1)]">
                      {i === 0 && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
                      )}
                      {i === 1 && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      )}
                      {i === 2 && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      )}
                      {i === 3 && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      )}
                    </div>
                    {/* Animated Gold Line */}
                    <div className="h-px flex-1 ml-6 bg-white/[0.04] relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#D4A437] to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
                    </div>
                  </div>

                  <h3 className="typo-button text-white mb-3 transition-colors duration-300 group-hover:text-[#D4A437]">
                    {pillar.title}
                  </h3>
                  <p className="text-[0.88rem] leading-[1.65] text-white/65">
                    {pillar.description}
                  </p>

                  <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_top_left,rgba(212,164,55,0.06),transparent_60%)] pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Architecture Diagram */}
          <div className="relative hidden md:flex justify-center items-center w-full min-h-[400px] lg:min-h-[500px] platform-reveal">
            
            {/* Grid background for the diagram */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[460px] md:h-[460px] flex justify-center items-center mx-auto">
              
              {/* Outer Orbit */}
              <div className="absolute w-[95%] h-[95%] rounded-full border border-[rgba(255,255,255,0.05)] diagram-ring" />
              
              {/* Middle Orbit (dashed) */}
              <div className="absolute w-[70%] h-[70%] rounded-full border border-dashed border-[rgba(212,164,55,0.25)] diagram-ring-reverse" />
              
              {/* Inner Orbit */}
              <div className="absolute w-[45%] h-[45%] rounded-full border border-[rgba(255,255,255,0.06)] diagram-ring" />

              {/* Diagonal Cross Lines */}
              <svg className="absolute w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
                <line className="diagram-line-flow" x1="20" y1="20" x2="80" y2="80" stroke="#D4A437" strokeWidth="0.5" strokeDasharray="4 6" shapeRendering="geometricPrecision" />
                <line className="diagram-line-flow" x1="80" y1="20" x2="20" y2="80" stroke="#D4A437" strokeWidth="0.5" strokeDasharray="4 6" shapeRendering="geometricPrecision" />
              </svg>

              {/* 4 Corner Nodes */}
              {/* Top Left */}
              <div className="absolute top-[18%] left-[18%] w-8 h-8 md:w-10 md:h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(212,164,55,0.3)] bg-[#0d142b] flex justify-center items-center z-10">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#D4A437] diagram-dot" />
                <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:bottom-[calc(100%+12px)]">
                  <div className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-sm diagram-pill">
                    <span className="text-[0.7rem] md:text-[0.75rem] font-bold uppercase tracking-wider text-white">Asset Intelligence</span>
                  </div>
                </div>
              </div>

              {/* Top Right */}
              <div className="absolute top-[18%] right-[18%] w-8 h-8 md:w-10 md:h-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(212,164,55,0.3)] bg-[#0d142b] flex justify-center items-center z-10">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#D4A437] diagram-dot" />
                <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:bottom-[calc(100%+12px)]">
                  <div className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-sm diagram-pill">
                    <span className="text-[0.7rem] md:text-[0.75rem] font-bold uppercase tracking-wider text-white">Partner APIs</span>
                  </div>
                </div>
              </div>

              {/* Bottom Left */}
              <div className="absolute bottom-[18%] left-[18%] w-8 h-8 md:w-10 md:h-10 -translate-x-1/2 translate-y-1/2 rounded-full border border-[rgba(212,164,55,0.3)] bg-[#0d142b] flex justify-center items-center z-10">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#D4A437] diagram-dot" />
                <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:top-[calc(100%+12px)]">
                  <div className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-sm diagram-pill">
                    <span className="text-[0.7rem] md:text-[0.75rem] font-bold uppercase tracking-wider text-white">Human Oversight</span>
                  </div>
                </div>
              </div>

              {/* Bottom Right */}
              <div className="absolute bottom-[18%] right-[18%] w-8 h-8 md:w-10 md:h-10 translate-x-1/2 translate-y-1/2 rounded-full border border-[rgba(212,164,55,0.3)] bg-[#0d142b] flex justify-center items-center z-10">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#D4A437] diagram-dot" />
                <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 md:top-[calc(100%+12px)]">
                  <div className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-sm diagram-pill">
                    <span className="text-[0.7rem] md:text-[0.75rem] font-bold uppercase tracking-wider text-white">Credit Operations</span>
                  </div>
                </div>
              </div>

              {/* Center Core */}
              <div className="diagram-core absolute w-[35%] h-[35%] rounded-full border-[2.5px] border-[#D4A437] bg-[#0d142b] flex justify-center items-center z-20 shadow-[0_0_40px_rgba(212,164,55,0.3),inset_0_0_20px_rgba(212,164,55,0.15)]">
                <span className="diagram-logo font-serif-display text-2xl md:text-3xl lg:text-4xl text-[#D4A437]">Pfundit</span>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
