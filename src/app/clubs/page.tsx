'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CLUBS } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClubsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030508] pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="pt-20 pb-16">
            <span className="eyebrow block mb-6" style={{ color: "#C9A24D" }}>
              NEXUS 2026 // ALL CLUBS
            </span>
            <h1 className="text-display-lg font-display font-black text-white leading-tight mb-6 whitespace-pre-line">
              10 Clubs.{'\n'}One Universe.
            </h1>
            <p className="text-[1.1rem] text-[#8D96A5] max-w-2xl">
              Specialized engineering collectives, gaming syndicates, and creative guilds.
            </p>
          </div>

          <div className="w-full h-px bg-[#222A36] mb-10" />

          {/* Editorial List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {CLUBS.map((club, index) => {
              const numStr = (index + 1).toString().padStart(2, '0');
              
              return (
                <motion.div key={club.id} variants={itemVariants}>
                  <Link 
                    href={`/clubs/${club.id}`}
                    className="group block border-b border-[#222A36] py-8 px-4 transition-colors duration-300 hover:bg-[#0A0F18] relative"
                  >
                    {/* Left accent border on hover */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: club.accentColor }}
                    />

                    <div className="flex items-center justify-between gap-6">
                      {/* Number + Name + Tagline */}
                      <div className="flex items-center gap-6 lg:gap-12 flex-1">
                        <span className="font-mono text-[0.6rem] text-[#8D96A5]">
                          {numStr}
                        </span>
                        
                        <div className="w-px h-8 bg-[#222A36] hidden sm:block" />
                        
                        <div>
                          <h2 className="text-[1.5rem] font-display font-bold text-white group-hover:text-[#F2C96D] transition-colors">
                            {club.name}
                          </h2>
                          <p className="text-[0.8rem] text-[#8D96A5] hidden md:block mt-1">
                            {club.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Activities Count */}
                      <div className="hidden sm:flex items-center justify-center flex-1">
                        <span 
                          className="font-mono text-[0.6rem] uppercase tracking-wider"
                          style={{ color: club.accentColor }}
                        >
                          {club.activityIds.length} activities
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-end w-12 text-[#8D96A5] group-hover:text-[#C9A24D] transition-colors">
                        <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
