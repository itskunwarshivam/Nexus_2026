import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EVENTS } from '@/lib/data';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'registrations');
    const masterJsonPath = path.join(dataDir, 'all_registrations.json');

    let allRecords: any[] = [];

    // Read master JSON first
    if (fs.existsSync(masterJsonPath)) {
      try {
        const raw = fs.readFileSync(masterJsonPath, 'utf8').trim();
        if (raw) allRecords = JSON.parse(raw);
      } catch {}
    }

    // Fallback: scan per-event participant files if master is empty
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

    // Count per event
    const countByEvent: Record<string, number> = {};
    for (const r of allRecords) {
      if (r.eventId) {
        countByEvent[r.eventId] = (countByEvent[r.eventId] || 0) + 1;
      }
    }

    // Build per-event stats using EVENTS from data
    const eventStats = EVENTS.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      venue: e.venue,
      teamSize: e.teamSize,
      registrationCount: countByEvent[e.id] || 0,
    }));

    // Count unique registered users (by unique email)
    const uniqueEmails = new Set(allRecords.map((r) => r.email?.toLowerCase()).filter(Boolean));

    return NextResponse.json({
      totalRegistrations: allRecords.length,
      uniqueParticipants: uniqueEmails.size,
      activeEvents: EVENTS.length,
      eventStats,
    });
  } catch (err) {
    console.error('Stats API error:', err);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
