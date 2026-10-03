'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, CheckCircle2, QrCode, AlertCircle, ArrowLeft, ShieldCheck, Mail, Calendar, MapPin, User, Key, Ticket, Printer } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function StudentDashboard() {
  const [emailInput, setEmailInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !codeInput.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorMsg('');
    setStudentInfo(null);
    setRegistrations([]);

    try {
      const res = await fetch('/api/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, code: codeInput }),
      });
      const data = await res.json();

      if (data.found && data.registrations) {
        setStudentInfo(data.student);
        setRegistrations(data.registrations);
      } else {
        setErrorMsg(data.message || 'No active registration found. Please check your Email and Tech Code.');
      }
    } catch {
      setErrorMsg('Failed to connect to verification server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="min-h-screen bg-[#030407] text-[#F0F4F8] selection:bg-[#00D9FF]/30 pb-24 pt-32 flex flex-col justify-center items-center px-4 print:bg-white print:text-black print:p-0">
        <div className="max-w-2xl w-full mx-auto print:max-w-none print:w-full">
          
          {/* Header - Centered */}
          <div className="mb-8 text-center print:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#00D9FF] transition-colors text-xs font-mono mb-4 uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Universe</span>
            </Link>

            <div className="w-16 h-16 bg-[#00D9FF]/10 border border-[#00D9FF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#00D9FF] shadow-[0_0_25px_rgba(0,217,255,0.2)]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-1">
              STUDENT REGISTRATION PORTAL
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-white">
              VERIFY DIGITAL PASSES
            </h1>
            <p className="font-mono text-xs text-[#8B949E] mt-2 max-w-md mx-auto">
              Enter your registered Email Address and Tech Code (Both Mandatory) to view all your registered events and entry passes.
            </p>
          </div>

          {/* Verification Form Card - Centered Cyan Glow Box */}
          <div className="bg-[#090C12] border border-[#00D9FF] p-8 md:p-10 relative shadow-[0_0_50px_rgba(0,217,255,0.15)] mb-8 print:hidden">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>REGISTERED EMAIL ADDRESS *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="luke@rebellion.org"
                    className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm font-mono text-white outline-none transition-all placeholder:text-[#8B949E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#F5A623]" />
                    <span>TECH CODE — Permanent User Code *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="TECH-XXXXX (Sent on first registration)"
                    className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#F5A623] p-3 text-sm font-mono text-white outline-none transition-all placeholder:text-[#8B949E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xs py-3.5 flex items-center justify-center gap-2 uppercase tracking-widest mt-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'VERIFYING PASSES...' : 'VERIFY & LIST ALL REGISTERED EVENTS'}</span>
              </button>
            </form>

            <div className="mt-4 space-y-1 text-[0.68rem] font-mono text-[#8B949E] border-t border-[#1F2937] pt-4">
              <p><span className="text-[#00D9FF]">TECH CODE</span> — Your permanent identity code. Sent once when you first registered. Never changes.</p>
              <p><span className="text-[#F5A623]">REGISTRATION CODE</span> — A new code issued per event (NEX-2026-XXXXX). Different for each event.</p>
              <div className="flex justify-end mt-2">
                <Link href="/register" className="text-[#00D9FF] hover:underline">Enlist in New Event →</Link>
              </div>
            </div>
          </div>

          {/* Results Section - Centered */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="print:block"
            >
              {errorMsg ? (
                <div className="bg-[#090C12] border border-rose-500/40 p-8 text-center print:hidden">
                  <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white uppercase">VERIFICATION FAILED</h3>
                  <p className="font-mono text-xs text-rose-400 mt-2 max-w-md mx-auto">{errorMsg}</p>
                  
                  <div className="mt-6 flex justify-center gap-4">
                    <Link href="/register" className="btn-primary text-xs">
                      ENLIST FOR AN EVENT NOW →
                    </Link>
                  </div>
                </div>
              ) : registrations.length > 0 && (
                <div className="space-y-6">
                  
                  {/* On-Screen Display Card (Centered Box) */}
                  <div className="print:hidden space-y-6">
                    {/* Student Identity Banner */}
                    {studentInfo && (
                      <div className="bg-[#090C12] border border-[#00D9FF] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,217,255,0.15)]">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#00D9FF]/10 border border-[#00D9FF] rounded-full flex items-center justify-center text-[#00D9FF] shrink-0 font-bold">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-xl font-display font-bold text-white uppercase">{studentInfo.name}</h2>
                            <p className="font-mono text-xs text-[#8B949E]">{studentInfo.email} · {studentInfo.college}</p>
                          </div>
                        </div>

                        <div className="bg-[#030407] border border-[#00D9FF]/40 px-4 py-2 text-right">
                          <span className="font-mono text-[0.65rem] text-[#00D9FF] font-bold block uppercase tracking-widest">ENLISTED EVENTS</span>
                          <span className="font-display font-bold text-xl text-[#F5A623]">{registrations.length} MISSIONS</span>
                        </div>
                      </div>
                    )}

                    {/* Print All Button */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
                      <h3 className="text-base font-display font-bold uppercase text-white tracking-wider flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-[#00D9FF]" />
                        <span>REGISTERED MISSIONS & TECH CODES ({registrations.length})</span>
                      </h3>
                      <button
                        onClick={() => window.print()}
                        className="btn-primary text-xs py-2 px-4 flex items-center gap-2 bg-[#F5A623] border-[#F5A623] text-[#030407]"
                      >
                        <Printer className="w-4 h-4" />
                        <span>PRINT E-TICKET</span>
                      </button>
                    </div>

                    {/* On-screen Event List */}
                    <div className="space-y-6">
                      {registrations.map((item, idx) => (
                        <div key={item.registrationCode || idx} className="bg-[#090C12] border border-[#00D9FF] p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,217,255,0.15)]">
                          
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-[0.65rem] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
                                  VERIFIED PASS
                                </span>
                                <span className="font-mono text-xs text-[#8B949E]">{item.eventDate}</span>
                              </div>
                              <h4 className="text-2xl font-display font-bold text-white uppercase mt-1">{item.eventTitle}</h4>
                              <p className="font-mono text-xs text-[#8B949E] mt-1">Venue: <span className="text-white">{item.eventVenue}</span> · Squad: <span className="text-[#00D9FF]">{item.teamName || 'Solo'}</span></p>
                            </div>

                            {/* Tech Code Display */}
                            <div className="bg-[#030407] border border-[#F5A623] p-4 text-center min-w-[200px]">
                              <span className="font-mono text-[0.6rem] text-[#8B949E] uppercase block">TECH CODE</span>
                              <span className="font-mono font-bold text-xl text-[#F5A623] tracking-widest block mt-0.5">{item.registrationCode}</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6">
                            <div className="space-y-2 font-mono text-xs text-[#8B949E] flex-1">
                              <p>OPERATIVE: <strong className="text-white">{item.name}</strong></p>
                              <p>EMAIL: <span className="text-white">{item.email}</span></p>
                              <p>COLLEGE: <span className="text-white">{item.college}</span></p>
                              <p>DIRECTIVE: <span className="text-[#00D9FF]">Present attached QR Pass at Checkpoint</span></p>
                            </div>

                            {item.qrCodeDataUrl && (
                              <div className="bg-white p-3 inline-block border border-[#00D9FF] text-center shrink-0">
                                <img src={item.qrCodeDataUrl} alt="Check-in QR Pass" className="w-32 h-32 mx-auto" />
                                <span className="text-[8px] font-mono text-black font-bold block mt-1 tracking-widest uppercase">SCAN AT ENTRY DESK</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* IRCTC-STYLE OFFICIAL PRINTABLE E-TICKET FORMAT (VISIBLE ONLY IN PRINT) */}
                  {/* ========================================================================= */}
                  <div className="hidden print:block font-mono text-black bg-white p-6 leading-normal">
                    
                    {/* PAGE 1: OFFICIAL IRCTC E-TICKET LAYOUT */}
                    <div className="border-4 border-black p-5 relative">
                      
                      {/* Top Branding Header */}
                      <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight uppercase">NEXUS 2026 — OFFICIAL FEST E-TICKET</h1>
                          <p className="text-xs font-semibold">IIT DELHI × VANGUARD INSTITUTE OF TECHNOLOGY</p>
                          <p className="text-[10px] text-gray-700">Combined Entry Pass & Multi-Event Operative Clearance</p>
                        </div>
                        <div className="text-right border-l-2 border-black pl-4">
                          <p className="text-xs font-bold">MASTER TICKET ID</p>
                          <p className="text-lg font-bold text-blue-900">{registrations[0]?.registrationCode}</p>
                          <p className="text-[10px]">Date of Issue: {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Operative / Passenger Info Table */}
                      <div className="mb-5">
                        <p className="text-xs font-bold uppercase bg-gray-200 p-1 border border-black mb-1">
                          OPERATIVE / PARTICIPANT DETAILS
                        </p>
                        <table className="w-full text-xs border-collapse border border-black">
                          <tbody>
                            <tr className="border-b border-black">
                              <td className="p-2 border-r border-black font-bold bg-gray-100 w-1/4">FULL NAME:</td>
                              <td className="p-2 border-r border-black font-bold uppercase w-1/4">{studentInfo?.name}</td>
                              <td className="p-2 border-r border-black font-bold bg-gray-100 w-1/4">EMAIL ADDRESS:</td>
                              <td className="p-2 font-bold w-1/4">{studentInfo?.email}</td>
                            </tr>
                            <tr className="border-b border-black">
                              <td className="p-2 border-r border-black font-bold bg-gray-100">PHONE NUMBER:</td>
                              <td className="p-2 border-r border-black">{studentInfo?.phone}</td>
                              <td className="p-2 border-r border-black font-bold bg-gray-100">COLLEGE / INSTITUTION:</td>
                              <td className="p-2">{studentInfo?.college}</td>
                            </tr>
                            <tr>
                              <td className="p-2 border-r border-black font-bold bg-gray-100">PROGRAM & YEAR:</td>
                              <td className="p-2 border-r border-black">{studentInfo?.course} ({studentInfo?.year})</td>
                              <td className="p-2 border-r border-black font-bold bg-gray-100">CLEARANCE STATUS:</td>
                              <td className="p-2 font-bold text-green-700 uppercase">OFFICIALLY VERIFIED</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* IRCTC Style Schedule Table */}
                      <div className="mb-5">
                        <p className="text-xs font-bold uppercase bg-gray-200 p-1 border border-black mb-1">
                          ENLISTED MISSIONS & TECH CODES SCHEDULE (TOTAL EVENTS: {registrations.length})
                        </p>
                        <table className="w-full text-[11px] border-collapse border border-black text-left">
                          <thead>
                            <tr className="bg-gray-100 border-b border-black">
                              <th className="p-2 border-r border-black">S.NO</th>
                              <th className="p-2 border-r border-black">TECH CODE</th>
                              <th className="p-2 border-r border-black">EVENT TITLE</th>
                              <th className="p-2 border-r border-black">VENUE</th>
                              <th className="p-2 border-r border-black">DATE & TIME</th>
                              <th className="p-2 border-r border-black">SQUAD NAME</th>
                              <th className="p-2">STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {registrations.map((r, i) => (
                              <tr key={r.registrationCode} className="border-b border-black">
                                <td className="p-2 border-r border-black text-center">{i + 1}</td>
                                <td className="p-2 border-r border-black font-bold text-blue-900">{r.registrationCode}</td>
                                <td className="p-2 border-r border-black font-bold uppercase">{r.eventTitle}</td>
                                <td className="p-2 border-r border-black">{r.eventVenue}</td>
                                <td className="p-2 border-r border-black">{r.eventDate} (09:00 AM)</td>
                                <td className="p-2 border-r border-black">{r.teamName || 'Solo'}</td>
                                <td className="p-2 font-bold text-green-700">VERIFIED</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* QR Passes Grid for Entry Checkpoints */}
                      <div className="mb-4">
                        <p className="text-xs font-bold uppercase bg-gray-200 p-1 border border-black mb-2">
                          ENTRY CHECKPOINT QR PASSES & TECH CODES
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {registrations.map((r) => (
                            <div key={r.registrationCode} className="border border-black p-2 bg-gray-50">
                              <p className="text-[10px] font-bold uppercase truncate">{r.eventTitle}</p>
                              {r.qrCodeDataUrl && (
                                <img src={r.qrCodeDataUrl} alt="QR Pass" className="w-28 h-28 mx-auto my-1 border border-black" />
                              )}
                              <p className="text-[10px] font-bold text-blue-900">TECH CODE: {r.registrationCode}</p>
                              <p className="text-[8px] text-gray-600">Scan at Entry Desk</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Official Seal / Signature Footer */}
                      <div className="flex justify-between items-end border-t-2 border-black pt-3 mt-4 text-[10px]">
                        <div>
                          <p><strong>NEXUS 2026 CONTROL DESK</strong></p>
                          <p>IIT Delhi × Vanguard Institute of Technology</p>
                        </div>
                        <div className="text-center border border-black p-2 bg-gray-100">
                          <p className="font-bold text-xs uppercase text-blue-900">AUTHORIZED STAMP</p>
                          <p className="text-[8px] text-gray-700">COMPUTER GENERATED TICKET — NO SIGNATURE REQUIRED</p>
                        </div>
                      </div>
                    </div>

                    {/* Page Break for Page 2 */}
                    <div className="break-before-page mt-8 pt-6 border-t-4 border-black">
                      <div className="border-4 border-black p-5">
                        
                        {/* Page 2 Header */}
                        <div className="border-b-2 border-black pb-3 mb-4 flex justify-between items-center">
                          <div>
                            <h2 className="text-xl font-bold uppercase">PAGE 2 OF 2 — FEST DIRECTIVES & OPERATIVE INSTRUCTIONS</h2>
                            <p className="text-xs">NEXUS 2026 — General Guidelines for Participants</p>
                          </div>
                          <span className="text-xs font-bold bg-gray-200 px-3 py-1 border border-black">IMPORTANT INTEL</span>
                        </div>

                        {/* Directives & Guidelines List */}
                        <div className="space-y-4 text-xs">
                          <div className="border border-black p-3 bg-gray-50">
                            <h4 className="font-bold uppercase text-blue-900 mb-2 border-b border-black pb-1">1. REPORTING & ENTRY PROTOCOL</h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                              <li>All operatives must report to the Main Gate Checkpoint by <strong>08:30 AM</strong> on 21 October 2026.</li>
                              <li>It is mandatory to present a physical or digital copy of this <strong>Official E-Ticket</strong> along with a valid College/Institution Photo ID.</li>
                              <li>Each event has its own specific <strong>Tech Code</strong> and scannable <strong>QR Pass</strong>. Have the respective QR code ready at the event hall entry.</li>
                            </ul>
                          </div>

                          <div className="border border-black p-3 bg-gray-50">
                            <h4 className="font-bold uppercase text-blue-900 mb-2 border-b border-black pb-1">2. EVENT RULES & CODE OF CONDUCT</h4>
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                              <li>Participants must adhere strictly to the schedule timings. Late entry to arena halls after event commencement will not be permitted.</li>
                              <li>Prohibited items: Weapons, inflammable materials, alcoholic beverages, and unauthorized recording devices are strictly forbidden.</li>
                              <li>The decision of the Mission Commanders & Judges will be final and binding for all competitions.</li>
                            </ul>
                          </div>

                          <div className="border border-black p-3 bg-gray-50">
                            <h4 className="font-bold uppercase text-blue-900 mb-2 border-b border-black pb-1">3. EMERGENCY HELPLINE & CONTROL DESK CONTACTS</h4>
                            <div className="grid grid-cols-2 gap-2 text-gray-800">
                              <p><strong>Central Command Desk:</strong> +91 98765 43210</p>
                              <p><strong>Email Support:</strong> nexus2026@vanguardit.edu</p>
                              <p><strong>Security Control:</strong> Gate 01 & Gate 04</p>
                              <p><strong>Medical Emergency:</strong> First Aid Post (Auditorium Block)</p>
                            </div>
                          </div>
                        </div>

                        {/* Footer Disclaimer */}
                        <div className="border-t border-black pt-3 mt-6 text-center text-[10px] text-gray-600">
                          <p>NEXUS 2026 © Vanguard Institute of Technology × IIT Delhi. All rights reserved.</p>
                          <p>Thank you for enlisting. May the Force be with you!</p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
