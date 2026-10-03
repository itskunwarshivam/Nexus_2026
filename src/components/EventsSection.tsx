'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Cpu, Crosshair, Brain, Paintbrush } from 'lucide-react';
import { EVENTS } from '@/lib/data';

const CATEGORIES = ['ALL', 'TECH', 'BATTLE', 'INTELLIGENCE', 'CREATIVE'];

const categoryIcons: Record<string, React.ReactNode> = {
  TECH: <Cpu className="w-3 h-3" />,
  BATTLE: <Crosshair className="w-3 h-3" />,
  INTELLIGENCE: <Brain className="w-3 h-3" />,
  CREATIVE: <Paintbrush className="w-3 h-3" />,
};

const categoryColors: Record<string, string> = {
  TECH: 'rgba(59, 130, 246, 0.15)', // electric blue
  BATTLE: 'rgba(245, 158, 11, 0.15)', // amber
  INTELLIGENCE: 'rgba(6, 182, 212, 0.15)', // plasma cyan
  CREATIVE: 'rgba(225, 29, 72, 0.15)', // red
};

export default function EventsSection() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const trackRef = useRef<HTMLDivElement>(null);

  const filteredEvents = EVENTS.filter(
    (event) => selectedCategory === 'ALL' || event.category === selectedCategory
  );

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="missions" className="section relative bg-[#050508]">
      <div className="section-inner flex flex-col gap-8 md:gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-blue-500">MISSION ARCHIVE // CHOOSE YOUR PATH</span>
            <h2 className="text-display-lg font-display font-bold uppercase text-white">
              CHOOSE YOUR MISSION
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-6 items-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-[0.65rem] font-mono tracking-[0.15em] uppercase pb-1 transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'text-white border-b border-blue-500' // electric blue border
                    : 'text-gray-500 hover:text-white border-b border-transparent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Catalogue */}
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/10 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex hover:bg-white/10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/10 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex hover:bg-white/10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={trackRef}
            className="events-track w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="snap-start shrink-0"
                >
                  <Link href={`/events/${event.id}`} className="block">
                    <div 
                      className="event-card relative rounded-lg overflow-hidden border border-white/5 bg-[#111111] transition-transform duration-500 hover:scale-[1.02]"
                      style={{ 
                        height: 'clamp(280px, 40vw, 420px)',
                        aspectRatio: '2/3',
                        background: `linear-gradient(180deg, ${categoryColors[event.category] || categoryColors.TECH} 0%, rgba(17,17,17,1) 50%, rgba(5,5,8,1) 100%)`
                      }}
                    >
                      {/* Top Badge */}
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10 text-[0.55rem] font-mono tracking-wider text-white uppercase">
                        {categoryIcons[event.category]}
                        <span>{event.category}</span>
                      </div>

                      {/* Content Overlay */}
                      <div className="event-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 hover:opacity-100 transition-opacity duration-400">
                        <h3 className="font-display font-bold text-[1.1rem] uppercase text-white mb-1">
                          {event.title}
                        </h3>
                        <p className="text-[0.75rem] text-gray-400 mb-4 line-clamp-2">
                          {event.subtitle}
                        </p>
                        
                        <div className="flex flex-col gap-1 mb-6">
                          <span className="text-[0.65rem] font-mono text-cyan-400">
                            VENUE: {event.venue || 'TBA'}
                          </span>
                          <span className="text-[0.65rem] font-mono text-cyan-400">
                            DATE: {event.date || 'OCT 21, 2026'}
                          </span>
                        </div>

                        <span className="text-[0.75rem] font-bold text-white tracking-widest flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                          OPEN MISSION <span className="text-blue-500">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredEvents.length === 0 && (
              <div className="w-full text-center py-20 text-gray-500 font-mono text-sm">
                NO MISSIONS FOUND IN THIS CATEGORY.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
