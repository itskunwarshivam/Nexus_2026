"use client";

import { useState, useEffect } from "react";

const SECTIONS = ["HOME", "ABOUT", "MISSIONS", "SCHEDULE", "SPEAKERS", "CONTACT"];

export default function ScrollProgress() {
  const [activeSection, setActiveSection] = useState("HOME");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.toUpperCase());
          }
        });
      },
      { threshold: 0.5 }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.toLowerCase());
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, section: string) => {
    e.preventDefault();
    const el = document.getElementById(section.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="scroll-progress" className="fixed right-6 top-1/2 -translate-y-1/2 z-[8000] hidden md:flex flex-col gap-5">
      {SECTIONS.map((section) => {
        const isActive = activeSection === section;
        return (
          <button
            key={section}
            onClick={(e) => handleClick(e, section)}
            className="group relative flex items-center justify-end w-24 h-6 focus:outline-none"
            aria-label={`Scroll to ${section}`}
          >
            <span
              className={`absolute right-6 font-mono text-[0.55rem] tracking-widest transition-opacity duration-300 ${
                isActive ? "opacity-100 text-[#3b82f6]" : "opacity-0 group-hover:opacity-100 text-neutral-400"
              }`}
            >
              {section}
            </span>
            <div
              className={`transition-all duration-300 ${
                isActive
                  ? "w-[6px] h-[6px] bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  : "w-[4px] h-[4px] bg-white/20 group-hover:bg-white/50"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
