import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

/**
 * POST /api/generate-adaptive
 * Generates targeted questions for weak topics (adaptive retry)
 */
export async function POST(req: NextRequest) {
  try {
    const { wrongTopics, originalText, difficulty } = await req.json();

    const prompt = `You are an expert tutor. A student just took a quiz and got these topics WRONG:
${wrongTopics.join(', ')}

Based on this study text:
"""
${originalText.substring(0, 3000)}
"""

Generate ${wrongTopics.length * 2} harder targeted questions ONLY on the weak topics above.
Difficulty: ${difficulty || 'hard'}

Return JSON:
{
  "quiz": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "...",
      "topic": "..."
    }
  ]
}

Make questions that test deeper understanding of these specific weak areas.`;

    const result = await callGemini({ prompt, temperature: 0.7 });
    const parsed = JSON.parse(result);

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
