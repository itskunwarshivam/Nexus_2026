import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const techCode = (body.code || body.techCode || '').trim().toUpperCase();

    // Both fields are mandatory
    if (!email || !techCode) {
      return NextResponse.json({
        found: false,
        message: 'Both Email Address and Tech Code are required for verification.',
      }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data', 'registrations');
    let allRecords: any[] = [];

    // Read master JSON
    const masterJsonPath = path.join(dataDir, 'all_registrations.json');
    if (fs.existsSync(masterJsonPath)) {
      try {
        const raw = fs.readFileSync(masterJsonPath, 'utf8').trim();
        if (raw) allRecords = JSON.parse(raw);
      } catch { allRecords = []; }
    }

    // Fallback: scan per-event participant files
    if (allRecords.length === 0 && fs.existsSync(dataDir)) {
      try {
        const entries = fs.readdirSync(dataDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const eventJsonPath = path.join(dataDir, entry.name, 'participants.json');
            if (fs.existsSync(eventJsonPath)) {
              try {
                const recs = JSON.parse(fs.readFileSync(eventJsonPath, 'utf8'));
                allRecords.push(...recs);
              } catch {}
            }
          }
        }
      } catch {}
    }

    // Step 1: Find all registrations under this email
    const emailRecords = allRecords.filter(
      (r) => r.email && r.email.toLowerCase() === email
    );

    if (emailRecords.length === 0) {
      return NextResponse.json({
        found: false,
        message: `No registrations found for email "${email}". Please check your email address or register first.`,
      }, { status: 404 });
    }

    // Step 2: Validate Tech Code against the permanent techCode stored on any record for this email
    const techCodeMatch = emailRecords.find(
      (r) => r.techCode && r.techCode.toUpperCase() === techCode
    );

    if (!techCodeMatch) {
      return NextResponse.json({
        found: false,
        message: `Invalid Tech Code for this account. Your permanent Tech Code was sent to "${email}" when you first registered. Check your inbox/spam folder.`,
      }, { status: 403 });
    }

    // Step 3: Return ALL registrations for this email with QR codes (each QR = registration code only)
    const registrationsWithQR = await Promise.all(
      emailRecords.map(async (r) => {
        // QR contains only the registration code — clean and simple
        const qrCodeDataUrl = await QRCode.toDataURL(r.registrationCode || '', {
          width: 300,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        });
        return { ...r, qrCodeDataUrl };
      })
    );

    const primary = emailRecords[0];

    return NextResponse.json({
      found: true,
      student: {
        name: primary.name,
        email: primary.email,
        phone: primary.phone,
        college: primary.college,
        course: primary.course,
        year: primary.year,
        techCode: primary.techCode,
      },
      registrations: registrationsWithQR,
      registration: registrationsWithQR[0], // backward compat
    });

  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Failed to verify registration' }, { status: 500 });
  }
}
