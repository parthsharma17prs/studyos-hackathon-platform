'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Role Preview — "For Students" and "For Faculty" sections
 * Shows a themed preview of each dashboard experience
 */
export default function RolePreview() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Preview */}
        <div
          className={`glass-card p-10 border-student-accent/20 transition-all duration-700 ${
            visible ? 'animate-fade-up' : 'opacity-0'
          }`}
        >
          <div className="ribbon-student rounded-full mb-8" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-student-accent/20 flex items-center justify-center">
              <span className="text-student-accent font-black text-lg">S</span>
            </div>
            <h3 className="text-3xl font-black">For Students</h3>
          </div>

          <ul className="space-y-4">
            {[
              'AI quiz generator with adaptive difficulty',
              'Marksheet analyzer + placement readiness',
              'ATS resume checker with AI rewriter',
              'RAG gap detector for exam prep',
              'Voice calling agent for study nudges',
              'Peer battle mode with live scoreboard',
              'Spaced repetition calendar',
              'Burnout detection + recovery mode',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-os-muted">
                <span className="text-student-accent mt-0.5 font-bold">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Mock dashboard preview */}
          <div className="mt-8 rounded-xl border border-os-border bg-black/50 p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-student-accent/60" />
              <div className="w-3 h-3 rounded-full bg-os-border" />
              <div className="w-3 h-3 rounded-full bg-os-border" />
              <span className="text-[10px] text-os-muted ml-2 uppercase tracking-wider">Student Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[78, 92, 45].map((score, i) => (
                <div key={i} className="bg-os-card rounded-lg p-3 text-center">
                  <div className={`text-2xl font-black ${score > 70 ? 'text-student-accent' : 'text-os-muted'}`}>
                    {score}%
                  </div>
                  <div className="text-[10px] text-os-muted mt-1">
                    {['Physics', 'Math', 'Chem'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Preview */}
        <div
          className={`glass-card p-10 border-faculty-accent/20 transition-all duration-700 ${
            visible ? 'animate-fade-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <div className="ribbon-faculty rounded-full mb-8" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-faculty-accent/20 flex items-center justify-center">
              <span className="text-faculty-accent font-black text-lg">F</span>
            </div>
            <h3 className="text-3xl font-black">For Faculty</h3>
          </div>

          <ul className="space-y-4">
            {[
              'AI assignment creator with auto-grading',
              'Class analytics heatmap — spot weak topics',
              'AI-powered notice board with categories',
              'Batch quiz launcher — Kahoot-style live quiz',
              'Student performance tracking (anonymous)',
              'Export class reports as PDF/Excel',
              'Intervention recommendations',
              'Batch management tools',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-os-muted">
                <span className="text-faculty-accent mt-0.5 font-bold">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Mock dashboard preview */}
          <div className="mt-8 rounded-xl border border-os-border bg-black/50 p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-faculty-accent/60" />
              <div className="w-3 h-3 rounded-full bg-os-border" />
              <div className="w-3 h-3 rounded-full bg-os-border" />
              <span className="text-[10px] text-os-muted ml-2 uppercase tracking-wider">Faculty Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[156, 87, 12].map((stat, i) => (
                <div key={i} className="bg-os-card rounded-lg p-3 text-center">
                  <div className="text-2xl font-black text-faculty-accent">{stat}</div>
                  <div className="text-[10px] text-os-muted mt-1">
                    {['Students', 'Avg Score', 'Assignments'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
