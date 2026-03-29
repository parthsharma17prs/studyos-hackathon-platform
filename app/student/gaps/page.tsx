'use client';

import { useState } from 'react';
import {
   LuSearch,
   LuZap,
   LuCircleCheck,
   LuTriangleAlert,
   LuCircleX,
   LuArrowRight,
   LuBookOpen,
   LuCirclePlay
} from 'react-icons/lu';
import Ribbon from '@/components/shared/Ribbon';

/**
 * RAG Gap Detector — Premium design with mock analysis
 */

interface TopicResult {
   topic: string;
   status: 'covered' | 'partial' | 'missing';
   score: number;
   explanation: string;
}

interface MockResult {
   overallCoverage: number;
   coverage: TopicResult[];
}

const mockGaps: MockResult = {
   overallCoverage: 68,
   coverage: [
      {
         topic: "Network Layer Protocols (IPv4 vs IPv6)",
         status: "covered",
         score: 95,
         explanation: "Your notes perfectly capture header structure and addressing differences."
      },
      {
         topic: "TCP/IP Congestion Control",
         status: "partial",
         score: 55,
         explanation: "You mentioned Slow Start and Congestion Avoidance, but missed Fast Retransmit and Fast Recovery details."
      },
      {
         topic: "DNS & Root Name Servers",
         status: "missing",
         score: 0,
         explanation: "Crucial topic missing from your notes. Syllabus requires understanding of iterative vs recursive queries."
      },
      {
         topic: "Routing Algorithms: BGP",
         status: "missing",
         score: 0,
         explanation: "Policy-based routing and Inter-AS routing concepts are completely absent."
      }
   ]
};

