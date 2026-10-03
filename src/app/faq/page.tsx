'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="min-h-screen bg-[#04040a] text-white selection:bg-cyan-500/30">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <span className="font-mono text-[0.62rem] text-[#06b6d4] tracking-[0.2em] uppercase">
              NEXUS 2026 // FREQUENTLY ASKED
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl mt-2 tracking-tight text-[#e8eaf0]">
              Questions.
            </h1>
            <p className="text-[#6b7280] text-[1.05rem] mt-4 font-display">
              Everything you need to know about NEXUS 2026.
            </p>
            <div className="h-[1px] w-full bg-white/5 mt-10" />
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-0">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div 
                  key={index} 
                  className="border-b border-white/[0.06] group"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className={`font-display font-medium text-[1rem] transition-colors duration-300 ${isOpen ? 'text-white' : 'text-[#e8eaf0] group-hover:text-white'}`}>
                      {faq.question}
                    </span>
                    <span className={`ml-4 text-[1.2rem] transition-colors duration-300 font-light ${isOpen ? 'text-[#06b6d4]' : 'text-[#6b7280] group-hover:text-[#06b6d4]'}`}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-[0.95rem] text-[#6b7280] leading-relaxed font-display pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Contact Prompt */}
          <div className="mt-24 pt-12 border-t border-white/[0.06]">
            <h2 className="font-display font-medium text-[1.3rem] text-white">
              Still have questions?
            </h2>
            <p className="text-[0.9rem] text-[#6b7280] mt-1 font-display">
              Reach out to our team and we'll get back to you.
            </p>
            <div className="mt-6">
              <a 
                href="mailto:nexus2026@vanguardit.edu" 
                className="font-mono text-[#06b6d4] text-[0.9rem] underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-500 transition-colors"
              >
                nexus2026@vanguardit.edu
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
