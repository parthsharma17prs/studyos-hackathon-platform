"use strict";(()=>{var e={};e.id=452,e.ids=[452],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5301:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>g,patchFetch:()=>h,requestAsyncStorage:()=>l,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>u});var r={};a.r(r),a.d(r,{POST:()=>c});var n=a(9303),o=a(8716),s=a(670),i=a(7070),d=a(6945);async function c(e){try{let t;let{resumeBase64:a,mimeType:r,jobDescription:n,targetCompany:o}=await e.json(),s=`You are an expert technical recruiter and ATS software analyzer at ${o||"a top tech company"}.
Analyze this resume against the following Job Description (JD):

JOB DESCRIPTION:
"""
${n||"General Software Engineering Role (React, Node, SQL, AWS, Algorithms)"}
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
- Identify at least 5 missing keywords from the JD (or standard expectations for the target company).`,c=await (0,d.PM)(a,r,s);try{t=JSON.parse(c)}catch{let e=c.match(/```json\s*([\s\S]*?)\s*```/)||c.match(/\{[\s\S]*\}/);if(e)t=JSON.parse(e[1]||e[0]);else throw Error("Failed to parse response")}return i.NextResponse.json(t)}catch(e){return i.NextResponse.json({error:e.message},{status:500})}}let p=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/analyze-resume/route",pathname:"/api/analyze-resume",filename:"route",bundlePath:"app/api/analyze-resume/route"},resolvedPagePath:"/Users/macbook/Desktop/Projects/anti aurobindo1/studyos/app/api/analyze-resume/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:l,staticGenerationAsyncStorage:u,serverHooks:m}=p,g="/api/analyze-resume/route";function h(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:u})}},6945:(e,t,a)=>{a.d(t,{Dt:()=>o,PM:()=>s,ke:()=>i});let r=process.env.GEMINI_API_KEY||"",n="https://generativelanguage.googleapis.com/v1beta";async function o({prompt:e,temperature:t=.7,maxTokens:a=8192}){let o=`${n}/models/gemini-1.5-flash:generateContent?key=${r}`,s=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:t,maxOutputTokens:a,responseMimeType:"application/json"}})});if(!s.ok){let e=await s.text();throw Error(`Gemini API error ${s.status}: ${e}`)}let i=await s.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function s(e,t,a){let o=`${n}/models/gemini-1.5-flash:generateContent?key=${r}`,s=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:a},{inlineData:{mimeType:t,data:e}}]}],generationConfig:{temperature:.3,maxOutputTokens:8192,responseMimeType:"application/json"}})});if(!s.ok){let e=await s.text();throw Error(`Gemini Vision error ${s.status}: ${e}`)}let i=await s.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function i(e){let t=`${n}/models/text-embedding-004:embedContent?key=${r}`,a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"models/text-embedding-004",content:{parts:[{text:e}]}})});if(!a.ok)throw Error(`Embedding API error ${a.status}`);let o=await a.json();return o.embedding?.values||[]}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[948,972],()=>a(5301));module.exports=r})();