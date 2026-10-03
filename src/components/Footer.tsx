"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#030508] text-white border-t border-[#222A36] pt-16 pb-12 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Col 1: Logo & Tagline */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-baseline gap-2 mb-4" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF" }}>
              NEXUS
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "#C9A24D" }}>
              2026
            </span>
          </Link>
          <p className="font-mono text-xs text-[#8D96A5] leading-relaxed">
            {SITE_CONFIG.collegeName} × {SITE_CONFIG.collaboration}
          </p>
          <p className="font-mono text-xs text-[#C9A24D] mt-2">
            {SITE_CONFIG.tagline}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-mono text-xs text-[#C9A24D] uppercase tracking-widest mb-4">
            NAVIGATION
          </h4>
          <ul className="flex flex-col gap-2 font-mono text-xs text-[#8D96A5]">
            <li><Link href="/" className="hover:text-white transition-colors">UNIVERSE</Link></li>
            <li><Link href="/clubs" className="hover:text-white transition-colors">CLUBS</Link></li>
            <li><Link href="/#missions" className="hover:text-white transition-colors">MISSIONS</Link></li>
            <li><Link href="/schedule" className="hover:text-white transition-colors">SCHEDULE</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Col 3: Portal Links */}
        <div>
          <h4 className="font-mono text-xs text-[#C9A24D] uppercase tracking-widest mb-4">
            PORTALS
          </h4>
          <ul className="flex flex-col gap-2 font-mono text-xs text-[#8D96A5]">
            <li><Link href="/register" className="hover:text-white transition-colors">REGISTRATION</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">STUDENT PASS</Link></li>
            <li><Link href="/admin" className="hover:text-white transition-colors">CONTROL CENTER</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="font-mono text-xs text-[#C9A24D] uppercase tracking-widest mb-4">
            MISSION INTEL
          </h4>
          <p className="font-mono text-xs text-[#8D96A5] mb-2">
            {SITE_CONFIG.venue}
          </p>
          <p className="font-mono text-xs text-[#C9A24D]">
            {SITE_CONFIG.contactEmail}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#222A36] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[0.65rem] text-[#8D96A5]">
        <div>
          © 2026 VANGUARD INSTITUTE OF TECHNOLOGY × IIT DELHI. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-6">
          <a href={SITE_CONFIG.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A24D]">INSTAGRAM</a>
          <a href={SITE_CONFIG.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A24D]">LINKEDIN</a>
          <a href={SITE_CONFIG.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A24D]">YOUTUBE</a>
        </div>
      </div>
    </footer>
  );
}
