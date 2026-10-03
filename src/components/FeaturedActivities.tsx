"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { EVENTS } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturedActivities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (section && track) {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.kill();
      };
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#030508] overflow-hidden py-24 min-h-screen flex flex-col justify-center" id="missions">
      {/* Header */}
      <div className="px-6 lg:px-16 max-w-7xl mx-auto w-full mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="eyebrow" style={{ color: "#C9A24D" }}>
            ACTIVITIES & MISSIONS
          </span>
          <h2 className="text-display-md font-display font-black uppercase text-white mt-1">
            FEATURED MISSIONS
          </h2>
        </div>
        <span className="font-mono text-xs text-[#8D96A5] tracking-widest uppercase">
          SCROLL TO EXPLORE →
        </span>
      </div>

      {/* Horizontal Track pinned by GSAP */}
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 px-6 lg:px-16 w-max will-change-transform"
        >
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="w-[340px] sm:w-[420px] lg:w-[480px] bg-[#0A0F18] border border-[#222A36] p-8 flex flex-col justify-between group transition-all duration-300 hover:border-[#C9A24D]"
              data-cursor="VIEW"
            >
              {/* Top info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[0.65rem] text-[#C9A24D] uppercase tracking-wider px-2 py-1 bg-[#C9A24D]/10 border border-[#C9A24D]/30">
                    {event.category}
                  </span>
                  <span className="font-mono text-[0.65rem] text-[#8D96A5]">
                    SQUAD: {event.teamSize}
                  </span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2 group-hover:text-[#F2C96D] transition-colors">
                  {event.title}
                </h3>

                <p className="text-sm font-display italic text-[#8D96A5] mb-6">
                  {event.subtitle}
                </p>

                <p className="text-xs text-[#8D96A5] leading-relaxed line-clamp-3 mb-8">
                  {event.description}
                </p>
              </div>

              {/* Event Details Footer */}
              <div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#222A36] mb-6 font-mono text-[0.65rem] text-[#8D96A5]">
                  <div>
                    <span className="block text-[0.55rem] text-[#C9A24D] uppercase">VENUE</span>
                    <span className="text-white">{event.venue}</span>
                  </div>
                  <div>
                    <span className="block text-[0.55rem] text-[#C9A24D] uppercase">FEE</span>
                    <span className="text-white">{event.fee}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 text-center py-2.5 font-mono text-xs font-bold uppercase border border-[#C9A24D] text-[#C9A24D] hover:bg-[#C9A24D] hover:text-[#030508] transition-colors"
                  >
                    VIEW EVENT →
                  </Link>
                  <Link
                    href={`/register?event=${event.id}`}
                    className="py-2.5 px-4 font-mono text-xs font-bold uppercase bg-[#222A36] text-white hover:bg-white hover:text-[#030508] transition-colors"
                  >
                    REGISTER
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
