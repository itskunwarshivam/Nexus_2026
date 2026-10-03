import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Trophy, Clock, Users, Shield } from 'lucide-react';
import { CLUBS, EVENTS } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return CLUBS.map((club) => ({
    id: club.id,
  }));
}

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = CLUBS.find((c) => c.id === id);

  if (!club) {
    notFound();
  }

  // Filter events belonging to this club
  const clubActivities = EVENTS.filter((event) => club.activityIds?.includes(event.id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030508] text-white pt-24 pb-20 relative overflow-hidden">
        {/* Background Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-10 blur-[120px] rounded-full pointer-events-none"
          style={{ backgroundColor: club.accentColor || '#C9A24D' }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-6xl">
          <Link 
            href="/clubs" 
            className="inline-flex items-center gap-2 text-[#8D96A5] hover:text-[#C9A24D] transition-colors uppercase tracking-widest text-xs font-mono font-bold mb-12"
            data-cursor="RETURN"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>

          {/* Header Section */}
          <header className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs tracking-widest text-[#C9A24D] uppercase border border-[#C9A24D]/40 px-3 py-1 bg-[#C9A24D]/10">
                DIVISION // {club.id.toUpperCase()}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase bg-[#222A36] text-white border border-[#222A36] px-3 py-1">
                <Users className="w-3.5 h-3.5 text-[#C9A24D]" />
                {club.memberCount || 75}+ OPERATIVES
              </div>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tight mb-4 text-white">
              {club.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-[#8D96A5] font-display italic mb-8">
              "{club.tagline}"
            </p>
            
            <div className="flex items-center gap-4 border-t border-[#222A36] pt-8 mt-8">
              <div className="w-12 h-12 rounded-full bg-[#0A0F18] flex items-center justify-center border border-[#222A36]">
                <Shield className="w-6 h-6 text-[#C9A24D]" />
              </div>
              <div>
                <p className="text-xs text-[#8D96A5] font-mono uppercase tracking-wider mb-0.5">Division Commander</p>
                <p className="text-base font-bold text-white uppercase tracking-wider">{club.leadName || 'Classified'}</p>
              </div>
            </div>
          </header>

          {/* Activities Section */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-display font-black uppercase tracking-wider">Active Missions</h2>
              <div className="h-px flex-1 bg-[#222A36]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubActivities.length > 0 ? (
                clubActivities.map((activity) => (
                  <Link href={`/events/${activity.id}`} key={activity.id} className="group outline-none" data-cursor="VIEW">
                    <div className="h-full bg-[#0A0F18] border border-[#222A36] hover:border-[#C9A24D] p-6 transition-all duration-300 flex flex-col relative overflow-hidden">
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-6 flex-1">
                          <span className="inline-block text-xs font-mono text-[#C9A24D] mb-3 tracking-widest uppercase">MISSION REF: {activity.id.toUpperCase()}</span>
                          <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#F2C96D] transition-colors">{activity.title}</h3>
                          <p className="text-sm text-[#8D96A5] line-clamp-2">{activity.subtitle || activity.description}</p>
                        </div>

                        <div className="space-y-2 mb-6 font-mono text-xs text-[#8D96A5]">
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-[#C9A24D]" />
                            <span>{activity.date || 'OCT 21, 2026'}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-2 text-[#C9A24D]" />
                            <span>{activity.time || 'TBD'}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-2 text-[#C9A24D]" />
                            <span className="truncate">{activity.venue || 'VANGUARD ARENA'}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-[#222A36] flex items-center justify-between">
                          <div className="flex items-center text-[#C9A24D] text-xs font-mono font-bold uppercase tracking-wider">
                            <Trophy className="w-3.5 h-3.5 mr-1.5" />
                            {activity.prizes?.[0]?.amount ? `PRIZE: ${activity.prizes[0].amount}` : 'GLORY AWAITS'}
                          </div>
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                            Briefing →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 text-center border border-[#222A36] bg-[#0A0F18]">
                  <p className="text-[#8D96A5] font-mono text-xs uppercase tracking-widest">NO MISSIONS CURRENTLY ASSIGNED</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
