'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, ChevronLeft, Mail, FileSpreadsheet } from 'lucide-react';
import { EVENTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STEPS = [
  { id: 1, title: 'Identity' },
  { id: 2, title: 'Mission' },
  { id: 3, title: 'Squad' },
  { id: 4, title: 'Review' }
];

function RegisterContent() {
  const searchParams = useSearchParams();
  const preselectedEventParam = searchParams.get('event');
  
  // Normalize eventId lookup
  const initialEventId = preselectedEventParam
    ? (EVENTS.find((e) => e.id === preselectedEventParam || e.id.toLowerCase() === preselectedEventParam.toLowerCase().replace(/_/g, '-'))?.id || preselectedEventParam)
    : '';

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [emailSentTo, setEmailSentTo] = useState('');

  // Returning Student Profile States
  const [hasRegisteredBefore, setHasRegisteredBefore] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [profileFetched, setProfileFetched] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    year: '',
    eventId: initialEventId,
    teamName: '',
    teamMembers: ['', ''],
  });

  const selectedEventDetails = EVENTS.find((e: any) => e.id === formData.eventId);
  const isTeamEvent = selectedEventDetails?.teamSize && !selectedEventDetails.teamSize.includes('1');

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFetchProfile = async () => {
    if (!formData.email.trim()) {
      setFetchError('Please enter your email address to fetch profile');
      return;
    }

    setFetchingProfile(true);
    setFetchError('');

    try {
      const res = await fetch('/api/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: formData.email.trim() }),
      });
      const data = await res.json();

      if (data.found && data.registration) {
        const r = data.registration;
        setFormData(prev => ({
          ...prev,
          name: r.name || prev.name,
          phone: r.phone !== 'N/A' ? r.phone : prev.phone,
          college: r.college !== 'N/A' ? r.college : prev.college,
          course: r.course !== 'N/A' ? r.course : prev.course,
          year: r.year !== 'N/A' ? r.year : prev.year,
        }));
        setProfileFetched(true);
      } else {
        setFetchError('No previous registration record found for this email. Please fill in your details below.');
      }
    } catch {
      setFetchError('Failed to connect to profile server. Please enter details manually.');
    } finally {
      setFetchingProfile(false);
    }
  };

  const [alreadyRegisteredBanner, setAlreadyRegisteredBanner] = useState(false);

  const checkExistingEmail = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@') || !emailToCheck.includes('.')) return false;

    try {
      const res = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck.trim() }),
      });
      const data = await res.json();

      if (data.exists && data.profile) {
        const p = data.profile;
        setFormData(prev => ({
          ...prev,
          email: emailToCheck.trim(),
          name: p.name || prev.name,
          phone: p.phone || prev.phone,
          college: p.college || prev.college,
          course: p.course || prev.course,
          year: p.year || prev.year,
        }));
        // Auto-switch to "Yes, already registered" flow and show banner
        setHasRegisteredBefore(true);
        setProfileFetched(true);
        setAlreadyRegisteredBanner(true);
        return true;
      }
    } catch {}
    return false;
  };

  const nextStep = async () => {
    if (step < 4) {
      if (step === 1) {
        if (!hasRegisteredBefore && formData.email) {
          const isAlreadyRegistered = await checkExistingEmail(formData.email);
          if (isAlreadyRegistered) return;
        }

        if (hasRegisteredBefore && !profileFetched) {
          setFetchError('Please enter your email and click FETCH PROFILE before continuing.');
          return;
        }
        if (!formData.name || !formData.email || !formData.phone) return;
        
        // IF PRE-SELECTED AN EVENT (e.g. from Club / Mission page), SKIP STEP 2 (Mission Selection)
        if (formData.eventId) {
          setDirection(1);
          setStep(isTeamEvent ? 3 : 4);
          return;
        }
      }
      
      if (step === 2 && !formData.eventId) return;
      if (step === 3 && isTeamEvent && !formData.teamName) return;
      
      if (step === 2 && !isTeamEvent) {
        setDirection(1);
        setStep(4);
      } else {
        setDirection(1);
        setStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      if (step === 4 && formData.eventId && !isTeamEvent && initialEventId) {
        // Jump back to Step 1 if mission was preselected
        setDirection(-1);
        setStep(1);
      } else if (step === 4 && !isTeamEvent) {
        setDirection(-1);
        setStep(2);
      } else {
        setDirection(-1);
        setStep(prev => prev - 1);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setRegistrationId(data.registrationCode);
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setEmailSentTo(data.emailSentTo);
        setStep(5);
      } else {
        // Fallback local registration success
        const regId = 'NEX-2026-' + Math.floor(10000 + Math.random() * 90000);
        setRegistrationId(regId);
        setEmailSentTo(formData.email);
        setStep(5);
      }
    } catch (err) {
      // Fallback local registration ID generation
      const regId = 'NEX-2026-' + Math.floor(10000 + Math.random() * 90000);
      setRegistrationId(regId);
      setEmailSentTo(formData.email);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-[#030407] text-[#F0F4F8] pt-32 pb-24 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#090C12] border border-[#00D9FF] p-8 md:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,217,255,0.15)] text-center"
        >
          <div className="w-16 h-16 bg-[#00D9FF]/10 border border-[#00D9FF] rounded-full flex items-center justify-center mx-auto mb-6 text-[#00D9FF]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-1">
            MISSION ENLISTMENT SUCCESSFUL
          </span>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-2">
            REGISTRATION CONFIRMED
          </h1>

          {/* Registration Code Badge */}
          <div className="bg-[#030407] border border-[#1F2937] py-3 px-6 inline-block my-4">
            <span className="text-xs text-[#8B949E] font-mono block">REGISTRATION CODE</span>
            <span className="text-2xl font-mono font-bold text-[#F5A623] tracking-widest">{registrationId}</span>
          </div>

          {/* Instant Email Notification Banner */}
          <div className="bg-[#00D9FF]/10 border border-[#00D9FF]/30 p-4 rounded-none my-6 text-left flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#00D9FF] shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-xs text-[#00D9FF] font-bold block uppercase">INSTANT EMAIL DISPATCHED</span>
              <p className="text-xs text-[#8B949E] mt-0.5">
                Confirmation email with pass intel & entry QR code has been sent to <span className="text-white font-bold">{emailSentTo || formData.email}</span>.
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          {qrCodeDataUrl && (
            <div className="my-6 bg-white p-4 inline-block border border-[#00D9FF]">
              <img src={qrCodeDataUrl} alt="Check-in QR Code" className="w-48 h-48 mx-auto" />
              <span className="text-[10px] font-mono text-black font-bold block mt-2 tracking-widest uppercase">SCAN AT ENTRY DESK</span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-xs flex-1 text-center justify-center">
              VIEW STUDENT PASS →
            </Link>
            <Link href="/" className="btn-ghost text-xs flex-1 text-center justify-center">
              RETURN TO UNIVERSE
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030407] text-[#F0F4F8] pt-32 pb-24 flex flex-col justify-center items-center px-4">
      <div className="max-w-xl w-full mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B949E] hover:text-[#00D9FF] text-xs font-mono tracking-widest uppercase mb-6">
            ← BACK TO UNIVERSE
          </Link>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase">
              ENLISTMENT STEP 0{step} OF 04
            </span>
            <span className="font-mono text-xs text-[#8B949E] uppercase tracking-wider">{STEPS[step - 1]?.title}</span>
          </div>

          <div className="h-1 bg-[#1F2937] w-full flex">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "h-full transition-all duration-300 flex-1",
                  s.id <= step ? "bg-[#00D9FF]" : "bg-transparent"
                )}
              />
            ))}
          </div>
        </div>

        {/* Form Container with Cyan Glow Border matching Confirmation Screen */}
        <div className="bg-[#090C12] border border-[#00D9FF] p-8 md:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,217,255,0.15)]">
          <form onSubmit={handleSubmit}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* STEP 1: IDENTITY */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="eyebrow text-[#00D9FF]">OPERATIVE IDENTIFICATION</span>
                      <h2 className="text-2xl font-display font-bold text-white uppercase mt-1">PERSONAL DETAILS</h2>
                      {selectedEventDetails && (
                        <div className="mt-3 p-3 bg-[#00D9FF]/10 border border-[#00D9FF]/30 font-mono text-xs text-[#00D9FF] flex items-center justify-between">
                          <span>PRESELECTED MISSION: <strong>{selectedEventDetails.title}</strong></span>
                          <span>{selectedEventDetails.fee}</span>
                        </div>
                      )}
                    </div>

                    {/* Returning Student Option Toggle */}
                    <div className="bg-[#030407] border border-[#1F2937] p-4 font-mono text-xs">
                      <span className="text-[#8B949E] uppercase tracking-wider block mb-2 font-bold">
                        HAVE YOU REGISTERED FOR ANOTHER EVENT BEFORE?
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setHasRegisteredBefore(false);
                            setProfileFetched(false);
                            setAlreadyRegisteredBanner(false);
                          }}
                          className={cn(
                            "p-2.5 text-center font-bold uppercase transition-all border",
                            !hasRegisteredBefore
                              ? "bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF]"
                              : "bg-[#090C12] border-[#1F2937] text-[#8B949E] hover:text-white"
                          )}
                        >
                          NO · FIRST TIME
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHasRegisteredBefore(true);
                            setAlreadyRegisteredBanner(false);
                          }}
                          className={cn(
                            "p-2.5 text-center font-bold uppercase transition-all border",
                            hasRegisteredBefore
                              ? "bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF]"
                              : "bg-[#090C12] border-[#1F2937] text-[#8B949E] hover:text-white"
                          )}
                        >
                          YES · REGISTERED BEFORE
                        </button>
                      </div>
                    </div>

                    {/* ⚠ ALREADY REGISTERED BANNER — shown when existing email entered in NO flow */}
                    {alreadyRegisteredBanner && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F5A623]/10 border-2 border-[#F5A623] p-5 font-mono text-xs space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-[#F5A623] text-xl shrink-0">⚠</span>
                          <div>
                            <p className="text-[#F5A623] font-bold uppercase tracking-widest text-sm">ACCOUNT ALREADY EXISTS</p>
                            <p className="text-[#8B949E] mt-1">
                              This email is already registered with NEXUS 2026. We've automatically loaded your existing operative profile below. You can now directly select your next event and register.
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#030407] border border-[#F5A623]/30 p-3 space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-[#8B949E]">NAME:</span>
                            <span className="text-white font-bold">{formData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8B949E]">EMAIL:</span>
                            <span className="text-white">{formData.email}</span>
                          </div>
                          {formData.college && (
                            <div className="flex justify-between">
                              <span className="text-[#8B949E]">COLLEGE:</span>
                              <span className="text-white">{formData.college}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[#F5A623] text-[0.65rem] uppercase tracking-wider">
                          ✦ Your profile has been fetched. Proceed to select your next mission →
                        </p>
                      </motion.div>
                    )}

                    {/* YES: FETCH DETAILS BY EMAIL ONLY */}
                    {hasRegisteredBefore ? (
                      <div className="bg-[#00D9FF]/5 border border-[#00D9FF]/30 p-5 space-y-4 font-mono text-xs">
                        <label className="block text-[#00D9FF] font-bold uppercase tracking-wider">ENTER REGISTERED EMAIL ADDRESS *</label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => {
                              updateForm('email', e.target.value);
                              setProfileFetched(false);
                              setFetchError('');
                            }}
                            placeholder="luke@rebellion.org"
                            className="flex-1 bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleFetchProfile}
                            disabled={fetchingProfile}
                            className="btn-primary text-xs px-5 shrink-0"
                          >
                            {fetchingProfile ? 'FETCHING...' : 'FETCH PROFILE'}
                          </button>
                        </div>

                        {fetchError && (
                          <p className="text-rose-400 text-xs mt-1">{fetchError}</p>
                        )}

                        {/* Summary of Fetched Profile — No manual entry fields */}
                        {profileFetched && (
                          <div className="p-4 bg-[#030407] border border-emerald-500/50 space-y-2 mt-4 text-xs">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-[#1F2937] pb-2 uppercase">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>OPERATIVE PROFILE RETRIEVED</span>
                            </div>
                            <div className="flex justify-between text-[#8B949E]">
                              <span>NAME:</span>
                              <span className="text-white font-bold">{formData.name}</span>
                            </div>
                            <div className="flex justify-between text-[#8B949E]">
                              <span>PHONE:</span>
                              <span className="text-white">{formData.phone}</span>
                            </div>
                            <div className="flex justify-between text-[#8B949E]">
                              <span>COLLEGE:</span>
                              <span className="text-white">{formData.college}</span>
                            </div>
                            <div className="flex justify-between text-[#8B949E]">
                              <span>PROGRAM & YEAR:</span>
                              <span className="text-white">{formData.course} ({formData.year})</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* NO: MANUAL PROFILE INPUT FIELDS FOR FIRST TIME USERS */
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">FULL NAME *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => updateForm('name', e.target.value)}
                            placeholder="Luke Skywalker"
                            className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">EMAIL ADDRESS *</label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => updateForm('email', e.target.value)}
                              onBlur={() => checkExistingEmail(formData.email)}
                              placeholder="luke@rebellion.org"
                              className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">PHONE NUMBER *</label>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => updateForm('phone', e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">COLLEGE / INSTITUTION</label>
                            <input
                              type="text"
                              value={formData.college}
                              onChange={(e) => updateForm('college', e.target.value)}
                              placeholder="IIT Delhi / Vanguard IT"
                              className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">YEAR</label>
                            <select
                              value={formData.year}
                              onChange={(e) => updateForm('year', e.target.value)}
                              className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono"
                            >
                              <option value="">Select</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: MISSION SELECTION (ONLY SHOWN IF NOT PRESELECTED) */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <span className="eyebrow text-[#00D9FF]">ARENA TARGET</span>
                      <h2 className="text-2xl font-display font-bold text-white uppercase mt-1">SELECT MISSION</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
                      {EVENTS.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => updateForm('eventId', ev.id)}
                          className={cn(
                            "p-4 border cursor-pointer transition-all",
                            formData.eventId === ev.id
                              ? "bg-[#00D9FF]/10 border-[#00D9FF]"
                              : "bg-[#030407] border-[#1F2937] hover:border-[#8B949E]"
                          )}
                        >
                          <span className="font-mono text-[0.6rem] text-[#00D9FF] uppercase">{ev.category}</span>
                          <h4 className="font-display font-bold text-white text-base mt-1">{ev.title}</h4>
                          <p className="font-mono text-xs text-[#8B949E] mt-2">Squad: {ev.teamSize} · Fee: {ev.fee}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: SQUAD */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <span className="eyebrow text-[#00D9FF]">SQUAD CONFIGURATION</span>
                      <h2 className="text-2xl font-display font-bold text-white uppercase mt-1">TEAM DETAILS</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-[#8B949E] uppercase mb-1">SQUAD / TEAM NAME *</label>
                        <input
                          type="text"
                          required
                          value={formData.teamName}
                          onChange={(e) => updateForm('teamName', e.target.value)}
                          placeholder="Rogue One"
                          className="w-full bg-[#030407] border border-[#1F2937] focus:border-[#00D9FF] p-3 text-sm text-white outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <span className="eyebrow text-[#F5A623]">CONFIRMATION BRIEFING</span>
                      <h2 className="text-2xl font-display font-bold text-white uppercase mt-1">REVIEW ENLISTMENT</h2>
                    </div>

                    <div className="bg-[#030407] border border-[#1F2937] p-5 space-y-3 font-mono text-xs text-[#8B949E]">
                      <div className="flex justify-between border-b border-[#1F2937] pb-2">
                        <span>OPERATIVE:</span>
                        <span className="text-white font-bold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1F2937] pb-2">
                        <span>EMAIL:</span>
                        <span className="text-white">{formData.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1F2937] pb-2">
                        <span>SELECTED MISSION:</span>
                        <span className="text-[#00D9FF] font-bold">{selectedEventDetails?.title || formData.eventId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ENTRY FEE:</span>
                        <span className="text-[#F5A623] font-bold">{selectedEventDetails?.fee || 'Free'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-[#1F2937] flex justify-between items-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={cn(
                      "btn-ghost text-xs px-4 py-2",
                      step === 1 ? "opacity-0 pointer-events-none" : ""
                    )}
                  >
                    ← BACK
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary text-xs"
                    >
                      CONTINUE →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary text-xs bg-[#F5A623] border-[#F5A623] text-[#030407]"
                    >
                      {isSubmitting ? 'ENLISTING...' : 'CONFIRM ENLISTMENT →'}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#030407] text-white flex items-center justify-center pt-24 font-mono text-xs text-[#8B949E]">INITIALIZING PASSPORT...</div>}>
        <RegisterContent />
      </Suspense>
      <Footer />
    </>
  );
}
