import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ClientLayer from '@/components/ClientLayer';

const spaceGrotesk = Space_Grotesk({ variable: '--font-display', subsets: ['latin'], weight: ['300','400','500','600','700'] });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['300','400','500','600'] });

export const metadata: Metadata = {
  title: 'NEXUS 2026 | Vanguard Institute of Technology × IIT Delhi',
  description: 'NEXUS 2026 — The premier tech fest. 10 clubs, 12 competitions, October 21 2026.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ClientLayer />
        {children}
      </body>
    </html>
  );
}
