"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCHEDULE } from "@/lib/data";

const CATEGORIES = ["ALL", "TECH", "ROBOTICS", "CULTURAL", "GAMING", "CREATIVE", "GENERAL"];

export default function ScheduleSection() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredSchedule = SCHEDULE.filter(
    (item) => selectedCategory === "ALL" || item.category === selectedCategory
  );

  return (
    <section className="section bg-[#030508] text-white" id="schedule">
      <div className="section-inner max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <span className="eyebrow" style={{ color: "#C9A24D" }}>
            MISSION TIMELINE // DAY 01
          </span>
          <h2 className="text-display-md font-display font-black uppercase text-white mt-1">
            EVENT SCHEDULE
          </h2>
          <p className="font-mono text-xs text-[#8D96A5] tracking-widest mt-2 uppercase">
            21 OCTOBER 2026 — VANGUARD INSTITUTE OF TECHNOLOGY, NEW DELHI
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto pb-4 mb-12 border-b border-[#222A36] scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="font-mono text-xs font-semibold tracking-widest uppercase relative pb-2 transition-colors whitespace-nowrap cursor-pointer"
                style={{ color: isActive ? "#C9A24D" : "#8D96A5" }}
              >
                {cat}
                {isActive && (
                  <motion.div
                    layoutId="activeScheduleTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: "#C9A24D" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Schedule List */}
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSchedule.map((item, index) => {
              const isGeneral = item.category === "GENERAL";

              return (
                <motion.div
                  key={`${item.time}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="bg-[#0A0F18] border border-[#222A36] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#C9A24D] transition-colors"
                >
                  {/* Left: Time & Visual Bar */}
                  <div className="flex items-center gap-6 md:w-1/3">
                    <div className="font-mono text-xl font-bold text-[#C9A24D] w-20 flex-shrink-0">
                      {item.time}
                    </div>
                    {/* Visual duration bar */}
                    <div className="h-1 flex-1 bg-[#222A36] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A24D] transition-all duration-500 group-hover:bg-[#F2C96D]"
                        style={{ width: isGeneral ? "30%" : "75%" }}
                      />
                    </div>
                  </div>

                  {/* Middle: Event Title & Venue */}
                  <div className="flex-1">
                    <h3 className={`text-lg font-display font-bold ${isGeneral ? "text-[#8D96A5]" : "text-white"}`}>
                      {item.event}
                    </h3>
                    <p className="font-mono text-xs text-[#8D96A5] mt-1">
                      VENUE: <span className="text-white">{item.venue}</span>
                    </p>
                  </div>

                  {/* Right: Category Badge */}
                  <div className="flex items-center md:justify-end">
                    <span
                      className="font-mono text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 border"
                      style={{
                        color: isGeneral ? "#8D96A5" : "#C9A24D",
                        borderColor: isGeneral ? "#222A36" : "rgba(201, 162, 77, 0.4)",
                        background: isGeneral ? "transparent" : "rgba(201, 162, 77, 0.08)",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
