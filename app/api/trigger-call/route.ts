import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/trigger-call
 * Triggers an outbound AI voice call using Vapi.ai for study nudges
 */
export async function POST(req: NextRequest) {
  try {
    const { studentPhone, studentName, score, weakTopics } = await req.json();

    if (!studentPhone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    const VAPI_KEY = process.env.VAPI_API_KEY;
    if (!VAPI_KEY) {
      return NextResponse.json({ error: 'Vapi API key missing for voice calls' }, { status: 500 });
    }

    // Call configuration
    const callData = {
      phoneNumber: {
         number: `+91${studentPhone.replace(/\\D/g, '').substring(0, 10)}` // Indian standard for Hackathon
      },
      assistant: {
        model: {
          provider: "google",
          model: "gemini-1.5-flash",
          systemPrompt: `You are an encouraging AI study assistant for ${studentName}.
They just scored ${score}% on a quiz. Their weak topics are: ${weakTopics.join(', ')}.
Your job is to call them, be super encouraging, give a brief 20-second summary of what they need to study next, and ask if they want a study plan sent to their WhatsApp.
Be conversational, fast-paced, and empathetic. Do not sound robotic.`
        },
        voice: {
          provider: "11labs",
          voiceId: "pNInz6obbfIdGjGI5Q" // Popular Indian English female voice id
        },
        firstMessage: `Hi ${studentName}! I noticed your recent quiz score of ${score}%. I have some quick tips on your weak areas. Can I share them?`
      }
    };

    const res = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callData),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Vapi returned ${res.status} ${text}`);
    }

    const data = await res.json();
    return NextResponse.json({ callId: data.id, status: 'ringing' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
