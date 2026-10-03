import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { EVENTS } from '@/lib/data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, college, course, year, eventId, teamName, teamMembers } = body;

    if (!name || !email || !eventId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = EVENTS.find((e) => e.id === eventId) || {
      id: eventId,
      title: eventId.toUpperCase(),
      date: '2026-10-21',
      time: '09:00 AM',
      venue: 'Vanguard Arena, New Delhi',
    };

    // ─────────────────────────────────────────────────────
    // TECH CODE — Permanent, unique per user/email account
    // Once assigned it NEVER changes, regardless of how many
    // events the participant registers for.
    // ─────────────────────────────────────────────────────
    const masterJsonPath = path.join(process.cwd(), 'data', 'registrations', 'all_registrations.json');
    let existingUserRecords: any[] = [];
    if (fs.existsSync(masterJsonPath)) {
      try {
        const allData = fs.readFileSync(masterJsonPath, 'utf8').trim();
        if (allData) {
          const all = JSON.parse(allData);
          existingUserRecords = all.filter(
            (r: any) => r.email && r.email.toLowerCase() === email.toLowerCase()
          );
        }
      } catch {}
    }

    // Re-use existing Tech Code, or mint a brand new one
    const existingTechCode = existingUserRecords.find((r: any) => r.techCode);
    const techCode: string = existingTechCode?.techCode ?? `TECH-${Math.floor(10000 + Math.random() * 90000)}`;

    // ─────────────────────────────────────────────────────
    // REGISTRATION CODE — Unique per event registration.
    // Changes every time the participant registers for any event.
    // Format: NEX-2026-XXXXX
    // ─────────────────────────────────────────────────────
    const registrationCode = `NEX-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();

    // ─────────────────────────────────────────────────────
    // QR CODE — Contains ONLY the Registration Code (clean, simple)
    // ─────────────────────────────────────────────────────
    const qrCodeDataUrl = await QRCode.toDataURL(registrationCode, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    const registrationRecord = {
      techCode,           // Permanent — unique per user profile (used for Verify Pass)
      registrationCode,   // Per-event — changes every registration (shown on event pass)
      timestamp,
      name,
      email,
      phone: phone || 'N/A',
      college: college || 'N/A',
      course: course || 'N/A',
      year: year || 'N/A',
      eventId: event.id,
      eventTitle: event.title,
      eventVenue: event.venue,
      eventDate: event.date,
      teamName: teamName || 'N/A',
      teamMembers: teamMembers ? teamMembers.join(', ') : 'N/A',
      status: 'VERIFIED',
    };

    let xlsxPath = '';

    // ── Save to Event-specific directory ──
    try {
      const eventDir = path.join(process.cwd(), 'data', 'registrations', event.id);
      if (!fs.existsSync(eventDir)) {
        fs.mkdirSync(eventDir, { recursive: true });
      }

      const jsonPath = path.join(eventDir, 'participants.json');
      let existingJSON: any[] = [];
      if (fs.existsSync(jsonPath)) {
        try { existingJSON = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch { existingJSON = []; }
      }
      existingJSON.push(registrationRecord);
      fs.writeFileSync(jsonPath, JSON.stringify(existingJSON, null, 2));

      // Per-event Excel
      try {
        xlsxPath = path.join(eventDir, `${event.id}_participants.xlsx`);
        const worksheetData = existingJSON.map((r) => ({
          'Tech Code': r.techCode,
          'Registration Code': r.registrationCode,
          'Full Name': r.name,
          'Email Address': r.email,
          'Phone Number': r.phone,
          'College / Institution': r.college,
          'Course / Program': r.course,
          Year: r.year,
          'Event Name': r.eventTitle,
          Venue: r.eventVenue,
          Date: r.eventDate,
          'Team Name': r.teamName,
          'Team Members': r.teamMembers,
          'Registration Date': r.timestamp,
          Status: r.status,
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
        XLSX.writeFile(workbook, xlsxPath);
      } catch (xlsxErr) {
        console.warn('XLSX per-event write skipped:', xlsxErr);
      }

      // ── Master JSON + Excel ──
      try {
        const masterDir = path.join(process.cwd(), 'data', 'registrations');
        const masterXlsxPath = path.join(masterDir, 'all_registrations.xlsx');
        let masterJSON: any[] = [];
        if (fs.existsSync(masterJsonPath)) {
          try {
            const raw = fs.readFileSync(masterJsonPath, 'utf8').trim();
            if (raw) masterJSON = JSON.parse(raw);
          } catch { masterJSON = []; }
        }
        masterJSON.push(registrationRecord);
        fs.writeFileSync(masterJsonPath, JSON.stringify(masterJSON, null, 2));

        const masterWorksheet = XLSX.utils.json_to_sheet(masterJSON);
        const masterWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(masterWorkbook, masterWorksheet, 'All Registrations');
        XLSX.writeFile(masterWorkbook, masterXlsxPath);
      } catch (masterErr) {
        console.warn('Master XLSX write skipped:', masterErr);
      }
    } catch (fsErr) {
      console.warn('Filesystem save skipped:', fsErr);
    }

    // ── Email Dispatch ──
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
    let realEmailSent = false;

    if (emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: { user: emailUser, pass: emailPass },
        });

        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
        const qrBuffer = Buffer.from(base64Data, 'base64');

        const isFirstRegistration = existingUserRecords.length === 0;

        await transporter.sendMail({
          from: `"NEXUS 2026 Command" <${emailUser}>`,
          to: email,
          subject: `[NEXUS 2026] Registration Confirmed — ${event.title} | Reg: ${registrationCode}`,
          text: `
NEXUS 2026 — REGISTRATION CONFIRMED
=====================================

Greetings ${name},

Your registration for "${event.title}" at NEXUS 2026 is officially confirmed!

─────────────────────────────────────
YOUR TECH CODE (Permanent — Save This!)
${techCode}
─────────────────────────────────────
This is your PERMANENT identity code for NEXUS 2026.
Use this code along with your email to verify all your passes at: https://nexus2026.vanguardit.edu/dashboard

─────────────────────────────────────
EVENT REGISTRATION CODE (This Event Only)
${registrationCode}
─────────────────────────────────────
This code is specific to: ${event.title}
A new registration code is issued for every event you register.

EVENT DETAILS:
  Event  : ${event.title}
  Venue  : ${event.venue}
  Date   : ${event.date}
  Squad  : ${teamName || 'Solo Operative'}

The QR Code attached to this email contains your Registration Code for this event.
Present it at entry checkpoints for instant check-in scanning.

${isFirstRegistration ? '✦ FIRST REGISTRATION: Your Tech Code has been created. Keep it safe — you will need it for all future verifications.\n' : ''}
May the Force be with you.
NEXUS 2026 Command · IIT Delhi × Vanguard Institute of Technology
          `.trim(),
          html: `
            <div style="background-color:#030407;color:#F0F4F8;font-family:monospace,sans-serif;padding:30px;max-width:620px;margin:0 auto;border:1px solid #00D9FF;">
              <h1 style="color:#00D9FF;letter-spacing:3px;font-size:26px;margin-bottom:4px;">NEXUS 2026</h1>
              <p style="color:#F5A623;font-size:13px;letter-spacing:1px;margin-top:0;"><strong>REGISTRATION CONFIRMED · OFFICIAL PASS</strong></p>
              <hr style="border-color:#1F2937;margin:18px 0;" />

              <p style="font-size:14px;">Greetings <strong style="color:#fff;">${name}</strong>,</p>
              <p style="font-size:13px;color:#8B949E;">Your enlistment for <strong style="color:#00D9FF;">${event.title}</strong> at NEXUS 2026 is officially confirmed.</p>

              <!-- TECH CODE — Permanent -->
              <div style="background:#090C12;border:2px solid #00D9FF;padding:20px;margin:22px 0;text-align:center;border-radius:2px;">
                <p style="color:#8B949E;font-size:10px;margin:0 0 6px 0;letter-spacing:3px;text-transform:uppercase;">YOUR TECH CODE — Permanent &amp; Unique to You</p>
                <p style="color:#00D9FF;font-size:28px;font-weight:bold;letter-spacing:5px;margin:0;">${techCode}</p>
                <p style="color:#8B949E;font-size:10px;margin:8px 0 0 0;">Use this code + your email to verify all passes at /dashboard</p>
              </div>

              <!-- REGISTRATION CODE — Per Event -->
              <div style="background:#090C12;border:1px solid #F5A623;padding:16px;margin:16px 0;text-align:center;border-radius:2px;">
                <p style="color:#8B949E;font-size:10px;margin:0 0 6px 0;letter-spacing:3px;text-transform:uppercase;">EVENT REGISTRATION CODE — This Event Only</p>
                <p style="color:#F5A623;font-size:22px;font-weight:bold;letter-spacing:4px;margin:0;">${registrationCode}</p>
                <p style="color:#8B949E;font-size:10px;margin:8px 0 0 0;">New code issued for every event registration</p>
              </div>

              <!-- Event Details -->
              <div style="background:#090C12;border:1px solid #1F2937;padding:14px;margin:16px 0;font-size:13px;border-radius:2px;">
                <p style="margin:5px 0;"><strong style="color:#8B949E;">Event:</strong> ${event.title}</p>
                <p style="margin:5px 0;"><strong style="color:#8B949E;">Venue:</strong> ${event.venue}</p>
                <p style="margin:5px 0;"><strong style="color:#8B949E;">Date:</strong>  ${event.date}</p>
                <p style="margin:5px 0;"><strong style="color:#8B949E;">Squad:</strong> ${teamName || 'Solo Operative'}</p>
              </div>

              <!-- QR note -->
              <p style="font-size:12px;color:#8B949E;">📎 The QR Code attached contains your <strong>Registration Code</strong> for <strong>${event.title}</strong>. Present it at entry checkpoints for scanning.</p>

              ${isFirstRegistration ? `<div style="background:#0a1020;border:1px solid #00D9FF;padding:12px;margin:16px 0;font-size:12px;color:#00D9FF;border-radius:2px;">✦ First Registration — Your permanent Tech Code has been created. Save it safely.</div>` : ''}

              <p style="font-size:11px;color:#F5A623;"><em>Not in inbox? Check Spam / Promotions folder.</em></p>
              <hr style="border-color:#1F2937;margin:18px 0;" />
              <p style="color:#8B949E;font-size:11px;">May the Force be with you.<br/>NEXUS 2026 Command · IIT Delhi × Vanguard Institute of Technology</p>
            </div>
          `,
          attachments: [
            {
              filename: `${registrationCode}_pass.png`,
              content: qrBuffer,
              cid: 'qrcodeImg',
            },
          ],
        });
        realEmailSent = true;
      } catch (emailErr) {
        console.error('Nodemailer send failed:', emailErr);
      }
    }

    // Always log email payload locally
    try {
      const emailDir = path.join(process.cwd(), 'data', 'emails');
      if (!fs.existsSync(emailDir)) fs.mkdirSync(emailDir, { recursive: true });
      fs.writeFileSync(
        path.join(emailDir, `${registrationCode}.json`),
        JSON.stringify({ to: email, techCode, registrationCode, realEmailSent, qrCodeDataUrl, sentAt: timestamp }, null, 2)
      );
    } catch {}

    return NextResponse.json({
      success: true,
      techCode,
      registrationCode,
      qrCodeDataUrl,
      eventTitle: event.title,
      emailSentTo: email,
      realEmailSent,
    });

  } catch (err: any) {
    console.error('Registration API Error:', err);
    return NextResponse.json({ error: 'Failed to process registration' }, { status: 500 });
  }
}
