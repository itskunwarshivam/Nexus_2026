'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CLUBS } from '@/lib/data';

export default function HomepageClubTeaser() {
  const teasers = CLUBS.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
  };

  return (
    <section className="bg-[#04040a] relative">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full flex flex-col lg:flex-row"
      >
        {teasers.map((club, index) => (
          <motion.div 
            key={club.id} 
            variants={itemVariants}
            className="group relative flex-1 min-h-[auto] lg:min-h-[70vh] border-l border-white/10 lg:first:border-l-0 p-8 lg:p-12 xl:p-16 flex flex-col justify-end transition-all duration-500 hover:bg-white/[0.02]"
            style={{ '--hover-color': club.accentColor } as React.CSSProperties}
          >
            {/* Hover left border effect */}
            <div 
              className="absolute left-[-1px] top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
              style={{ backgroundColor: club.accentColor }}
            />
            
            {/* Radial glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
              style={{ 
                background: `radial-gradient(circle at top, ${club.accentColor} 0%, transparent 70%)` 
              }}
            />

            <div className="relative z-10 mt-20 lg:mt-0">
              <span className="eyebrow text-muted block mb-6">
                CLUB // 0{index + 1}
              </span>
              
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4">
                {club.name}
              </h3>
              
              <p className="text-[0.85rem] text-muted max-w-xs leading-relaxed mb-12">
                {club.tagline}
              </p>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: club.accentColor }}
                  />
                  <span className="font-mono text-[0.6rem] text-white/70 uppercase tracking-wider">
                    {club.activityIds.length} Activities
                  </span>
                </div>
                
                <Link 
                  href={`/clubs/${club.id}`} 
                  className="text-white text-sm font-medium inline-flex items-center group/link relative"
                >
                  Enter <span className="ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover/link:w-full transition-all duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="py-16 flex justify-center border-t border-white/5">
        <Link 
          href="/clubs" 
          className="eyebrow text-muted hover:text-white transition-colors relative group"
        >
          All 10 clubs →
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
        </Link>
      </div>
    </section>
  );
}
