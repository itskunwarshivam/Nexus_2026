'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ClubsOverviewBanner() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        }
      });

      tl.fromTo(textRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out" }
      )
      .fromTo(subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "power3.inOut" },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-32 bg-[#050508] relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <h2 
          ref={textRef}
          className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#e8eaf0] mb-6"
        >
          10 CLUBS. ONE UNIVERSE.
        </h2>
        
        <div 
          ref={lineRef}
          className="h-[2px] w-32 bg-amber-500 mb-8 origin-center"
        />
        
        <p 
          ref={subRef}
          className="text-lg md:text-2xl text-[#e8eaf0]/70 max-w-3xl font-light tracking-wide leading-relaxed"
        >
          Discover specialized engineering collectives, gaming syndicates, and creative guilds.
        </p>
      </div>
    </section>
  );
}
