import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { format, summaryData } = await req.json();

    if (!format || !summaryData) {
      return NextResponse.json({ error: 'Format and Summary Data are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    let promptText = "";

    if (format === 'image') {
      promptText = `You are a visual learning architect. Analyze the provided study summary and generate specific image generation prompts to help students visualize the concepts.
      Return a JSON object:
      {
        "mind_map_prompt": "A highly detailed, complex DALL-E/Midjourney prompt describing a central conceptual mind map connecting all the topics.",
        "visual_prompts": [
          { "heading": "Heading from summary", "prompt": "Image prompt for this specific node/concept" }
        ]
      }
      Summary: ${JSON.stringify(summaryData)}`;
    } else if (format === 'video') {
      promptText = `You are an educational video producer. Analyze the provided study summary and convert it into a video script.
      Return a JSON object:
      {
        "script": [
          { 
            "heading": "Heading from summary", 
            "timestamp": "0:00",
            "visual": "What is shown on screen (animations/footage)",
            "audio": "The exact voiceover script"
          }
        ]
      }
      Summary: ${JSON.stringify(summaryData)}`;
    } else if (format === 'ppt') {
      promptText = `You are a presentation designer. Convert the provided study summary into a professional slide deck outline optimized for Gamma AI.
      Return a JSON object:
      {
        "presentation_outline": "A full text block representing the presentation outline. Start with # Title, then ## Slide 1, include bullet points and [Image suggestion] per slide."
      }
      Summary: ${JSON.stringify(summaryData)}`;
    }

    const result = await model.generateContent([{ text: promptText }]);
    const outputText = result.response.text();
    
    let parsedData;
    try {
        const jsonMatch = outputText.match(/\{[\s\S]*\}/);
        const cleanJSON = jsonMatch ? jsonMatch[0] : outputText;
        parsedData = JSON.parse(cleanJSON);
    } catch {
        parsedData = JSON.parse(outputText.replace(/```json/g, '').replace(/```/g, ''));
    }
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Transform API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
