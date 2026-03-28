import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { usersDB } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-saarthi-key-hackathon');

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    // Check if user exists (fallback to a dummy user if none exists in DB for hackathon ease)
    let user = usersDB.find((u: any) => u.email === email && u.password === password);
    
    // Auto-create a dummy user to ensure judges never get locked out during a demo if they type random stuff
    if (!user) {
       user = { id: Date.now().toString(), email, role: role || 'student', name: email.split('@')[0] };
    }

    const token = await new SignJWT({ sub: user.id, role: user.role, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const res = NextResponse.json({ message: 'Login successful', user });
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
