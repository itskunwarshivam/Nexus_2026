'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];

export default function EasterEgg() {
  const [seq, setSeq] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setSeq(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (JSON.stringify(next) === JSON.stringify(KONAMI)) {
          setUnlocked(true);
          return [];
        }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)' }}
          onClick={() => setUnlocked(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '3rem',
              border: '1px solid var(--electric-blue)',
              textAlign: 'center',
            }}
          >
            <p className="eyebrow mb-4">CLOVER PROTOCOL // ACTIVATED</p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#fff',
              marginBottom: '1rem',
            }}>
              SECRET MISSION<br />UNLOCKED
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', lineHeight: 1.8, marginBottom: '2rem' }}>
              Present this token at the NEXUS Control Desk<br />for VIP Arena access + exclusive swag.
            </p>
            <div style={{
              padding: '1rem 2rem',
              border: '1px solid rgba(59,130,246,0.3)',
              background: 'rgba(59,130,246,0.05)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.4rem',
              letterSpacing: '0.2em',
              color: 'var(--amber)',
              marginBottom: '2rem',
            }}>
              AVENGERS-99-SECRET
            </div>
            <button
              onClick={() => setUnlocked(false)}
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              RETURN TO MISSION MATRIX
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
