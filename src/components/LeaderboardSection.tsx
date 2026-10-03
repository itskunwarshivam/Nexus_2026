'use client';

import { motion } from 'framer-motion';
import { LEADERBOARD } from '@/lib/data';

export default function LeaderboardSection() {
  const maxScore = Math.max(...LEADERBOARD.map((item) => item.score));

  return (
    <section id="leaderboard" className="section bg-[#090b1a]">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="eyebrow text-[#f59e0b]">HALL OF HEROES // LIVE RANKINGS</div>
          <h2 className="text-display-md text-[#e8eaf0]">TOP OPERATIVES</h2>
        </motion.div>

        <div className="w-full">
          {LEADERBOARD.map((item, index) => {
            const rankStr = item.rank.toString().padStart(2, '0');
            const percent = (item.score / maxScore) * 100;

            let rankColor = 'text-[#6b7280]'; // text-muted
            let rankSize = 'text-[1.5rem]';
            if (item.rank === 1) {
              rankColor = 'text-[#f59e0b]'; // amber
              rankSize = 'text-[2rem]';
            } else if (item.rank === 2) {
              rankColor = 'text-white';
            } else if (item.rank === 3) {
              rankColor = 'text-[#06b6d4]'; // plasma cyan
            }

            return (
              <motion.div
                key={item.team}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-row items-center py-5 border-b border-[var(--border)] hover:bg-[rgba(59,130,246,0.04)] transition-colors gap-4 group"
              >
                <div className={`font-mono font-bold ${rankColor} ${rankSize} w-12 sm:w-16 text-center`}>
                  {rankStr}
                </div>
                
                <div className="w-48 sm:w-64">
                  <div className="font-display font-bold text-base text-[#e8eaf0] uppercase tracking-wider">
                    {item.team}
                  </div>
                  <div className="text-[0.7rem] font-mono text-[#6b7280] uppercase mt-1">
                    {item.event}
                  </div>
                </div>

                <div className="flex-1 hidden md:block px-4">
                  <div className="w-full bg-[#050508] h-[3px] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                      className="h-full bg-[#3b82f6]"
                    />
                  </div>
                </div>

                <div className="font-mono text-[1.2rem] text-[#e8eaf0] text-right w-20 sm:w-24 ml-auto">
                  {item.score}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
