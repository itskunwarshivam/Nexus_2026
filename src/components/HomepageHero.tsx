"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomepageHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgLightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    const bgLight = bgLightRef.current;

    if (hero && content) {
      // Continuous scroll-linked parallax animation
      gsap.to(content, {
        y: -120,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (bgLight) {
        gsap.to(bgLight, {
          scale: 1.5,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#030508] flex items-center"
    >
      {/* Background atmosphere: sparse stars + distant nebula light */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          ref={bgLightRef}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C9A24D] opacity-10 blur-[140px]"
        />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-[#6C8EBF] opacity-5 blur-[120px]" />
      </div>

      {/* Asymmetric content: left-aligned with generous cinematic negative space */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16"
      >
        <div className="max-w-3xl">
          {/* Institution label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="eyebrow" style={{ color: "#C9A24D" }}>
              IIT DELHI × VANGUARD INSTITUTE OF TECHNOLOGY
            </span>
          </motion.div>

          {/* NEXUS 2026 Title */}
          <motion.div
            initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="mt-3 flex flex-wrap items-baseline gap-4 md:gap-6"
          >
            <h1 className="text-[5rem] sm:text-[8rem] lg:text-[11rem] font-display font-black text-white leading-none tracking-tight">
              NEXUS
            </h1>
            <span
              className="text-[2.5rem] sm:text-[4rem] font-mono font-bold"
              style={{ color: "#C9A24D" }}
            >
              2026
            </span>
          </motion.div>

          {/* THE UNIVERSE AWAITS. */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-4 text-[1.25rem] sm:text-[1.6rem] font-display font-medium italic"
            style={{ color: "#8D96A5" }}
          >
            THE UNIVERSE AWAITS.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="mt-10 flex flex-wrap gap-5"
          >
            <Link href="/clubs" className="btn-primary" data-cursor="EXPLORE">
              EXPLORE NEXUS →
            </Link>
            <Link href="/register" className="btn-ghost" data-cursor="REGISTER">
              REGISTER NOW
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom left technical date label */}
      <div className="absolute bottom-10 left-8 md:left-16 z-10 pointer-events-none hidden sm:block">
        <span
          className="font-mono text-[0.6rem] uppercase tracking-[0.25em]"
          style={{ color: "#8D96A5" }}
        >
          21.10.2026 // NEW DELHI
        </span>
      </div>

      {/* Bottom right scroll indicator */}
      <div className="absolute bottom-10 right-8 md:right-16 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span
          className="font-mono text-[0.55rem] tracking-[0.25em] uppercase"
          style={{ color: "#8D96A5" }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "rgba(201, 162, 77, 0.4)" }}
        />
      </div>
    </section>
  );
}
