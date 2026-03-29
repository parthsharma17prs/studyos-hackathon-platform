import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

/**
 * Saarthi-AI Clone: Question Generator using LLM
 * Based on https://github.com/Navn2025/saarthi-ai
 * Generates questions based on Subject, Bloom's Taxonomy Level, and Difficulty.
 */
export async function POST(req: NextRequest) {
  try {
    const { subject, bloom_level, difficulty, count = 3 } = await req.json();

    if (!subject || !bloom_level || !difficulty) {
      return NextResponse.json({ error: 'Missing subject, bloom_level, or difficulty' }, { status: 400 });
    }

    // Saarthi LLM Integration uses Groq (Llama 3). 
    // We bind it through our central API logic (Gemini fallback for hackathon unified keys, or Groq if env exists).
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    let responseText = '';

    const prompt = `You are an expert AI Question Generator (like Saarthi-AI).
Generate ${count} interview questions for the subject: "${subject}".
Difficulty Level: ${difficulty}
Bloom's Taxonomy Level: ${bloom_level} (e.g. Remember, Understand, Apply, Analyze, Evaluate, Create)

You must return a raw JSON object matching this schema exactly:
{
  "questions": [
    {
      "question_text": "...",
      "sample_answer": "...",
      "bloom_level": "${bloom_level}",
      "difficulty": "${difficulty}"
    }
  ]
}`;

    if (GROQ_API_KEY) {
       // Call Groq Llama3
       const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
             'Authorization': `Bearer ${GROQ_API_KEY}`,
             'Content-Type': 'application/json'
          },
          body: JSON.stringify({
             model: 'llama3-8b-8192',
             messages: [{ role: 'system', content: prompt }],
             temperature: 0.7,
             response_format: { type: 'json_object' }
          })
       });
       if (!groqRes.ok) throw new Error('Groq API Error');
       const groqData = await groqRes.json();
       responseText = groqData.choices[0].message.content;
    } else {
       // Fallback to central Gemini logic if Groq key isn't provided yet
       responseText = await callGemini({ prompt, temperature: 0.7 });
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const match = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[1] || match[0]);
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('Saarthi Question Gen Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
