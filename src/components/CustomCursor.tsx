"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [label, setLabel] = useState("");
  const [isHover, setIsHover] = useState(false);
  const pathname = usePathname();

  const mousePos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.matchMedia("(hover: none)").matches ||
          window.matchMedia("(max-width: 768px)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, input, select, textarea, [data-cursor]"
      );
      if (el) {
        const custom = el.getAttribute("data-cursor");
        const href = el.getAttribute("href") || "";
        const text = el.textContent?.toUpperCase() || "";

        let cursorLabel = "VIEW";
        if (custom) {
          cursorLabel = custom;
        } else if (href.includes("/register") || text.includes("REGISTER") || text.includes("ENLIST")) {
          cursorLabel = "REGISTER";
        } else if (href.includes("/clubs") || text.includes("CLUB") || text.includes("EXPLORE")) {
          cursorLabel = "EXPLORE";
        } else if (href.includes("/events") || text.includes("EVENT") || text.includes("MISSION")) {
          cursorLabel = "VIEW";
        }

        setLabel(cursorLabel);
        setIsHover(true);
      } else {
        setIsHover(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [isMobile, pathname]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform"
      style={{ transform: "translate(-100px, -100px)" }}
    >
      {/* Lightsaber Assembly */}
      <div className="relative">
        {/* Hilt */}
        <div
          style={{
            width: 4,
            height: 12,
            background: "linear-gradient(to bottom, #d1d5db, #4b5563, #111827)",
            borderRadius: "1px",
            border: "1px solid #9ca3af",
            position: "absolute",
            top: 0,
            left: -2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {/* Hilt emitter ring */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -1,
              width: 6,
              height: 2,
              background: "#ef4444",
              borderRadius: "1px",
            }}
          />
        </div>

        {/* Glowing Red Darth Vader Lightsaber Blade */}
        <div
          style={{
            width: isHover ? 4 : 3,
            height: isHover ? 38 : 28,
            background: "#FFFFFF",
            borderRadius: "2px 2px 0 0",
            position: "absolute",
            bottom: 12,
            left: -1.5,
            boxShadow: isHover
              ? "0 0 4px #FFFFFF, 0 0 10px #FF0033, 0 0 20px #FF0033, 0 0 35px #FF0033"
              : "0 0 3px #FFFFFF, 0 0 8px #FF0033, 0 0 15px #FF0033",
            transition: "height 0.2s ease, width 0.2s ease, box-shadow 0.2s ease",
          }}
        />

        {/* Optional Hover Action Label */}
        {label && (
          <span
            style={{
              position: "absolute",
              top: -24,
              left: 14,
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              color: "#FF0033",
              whiteSpace: "nowrap",
              fontWeight: 800,
              textTransform: "uppercase",
              background: "rgba(3, 4, 7, 0.9)",
              padding: "2px 6px",
              border: "1px solid #FF0033",
              boxShadow: "0 0 10px rgba(255, 0, 51, 0.4)",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
