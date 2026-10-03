'use client';

import { motion } from 'framer-motion';
import { SPONSORS } from '@/lib/data';

export default function SponsorsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="section bg-[#050508]">
      <div className="section-inner">
        <div className="text-center mb-12">
          <div className="eyebrow text-[#f59e0b]">THE ALLIES // OUR PARTNERS</div>
        </div>

        <div className="divider-h w-full h-[1px] bg-[var(--border)] mb-16"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col gap-16 items-center"
        >
          {/* Title Partner */}
          <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
            <div className="font-mono text-[0.7rem] text-[#6b7280] mb-4 uppercase tracking-widest text-center">Title Partner</div>
            <div className="flex flex-wrap justify-center gap-12 w-full">
              {SPONSORS.title.map((sponsor) => (
                <div key={sponsor.name} className="sponsor-logo text-4xl sm:text-5xl font-display font-bold tracking-[0.05em] text-[#e8eaf0] max-w-[200px] text-center w-full">
                  {sponsor.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Powered By */}
          <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
            <div className="font-mono text-[0.7rem] text-[#6b7280] mb-4 uppercase tracking-widest text-center">Powered By</div>
            <div className="flex flex-wrap justify-center gap-12 w-full">
              {SPONSORS.poweredBy.map((sponsor) => (
                <div key={sponsor.name} className="sponsor-logo text-2xl sm:text-3xl font-display font-bold tracking-[0.05em] text-[#e8eaf0] max-w-[150px] text-center w-full">
                  {sponsor.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gold */}
          <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
            <div className="font-mono text-[0.7rem] text-[#6b7280] mb-4 uppercase tracking-widest text-center">Gold Partners</div>
            <div className="flex flex-wrap justify-center gap-10 w-full">
              {SPONSORS.gold.map((sponsor) => (
                <div key={sponsor.name} className="sponsor-logo text-xl sm:text-2xl font-display font-bold tracking-[0.05em] text-[#e8eaf0] text-center">
                  {sponsor.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Silver */}
          <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
            <div className="font-mono text-[0.7rem] text-[#6b7280] mb-4 uppercase tracking-widest text-center">Silver Partners</div>
            <div className="flex flex-wrap justify-center gap-8 w-full">
              {SPONSORS.silver.map((sponsor) => (
                <div key={sponsor.name} className="sponsor-logo text-lg sm:text-xl font-display font-bold tracking-[0.05em] text-[#e8eaf0] text-center">
                  {sponsor.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Community */}
          <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
            <div className="font-mono text-[0.7rem] text-[#6b7280] mb-4 uppercase tracking-widest text-center">Community Partners</div>
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {SPONSORS.community.map((sponsor) => (
                <div key={sponsor.name} className="sponsor-logo text-base sm:text-lg font-display font-bold tracking-[0.05em] text-[#e8eaf0] text-center">
                  {sponsor.name}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="divider-h w-full h-[1px] bg-[var(--border)] mt-16"></div>
      </div>
    </section>
  );
}
