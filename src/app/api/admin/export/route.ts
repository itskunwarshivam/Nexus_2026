import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawEventId = searchParams.get('eventId');
    const eventId = rawEventId ? rawEventId.trim().toLowerCase().replace(/\s+/g, '-') : 'all';

    const fileName = eventId !== 'all' ? `${eventId}_participants.xlsx` : 'all_registrations.xlsx';
    const jsonPath = eventId !== 'all'
      ? path.join(process.cwd(), 'data', 'registrations', eventId, 'participants.json')
      : path.join(process.cwd(), 'data', 'registrations', 'all_registrations.json');

    let records: any[] = [];
    if (fs.existsSync(jsonPath)) {
      try {
        records = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      } catch {
        records = [];
      }
    }

    const worksheetData = records.length > 0 ? records.map(r => ({
      'Registration Code': r.registrationCode,
      'Full Name': r.name,
      'Email Address': r.email,
      'Phone Number': r.phone,
      'College / Institution': r.college,
      'Course / Program': r.course,
      'Year': r.year,
      'Event Name': r.eventTitle,
      'Venue': r.eventVenue,
      'Date': r.eventDate,
      'Team Name': r.teamName,
      'Team Members': r.teamMembers,
      'Registration Date': r.timestamp,
      'Status': r.status,
    })) : [{
      'Registration Code': 'N/A',
      'Full Name': 'No registrations submitted for this event yet',
      'Email Address': '-',
      'Phone Number': '-',
      'College / Institution': '-',
      'Course / Program': '-',
      'Year': '-',
      'Event Name': eventId.toUpperCase(),
      'Venue': '-',
      'Date': '-',
      'Team Name': '-',
      'Team Members': '-',
      'Registration Date': '-',
      'Status': 'EMPTY',
    }];

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
    
    // Generate XLSX Buffer directly in memory — no disk I/O failure possible
    const fileBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Also attempt async write to disk for backup if possible
    try {
      const filePath = eventId !== 'all'
        ? path.join(process.cwd(), 'data', 'registrations', eventId, `${eventId}_participants.xlsx`)
        : path.join(process.cwd(), 'data', 'registrations', 'all_registrations.xlsx');
      const eventDir = path.dirname(filePath);
      if (!fs.existsSync(eventDir)) {
        fs.mkdirSync(eventDir, { recursive: true });
      }
      fs.writeFileSync(filePath, fileBuffer);
    } catch (fsErr) {
      // Ignore disk write warning, buffer is already created
    }

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: 'Failed to download registration list' }, { status: 500 });
  }
}


