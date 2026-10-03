'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SPEAKERS } from '@/lib/data';

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-[#04040a] text-[#e8eaf0] selection:bg-[#3b82f6] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Hero */}
          <div className="mb-16 max-w-2xl">
            <p className="eyebrow text-[#06b6d4] mb-4">NEXUS 2026 // THE COMMANDERS</p>
            <h1 className="text-display-lg font-display font-black text-white leading-tight mb-6 tracking-tight">
              The Minds Behind<br />The Mission.
            </h1>
            <p className="text-[1rem] text-[#6b7280] max-w-lg leading-relaxed">
              Industry leaders, IIT Delhi faculty, and domain experts.
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-16" />

          {/* Speakers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {SPEAKERS.map((speaker, index) => {
              const initials = speaker.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={speaker.name}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Portrait placeholder */}
                  <div className="w-full aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#11111a] to-[#04040a] relative mb-6">
                    <motion.div 
                      className="w-full h-full flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {/* Placeholder Image Content */}
                      <span className="text-[6rem] font-display font-bold text-white/5 tracking-tighter">
                        {initials}
                      </span>
                    </motion.div>
                  </div>

                  {/* Speaker Details */}
                  <div className="flex flex-col">
                    <span className="eyebrow text-[#06b6d4] mb-2">{speaker.role || 'GUEST SPEAKER'}</span>
                    <h3 className="text-[1.2rem] font-display font-bold text-white mb-1">
                      {speaker.name}
                    </h3>
                    <p className="text-[0.75rem] text-[#6b7280] font-mono mb-4">
                      {speaker.designation || 'Expert'}
                    </p>
                    <p className="text-[0.85rem] text-[#6b7280]/70 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      {speaker.bio || 'Detailed biography and background information will be updated shortly.'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
