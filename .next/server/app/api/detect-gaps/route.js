"use strict";(()=>{var e={};e.id=704,e.ids=[704],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5825:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>g,patchFetch:()=>h,requestAsyncStorage:()=>u,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var s={};a.r(s),a.d(s,{POST:()=>c});var o=a(9303),n=a(8716),r=a(670),i=a(7070),p=a(6945);async function c(e){try{let t;let{syllabusText:a,notesText:s}=await e.json();if(!a||!s)return i.NextResponse.json({error:"Provide both syllabus and notes."},{status:400});let o=`Extract a flat list of 10-15 key academic topics from this syllabus text:
"""
${a.substring(0,3e3)}
"""
Return JSON: { "topics": ["topic 1", "topic 2", ...] }`,n=await (0,p.Dt)({prompt:o,temperature:.1}),r=[];try{r=JSON.parse(n).topics||[]}catch{let e=n.match(/```json\s*([\s\S]*?)\s*```/)||n.match(/\{[\s\S]*\}/);e&&(r=JSON.parse(e[1]||e[0]).topics||[])}if(!r.length)return i.NextResponse.json({error:"Failed to extract topics from syllabus."},{status:500});await Promise.all(r.map(e=>(0,p.ke)(e).then(t=>({topic:e,embedding:t})))),s.split(/\n\s*\n/).map(e=>e.trim()).filter(e=>e.length>20).join(" \n\n ");let c=`You are an AI syllabus checker. I have a list of topics from a syllabus, and a student's notes.
SYLLABUS TOPICS:
${r.map(e=>`- ${e}`).join("\n")}

STUDENT NOTES:
"""
${s.substring(0,15e3)}
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
Make 'missing' if there's little to no mention.`,l=await (0,p.Dt)({prompt:c,temperature:.2});try{t=JSON.parse(l)}catch{let e=l.match(/```json\s*([\s\S]*?)\s*```/)||l.match(/\{[\s\S]*\}/);e&&(t=JSON.parse(e[1]||e[0]))}return i.NextResponse.json(t)}catch(e){return i.NextResponse.json({error:e.message},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/detect-gaps/route",pathname:"/api/detect-gaps",filename:"route",bundlePath:"app/api/detect-gaps/route"},resolvedPagePath:"/Users/macbook/Desktop/Projects/anti aurobindo1/studyos/app/api/detect-gaps/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:m}=l,g="/api/detect-gaps/route";function h(){return(0,r.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}},6945:(e,t,a)=>{a.d(t,{Dt:()=>n,PM:()=>r,ke:()=>i});let s=process.env.GEMINI_API_KEY||"",o="https://generativelanguage.googleapis.com/v1beta";async function n({prompt:e,temperature:t=.7,maxTokens:a=8192}){let n=`${o}/models/gemini-1.5-flash:generateContent?key=${s}`,r=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:t,maxOutputTokens:a,responseMimeType:"application/json"}})});if(!r.ok){let e=await r.text();throw Error(`Gemini API error ${r.status}: ${e}`)}let i=await r.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function r(e,t,a){let n=`${o}/models/gemini-1.5-flash:generateContent?key=${s}`,r=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:a},{inlineData:{mimeType:t,data:e}}]}],generationConfig:{temperature:.3,maxOutputTokens:8192,responseMimeType:"application/json"}})});if(!r.ok){let e=await r.text();throw Error(`Gemini Vision error ${r.status}: ${e}`)}let i=await r.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function i(e){let t=`${o}/models/text-embedding-004:embedContent?key=${s}`,a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"models/text-embedding-004",content:{parts:[{text:e}]}})});if(!a.ok)throw Error(`Embedding API error ${a.status}`);let n=await a.json();return n.embedding?.values||[]}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[948,972],()=>a(5825));module.exports=s})();