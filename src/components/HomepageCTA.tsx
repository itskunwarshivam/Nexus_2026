"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomepageCTA() {
  return (
    <section className="section bg-[#030508] border-t border-[#222A36] py-32 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,77,0.1)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-inner max-w-4xl mx-auto relative z-10"
      >
        <span className="eyebrow" style={{ color: "#C9A24D" }}>
          OCTOBER 21, 2026 // NEW DELHI
        </span>

        <h2 className="text-display-lg font-display font-black uppercase text-white mt-4 leading-none">
          YOUR ARENA AWAITS.
        </h2>

        <p className="text-[1.2rem] text-[#8D96A5] max-w-xl mx-auto mt-6">
          12 competitions. 10 clubs. One day to prove yourself on the galactic stage.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/register" className="btn-primary text-sm px-10 py-4" data-cursor="REGISTER">
            REGISTER FOR NEXUS 2026 →
          </Link>
        </div>

        <p className="font-mono text-xs text-[#00D9FF] mt-6">
          Free Registration for all events · Open to all students
        </p>
      </motion.div>
    </section>
  );
}
