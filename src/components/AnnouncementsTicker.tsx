'use client';

import { useState } from 'react';
import { ANNOUNCEMENTS } from '@/lib/data';

export default function AnnouncementsTicker() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const tickerText = ANNOUNCEMENTS.map(a => `// ${a.title}: ${a.description}`).join('    ');

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] flex items-center justify-between overflow-hidden"
      style={{
        background: 'var(--electric-blue)',
        height: '28px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex-1 overflow-hidden relative">
        <div
          className="whitespace-nowrap absolute"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: '#fff',
            top: '50%',
            transform: 'translateY(-50%)',
            animation: 'ticker 40s linear infinite',
          }}
        >
          {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.7)',
          padding: '0 0.75rem',
          flexShrink: 0,
          cursor: 'none',
          letterSpacing: '0.1em',
        }}
      >
        ✕ DISMISS
      </button>
    </div>
  );
}
