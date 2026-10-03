"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLaunched, setIsLaunched] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date("2026-10-21T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsLaunched(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <section 
      id="countdown" 
      className="w-full bg-[#090b1a]"
      style={{ padding: "4rem clamp(1.5rem, 5vw, 6rem)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-start w-full">
        <span className="eyebrow text-muted font-mono tracking-widest text-sm mb-4">
          MISSION COUNTDOWN // T-MINUS
        </span>
        
        <div className="w-full h-[1px] bg-white/10 mb-8" />

        <div className="w-full">
          {isLaunched ? (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#f59e0b] font-display text-4xl md:text-6xl font-bold uppercase"
            >
              THE MISSION HAS LAUNCHED
            </motion.h2>
          ) : (
            <div className="flex flex-row items-center gap-2 md:gap-6">
              <CountdownGroup value={timeLeft.days} label="DAYS" />
              <Separator />
              <CountdownGroup value={timeLeft.hours} label="HRS" />
              <Separator />
              <CountdownGroup value={timeLeft.minutes} label="MIN" />
              <Separator />
              <CountdownGroup value={timeLeft.seconds} label="SEC" />
            </div>
          )}
        </div>

        <p className="mt-12 text-muted font-mono text-xs tracking-wider uppercase">
          21 OCTOBER 2026 — VANGUARD INSTITUTE OF TECHNOLOGY
        </p>
      </div>
    </section>
  );
}

function CountdownGroup({ value, label }: { value: number; label: string }) {
  // Pad with leading zero
  const paddedValue = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-start min-w-[3rem] md:min-w-[5rem]">
      <div className="relative h-[3rem] md:h-[5rem] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={paddedValue}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="countdown-digit text-white font-mono text-5xl md:text-7xl font-light tabular-nums leading-none"
          >
            {paddedValue}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="countdown-label text-muted font-mono text-[0.6rem] md:text-xs tracking-widest uppercase mt-2">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="text-muted font-mono text-4xl md:text-6xl font-light mb-6 opacity-50">
      :
    </div>
  );
}