export default function RAGGapsDetector() {
   const [syllabus, setSyllabus] = useState('');
   const [notes, setNotes] = useState('');
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [data, setData] = useState<MockResult | null>(null);

   const loadSample = () => {
      setIsAnalyzing(true);
      setTimeout(() => {
         setData(mockGaps);
         setIsAnalyzing(false);
      }, 2500);
   };

   const analyze = () => {
      if (!syllabus || !notes) return;
      loadSample();
   };

   return (
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
         <div className="flex items-end justify-between">
            <div>
               <h2 className="text-4xl font-black tracking-tighter mb-2">RAG Gap Detector</h2>
               <p className="text-os-muted text-sm uppercase tracking-widest font-bold">Semantic Syllabus Mapping</p>
            </div>
            {!data && !isAnalyzing && (
               <button
                  onClick={loadSample}
                  className="btn-ghost flex items-center gap-2 border-student-accent/30 text-student-accent hover:bg-student-accent/5"
               >
                  <LuZap size={16} /> Load Sample Analysis
               </button>
            )}
         </div>

         {!data && !isAnalyzing ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-os-muted flex items-center gap-2">
                     <LuBookOpen className="text-student-accent" /> Official Syllabus
                  </label>
                  <textarea
                     placeholder="Paste the course syllabus topics here..."
                     className="w-full h-96 bg-os-card border-2 border-os-border focus:border-student-accent rounded-3xl p-8 text-sm leading-relaxed text-white outline-none transition-all group-hover:bg-white/[0.01]"
                     value={syllabus}
                     onChange={e => setSyllabus(e.target.value)}
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-os-muted flex items-center gap-2">
                     <LuSearch className="text-student-accent" /> Your Knowledge Base
                  </label>
                  <textarea
                     placeholder="Paste your notes or summaries here..."
                     className="w-full h-96 bg-os-card border-2 border-os-border focus:border-student-accent rounded-3xl p-8 text-sm leading-relaxed text-white outline-none transition-all"
                     value={notes}
                     onChange={e => setNotes(e.target.value)}
                  />
               </div>

               <div className="lg:col-span-2">
                  <button
                     onClick={analyze}
                     disabled={!syllabus || !notes}
                     className={`w-full py-6 text-xl rounded-3xl flex justify-center uppercase font-black tracking-[0.2em] transition-all
                   ${!syllabus || !notes ? 'bg-os-border text-os-muted' : 'btn-primary-student shadow-[0_10px_40px_rgba(229,9,20,0.3)]'}
                 `}
                  >
                     Run Semantic Mapping (RAG)
                  </button>
               </div>
            </div>
         ) : isAnalyzing ? (
            <div className="glass-card p-32 text-center animate-pulse">
               <div className="w-20 h-20 border-4 border-student-accent border-t-transparent rounded-full animate-spin mx-auto mb-10" />
               <h3 className="text-3xl font-black tracking-tighter mb-4">Semantic Pipeline Active</h3>
               <p className="text-sm text-os-muted uppercase tracking-[0.3em] font-bold">Generating Embeddings & Topic Extraction</p>
            </div>
         ) : data && (
            <div className="space-y-12 animate-fade-up">
               <Ribbon theme="student" />

               {/* Metrics Grid */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2 glass-card p-10 flex flex-col justify-between">
                     <div>
                        <h3 className="text-3xl font-black tracking-tighter mb-2">Overall Coverage</h3>
                        <p className="text-[10px] text-os-muted uppercase tracking-widest font-black">Syllabus vs Knowledge Base</p>
                     </div>
                     <div className="mt-8">
                        <div className="flex justify-between items-end mb-4">
                           <span className={`text-7xl font-black glow-text-red ${data.overallCoverage > 75 ? 'text-green-500' : 'text-student-accent'}`}>
                              {data.overallCoverage}%
                           </span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-os-muted mb-3">AI Confidence: 98%</span>
                        </div>
                        <div className="progress-bar h-3">
                           <div className="progress-fill-red" style={{ width: `${data.overallCoverage}%` }} />
                        </div>
                     </div>
                  </div>

                  <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                     <LuCircleCheck className="text-green-500 mb-4" size={32} />
                     <div className="text-4xl font-black mb-1">12</div>
                     <p className="text-[10px] text-os-muted uppercase tracking-widest font-black">Topics Covered</p>
                  </div>

                  <div className="glass-card p-8 flex flex-col items-center justify-center text-center bg-student-accent/5 border-student-accent/20">
                     <LuCircleX className="text-student-accent mb-4" size={32} />
                     <div className="text-4xl font-black text-student-accent mb-1">04</div>
                     <p className="text-[10px] text-os-muted uppercase tracking-widest font-black">Critical Gaps</p>
                  </div>
               </div>

               {/* Detailed Topics */}
               <div className="space-y-6">
                  <h3 className="text-2xl font-black tracking-tighter">Topic Breakdown</h3>
                  <div className="grid grid-cols-1 gap-6">
                     {data.coverage.map((cov, i) => {
                        const StatusIcon = cov.status === 'covered' ? LuCircleCheck : cov.status === 'partial' ? LuTriangleAlert : LuCircleX;
                        const statusColor = cov.status === 'covered' ? 'text-green-500' : cov.status === 'partial' ? 'text-orange-500' : 'text-student-accent';
                        const borderColor = cov.status === 'covered' ? 'border-green-500/20' : cov.status === 'partial' ? 'border-orange-500/20' : 'border-student-accent/20';

                        return (
                           <div key={i} className={`glass-card p-8 flex items-start gap-8 border-l-8 ${borderColor} group hover:bg-white/[0.01] transition-all`}>
                              <StatusIcon className={`${statusColor} shrink-0 mt-1`} size={32} />
                              <div className="flex-1">
                                 <div className="flex justify-between items-start mb-4">
                                    <div>
                                       <h4 className="text-xl font-black tracking-tight mb-2 group-hover:text-student-accent transition-colors">{cov.topic}</h4>
                                       <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-lg border ${statusColor.replace('text-', 'bg-')}/5 ${statusColor.replace('text-', 'border-')}/30 ${statusColor}`}>
                                          {cov.status} • {cov.score}% Match
                                       </span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-os-muted hover:text-white transition-all">
                                       Syllabus Details <LuArrowRight size={14} />
                                    </button>
                                 </div>
                                 <p className="text-sm text-os-muted leading-relaxed max-w-3xl">{cov.explanation}</p>

                                 {cov.status !== 'covered' && (
                                    <div className="mt-8 flex items-center gap-4">
                                       <button className="btn-primary-student !py-3 !px-6 !text-[10px] !rounded-xl flex items-center gap-2">
                                          <LuZap size={14} /> Generate Gap Notes
                                       </button>
                                       <button className="btn-ghost !py-3 !px-6 !text-[10px] !rounded-xl flex items-center gap-2 border-os-border text-os-muted hover:text-white">
                                          <LuCirclePlay size={14} /> Video Explainer
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </div>

               <button onClick={() => { setData(null); setNotes(''); setSyllabus(''); }} className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-os-muted hover:text-red-500 transition-all py-10">Start New Comparison</button>
            </div>
         )}
      </div>
   );
}
