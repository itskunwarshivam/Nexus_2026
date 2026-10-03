'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS } from '@/lib/data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section bg-[#050508]">
      <div className="section-inner max-w-[800px] mx-auto">
        <div className="mb-16">
          <p className="eyebrow text-cyan-500 mb-2 uppercase">MISSION BRIEF // FREQUENTLY ASKED</p>
          <h2 className="text-display-md text-white font-display font-bold uppercase">QUESTIONS</h2>
        </div>

        <div className="flex flex-col">
          {FAQS.map((faq: any, index: number) => {
            const isOpen = openIndex === index;
            
            return (
              <div key={index} className="faq-item border-b border-white/10 last:border-b-0 py-6">
                <button
                  onClick={() => toggle(index)}
                  className="faq-question w-full flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="text-lg font-display font-medium text-white uppercase group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </span>
                  <span 
                    className="ml-4 flex-shrink-0 text-3xl font-light text-slate-500 transition-transform duration-300 ease-in-out" 
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    +
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="faq-answer overflow-hidden"
                    >
                      <div className="pt-4 pb-2 text-slate-400 font-mono text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
