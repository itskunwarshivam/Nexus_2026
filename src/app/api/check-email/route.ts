import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Lightweight endpoint — checks if an email exists in registrations
// Returns basic profile info (no Tech Code auth required, used only for registration flow UX)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    const masterJsonPath = path.join(process.cwd(), 'data', 'registrations', 'all_registrations.json');
    let allRecords: any[] = [];

    if (fs.existsSync(masterJsonPath)) {
      try {
        const raw = fs.readFileSync(masterJsonPath, 'utf8').trim();
        if (raw) allRecords = JSON.parse(raw);
      } catch {}
    }

    // Fallback: scan event folders
    if (allRecords.length === 0) {
      const dataDir = path.join(process.cwd(), 'data', 'registrations');
      if (fs.existsSync(dataDir)) {
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
    }

    const userRecords = allRecords.filter(
      (r) => r.email && r.email.toLowerCase() === email
    );

    if (userRecords.length === 0) {
      return NextResponse.json({ exists: false });
    }

    const primary = userRecords[0];

    return NextResponse.json({
      exists: true,
      profile: {
        name: primary.name,
        email: primary.email,
        phone: primary.phone !== 'N/A' ? primary.phone : '',
        college: primary.college !== 'N/A' ? primary.college : '',
        course: primary.course !== 'N/A' ? primary.course : '',
        year: primary.year !== 'N/A' ? primary.year : '',
      },
      eventCount: userRecords.length,
    });

  } catch (err) {
    console.error('Check email error:', err);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
