'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Users, Clock, MapPin, ArrowRight } from 'lucide-react';
import { EVENTS, EVENT_CATEGORIES } from '@/lib/data';
import { cn } from '@/lib/utils';

interface EventCardsProps {
  filter: string;
}

export default function EventCards({ filter }: EventCardsProps) {
  const filteredEvents = filter === 'all' 
    ? EVENTS 
    : EVENTS.filter(event => event.category === filter);

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {filteredEvents.map((event, index) => {
          const categoryColor = EVENT_CATEGORIES.find(c => c.id === event.category)?.color || '#e11d48';
          
          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group flex flex-col bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-300"
              style={{
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px -10px ${categoryColor}`;
                e.currentTarget.style.borderColor = `${categoryColor}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div 
                className="h-32 relative flex items-center justify-center overflow-hidden"
                style={{ 
                  background: `linear-gradient(to bottom right, ${categoryColor}20, transparent)` 
                }}
              >
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${categoryColor}80 0%, transparent 70%)`
                  }}
                />
                <span className="text-6xl relative z-10 drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300">
                  {event.categoryIcon}
                </span>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${categoryColor}, transparent)` }}
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold uppercase text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white transition-colors" style={{ backgroundImage: `linear-gradient(to right, white, ${categoryColor})` }}>
                    {event.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-400">{event.subtitle}</p>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center text-sm text-slate-300">
                    <Users className="w-4 h-4 mr-3 opacity-70" />
                    <span>Team: {event.teamSize}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Clock className="w-4 h-4 mr-3 opacity-70" />
                    <span>{event.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <MapPin className="w-4 h-4 mr-3 opacity-70" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <Link 
                  href={`/events/${event.id}`}
                  className="inline-flex items-center text-sm font-bold tracking-wider mt-auto transition-colors group-hover:text-white"
                  style={{ color: categoryColor }}
                >
                  VIEW MISSION
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
