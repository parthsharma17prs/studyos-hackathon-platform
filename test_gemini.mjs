import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({path: '.env.local'});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", generationConfig: { responseMimeType: "application/json" } });
    const res = await model.generateContent("Create a JSON object with {\"hello\": \"world\"}");
    console.log("2.5-flash-lite success:", res.response.text());
  } catch (e) {
    console.error("2.5-flash-lite error:", e.message);
  }
}
run();
