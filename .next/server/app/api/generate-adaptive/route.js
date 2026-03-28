"use strict";(()=>{var e={};e.id=528,e.ids=[528],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},166:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>m,patchFetch:()=>h,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>g,staticGenerationAsyncStorage:()=>l});var n={};a.r(n),a.d(n,{POST:()=>d});var o=a(9303),r=a(8716),s=a(670),i=a(7070),p=a(6945);async function d(e){try{let{wrongTopics:t,originalText:a,difficulty:n}=await e.json(),o=`You are an expert tutor. A student just took a quiz and got these topics WRONG:
${t.join(", ")}

Based on this study text:
"""
${a.substring(0,3e3)}
"""

Generate ${2*t.length} harder targeted questions ONLY on the weak topics above.
Difficulty: ${n||"hard"}

Return JSON:
{
  "quiz": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "...",
      "topic": "..."
    }
  ]
}

Make questions that test deeper understanding of these specific weak areas.`,r=await (0,p.Dt)({prompt:o,temperature:.7}),s=JSON.parse(r);return i.NextResponse.json(s)}catch(e){return i.NextResponse.json({error:e.message},{status:500})}}let u=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/generate-adaptive/route",pathname:"/api/generate-adaptive",filename:"route",bundlePath:"app/api/generate-adaptive/route"},resolvedPagePath:"/Users/macbook/Desktop/Projects/anti aurobindo1/studyos/app/api/generate-adaptive/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:g}=u,m="/api/generate-adaptive/route";function h(){return(0,s.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:l})}},6945:(e,t,a)=>{a.d(t,{Dt:()=>r,PM:()=>s,ke:()=>i});let n=process.env.GEMINI_API_KEY||"",o="https://generativelanguage.googleapis.com/v1beta";async function r({prompt:e,temperature:t=.7,maxTokens:a=8192}){let r=`${o}/models/gemini-1.5-flash:generateContent?key=${n}`,s=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:t,maxOutputTokens:a,responseMimeType:"application/json"}})});if(!s.ok){let e=await s.text();throw Error(`Gemini API error ${s.status}: ${e}`)}let i=await s.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function s(e,t,a){let r=`${o}/models/gemini-1.5-flash:generateContent?key=${n}`,s=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:a},{inlineData:{mimeType:t,data:e}}]}],generationConfig:{temperature:.3,maxOutputTokens:8192,responseMimeType:"application/json"}})});if(!s.ok){let e=await s.text();throw Error(`Gemini Vision error ${s.status}: ${e}`)}let i=await s.json();return i.candidates?.[0]?.content?.parts?.[0]?.text||""}async function i(e){let t=`${o}/models/text-embedding-004:embedContent?key=${n}`,a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"models/text-embedding-004",content:{parts:[{text:e}]}})});if(!a.ok)throw Error(`Embedding API error ${a.status}`);let r=await a.json();return r.embedding?.values||[]}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),n=t.X(0,[948,972],()=>a(166));module.exports=n})();