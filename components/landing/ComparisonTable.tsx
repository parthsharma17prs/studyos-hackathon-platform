'use client';

import { useEffect, useRef } from 'react';

/**
 * Comparison Table — "What no other AI can do for you"
 * Animated rows that reveal on scroll
 */
const features = [
  { name: 'Remembers your notes', chatgpt: false, gemini: false, studyos: true },
  { name: 'Scorecard AI analyzer', chatgpt: false, gemini: false, studyos: true },
  { name: 'Calls your phone', chatgpt: false, gemini: false, studyos: true },
  { name: 'Gap detection (RAG)', chatgpt: false, gemini: false, studyos: true },
  { name: 'Peer battle mode', chatgpt: false, gemini: false, studyos: true },
  { name: 'ATS resume checker', chatgpt: false, gemini: false, studyos: true },
  { name: 'Exam pattern predictor', chatgpt: false, gemini: false, studyos: true },
  { name: 'Burnout detection', chatgpt: false, gemini: false, studyos: true },
  { name: 'Spaced repetition', chatgpt: false, gemini: false, studyos: true },
  { name: 'Video explanations', chatgpt: false, gemini: false, studyos: true },
];

export default function ComparisonTable() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rows = entry.target.querySelectorAll('.table-row-animate');
            rows.forEach((row, index) => {
              setTimeout(() => {
                row.classList.add('visible');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 max-w-5xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
          What <span className="gradient-text-red">no other AI</span> can do
        </h2>
        <p className="mt-4 text-os-muted text-lg">
          Side-by-side. Feature-by-feature. No contest.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-os-border">
              <th className="text-left py-4 px-4 text-os-muted font-semibold uppercase text-sm tracking-wider">
                Feature
              </th>
              <th className="py-4 px-4 text-os-muted font-semibold uppercase text-sm tracking-wider text-center">
                ChatGPT
              </th>
              <th className="py-4 px-4 text-os-muted font-semibold uppercase text-sm tracking-wider text-center">
                Gemini
              </th>
              <th className="py-4 px-4 text-sm tracking-wider text-center">
                <span className="font-black text-student-accent">StudyOS</span>
              </th>
            </tr>
          </thead>

          {/* Body with animated rows */}
          <tbody>
            {features.map((feat, i) => (
              <tr
                key={i}
                className="table-row-animate animate-on-scroll border-b border-os-border/50 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-4 px-4 font-semibold text-sm sm:text-base">
                  {feat.name}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-red-900 text-xl">✗</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-red-900 text-xl">✗</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-student-accent text-xl font-bold">✓</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
