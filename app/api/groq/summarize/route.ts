import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    console.log("Receiving summarize request");
    const formData = await req.formData();
    console.log("Parsed form data");
    const content = formData.get('content') as string || '';
    const difficulty = formData.get('difficulty') as string || 'medium';
    const language = formData.get('language') as string || 'English';
    const questionCount = formData.get('questionCount') as string || '5';
    const format = formData.get('format') as string || 'text';
    const file = formData.get('file') as File | null;
    
    if (!content.trim() && !file) {
      console.log("No content");
      return NextResponse.json({ error: 'Content or file is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const promptText = `You are an elite cognitive learning assistant, matching the "study_notes_intelligence_suite" and "adaptive_learning_roadmap" framework. 
    Analyze the provided notes and return ONE massive structured JSON object.

    JSON SCHEMA (STRICT):
    {
      "summary": [
        {
          "heading": "Concept name",
          "description": "Highly detailed multi-sentence explanation of the concept"
        }
      ],
      "youtube_recommendations": [
        { "title": "Specific Video Title", "search_query": "Exact query to search on YouTube" }
      ],
      "quiz": [
        {
          "question": "The question",
          "options": ["A", "B", "C", "D"],
          "correct": 0,
          "explanation": "Why it's correct",
          "topic": "Specific sub-topic"
        }
      ],
      "keyTerms": [{ "term": "X", "definition": "Y" }],
      "studyStrategy": "Actionable learning path",
      "mnemonics": [
        { "concept": "Topic", "mnemonic": "Memory aid", "logic": "The science behind it" }
      ],
      "eli5": "Complex concept explained for a 5-year-old using a simple analogy.",
      "real_world_use": "Concrete industry use case (e.g. How Space-X uses this, etc.)",
      "roadmap": {
        "milestones": [{ "stage": "Phase", "action": "Specific task" }],
        "common_mistakes": ["What to avoid"],
        "exam_focus": ["High-yield topics"]
      }
    }

    Rules:
    1. LANGUAGE: ${language}.
    2. DIFFICULTY: ${difficulty}.
    3. QUESTION COUNT: ${questionCount}.

    CONTENT TO ANALYZE:
    ${content}`;

    const parts: any[] = [{ text: promptText }];
    
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'application/pdf'
        }
      });
    }

    console.log("Generating with Gemini...");
    const result = await model.generateContent(parts);
    console.log("Generated.");
    const outputText = result.response.text();
    
    let studyData;
    try {
        // Robust JSON extraction
        const jsonMatch = outputText.match(/\{[\s\S]*\}/);
        const cleanJSON = jsonMatch ? jsonMatch[0] : outputText;
        studyData = JSON.parse(cleanJSON);
    } catch (e) {
        console.error("JSON Parse Error, trying fallback:", e);
        try {
          studyData = JSON.parse(outputText.replace(/```json/g, '').replace(/```/g, ''));
        } catch (innerE) {
          throw new Error("Failed to parse AI response as JSON");
        }
    }
    
    return NextResponse.json(studyData);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
