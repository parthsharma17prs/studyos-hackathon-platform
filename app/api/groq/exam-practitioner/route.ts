import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { callGeminiVision } from '@/lib/gemini';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    let promptText = '';
    let isVision = false;
    let base64Image = '';
    let mimeType = '';
    let model = 'llama-3.3-70b-versatile';

    if (action === 'solve') {
      const { questionPaper, summaryNotes } = payload;
      
      if (questionPaper.startsWith('data:image/')) {
        isVision = true;
        base64Image = questionPaper.split(',')[1];
        mimeType = questionPaper.split(';')[0].split(':')[1];
      }
      
      promptText = `You are an expert AI Exam Solver. 
      The student has uploaded a question paper. Your task is to provide detailed, accurate, and structured solutions.
      CRITICAL INSTRUCTION: You MUST answer EVERY SINGLE question SEQUENCE-WISE as it appears in the question paper. Do not skip any questions. Clearly label the question number and then its solution.

      ${summaryNotes ? `CRITICAL CONSTRAINT: Use the provided Summary JSON files / Context to guide your solutions. Ensure correctness based on these notes.\n\nSummary Context:\n${summaryNotes}\n\n` : ''}
      
      Question Paper:
      ${isVision ? '(Please extract the questions from the attached image and solve them sequentially.)' : questionPaper}
      `;
    } 
    else if (action === 'generate_paper') {
      const { template, notes } = payload;

      if (template.startsWith('data:image/')) {
        isVision = true;
        base64Image = template.split(',')[1];
        mimeType = template.split(';')[0].split(':')[1];
      }

      promptText = `You are an expert Question Paper setter. Your task is to create a new Mock Practice Question Paper.
      
      RULE 1 (Template): You MUST strictly follow the format of the provided Sample PYQ (Previous Year Question Paper). Mimic its exact structure, sections, total marks, and types of questions (e.g., number of MCQs, short answers, long answers).
      RULE 2 (Context): The content/knowledge of the new questions MUST come ONLY from the provided RAG Context / Study Notes. Do not use external knowledge outside of the notes provided.
      
      Sample PYQ Template:
      ${isVision ? '(Please extract the format/template structure from the attached image).' : template}

      RAG Context / Study Notes:
      ${notes}

      Generate ONLY the question paper (no answers).
      `;
    }
    else if (action === 'generate_quiz') {
      const { notes, type } = payload; // type can be 'pre' or 'post'
      promptText = `Generate exactly 5 MCQ questions (with 4 options and mark the correct answer clearly) from the provided notes. Make it distinct and focused on key concepts. ${type === 'post' ? 'These must be different from previous standard questions.' : ''}

      Notes:
      ${notes}
      `;
    }
    else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (isVision) {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Vision model temporarily requires GEMINI_API_KEY as Groq LLaMA Vision is decommissioned. Please check .env.local' }, { status: 400 });
      }
      
      const responseText = await callGeminiVision(base64Image, mimeType, promptText);
      return NextResponse.json({ result: responseText });
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: promptText }],
      model: model,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ result: responseText });
  } catch (error: any) {
    console.error('Exam Practitioner API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
