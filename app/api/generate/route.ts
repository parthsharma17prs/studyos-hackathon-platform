import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

/**
 * POST /api/generate
 * Core API: takes study text → returns summary, quiz, key terms, strategy
 * Uses TWO Gemini calls: one for generation, one for fact-checking
 */
export async function POST(req: NextRequest) {
  try {
    const { text, difficulty, count, language } = await req.json();

    if (!text || text.length < 30) {
      return NextResponse.json({ error: 'Text must be at least 30 characters' }, { status: 400 });
    }

    const langInstruction = language === 'Hindi'
      ? 'Respond entirely in Hindi (Devanagari script).'
      : language === 'Hinglish'
        ? 'Respond in Hinglish (mix of Hindi and English, Roman script).'
        : 'Respond in English.';

    // ─── CALL 1: Generate study set ───
    const generatePrompt = `You are an expert tutor. Analyze the following study text and generate a comprehensive study set.

${langInstruction}

STUDY TEXT:
"""
${text}
"""

DIFFICULTY: ${difficulty}
NUMBER OF QUESTIONS: ${count}

Return a JSON object with this EXACT structure:
{
  "summary": ["point 1", "point 2", ...],  // 5-8 key summary points
  "quiz": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],  // exactly 4 options
      "correct": 0,  // index of correct option (0-3)
      "explanation": "...",
      "topic": "..."  // broad topic category
    }
  ],
  "keyTerms": [
    { "term": "...", "definition": "..." }
  ],
  "studyStrategy": "A 2-3 line personalized exam strategy tip based on the content"
}

Rules:
- Generate exactly ${count} quiz questions
- ${difficulty === 'easy' ? 'Questions should be straightforward recall-based' : difficulty === 'hard' ? 'Questions should require analysis, application, and critical thinking' : 'Mix of recall and application questions'}
- Each question must have exactly 4 options with 1 correct answer
- Explanations should be concise but helpful
- Key terms: extract 6-10 important terms
- Summary: 5-8 bullet points covering the key concepts`;

    const result = await callGemini({
      prompt: generatePrompt,
      temperature: difficulty === 'hard' ? 0.8 : 0.6,
    });

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response');
      }
    }

    // ─── CALL 2: Fact-check summary points ───
    const factCheckPrompt = `Given this source text:
"""
${text.substring(0, 2000)}
"""

Check each of these summary points for accuracy. Return a JSON array of indices (0-based) where the point is NOT clearly supported by the source text:

Summary points:
${parsed.summary.map((p: string, i: number) => `${i}. ${p}`).join('\n')}

Return format: { "flaggedIndices": [0, 3, ...] }
Return empty array if all points are accurate.`;

    let confabulationFlags: number[] = [];
    try {
      const checkResult = await callGemini({
        prompt: factCheckPrompt,
        temperature: 0.1,
      });
      const checkParsed = JSON.parse(checkResult);
      confabulationFlags = checkParsed.flaggedIndices || [];
    } catch {
      // If fact-check fails, no flags — non-critical
    }

    return NextResponse.json({
      ...parsed,
      confabulationFlags,
    });
  } catch (error: any) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate study set' },
      { status: 500 }
    );
  }
}
