import { NextRequest, NextResponse } from 'next/server';
import { callGeminiVision } from '@/lib/gemini';

/**
 * POST /api/analyze-resume
 * Analyzes resume against job description using Gemini
 */
export async function POST(req: NextRequest) {
  try {
    const { resumeBase64, mimeType, jobDescription, targetCompany } = await req.json();

    const prompt = `You are an expert technical recruiter and ATS software analyzer at ${targetCompany || 'a top tech company'}.
Analyze this resume against the following Job Description (JD):

JOB DESCRIPTION:
"""
${jobDescription || 'General Software Engineering Role (React, Node, SQL, AWS, Algorithms)'}
"""

Return a JSON object with this EXACT structure:
{
  "atsScore": 65,  // Overall match 0-100
  "subScores": {
    "keywordMatch": 60,
    "formatting": 80,
    "skillsCoverage": 70,
    "quantifiedImpact": 50,
    "lengthStructure": 90
  },
  "missingKeywords": ["Docker", "Kubernetes", "Redis", ...],
  "presentKeywords": ["React", "JavaScript", "HTML", ...],
  "rewrittenBullets": [
    {
      "original": "Worked on the backend API.",
      "improved": "Engineered scalable REST APIs using Node.js, improving system response time by 30% and handling 10k+ daily queries."
    }
  ],
  "actionPlan": [
    "Add more metrics to your project descriptions",
    "Include specific database technologies mentioned in JD"
  ],
  "verdict": "Likely to be rejected by ATS. Needs more keyword alignment."
}

Rules:
- Be strict but constructive. 
- Extract exactly what's in the uploaded resume image/pdf.
- Provide 3-5 rewritten bullets that quantify impact.
- Identify at least 5 missing keywords from the JD (or standard expectations for the target company).`;

    const result = await callGeminiVision(resumeBase64, mimeType, prompt);
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/) || result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
         throw new Error('Failed to parse response');
      }
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
