"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenisScroll } from "@/hooks/use-lenis-scroll";

// Hook to wire GSAP ScrollTrigger with Lenis and provide helpers for story scroll
export function useStoryScroll() {
  useLenisScroll(); // ensure lenis is initialized

  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {}

    // If lenis exists globally via useLenisScroll, wire ScrollTrigger to it.
    const lenisAny: any = (window as any).__lenis;
    if (lenisAny && ScrollTrigger && !initialized.current) {
      // scroller proxy if lenis uses a virtual scroll container
      try {
        ScrollTrigger.scrollerProxy(document.scrollingElement || document.documentElement, {
          scrollTop(value?: number) {
            if (arguments.length) {
              lenisAny.scrollTo(value, { immediate: true });
            }
            return lenisAny.scroll.instance ? lenisAny.scroll.instance.scroll.y : window.scrollY;
          },
        });
      } catch (e) {
        // ignore scrollerProxy errors
      }

      // make ScrollTrigger update on Lenis raf
      if (lenisAny.on) {
        lenisAny.on("scroll", () => ScrollTrigger.update());
      }

      gsap.ticker.add(() => {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
      });

      initialized.current = true;
    }

    return () => {
      try {
        gsap.ticker.remove(() => ScrollTrigger.update());
      } catch (e) {}
    };
  }, []);

  return {
    ScrollTrigger: ScrollTrigger,
    gsap,
  };
}

export default useStoryScroll;
