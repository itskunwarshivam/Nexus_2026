'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Key, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Matrix-style hacking background canvas
function HackingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    // Mix of hex, binary and chars for hacking feel
    const chars = '01アイウエオカキクケコABCDEF0123456789NEXUS#@!%&*SECURED'.split('');

    const draw = () => {
      // Dark fade overlay — trails
      ctx.fillStyle = 'rgba(3, 4, 7, 0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * fontSize;

        // Brightest char at head
        if (drops[i] * fontSize < canvas.height * 0.3) {
          ctx.fillStyle = '#ff2222'; // bright red head in top area
        } else {
          // Gradient: bright red → dark red → very dim
          const alpha = Math.max(0.08, 1 - (drops[i] * fontSize) / canvas.height);
          ctx.fillStyle = `rgba(220, 20, 20, ${alpha})`;
        }

        ctx.font = `${fontSize}px 'Courier New', monospace`;
        ctx.fillText(char, i * fontSize, y);

        // Reset when off screen + random stagger
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-30 pointer-events-none"
    />
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        setAuthSuccess(true);
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 2000);
      } else {
        setError(data.error || 'Authentication failed. Access denied.');
        setLoading(false);
      }
    } catch {
      setError('Connection error to auth server');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Matrix Hacking Background — always visible */}
      <HackingCanvas />

      <main className="min-h-screen text-[#F0F4F8] pt-32 pb-24 flex flex-col justify-center items-center px-4 relative">

        {/* Full-screen AUTH SUCCESS overlay */}
        <AnimatePresence>
          {authSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-[#030407]/95 flex flex-col items-center justify-center gap-8"
            >
              {/* Outer spinning rings */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-500 border-r-red-400"
                  style={{ boxShadow: '0 0 20px rgba(239,68,68,0.5)' }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-[2px] border-transparent border-t-red-600/70 border-b-red-400/40"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-8 rounded-full border border-red-800/50"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-14 h-14 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-400"
                  style={{ boxShadow: '0 0 30px rgba(239,68,68,0.4), inset 0 0 20px rgba(239,68,68,0.1)' }}
                >
                  <ShieldCheck className="w-7 h-7" />
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="w-72 space-y-2">
                <div className="flex justify-between font-mono text-[0.6rem] text-red-400/70 uppercase tracking-widest">
                  <span>AUTHORIZATION</span>
                  <span>GRANTED</span>
                </div>
                <div className="h-[2px] bg-red-900/30 w-full relative overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                    className="h-full bg-red-500 absolute top-0 left-0"
                    style={{ boxShadow: '0 0 12px 2px rgba(239,68,68,0.7)' }}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="text-center space-y-2">
                <motion.p
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="font-mono text-sm text-red-400 tracking-[0.35em] uppercase"
                >
                  ACCESS GRANTED
                </motion.p>
                <p className="font-mono text-[0.65rem] text-[#8B949E] tracking-widest uppercase">
                  Redirecting to Command Center...
                </p>
              </div>

              {/* Scanning horizontal lines */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: ['-10vh', '110vh'] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.8,
                      ease: 'linear',
                    }}
                    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGIN FORM */}
        <div className="max-w-md w-full mx-auto relative z-10">

          {/* Header */}
          <div className="text-center mb-8">
            {/* Shield with red pulse animation when loading */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              {loading && !authSuccess && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.7, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 1.0, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-red-500"
                  />
                  <motion.div
                    animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 1.0, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 rounded-full border border-red-600/50"
                  />
                </>
              )}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  loading && !authSuccess
                    ? 'bg-red-900/20 border-red-500 text-red-400'
                    : 'bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF]'
                }`}
                style={
                  loading && !authSuccess
                    ? { boxShadow: '0 0 30px rgba(239,68,68,0.4)' }
                    : { boxShadow: '0 0 20px rgba(0,217,255,0.2)' }
                }
              >
                {loading && !authSuccess
                  ? <ShieldAlert className="w-8 h-8" />
                  : <ShieldCheck className="w-8 h-8" />
                }
              </div>
            </div>

            <span className={`font-mono text-xs tracking-widest uppercase block mb-1 transition-colors duration-300 ${
              loading && !authSuccess ? 'text-red-400' : 'text-[#00D9FF]'
            }`}>
              {loading && !authSuccess ? 'AUTHENTICATING CREDENTIALS...' : 'RESTRICTED SECURITY ZONE'}
            </span>
            <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">
              ADMIN COMMAND AUTH
            </h1>
            <p className="font-mono text-xs text-[#8B949E] mt-1">
              Enter authorized personnel credentials to proceed
            </p>
          </div>

          {/* Scanning animation bar during loading */}
          <AnimatePresence>
            {loading && !authSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="relative h-7 bg-red-950/20 border border-red-900/40 flex items-center justify-center overflow-hidden">
                  {/* Moving scan line */}
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
                  />
                  <div className="flex items-center gap-2 relative z-10">
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-red-500 rounded-full"
                      style={{ boxShadow: '0 0 6px rgba(239,68,68,0.8)' }}
                    />
                    <span className="font-mono text-[0.62rem] text-red-400 tracking-[0.2em] uppercase">
                      SCANNING BIOMETRIC DATA...
                    </span>
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-red-500 rounded-full"
                      style={{ boxShadow: '0 0 6px rgba(239,68,68,0.8)' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form box — border animates red during auth */}
          <motion.div
            animate={
              loading && !authSuccess
                ? {
                    borderColor: 'rgba(239,68,68,0.9)',
                    boxShadow: '0 0 60px rgba(239,68,68,0.25), 0 0 20px rgba(239,68,68,0.1) inset',
                  }
                : {
                    borderColor: 'rgba(0,217,255,1)',
                    boxShadow: '0 0 50px rgba(0,217,255,0.15)',
                  }
            }
            transition={{ duration: 0.4 }}
            className="bg-[#090C12]/90 backdrop-blur-sm border p-8 relative"
          >
            {/* Corner accents */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-colors duration-300 ${loading && !authSuccess ? 'border-red-500' : 'border-[#00D9FF]'}`} />
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 transition-colors duration-300 ${loading && !authSuccess ? 'border-red-500' : 'border-[#00D9FF]'}`} />
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 transition-colors duration-300 ${loading && !authSuccess ? 'border-red-500' : 'border-[#00D9FF]'}`} />
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-colors duration-300 ${loading && !authSuccess ? 'border-red-500' : 'border-[#00D9FF]'}`} />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/50 p-3 mb-6 flex items-center gap-2 text-xs font-mono text-rose-400"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-[#8B949E] uppercase mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>OPERATIVE ID / USERNAME</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  disabled={loading}
                  className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8B949E] uppercase mb-2 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>SECURITY PASSWORD</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono transition-colors disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-xs py-3.5 flex items-center justify-center gap-2 mt-4 tracking-widest border font-mono font-bold uppercase transition-all duration-300 ${
                  loading && !authSuccess
                    ? 'bg-red-600/20 border-red-500 text-red-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {loading && !authSuccess ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-red-400/40 border-t-red-400 rounded-full"
                    />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>ACCESS CONTROL CENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <p className="text-center font-mono text-[0.6rem] text-[#8B949E]/50 mt-5 tracking-widest uppercase">
            NEXUS 2026 · RESTRICTED ZONE · ALL ACCESS ATTEMPTS ARE LOGGED
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
