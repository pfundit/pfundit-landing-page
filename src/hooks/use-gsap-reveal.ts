"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useGSAPReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // Register once
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
      // ignore if already registered or not available
    }

    // sensible defaults for ScrollTrigger
    if (ScrollTrigger) {
      ScrollTrigger.defaults({
        markers: false,
        toggleActions: "play none none reverse",
      });
    }

    return () => {
      // No global teardown; individual contexts will clean up.
    };
  }, []);
}

export default useGSAPReveal;
