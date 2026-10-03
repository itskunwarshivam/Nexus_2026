'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.to(bgRef.current, {
        scale: 1.15,
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // Content parallax and fade
      gsap.to(contentRef.current, {
        yPercent: -40,
        opacity: 0,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#050508] flex items-end pb-24 md:pb-32"
    >
      {/* Background layer */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(59,130,246,0.15)_0%,_transparent_40%),radial-gradient(circle_at_30%_80%,_rgba(6,182,212,0.1)_0%,_transparent_30%)]"
      >
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 container mx-auto px-6 md:px-12 w-full flex flex-col justify-end h-full"
      >
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-cyan-500" />
            <p className="text-xs md:text-sm tracking-widest text-[#e8eaf0]/70 font-semibold uppercase">
              IIT Delhi × Vanguard Institute of Technology
            </p>
          </div>

          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-[#e8eaf0] mb-6 drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            NEXUS <br className="hidden md:block"/> 2026
          </h1>

          <p className="text-xl md:text-2xl font-bold tracking-widest text-amber-500 mb-10">
            10 CLUBS. ONE UNIVERSE.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider uppercase text-sm transition-colors relative overflow-hidden group">
              <span className="relative z-10">Explore Clubs & Missions</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
            </button>
            <button className="px-8 py-4 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold tracking-wider uppercase text-sm transition-colors">
              Enlist Now
            </button>
          </div>
        </div>
      </div>

      {/* Vertical date badge */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8 z-20">
        <span className="[writing-mode:vertical-lr] text-xs tracking-widest text-cyan-500 font-mono rotate-180">
          21.10.2026
        </span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-cyan-500/50 to-transparent" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20">
        <span className="text-[10px] tracking-widest uppercase text-[#e8eaf0]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#e8eaf0] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
