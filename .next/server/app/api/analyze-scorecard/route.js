"use strict";(()=>{var e={};e.id=912,e.ids=[912],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7125:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>g,patchFetch:()=>f,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l});var s={};a.r(s),a.d(s,{POST:()=>u});var n=a(9303),r=a(8716),o=a(670),i=a(7070),c=a(6945);async function u(e){try{let{fileBase64:t,mimeType:a}=await e.json(),s=`You are an expert academic data extractor. Analyze this marksheet/scorecard image and extract ALL data.

Return a JSON object with this EXACT structure:
{
  "studentName": "...",
  "university": "...",
  "semester": "...",
  "subjects": [
    {
      "name": "Subject Name",
      "marksObtained": 75,
      "maxMarks": 100,
      "grade": "A",
      "credits": 4,
      "percentage": 75
    }
  ],
  "cgpa": 8.2,
  "sgpa": 7.8,
  "totalPercentage": 76.5,
  "placementScore": 72,
  "placementReadiness": {
    "tcs": true,
    "infosys": true,
    "wipro": true,
    "amazon": false,
    "google": false,
    "flipkart": false
  },
  "studyPlan": [
    { "day": "Day 1-5", "subject": "weakest subject", "focus": "description" },
    { "day": "Day 6-10", "subject": "...", "focus": "..." }
  ],
  "strengths": ["subject1", "subject2"],
  "weaknesses": ["subject1", "subject2"],
  "commentary": "Brief AI analysis of overall performance"
}

Rules:
- Extract EVERY subject visible in the marksheet
- Calculate percentage for each subject
- CGPA: if shown, use it. If not, calculate from grades
- Placement Score: weighted (CS subjects get 1.5x weight)
- Placement cutoffs: TCS 6.0+, Infosys 6.5+, Wipro 6.0+, Amazon 7.5+, Google 8.0+
- Study plan: 30-day plan focusing on weakest subjects first
- If you can't read a value, use null`,n=await (0,c.PM)(t,a,s),r=JSON.parse(n);return i.NextResponse.json(r)}catch(e){return i.NextResponse.json({error:e.message},{status:500})}}let p=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/analyze-scorecard/route",pathname:"/api/analyze-scorecard",filename:"route",bundlePath:"app/api/analyze-scorecard/route"},resolvedPagePath:"/Users/macbook/Desktop/Projects/anti aurobindo1/studyos/app/api/analyze-scorecard/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:m}=p,g="/api/analyze-scorecard/route";function f(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}},6945:(e,t,a)=>{a.d(t,{Dt:()=>r,PM:()=>o,ke:()=>i});let s=process.env.GEMINI_API_KEY||"",n="https://generativelanguage.googleapis.com/v1beta";async function r({prompt:e,temperature:t=.7,maxTokens:a=8192}){let r=`${n}/models/gemini-1.5-flash:generateContent?key=${s}`,o=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:t,maxOutputTokens:a,responseMimeType:"application/json"}})});if(!o.ok){let e=await o.text();throw Error(`Gemini API error ${o.status}: ${e}`)}let i=await o.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function o(e,t,a){let r=`${n}/models/gemini-1.5-flash:generateContent?key=${s}`,o=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:a},{inlineData:{mimeType:t,data:e}}]}],generationConfig:{temperature:.3,maxOutputTokens:8192,responseMimeType:"application/json"}})});if(!o.ok){let e=await o.text();throw Error(`Gemini Vision error ${o.status}: ${e}`)}let i=await o.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function i(e){let t=`${n}/models/text-embedding-004:embedContent?key=${s}`,a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"models/text-embedding-004",content:{parts:[{text:e}]}})});if(!a.ok)throw Error(`Embedding API error ${a.status}`);let r=await a.json();return r.embedding?.values||[]}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[948,972],()=>a(7125));module.exports=s})();