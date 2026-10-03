"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CLUBS } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Exact club accents specified in prompt
const CLUB_ACCENTS: Record<string, string> = {
  "cyber-forge":    "#4DA3FF", // TECH
  "web-craft":      "#00D9FF", // CODING
  "robo-tech":      "#FF8A3D", // ROBOTICS
  "ai-syndicate":   "#8B7CFF", // AI/ML
  "game-devs":      "#E63946", // GAMING
  "design-guild":   "#A78BFA", // DESIGN
  "media-house":    "#F472B6", // PHOTOGRAPHY
  "esports-arena":  "#39D98A", // SPORTS
  "ecell":          "#F2C94C", // ENTREPRENEURSHIP
  "music-club":     "#C9A24D", // CULTURAL
};

export default function ClubShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".club-viewport");
    
    sections.forEach((section) => {
      const content = section.querySelector(".club-content");
      const bgGlow = section.querySelector(".club-glow");

      if (content) {
        gsap.fromTo(
          content,
          { y: 60, opacity: 0.2 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
          }
        );
      }

      if (bgGlow) {
        gsap.fromTo(
          bgGlow,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1.2,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
      }
    });
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#030508] text-white" id="clubs">
      {/* Section Header */}
      <div className="py-24 text-center border-b border-[#222A36]">
        <span className="eyebrow" style={{ color: "#C9A24D" }}>
          THE CLUBS
        </span>
        <h2 className="text-display-lg font-display font-black uppercase mt-2 text-white">
          10 CLUBS. ONE UNIVERSE.
        </h2>
        <p className="text-[1.1rem] text-[#8D96A5] max-w-xl mx-auto mt-4 px-6">
          Specialized engineering collectives, gaming syndicates, and creative guilds forging the future.
        </p>
      </div>

      {/* 10 Club Viewports */}
      <div className="flex flex-col">
        {CLUBS.map((club, index) => {
          const accentColor = CLUB_ACCENTS[club.id] || club.accentColor || "#C9A24D";
          const numStr = (index + 1).toString().padStart(2, "0");

          return (
            <div
              key={club.id}
              className="club-viewport relative min-h-[90vh] lg:min-h-screen flex items-center justify-center border-b border-[#222A36] px-6 lg:px-16 overflow-hidden py-16"
            >
              {/* Subtle background accent lighting (never changes global background) */}
              <div
                className="club-glow absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
                style={{ background: accentColor }}
              />

              {/* Viewport Content */}
              <div className="club-content relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left side: Club info */}
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="font-mono text-sm font-bold tracking-widest px-3 py-1 border"
                      style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}10` }}
                    >
                      CLUB {numStr} // {club.code}
                    </span>
                    <span className="font-mono text-xs text-[#8D96A5]">
                      {club.activityIds.length} ACTIVITIES
                    </span>
                  </div>

                  <h3 className="text-[3rem] lg:text-[5rem] font-display font-black leading-none uppercase text-white mb-4">
                    {club.name}
                  </h3>

                  <p className="text-[1.25rem] font-display italic text-[#C9A24D] mb-6">
                    "{club.tagline}"
                  </p>

                  <p className="text-[1rem] text-[#8D96A5] leading-relaxed mb-8 max-w-xl">
                    {club.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <Link
                      href={`/clubs/${club.id}`}
                      className="btn-primary"
                      data-cursor="EXPLORE"
                      style={{ background: accentColor, borderColor: accentColor }}
                    >
                      EXPLORE CLUB →
                    </Link>
                    <span className="font-mono text-xs text-[#8D96A5]">
                      LEAD: <span className="text-white">{club.leadName}</span>
                    </span>
                  </div>
                </div>

                {/* Right side: Large visual composition */}
                <div className="w-full lg:w-1/2 aspect-[4/3] relative rounded-none border border-[#222A36] bg-[#0A0F18] overflow-hidden flex items-center justify-center p-8 group">
                  <div
                    className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
                    style={{
                      background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
                    }}
                  />
                  <div className="text-center relative z-10">
                    <span
                      className="text-[6rem] lg:text-[8rem] font-display font-black opacity-15 select-none"
                      style={{ color: accentColor }}
                    >
                      {club.code}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-xs tracking-[0.3em] text-white uppercase border border-[#222A36] px-4 py-2 bg-[#030508]/80">
                        {club.category} DIVISION
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
