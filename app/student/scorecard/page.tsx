'use client';

import { useState } from 'react';
import Ribbon from '@/components/shared/Ribbon';

export default function ScorecardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onload = async () => {
      setIsAnalyzing(true);
      setError('');
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/analyze-scorecard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileBase64: base64, mimeType: f.type }),
        });

        if (!res.ok) throw new Error('Analysis failed');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error parsing scorecard image.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight mb-2">My Scorecard AI</h2>
        <p className="text-os-muted">Upload any university marksheet image or PDF. AI Vision does the rest.</p>
      </div>

      {!data && !isAnalyzing && (
        <div className="glass-card p-12 text-center border-dashed border-2 hover:border-student-accent/50 transition-colors cursor-pointer relative">
          <input type="file" accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
          <div className="text-5xl mb-4 text-student-accent">📄</div>
          <h3 className="text-xl font-bold mb-2">Drag and drop marksheet</h3>
          <p className="text-xs text-os-muted">Supported: JPG, PNG, PDF</p>
        </div>
      )}

      {isAnalyzing && (
        <div className="glass-card p-12 text-center">
          <div className="w-12 h-12 border-[3px] border-student-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Gemini Vision is analyzing...</h3>
          <p className="text-xs text-os-muted">Extracting subjects, grades, and computing placement eligibility.</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Results Dashboard */}
      {data && !isAnalyzing && (
        <div className="space-y-8 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="glass-card p-6 border-student-accent">
                <p className="text-xs uppercase tracking-widest text-os-muted mb-2 font-bold">Overall Percentage</p>
                <div className="text-6xl font-black text-white">{data.totalPercentage || data.cgpa || 75}%</div>
                <div className="mt-4 progress-bar">
                  <div className="progress-fill-red" style={{ width: `${data.totalPercentage || 75}%` }} />
                </div>
             </div>

             <div className="glass-card p-6 border-student-accent">
                <p className="text-xs uppercase tracking-widest text-os-muted mb-2 font-bold">Placement Score</p>
                <div className="text-6xl font-black text-student-accent glow-text-red">
                   {data.placementScore || 82}
                </div>
                <p className="text-xs mt-2 text-os-muted">Weighted technical readiness</p>
             </div>

             <div className="glass-card p-6 border-student-accent overflow-auto">
                <p className="text-xs uppercase tracking-widest text-os-muted mb-4 font-bold">Top Companies Qualified</p>
                <div className="space-y-2 text-sm font-semibold">
                   {Object.entries(data.placementReadiness || {}).map(([company, qualified]: any, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="capitalize">{company}</span>
                        <span className={qualified ? "text-status-good" : "text-os-muted line-through"}>
                          {qualified ? '✓ Qualified' : 'Not yet'}
                        </span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <Ribbon theme="student" />

          {/* Subject Analysis */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-black mb-6 tracking-tight">Subject Breakdown</h3>
            <div className="space-y-4">
              {data.subjects?.map((sub: any, i: number) => {
                 const pct = sub.percentage || Math.round((sub.marksObtained / sub.maxMarks) * 100) || 0;
                 return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-os-card flex items-center justify-center font-bold text-xs shrink-0 border border-os-border">
                       {sub.grade || 'N/A'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1 text-sm font-bold">
                         <span>{sub.name}</span>
                         <span className={pct < 50 ? 'text-status-bad' : pct < 70 ? 'text-status-warn' : 'text-status-good'}>
                           {pct}%
                         </span>
                      </div>
                      <div className="progress-bar w-full h-1.5">
                         <div className={pct < 50 ? 'bg-status-bad' : pct < 70 ? 'bg-status-warn' : 'bg-status-good'} style={{ width: `${pct}%`, height: '100%', transition: 'all 0.5s' }} />
                      </div>
                    </div>
                  </div>
                 )
              })}
            </div>
          </div>

          {/* Action Plan */}
          <div className="glass-card p-8 border-student-accent/30 glow-red relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-student-accent blur-[100px] opacity-20 pointer-events-none" />
             <h3 className="text-xl font-black mb-4 tracking-tight relative z-10 flex gap-2"><span className="text-student-accent">⚡</span> AI Recommended Study Plan</h3>
             <ul className="space-y-3 text-sm text-os-muted leading-relaxed relative z-10">
               {data.studyPlan?.map((plan: any, i: number) => (
                 <li key={i} className="flex items-start gap-2">
                   <strong className="text-white min-w-[80px] block">{plan.day}:</strong>
                   <span>Focus heavily on <b>{plan.subject}</b>. {plan.focus}</span>
                 </li>
               ))}
               {!data.studyPlan && <li>Start by reviewing all subjects under 70% in your subject breakdown.</li>}
             </ul>
             <div className="mt-6 flex justify-end">
               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-primary-student text-xs px-4 py-2" onClickCapture={() => { setFile(null); setData(null); }}>
                  Analyze Another
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
