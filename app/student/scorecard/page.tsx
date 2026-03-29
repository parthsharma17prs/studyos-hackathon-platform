'use client';

import { useState } from 'react';
import {
  LuFileText,
  LuTrendingUp,
  LuCircleCheck,
  LuZap,
  LuShieldCheck,
  LuChevronRight,
  LuUpload
} from 'react-icons/lu';
import Ribbon from '@/components/shared/Ribbon';

/**
 * Scorecard Analyzer — Premium design with mock data injection
 */

interface Subject {
  name: string;
  grade: string;
  percentage: number;
}

interface MockData {
  totalPercentage: number;
  cgpa: string;
  placementScore: number;
  placementReadiness: Record<string, boolean>;
  subjects: Subject[];
  studyPlan: { day: string; subject: string; focus: string }[];
}

const mockScorecard: MockData = {
  totalPercentage: 84.5,
  cgpa: "8.45/10",
  placementScore: 92,
  placementReadiness: {
    "Google": true,
    "Microsoft": true,
    "TCS": true,
    "Infosys": true,
    "Zomato": false
  },
  subjects: [
    { name: "Data Structures", grade: "A", percentage: 92 },
    { name: "Algorithms", grade: "A+", percentage: 95 },
    { name: "Operating Systems", grade: "B", percentage: 72 },
    { name: "Database Systems", grade: "B+", percentage: 81 },
    { name: "Computer Networks", grade: "A", percentage: 88 }
  ],
  studyPlan: [
    { day: "Day 1", subject: "Operating Systems", focus: "Focus on Thread Synchronization and Virtual Memory." },
    { day: "Day 2", subject: "Database Systems", focus: "Practice Normalization and SQL Join optimizations." },
    { day: "Day 3", subject: "Review", focus: "Full mock interview on Core CS fundamentals." }
  ]
};

export default function ScorecardPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<MockData | null>(null);
  const [error, setError] = useState('');

  const loadSample = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setData(mockScorecard);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleUpload = () => {
    // For demo, just load sample
    loadSample();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Scorecard Analyzer</h2>
          <p className="text-os-muted text-sm uppercase tracking-widest font-bold">Upload Marksheet. Get Career Roadmap.</p>
        </div>
        {!data && !isAnalyzing && (
          <button
            onClick={loadSample}
            className="btn-ghost flex items-center gap-2 border-student-accent/30 text-student-accent hover:bg-student-accent/5"
          >
            <LuZap size={16} /> Try Sample Marksheet
          </button>
        )}
      </div>

      {!data && !isAnalyzing && (
        <div className="glass-card p-20 text-center border-dashed border-2 border-os-border hover:border-student-accent/40 transition-all cursor-pointer group relative">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
          <div className="w-20 h-20 rounded-3xl bg-student-accent/5 border border-student-accent/20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
            <LuUpload className="text-student-accent" size={32} />
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-2">Drop your marksheet here</h3>
          <p className="text-os-muted text-sm font-medium">Supports JPG, PNG, and PDF (OCR Powered)</p>
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-os-muted"><LuShieldCheck className="text-green-500" /> SECURE</div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-os-muted"><LuZap className="text-student-accent" /> FAST</div>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="glass-card p-24 text-center">
          <div className="w-16 h-16 border-4 border-student-accent border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          <h3 className="text-3xl font-black tracking-tighter mb-2 animate-pulse">Gemini Vision Analyzing...</h3>
          <p className="text-os-muted text-sm font-medium uppercase tracking-[0.2em]">Extracting grades & placement eligibility</p>
        </div>
      )}

      {data && !isAnalyzing && (
        <div className="space-y-10 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 group">
              <p className="text-[10px] uppercase tracking-[0.2em] text-os-muted mb-4 font-black">Overall CGPA</p>
              <div className="text-6xl font-black text-white group-hover:scale-105 transition-transform">{data.cgpa || '8.2'}</div>
              <div className="mt-6 progress-bar h-2">
                <div className="progress-fill-red" style={{ width: `${data.totalPercentage}%` }} />
              </div>
            </div>

            <div className="glass-card p-8 group bg-gradient-to-br from-student-accent/5 to-transparent border-student-accent/20">
              <p className="text-[10px] uppercase tracking-[0.2em] text-student-accent mb-4 font-black">Placement Score</p>
              <div className="text-6xl font-black text-student-accent glow-text-red group-hover:scale-105 transition-transform">
                {data.placementScore}
              </div>
              <p className="text-[10px] mt-4 text-os-muted uppercase tracking-widest font-bold">Top 2% of candidates</p>
            </div>

            <div className="glass-card p-8 overflow-hidden">
              <p className="text-[10px] uppercase tracking-[0.2em] text-os-muted mb-6 font-black">Company Readiness</p>
              <div className="space-y-3">
                {Object.entries(data.placementReadiness).map(([company, qualified], i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <span className="text-sm font-bold text-os-muted group-hover:text-white transition-colors">{company}</span>
                    {qualified ? (
                      <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase tracking-widest">
                        <LuCircleCheck size={12} /> Qualified
                      </span>
                    ) : (
                      <span className="text-os-muted/30 text-[10px] font-black uppercase tracking-widest line-through">Incomplete</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Ribbon theme="student" />

          {/* Subject Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass-card p-10">
              <h3 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-3">
                <LuFileText className="text-student-accent" /> Subject Analytics
              </h3>
              <div className="space-y-6">
                {data.subjects.map((sub, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-xs font-black text-os-muted uppercase tracking-widest block mb-1">{sub.grade}</span>
                        <h4 className="font-bold text-sm tracking-tight">{sub.name}</h4>
                      </div>
                      <span className={`text-sm font-black ${sub.percentage >= 80 ? 'text-green-500' : 'text-student-accent'}`}>
                        {sub.percentage}%
                      </span>
                    </div>
                    <div className="progress-bar w-full h-1">
                      <div className={sub.percentage >= 80 ? 'bg-green-500' : 'bg-student-accent'} style={{ width: `${sub.percentage}%`, height: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Action Plan */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black mb-4 tracking-tighter flex items-center gap-3">
                <LuTrendingUp className="text-student-accent" /> Career Action Plan
              </h3>
              <div className="space-y-4">
                {data.studyPlan.map((plan, i) => (
                  <div key={i} className="glass-card p-6 border-l-4 border-student-accent flex items-start gap-5 hover:bg-white/5 transition-colors">
                    <div className="text-[10px] font-black uppercase tracking-widest text-student-accent pt-1">{plan.day}</div>
                    <div>
                      <h4 className="text-sm font-black mb-1">{plan.subject}</h4>
                      <p className="text-xs text-os-muted leading-relaxed">{plan.focus}</p>
                    </div>
                    <LuChevronRight className="ml-auto text-os-border" />
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setData(null); }}
                className="w-full p-4 text-[10px] font-black uppercase tracking-[0.2em] text-os-muted hover:text-white border-t border-os-border transition-colors mt-4"
              >
                Analyze Another Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
