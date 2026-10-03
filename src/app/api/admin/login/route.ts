import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Load admin accounts
    const adminsPath = path.join(process.cwd(), 'data', 'admins.json');
    let admins: any[] = [];

    if (fs.existsSync(adminsPath)) {
      try {
        admins = JSON.parse(fs.readFileSync(adminsPath, 'utf8'));
      } catch {
        admins = [];
      }
    }

    // Fallback default admin if file read fails
    if (admins.length === 0) {
      admins = [
        {
          id: 'adm-01',
          username: 'admin',
          email: 'admin@nexus2026.edu',
          password: 'admin',
          name: 'Chief Commander Alex',
          role: 'SUPER_ADMIN',
          badge: 'LEVEL 5 CLEARANCE'
        }
      ];
    }

    const cleanUsername = username.trim().toLowerCase();
    const matchedAdmin = admins.find(
      (a) => (a.username.toLowerCase() === cleanUsername || a.email.toLowerCase() === cleanUsername) && a.password === password
    );

    if (!matchedAdmin) {
      return NextResponse.json({ error: 'Invalid security credentials or password' }, { status: 401 });
    }

    const sessionData = {
      id: matchedAdmin.id,
      username: matchedAdmin.username,
      name: matchedAdmin.name,
      email: matchedAdmin.email,
      role: matchedAdmin.role,
      badge: matchedAdmin.badge,
      loggedInAt: new Date().toISOString()
    };

    const response = NextResponse.json({
      success: true,
      user: sessionData
    });

    // Set cookie
    response.cookies.set({
      name: 'nexus_admin_session',
      value: Buffer.from(JSON.stringify(sessionData)).toString('base64'),
      httpOnly: false, // Accessible client-side for fast session hydration
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error during authentication' }, { status: 500 });
  }
}
