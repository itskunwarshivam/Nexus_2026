import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, IndianRupee, Timer, ArrowLeft, Trophy } from 'lucide-react';
import { EVENTS, CLUBS } from '@/lib/data';
import { RulesAccordion } from '@/components/EventDetailClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return EVENTS.map((event) => ({ id: event.id }));
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = EVENTS.find((e) => e.id === id);
  
  if (!event) {
    notFound();
  }

  const hostClub = CLUBS.find(c => c.id === event.clubId) || CLUBS[0];

  const timelineSteps = [
    { step: 'Registration Phase', time: 'Before Event' },
    { step: 'Preliminary Round', time: event.time.split('–')[0]?.trim() || '10:00 AM' },
    { step: 'Final Showdown', time: 'TBA' },
    { step: 'Results & Ceremonies', time: '05:00 PM' }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030508] text-[#E8E8E3] pb-20 pt-24">
        {/* Subtle Club Accent Glow */}
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15"
          style={{ background: hostClub.accentColor || '#C9A24D' }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-6xl">
          <div className="mb-8">
            <Link 
              href={event.clubId ? `/clubs/${event.clubId}` : "/clubs"} 
              className="inline-flex items-center gap-2 text-[#8D96A5] hover:text-[#C9A24D] transition-colors text-xs font-mono tracking-wider group uppercase"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to {hostClub.name}</span>
            </Link>
          </div>

          {/* Hero Header */}
          <div className="border-b border-[#222A36] pb-12 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-[#C9A24D]/30 text-[#C9A24D] text-xs font-mono uppercase tracking-widest bg-[#C9A24D]/10">
              <span>{event.categoryIcon}</span>
              <span>{hostClub.name} // {event.category.toUpperCase()}</span>
            </div>

            <h1 className="text-display-lg font-display font-black text-white uppercase tracking-tight mb-4">
              {event.title}
            </h1>

            <p className="text-xl md:text-2xl text-[#8D96A5] font-display italic max-w-3xl border-l-2 border-[#C9A24D] pl-4 mb-8">
              {event.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                href={`/register?event=${event.id}`} 
                className="btn-primary text-xs"
              >
                ACCEPT MISSION & REGISTER →
              </Link>
              <Link 
                href={`/clubs/${hostClub.id}`} 
                className="btn-ghost text-xs"
              >
                VIEW HOST CLUB INTEL
              </Link>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Mission Brief */}
              <section className="space-y-4">
                <p className="eyebrow" style={{ color: '#C9A24D' }}>MISSION BRIEFING</p>
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                  OBJECTIVE & OVERVIEW
                </h2>
                <p className="text-[#8D96A5] text-lg leading-relaxed font-body">
                  {event.description}
                </p>
              </section>

              {/* Rules */}
              <section className="space-y-4">
                <p className="eyebrow" style={{ color: '#C9A24D' }}>RULES OF ENGAGEMENT</p>
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                  OPERATIONAL DIRECTIVES
                </h2>
                <RulesAccordion rules={event.rules} />
              </section>

              {/* Prizes */}
              <section className="space-y-4">
                <p className="eyebrow" style={{ color: '#F2C96D' }}>SPOILS OF WAR</p>
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                  PRIZE POOL BREAKDOWN
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.prizes.map((prize, i) => (
                    <div key={i} className="p-6 bg-[#0A0F18] border border-[#222A36] flex flex-col items-center text-center">
                      <Trophy className="w-10 h-10 text-[#C9A24D] mb-3" />
                      <h3 className="font-display font-bold text-lg text-white mb-1">{prize.position}</h3>
                      <p className="font-mono text-xl font-bold text-[#F2C96D]">{prize.amount}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Intel Sidebar */}
            <div>
              <div className="bg-[#0A0F18] border border-[#222A36] p-6 sticky top-28 space-y-6">
                <h3 className="font-display font-bold text-lg uppercase tracking-wider text-white border-b border-[#222A36] pb-4">
                  MISSION INTEL
                </h3>

                <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <div className="text-[#8D96A5] uppercase flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A24D]" /> DATE
                    </div>
                    <div className="text-white font-bold">{event.date}</div>
                  </div>

                  <div>
                    <div className="text-[#8D96A5] uppercase flex items-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#C9A24D]" /> TIME
                    </div>
                    <div className="text-white font-bold">{event.time}</div>
                  </div>

                  <div>
                    <div className="text-[#8D96A5] uppercase flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A24D]" /> VENUE
                    </div>
                    <div className="text-white font-bold">{event.venue}</div>
                  </div>

                  <div>
                    <div className="text-[#8D96A5] uppercase flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 text-[#C9A24D]" /> SQUAD
                    </div>
                    <div className="text-white font-bold">{event.teamSize}</div>
                  </div>

                  <div>
                    <div className="text-[#8D96A5] uppercase flex items-center gap-1 mb-1">
                      <IndianRupee className="w-3.5 h-3.5 text-[#C9A24D]" /> ENTRY FEE
                    </div>
                    <div className="text-white font-bold">{event.fee}</div>
                  </div>

                  <div>
                    <div className="text-[#8D96A5] uppercase flex items-center gap-1 mb-1">
                      <Timer className="w-3.5 h-3.5 text-[#C9A24D]" /> DURATION
                    </div>
                    <div className="text-white font-bold">{event.duration}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#222A36]">
                  <p className="eyebrow text-[#8D96A5] mb-3">OPERATION TIMELINE</p>
                  <div className="space-y-3 font-mono text-xs">
                    {timelineSteps.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[#E8E8E3]">
                        <span>• {item.step}</span>
                        <span className="text-[#8D96A5]">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link 
                  href={`/register?event=${event.id}`} 
                  className="btn-primary block text-center w-full py-3.5 text-xs"
                >
                  ACCEPT MISSION NOW →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
