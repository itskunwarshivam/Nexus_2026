"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "UNIVERSE",  href: "/" },
  { label: "CLUBS",     href: "/clubs" },
  { label: "MISSIONS",  href: "/#missions" },
  { label: "SCHEDULE",  href: "/schedule" },
  { label: "VERIFY PASS", href: "/dashboard" },
  { label: "ABOUT",     href: "/#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY.current + 5) {
          setVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          setVisible(true);
        }
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[9000] transition-all duration-300"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          background: scrolled ? "rgba(3, 4, 7, 0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(31, 41, 55, 0.8)" : "1px solid transparent",
          paddingBlock: scrolled ? "0.75rem" : "1.25rem",
        }}
      >
        <div className="flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2 group" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 900, letterSpacing: "0.1em", color: "#FFFFFF" }}>
              NEXUS
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: "#00D9FF" }}>
              2026
            </span>
          </Link>

          {/* Desktop Navigation Links — hidden on homepage until scrolled */}
          <nav
            className="hidden md:flex items-center gap-8"
            style={{
              opacity: pathname === "/" && !scrolled ? 0 : 1,
              pointerEvents: pathname === "/" && !scrolled ? "none" : "auto",
              transition: "opacity 0.4s ease",
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: isActive ? "#00D9FF" : "#8B949E",
                    textDecoration: "none",
                    position: "relative",
                    paddingBottom: "3px",
                    transition: "color 0.2s ease",
                  }}
                  className="group hover:text-white"
                >
                  {link.label}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: 1,
                      background: "#00D9FF",
                      width: isActive ? "100%" : "0%",
                      transition: "width 0.25s ease",
                    }}
                    className="group-hover:!w-full"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: REGISTER → button */}
          <div className="flex items-center gap-5">
            <Link
              href="/register"
              className="hidden md:inline-flex items-center gap-2 group"
              data-cursor="REGISTER"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#F0F4F8",
                textDecoration: "none",
                padding: "8px 20px",
                border: "1px solid rgba(0, 217, 255, 0.4)",
                background: "rgba(0, 217, 255, 0.05)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00D9FF";
                e.currentTarget.style.background = "rgba(0, 217, 255, 0.15)";
                e.currentTarget.style.color = "#00D9FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0, 217, 255, 0.4)";
                e.currentTarget.style.background = "rgba(0, 217, 255, 0.05)";
                e.currentTarget.style.color = "#F0F4F8";
              }}
            >
              REGISTER <span className="group-hover:translate-x-1 transition-transform" style={{ color: "#00D9FF" }}>→</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#8B949E] hover:text-white p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col justify-between p-8"
            style={{ background: "#030407", backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 217, 255, 0.1) 0%, transparent 70%)" }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 900, color: "#FFFFFF" }}>
                NEXUS <span style={{ color: "#00D9FF" }}>2026</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-[#8B949E] hover:text-white p-2">
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6 my-auto">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-baseline gap-4 group"
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#00D9FF" }}>
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2.2rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: pathname === link.href ? "#00D9FF" : "#F0F4F8",
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-6 border-t border-[#1F2937]"
            >
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-4"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#030407",
                  background: "#00D9FF",
                  textDecoration: "none",
                }}
              >
                REGISTER NOW
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
