import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { start, end } = await req.json();

    // Emulate FastMCP random_number feature locally since it's simple to inject
    const rnd = Math.floor(Math.random() * (end - start + 1)) + start;

    return NextResponse.json({ result: rnd, status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
