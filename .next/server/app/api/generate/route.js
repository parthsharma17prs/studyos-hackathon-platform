"use strict";(()=>{var e={};e.id=290,e.ids=[290],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4302:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>h,patchFetch:()=>y,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var r={};n.r(r),n.d(r,{POST:()=>u});var a=n(9303),o=n(8716),s=n(670),i=n(7070),p=n(6945);async function u(e){try{let t;let{text:n,difficulty:r,count:a,language:o}=await e.json();if(!n||n.length<30)return i.NextResponse.json({error:"Text must be at least 30 characters"},{status:400});let s=`You are an expert tutor. Analyze the following study text and generate a comprehensive study set.

${"Hindi"===o?"Respond entirely in Hindi (Devanagari script).":"Hinglish"===o?"Respond in Hinglish (mix of Hindi and English, Roman script).":"Respond in English."}

STUDY TEXT:
"""
${n}
"""

DIFFICULTY: ${r}
NUMBER OF QUESTIONS: ${a}

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
- Generate exactly ${a} quiz questions
- ${"easy"===r?"Questions should be straightforward recall-based":"hard"===r?"Questions should require analysis, application, and critical thinking":"Mix of recall and application questions"}
- Each question must have exactly 4 options with 1 correct answer
- Explanations should be concise but helpful
- Key terms: extract 6-10 important terms
- Summary: 5-8 bullet points covering the key concepts`,u=await (0,p.Dt)({prompt:s,temperature:"hard"===r?.8:.6});try{t=JSON.parse(u)}catch{let e=u.match(/```json\s*([\s\S]*?)\s*```/)||u.match(/\{[\s\S]*\}/);if(e)t=JSON.parse(e[1]||e[0]);else throw Error("Could not parse AI response")}let c=`Given this source text:
"""
${n.substring(0,2e3)}
"""

Check each of these summary points for accuracy. Return a JSON array of indices (0-based) where the point is NOT clearly supported by the source text:

Summary points:
${t.summary.map((e,t)=>`${t}. ${e}`).join("\n")}

Return format: { "flaggedIndices": [0, 3, ...] }
Return empty array if all points are accurate.`,l=[];try{let e=await (0,p.Dt)({prompt:c,temperature:.1});l=JSON.parse(e).flaggedIndices||[]}catch{}return i.NextResponse.json({...t,confabulationFlags:l})}catch(e){return console.error("Generate API error:",e),i.NextResponse.json({error:e.message||"Failed to generate study set"},{status:500})}}let c=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:"app/api/generate/route"},resolvedPagePath:"/Users/macbook/Desktop/Projects/anti aurobindo1/studyos/app/api/generate/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:m}=c,h="/api/generate/route";function y(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}},6945:(e,t,n)=>{n.d(t,{Dt:()=>o,PM:()=>s,ke:()=>i});let r=process.env.GEMINI_API_KEY||"",a="https://generativelanguage.googleapis.com/v1beta";async function o({prompt:e,temperature:t=.7,maxTokens:n=8192}){let o=`${a}/models/gemini-1.5-flash:generateContent?key=${r}`,s=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:t,maxOutputTokens:n,responseMimeType:"application/json"}})});if(!s.ok){let e=await s.text();throw Error(`Gemini API error ${s.status}: ${e}`)}let i=await s.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function s(e,t,n){let o=`${a}/models/gemini-1.5-flash:generateContent?key=${r}`,s=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:n},{inlineData:{mimeType:t,data:e}}]}],generationConfig:{temperature:.3,maxOutputTokens:8192,responseMimeType:"application/json"}})});if(!s.ok){let e=await s.text();throw Error(`Gemini Vision error ${s.status}: ${e}`)}let i=await s.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function i(e){let t=`${a}/models/text-embedding-004:embedContent?key=${r}`,n=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"models/text-embedding-004",content:{parts:[{text:e}]}})});if(!n.ok)throw Error(`Embedding API error ${n.status}`);let o=await n.json();return o.embedding?.values||[]}}};var t=require("../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[948,972],()=>n(4302));module.exports=r})();