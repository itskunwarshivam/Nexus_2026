"use client";

import { motion } from "framer-motion";
import { SPEAKERS } from "@/lib/data";

export default function SpeakersSection() {
  return (
    <section className="section bg-[#030508] text-white" id="speakers">
      <div className="section-inner max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="eyebrow" style={{ color: "#C9A24D" }}>
            MISSION COMMANDERS // THE AVENGERS
          </span>
          <h2 className="text-display-md font-display font-black uppercase text-white mt-1">
            MEET THE HEROES
          </h2>
          <p className="font-mono text-xs text-[#8D96A5] tracking-widest mt-2 uppercase">
            INDUSTRY LEADERS, IIT DELHI FACULTY, AND DOMAIN EXPERTS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPEAKERS.map((speaker, index) => {
            const initials = speaker.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2);

            return (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0A0F18] border border-[#222A36] p-8 group hover:border-[#C9A24D] transition-all duration-300"
              >
                {/* Avatar Placeholder */}
                <div className="w-full aspect-[4/3] bg-[#030508] border border-[#222A36] mb-6 flex items-center justify-center relative overflow-hidden group-hover:border-[#C9A24D]/40">
                  <span className="text-[5rem] font-display font-black text-[#222A36] group-hover:text-[#C9A24D]/20 transition-colors">
                    {initials}
                  </span>
                  <div className="absolute bottom-3 left-3">
                    <span className="font-mono text-[0.6rem] text-[#C9A24D] uppercase px-2 py-0.5 bg-[#030508]/80 border border-[#C9A24D]/30">
                      {speaker.role}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-white group-hover:text-[#F2C96D] transition-colors">
                  {speaker.name}
                </h3>
                <p className="font-mono text-xs text-[#C9A24D] mt-1">
                  {speaker.designation}
                </p>
                <p className="text-xs text-[#8D96A5] mt-4 leading-relaxed line-clamp-3">
                  {speaker.bio}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
