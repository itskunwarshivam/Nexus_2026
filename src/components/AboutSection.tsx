'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const timelineSteps = [
  {
    num: '01',
    title: 'MISSION',
    desc: 'Assemble your crew and select your specialization path.',
  },
  {
    num: '02',
    title: 'CHALLENGE',
    desc: 'Face grueling technical and creative trials designed to test your limits.',
  },
  {
    num: '03',
    title: 'BATTLE',
    desc: 'Compete head-to-head against top talent from across the galaxy.',
  },
  {
    num: '04',
    title: 'VICTORY',
    desc: 'Claim your glory, win the grand prize, and cement your legacy.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section bg-[#050508] relative overflow-hidden">
      <div className="section-inner grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-16 lg:gap-24 items-center">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="eyebrow text-blue-500">THE UNIVERSE // WHAT IS NEXUS</span>
            <h2 className="text-display-md font-display font-bold uppercase text-white leading-tight">
              WHERE HEROES ARE FORGED
            </h2>
          </div>
          
          <div className="flex flex-col gap-4 text-gray-400 max-w-2xl text-lg">
            <p>
              NEXUS 2026 is the ultimate technological battleground, forged through an unprecedented collaboration between Vanguard Institute of Technology and IIT Delhi. Scheduled for October 21, 2026, it stands as the most anticipated convergence of brilliant minds and cutting-edge innovation.
            </p>
            <p>
              This is not just another tech fest. It is a proving ground where theory meets reality, where raw talent is refined into unparalleled mastery. Step into the arena, choose your mission, and prove you have what it takes to shape the future.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 my-4">
            <div className="flex flex-col">
              <span className="text-[2.5rem] font-mono text-blue-500 font-bold leading-none mb-1">12+</span>
              <span className="text-[0.7rem] text-gray-500 font-mono tracking-wider uppercase">Events</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2.5rem] font-mono text-blue-500 font-bold leading-none mb-1">₹3L+</span>
              <span className="text-[0.7rem] text-gray-500 font-mono tracking-wider uppercase">Prize Pool</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2.5rem] font-mono text-blue-500 font-bold leading-none mb-1">2000+</span>
              <span className="text-[0.7rem] text-gray-500 font-mono tracking-wider uppercase">Participants</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2.5rem] font-mono text-blue-500 font-bold leading-none mb-1">1</span>
              <span className="text-[0.7rem] text-gray-500 font-mono tracking-wider uppercase">Epic Day</span>
            </div>
          </div>

          <div>
            <Link 
              href="#missions" 
              className="btn-ghost"
            >
              EXPLORE ALL MISSIONS
            </Link>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="relative pl-8 md:pl-12">
          {/* Vertical Line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-blue-500" />
          
          <div className="flex flex-col gap-12">
            {timelineSteps.map((step, index) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Node on the line */}
                <div className="absolute -left-[2.25rem] md:-left-[3.25rem] top-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                
                <div className="flex flex-col gap-1">
                  <span className="text-cyan-400 font-mono text-sm tracking-widest">{step.num}</span>
                  <h3 className="text-white font-bold font-display tracking-wide uppercase text-xl">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
