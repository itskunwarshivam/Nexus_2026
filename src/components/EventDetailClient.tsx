'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RulesAccordion({ rules }: { rules: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2 mt-4">
      {rules.map((rule, index) => (
        <div key={index} className="border border-white/10 bg-black/20 rounded-lg overflow-hidden backdrop-blur-sm">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
          >
            <span className="font-semibold text-gray-200">Rule #{index + 1}</span>
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform", 
                openIndex === index && "rotate-180"
              )} 
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 pt-0 text-gray-400 text-sm border-t border-white/5 mt-2">
                  {rule}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
