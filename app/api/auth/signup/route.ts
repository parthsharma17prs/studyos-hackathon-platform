import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-saarthi-key-hackathon');

import { usersDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existing = usersDB.find(u => u.email === email);
    if (existing) {
      return NextResponse.json({ error: 'User already registered' }, { status: 400 });
    }

    const newUser = { id: Date.now().toString(), email, password, role, name: email.split('@')[0] };
    usersDB.push(newUser);

    // Create a mock JWT token (Saarthi feature)
    const token = await new SignJWT({ sub: newUser.id, role, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Set HTTPOnly cookie for session management
    const res = NextResponse.json({ message: 'Signup successful', user: { id: newUser.id, email, name: newUser.name, role } });
    res.cookies.set('saarthi_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
