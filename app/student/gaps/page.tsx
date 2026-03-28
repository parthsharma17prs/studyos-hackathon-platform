'use client';

import { useState } from 'react';
import Ribbon from '@/components/shared/Ribbon';

export default function RAGGapsDetector() {
  const [syllabus, setSyllabus] = useState('');
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!syllabus || !notes) {
      setError('Please provide both syllabus and notes.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/detect-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabusText: syllabus, notesText: notes }),
      });
      if (!res.ok) throw new Error('Failed to analyze gaps.');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
       setError(err.message || 'Error running RAG pipeline.');
    } finally {
       setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight mb-2">RAG Learning Gap Detector</h2>
        <p className="text-os-muted">Compare your study notes against the official syllabus. AI flags what you missed.</p>
      </div>

      {!data && !isAnalyzing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass-card p-6 h-[500px] flex flex-col">
              <label className="text-xs font-bold uppercase tracking-widest text-os-muted mb-2">🎓 Official Syllabus</label>
              <textarea 
                placeholder="Paste the university/course syllabus here..."
                className="w-full flex-1 bg-os-card border-2 border-os-border focus:border-student-accent rounded-xl p-4 text-sm resize-none text-white outline-none"
                value={syllabus}
                onChange={e => setSyllabus(e.target.value)}
              />
           </div>

           <div className="glass-card p-6 h-[500px] flex flex-col border-student-accent/30 bg-student-accent/5 relative shadow-[0_0_20px_rgba(255,0,0,0.1)]">
              <span className="absolute -top-3 left-6 bg-black text-xs text-student-accent font-black uppercase px-3 py-1 rounded-full border border-student-accent">Your Knowledge Base</span>
              <label className="text-xs font-bold uppercase tracking-widest text-os-muted mt-2 mb-2">📝 Personal Notes</label>
              <textarea 
                placeholder="Paste your compiled notes, chat history, or textbook summaries..."
                className="w-full flex-1 bg-os-card border-2 border-os-border focus:border-student-accent rounded-xl p-4 text-sm resize-none text-white outline-none"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
           </div>

           <div className="md:col-span-2">
              <button 
                 onClick={analyze}
                 disabled={!syllabus || !notes}
                 className="w-full py-5 text-lg btn-primary-student flex justify-center uppercase font-black tracking-widest"
              >
                 Run Semantic Gap Analysis (RAG)
              </button>
              {error && <p className="text-status-bad text-xs mt-4 text-center">{error}</p>}
           </div>
        </div>
      ) : isAnalyzing ? (
         <div className="glass-card p-24 text-center">
          <div className="w-16 h-16 border-4 border-student-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-black mb-2">RAG Pipeline Active</h3>
          <p className="text-sm text-os-muted">Extracting topics → Generating Embeddings → Computing Cosine Similarity</p>
        </div>
      ) : data && (
        <div className="space-y-8 animate-fade-up">
           <Ribbon theme="student" />

           <div className="glass-card p-8 border-student-accent">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-black tracking-tight mb-1">Knowledge Coverage</h3>
                    <p className="text-xs text-os-muted uppercase tracking-widest font-bold">Based on AI Topic Extraction</p>
                 </div>
                 <div className={"text-5xl font-black glow-text-red " + (data.overallCoverage > 75 ? 'text-status-good' : data.overallCoverage > 50 ? 'text-status-warn' : 'text-status-bad')}>
                    {data.overallCoverage}%
                 </div>
              </div>
              <div className="progress-bar h-2 w-full">
                <div className={data.overallCoverage > 75 ? 'bg-status-good' : data.overallCoverage > 50 ? 'bg-status-warn' : 'bg-status-bad'} style={{ width: `${data.overallCoverage}%`, height: '100%', transition: 'all 0.5s' }} />
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {data.coverage?.map((cov: any, i: number) => {
                 const statusColors = {
                    missing: 'border-status-bad bg-status-bad/10',
                    partial: 'border-status-warn bg-status-warn/10',
                    covered: 'border-status-good bg-status-good/10',
                 }[cov.status as ('missing'|'partial'|'covered')] || 'border-os-border';

                 const icon = {
                    missing: '❌',
                    partial: '⚠️',
                    covered: '✓'
                 }[cov.status as ('missing'|'partial'|'covered')] || 'ℹ️';

                 return (
                 <div key={i} className={`glass-card p-6 border-l-4 ${statusColors} flex items-start gap-4`}>
                    <div className="text-3xl shrink-0 mt-1">{icon}</div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-2">
                           <h4 className="text-lg font-black">{cov.topic}</h4>
                           <span className={"text-xs uppercase font-bold px-3 py-1 rounded-full border " + statusColors}>
                              {cov.status} // {cov.score || 0}% match
                           </span>
                       </div>
                       <p className="text-sm text-os-muted">{cov.explanation}</p>
                       
                       {cov.status === 'missing' && (
                          <div className="mt-4 flex flex-wrap gap-2">
                             <button onClick={() => alert("Takes user back to Study Generation with this topic filled via NextJS router.")} className="text-xs font-bold bg-student-accent text-white px-4 py-2 rounded border border-transparent hover:bg-transparent hover:border-student-accent transition-all">Generate Notes</button>
                             <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded transition-all hover:bg-os-muted">View Video Explainers</button>
                          </div>
                       )}
                    </div>
                 </div>
              )})}
           </div>

           <button onClick={() => { setNotes(''); setData(null); }} className="w-full text-xs text-os-muted underline hover:text-white pb-12">Submit new notes</button>
        </div>
      )}
    </div>
  );
}
