"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicLoading() {
  const [stage, setStage] = useState(0); // 0: initial, 1: "A long time ago...", 2: STAR WARS style NEXUS title zoom, 3: exit
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if intro was played in this session to avoid blocking repeated internal navigation
    const played = sessionStorage.getItem("nexus_starwars_intro_played");
    if (played) {
      setVisible(false);
      return;
    }

    setStage(1); // "A long time ago..."
    const t1 = setTimeout(() => setStage(2), 1100); // Star Wars yellow logo burst & zoom into space
    const t2 = setTimeout(() => setStage(3), 2600); // Fade out overlay
    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("nexus_starwars_intro_played", "true");
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {stage < 3 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#030407] flex items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Star Field Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.08)_0%,transparent_70%)]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: "radial-gradient(#FFFFFF 1.5px, transparent 1.5px)",
                backgroundSize: "60px 60px",
                opacity: 0.35,
              }}
            />
          </div>

          {/* Stage 1: Iconic Cyan Text ("A long time ago in a college far, far away....") */}
          {stage === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-center px-6"
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(1rem, 2.5vw, 1.8rem)",
                  color: "#00D9FF",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                A long time ago in a college<br />far, far away....
              </p>
            </motion.div>
          )}

          {/* Stage 2: Star Wars Outlined Yellow Title Zooming into Space */}
          {stage === 2 && (
            <div className="relative flex flex-col items-center justify-center z-10 text-center w-full">
              {/* Star Wars Yellow Outlined NEXUS Title */}
              <motion.div
                initial={{ scale: 2.2, opacity: 0, z: 200 }}
                animate={{ scale: 0.9, opacity: 1, z: 0 }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(4.5rem, 14vw, 12rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                    color: "transparent",
                    WebkitTextStroke: "3px #FFE81F",
                    textShadow: "0 0 25px rgba(255, 232, 31, 0.5), 0 0 50px rgba(255, 232, 31, 0.2)",
                    textTransform: "uppercase",
                  }}
                >
                  NEXUS
                </h1>

                {/* Filled Yellow Star Wars Accent Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-4 flex flex-col items-center"
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      fontWeight: 900,
                      color: "#FFE81F",
                      letterSpacing: "0.2em",
                      textShadow: "0 0 20px rgba(255, 232, 31, 0.6)",
                    }}
                  >
                    2026
                  </span>

                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.3em",
                      color: "#F0F4F8",
                      marginTop: "1rem",
                      textTransform: "uppercase",
                    }}
                  >
                    THE UNIVERSE AWAITS.
                  </span>
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
