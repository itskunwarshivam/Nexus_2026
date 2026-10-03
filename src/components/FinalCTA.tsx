'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="section bg-[#050508] relative overflow-hidden py-32 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-rose-950/20 pointer-events-none" />
      <div className="section-inner max-w-4xl mx-auto text-center relative z-10 px-4">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow text-cyan-400 mb-4 uppercase tracking-[0.3em]"
        >
          THE ARENA AWAITS YOUR ARRIVAL
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-display-lg font-display font-black text-white uppercase mb-6 tracking-tight"
        >
          CLAIM YOUR PLACE IN THE UNIVERSE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 font-mono"
        >
          10 Clubs. 12 High-Stakes Missions. 21st October 2026. Vanguard Institute of Technology × IIT Delhi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="btn-primary px-10 py-5 text-sm shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          >
            ENLIST FOR NEXUS 2026 →
          </Link>
          <Link
            href="#missions"
            className="btn-ghost px-10 py-5 text-sm"
          >
            EXPLORE ALL CLUBS
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
