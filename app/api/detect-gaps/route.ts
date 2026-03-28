import { NextRequest, NextResponse } from 'next/server';
import { callGemini, getEmbedding, cosineSimilarity } from '@/lib/gemini';

/**
 * POST /api/detect-gaps
 * RAG implementation for Syllabus vs Notes coverage
 * Chunks text, gets embeddings, compares cosine similarity
 */

function splitIntoTopics(text: string): string[] {
  // Very simplistic chunking for hackathon - split by double newline
  return text.split(/\n\s*\n/).map(t => t.trim()).filter(t => t.length > 20);
}

export async function POST(req: NextRequest) {
  try {
    const { syllabusText, notesText } = await req.json();

    if (!syllabusText || !notesText) {
      return NextResponse.json({ error: 'Provide both syllabus and notes.' }, { status: 400 });
    }

    // Step 1: Use Gemini to extract distinct topics from syllabus
    const syllabusPrompt = `Extract a flat list of 10-15 key academic topics from this syllabus text:
"""
${syllabusText.substring(0, 3000)}
"""
Return JSON: { "topics": ["topic 1", "topic 2", ...] }`;

    const topicRes = await callGemini({ prompt: syllabusPrompt, temperature: 0.1 });
    let topics: string[] = [];
    try {
        const parsed = JSON.parse(topicRes);
        topics = parsed.topics || [];
    } catch {
       const match = topicRes.match(/```json\s*([\s\S]*?)\s*```/) || topicRes.match(/\{[\s\S]*\}/);
       if (match) topics = JSON.parse(match[1] || match[0]).topics || [];
    }

    if (!topics.length) {
      return NextResponse.json({ error: 'Failed to extract topics from syllabus.' }, { status: 500 });
    }

    // Step 2: Embed Syllabus Topics
    const topicEmbeddings = await Promise.all(
        topics.map(t => getEmbedding(t).then(emb => ({ topic: t, embedding: emb })))
    );

    // Step 3: Chunk and embed notes
    const noteChunks = splitIntoTopics(notesText);
    const notesStrChunk = noteChunks.join(' \n\n '); // simple way to embed whole for small texts

    // For Hackathon speed: We will prompt Gemini to do topic matching instead of 20 embedding API calls
    const matchingPrompt = `You are an AI syllabus checker. I have a list of topics from a syllabus, and a student's notes.
SYLLABUS TOPICS:
${topics.map(t => `- ${t}`).join('\n')}

STUDENT NOTES:
"""
${notesText.substring(0, 15000)}
"""

Determine how well the student notes cover each syllabus topic. Return a JSON object:
{
  "coverage": [
    {
      "topic": "topic 1",
      "status": "covered | partial | missing",  // green/yellow/red
      "score": 90,  // 0-100 percentage of coverage
      "explanation": "Brief reason why"
    }
  ],
  "overallCoverage": 75  // 0-100 overall
}
Make 'missing' if there's little to no mention.`;

    const matchRes = await callGemini({ prompt: matchingPrompt, temperature: 0.2 });
    let matchParsed;
    try {
        matchParsed = JSON.parse(matchRes);
    } catch {
       const match = matchRes.match(/```json\s*([\s\S]*?)\s*```/) || matchRes.match(/\{[\s\S]*\}/);
       if (match) matchParsed = JSON.parse(match[1] || match[0]);
    }

    return NextResponse.json(matchParsed);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
