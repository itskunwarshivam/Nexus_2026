'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Download, QrCode, CheckCircle2, Search, ArrowLeft, FileSpreadsheet, LogOut, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [eventList, setEventList] = useState<any[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [uniqueParticipants, setUniqueParticipants] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [searchCode, setSearchCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Fetch real stats from API
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (!data.error) {
        setEventList(data.eventStats || []);
        setTotalRegistrations(data.totalRegistrations || 0);
        setUniqueParticipants(data.uniqueParticipants || 0);
      }
    } catch {}
    finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (data.authenticated) {
          setAdminUser(data.user);
          fetchStats(); // load real stats once authenticated
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleDownloadExcel = (eventId: string = 'all') => {
    window.open(`/api/admin/export?eventId=${eventId}`, '_blank');
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const code = searchCode.trim().toUpperCase();
    const mockRecord = {
      code,
      status: 'VERIFIED',
      name: 'OPERATIVE ' + code.slice(-4),
      eventTitle: eventList[0]?.title || 'NEXUS EVENT',
      time: new Date().toLocaleTimeString(),
    };
    setVerificationResult(mockRecord);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#030407] text-[#00D9FF] font-mono text-xs flex items-center justify-center tracking-widest uppercase">
        VERIFYING SECURITY CLEARANCE...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#030407] text-[#F0F4F8] selection:bg-[#00D9FF]/30 pb-20 pt-24">
        <div className="container mx-auto px-6 relative z-10 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1F2937]">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#00D9FF] transition-colors text-xs font-mono mb-2 uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </Link>
              <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight flex items-center gap-3">
                <span>CONTROL CENTER</span>
                <span className="text-xs px-3 py-1 bg-[#00D9FF]/10 border border-[#00D9FF]/40 text-[#00D9FF] font-mono">
                  ADMIN COMMAND
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {adminUser && (
                <div className="bg-[#090C12] border border-[#00D9FF]/40 px-3 py-1.5 flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#00D9FF]" />
                  <div className="text-left">
                    <span className="font-mono text-xs text-white font-bold block">{adminUser.name}</span>
                    <span className="font-mono text-[0.6rem] text-[#F5A623]">{adminUser.role} · {adminUser.badge}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleDownloadExcel('all')}
                className="btn-primary text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                EXPORT ALL EXCEL (.XLSX)
              </button>

              <button
                onClick={handleLogout}
                className="btn-ghost text-xs flex items-center gap-2 border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                LOGOUT
              </button>
            </div>
          </div>

          {/* QR Code & Code Check-in Verifier */}
          <section className="bg-[#090C12] border border-[#00D9FF] p-6 mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <QrCode className="w-6 h-6 text-[#00D9FF]" />
              <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white">INSTANT ENTRY CHECK-IN SCANNER</h2>
            </div>

            <form onSubmit={handleVerifyCode} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter / Scan Registration Code (e.g. NEX-2026-04821)"
                className="flex-1 bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm font-mono text-white outline-none"
              />
              <button type="submit" className="btn-primary text-xs px-6">
                <Search className="w-4 h-4 mr-1" />
                VERIFY PASS
              </button>
            </form>

            {verificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#030407] border border-emerald-500/50 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <span className="font-mono text-xs text-emerald-400 font-bold block uppercase">ENTRY GRANTED — {verificationResult.code}</span>
                    <span className="text-xs text-white font-mono">{verificationResult.name} · {verificationResult.eventTitle}</span>
                  </div>
                </div>
                <span className="font-mono text-[0.65rem] text-[#8B949E]">CHECKED IN AT {verificationResult.time}</span>
              </motion.div>
            )}
          </section>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#090C12] border border-[#1F2937] p-6 text-center">
              <span className="font-mono text-xs text-[#8B949E] uppercase tracking-wider block mb-1">TOTAL REGISTRATIONS</span>
              {statsLoading
                ? <span className="font-display font-bold text-4xl text-[#00D9FF] animate-pulse">—</span>
                : <span className="font-display font-bold text-4xl text-[#00D9FF]">{totalRegistrations}</span>
              }
            </div>
            <div className="bg-[#090C12] border border-[#1F2937] p-6 text-center">
              <span className="font-mono text-xs text-[#8B949E] uppercase tracking-wider block mb-1">ACTIVE MISSIONS</span>
              {statsLoading
                ? <span className="font-display font-bold text-4xl text-white animate-pulse">—</span>
                : <span className="font-display font-bold text-4xl text-white">{eventList.length}</span>
              }
            </div>
            <div className="bg-[#090C12] border border-[#1F2937] p-6 text-center">
              <span className="font-mono text-xs text-[#8B949E] uppercase tracking-wider block mb-1">UNIQUE PARTICIPANTS</span>
              {statsLoading
                ? <span className="font-display font-bold text-4xl text-[#F5A623] animate-pulse">—</span>
                : <span className="font-display font-bold text-4xl text-[#F5A623]">{uniqueParticipants}</span>
              }
            </div>
          </div>

          {/* Event List & Excel Download Section */}
          <section className="mb-12">
            <div className="flex flex-col items-center justify-center mb-6 gap-1 text-center">
              <h2 className="text-xl font-display font-bold uppercase tracking-wider text-white">EVENT REGISTRATION LISTS (.XLSX)</h2>
              <span className="font-mono text-xs text-[#8B949E]">DATA STORED IN /data/registrations/[eventId]/</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {eventList.map(item => (
                <div key={item.id} className="bg-[#090C12] border border-[#1F2937] p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-[#00D9FF]/30 transition-colors">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <span className="font-mono text-[0.65rem] text-[#00D9FF] uppercase tracking-widest">{item.category}</span>
                      <span className="font-mono text-[0.65rem] text-[#8B949E]">•</span>
                      <span className="font-mono text-[0.65rem] text-[#F5A623]">{item.registrationCount} Registered</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-xl">{item.title}</h3>
                    <p className="font-mono text-xs text-[#8B949E] mt-1">{item.venue} · Squad Size: {item.teamSize}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadExcel(item.id)}
                    className="btn-ghost text-xs flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#F5A623]" />
                    EXTRACT EXCEL (.XLSX)
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
