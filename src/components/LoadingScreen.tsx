"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const duration = 1800; // 1.8s
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
        }, 200); // Small delay before fading out
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508]"
          style={isLoading ? {} : { display: "none" }}
        >
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[#06b6d4] text-[1.2rem]"
            >
              ✦
            </motion.div>
            
            <div className="flex flex-col items-center space-y-1">
              <span className="font-mono text-[1rem] tracking-[0.4em] text-neutral-400">NEXUS</span>
              <span className="font-mono text-[0.7rem] tracking-[0.3em] text-[#3b82f6]">2026</span>
            </div>

            <div className="flex flex-col items-center space-y-3 mt-4">
              <div className="w-[200px] h-[2px] bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-[#3b82f6]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
              <span className="font-mono text-xs text-neutral-500">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
