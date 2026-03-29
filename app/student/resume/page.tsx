'use client';

import { useState } from 'react';
import Ribbon from '@/components/shared/Ribbon';
import { LuFileText, LuZap, LuCheck, LuTriangleAlert, LuCircleCheck } from 'react-icons/lu';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [company, setCompany] = useState('Top Tech Co');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const companies = ['Top Tech Co', 'Google', 'Amazon', 'TCS', 'Infosys', 'Startup'];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const analyze = async () => {
    if (!file || !jd) {
      setError('Upload a resume AND paste a Job Description.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      setIsAnalyzing(true);
      setError('');
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/analyze-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeBase64: base64, mimeType: file.type, jobDescription: jd, targetCompany: company }),
        });
        if (!res.ok) throw new Error('Failed to analyze resume.');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error parsing resume using Gemini Vision.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight mb-2">ATS Resume Checker</h2>
        <p className="text-os-muted">See what the hiring robot sees. AI rewrites your bullets for maximum impact.</p>
      </div>

      {!data && !isAnalyzing ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Side */}
          <div className="glass-card p-8 border-dashed border-2 hover:border-student-accent transition-all cursor-pointer relative h-[500px] flex items-center justify-center">
            <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer text-9xl z-10" onChange={handleUpload} />
            <div className="text-center relative z-0">
              <div className="text-7xl mb-4 text-student-accent opacity-80 group-hover:opacity-100 flex justify-center"><LuFileText size={72} /></div>
              <h3 className="text-2xl font-black mb-2">{file ? file.name : 'Upload Resume'}</h3>
              <p className="text-sm text-os-muted">{file ? 'Ready to analyze' : 'Drag & drop your PDF or image.'}</p>
              {file && <span className="text-status-good absolute -top-8 -right-8 text-4xl"><LuCheck size={40} /></span>}
            </div>
          </div>

          {/* JD Side */}
          <div className="glass-card p-8 flex flex-col space-y-4 h-[500px]">
            <div>
              <label className="text-xs uppercase font-bold tracking-widest text-os-muted">Target Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full mt-2 bg-os-card border-2 border-os-border focus:border-student-accent rounded-xl p-3 text-sm h-12 text-white outline-none"
              >
                {companies.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs uppercase font-bold tracking-widest text-os-muted">Job Description</label>
              <textarea
                placeholder="Paste the Job Description (JD) here to match keywords..."
                className="w-full mt-2 bg-os-card border-2 border-os-border focus:border-student-accent rounded-xl p-4 text-sm resize-none h-48 text-white outline-none"
                value={jd}
                onChange={e => setJd(e.target.value)}
              />
            </div>
            <button
              onClick={analyze}
              disabled={!file || !jd}
              className={"w-full py-4 text-lg btn-primary-student flex justify-center uppercase font-black tracking-widest" + (!file || !jd ? " opacity-50 cursor-not-allowed" : "")}
            >
              Analyze Match
            </button>
            {error && <p className="text-status-bad text-xs mt-2 text-center">{error}</p>}
          </div>
        </div>
      ) : isAnalyzing ? (
        <div className="glass-card p-24 text-center">
          <div className="w-16 h-16 border-4 border-student-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">Simulating ATS Bot...</h3>
          <p className="text-sm text-os-muted">Matching keywords against {company}'s JD profile.</p>
        </div>
      ) : data && (
        <div className="space-y-8 animate-fade-up">
          <Ribbon theme="student" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 glass-card p-8 text-center border-student-accent/30 flex flex-col items-center justify-center glow-red">
              <p className="text-xs font-bold uppercase tracking-widest text-os-muted mb-4">Overall ATS Score</p>
              <div className={"text-7xl font-black mb-4 " + (data.atsScore > 75 ? 'text-status-good' : data.atsScore > 50 ? 'text-status-warn' : 'text-status-bad')}>
                {data.atsScore}%
              </div>
              <p className="text-xs text-os-muted max-w-[150px] mx-auto">{data.verdict}</p>
              <button onClick={() => { setFile(null); setData(null); }} className="mt-8 text-xs text-os-muted underline">Resubmit</button>
            </div>

            <div className="md:col-span-3 glass-card p-8">
              <h3 className="text-xl font-black tracking-tight mb-6">Subsystem Ratings</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(data.subScores || {}).map(([key, score]: any, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1 text-sm font-bold">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={score < 50 ? 'text-status-bad' : score < 70 ? 'text-status-warn' : 'text-status-good'}>{score}%</span>
                    </div>
                    <div className="progress-bar h-1.5 w-full">
                      <div className={score < 50 ? 'bg-status-bad' : score < 70 ? 'bg-status-warn' : 'bg-status-good'} style={{ width: `${score}%`, height: '100%', transition: 'all 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 border-status-warn/20">
              <h3 className="text-xl font-black tracking-tight mb-6 text-status-warn flex items-center gap-2">
                <LuTriangleAlert /> Missing Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.missingKeywords?.map((k: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-status-bad/10 text-status-bad border border-status-bad/30 rounded-lg text-xs font-bold">
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-xs mt-6 text-os-muted border-t border-os-border pt-4">Make sure to add project experience related to these keywords to improve your score for {company}.</p>
            </div>

            <div className="glass-card p-8 border-status-good/20">
              <h3 className="text-xl font-black tracking-tight mb-6 text-status-good flex items-center gap-2">
                <LuCircleCheck /> ATS Detected Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.presentKeywords?.map((k: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-status-good/10 text-status-good border border-status-good/30 rounded-lg text-xs font-bold">
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-xs mt-6 text-os-muted border-t border-os-border pt-4">The bot successfully indexed these items from your resume document.</p>
            </div>
          </div>

          {data.rewrittenBullets && data.rewrittenBullets.length > 0 && (
            <div className="glass-card p-8 border-student-accent shadow-[0_0_30px_rgba(255,0,0,0.1)]">
              <h3 className="text-2xl font-black tracking-tight mb-6 flex gap-3 items-center">
                <span className="text-student-accent"><LuZap className="animate-pulse" /></span> AI Rewritten Impact Statements
              </h3>
              <p className="text-sm text-os-muted mb-8">Replace your original bullet points with these quantified versions to trigger higher ATS scores.</p>
              <div className="space-y-6">
                {data.rewrittenBullets.map((b: any, i: number) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 border-b border-os-border pb-6 last:border-0 last:pb-0">
                    <div className="flex-1 bg-os-card p-5 rounded-xl border border-status-bad/30 relative">
                      <span className="absolute -top-3 left-4 bg-black text-[10px] text-status-bad font-black uppercase px-2 py-0.5 rounded-full border border-status-bad/30">Original (Weak)</span>
                      <p className="text-sm text-os-muted line-through pt-1">{b.original}</p>
                    </div>
                    <div className="flex-none flex items-center justify-center"><span className="text-2xl text-os-muted">→</span></div>
                    <div className="flex-1 bg-os-card p-5 rounded-xl border border-status-good/30 relative shadow-[0_0_15px_rgba(0,255,136,0.05)]">
                      <span className="absolute -top-3 left-4 bg-black text-[10px] text-status-good font-black uppercase px-2 py-0.5 rounded-full border border-status-good/30">AI Improved</span >
                      <p className="text-sm text-white font-bold pt-1">{b.improved}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
