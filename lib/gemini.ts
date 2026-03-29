/**
 * Gemini API Wrapper — Central helper for all Gemini calls
 * Uses Gemini 1.5 Flash for speed (hackathon constraint)
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call Gemini 1.5 Flash with a text prompt
 * Returns parsed JSON if possible, raw text otherwise
 */
export async function callGemini({ prompt, temperature = 0.7, maxTokens = 8192 }: GeminiRequest): Promise<string> {
  const url = `${GEMINI_BASE}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Call Gemini Vision (for image/PDF analysis)
 */
export async function callGeminiVision(base64Data: string, mimeType: string, prompt: string): Promise<string> {
  const url = `${GEMINI_BASE}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Data } },
        ],
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Vision error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Get text embeddings using Gemini Embedding API
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const url = `${GEMINI_BASE}/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/text-embedding-004',
      content: { parts: [{ text }] },
    }),
  });

  if (!res.ok) {
    throw new Error(`Embedding API error ${res.status}`);
  }

  const data = await res.json();
  return data.embedding?.values || [];
}

/**
 * Cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((s, a) => s + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((s, b) => s + b * b, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}
