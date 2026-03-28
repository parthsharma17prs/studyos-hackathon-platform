'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * How It Works — 3 animated steps
 */
const steps = [
  {
    step: '01',
    title: 'Upload Your Notes',
    desc: 'Paste text, upload PDFs, images, or marksheets. Our AI reads everything — even handwritten notes via Gemini Vision.',
    icon: '📤',
  },
  {
    step: '02',
    title: 'AI Analyzes Everything',
    desc: 'Gemini 1.5 Flash processes your content in seconds. Generates summaries, quizzes, gap analysis, and personalized study plans.',
    icon: '⚡',
  },
  {
    step: '03',
    title: 'Personalized Plan Delivered',
    desc: 'Get a tailored study schedule, adaptive quizzes, and AI-powered interventions. Even phone calls when you need motivation.',
    icon: '🎯',
  },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
          How it <span className="gradient-text-red">works</span>
        </h2>
        <p className="mt-4 text-os-muted text-lg">Three steps. That&apos;s it. No setup, no friction.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`relative text-center transition-all duration-700 ${
              visible ? 'animate-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: `${i * 0.2}s`, animationFillMode: 'forwards' }}
          >
            {/* Step number */}
            <div className="text-8xl font-black text-white/[0.03] absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none">
              {s.step}
            </div>

            {/* Icon */}
            <div className="text-5xl mb-6 relative z-10">{s.icon}</div>

            {/* Content */}
            <h3 className="text-xl font-black mb-3 tracking-tight relative z-10">{s.title}</h3>
            <p className="text-os-muted text-sm leading-relaxed relative z-10">{s.desc}</p>

            {/* Connector line (not on last) */}
            {i < 2 && (
              <div className="hidden md:block absolute top-16 -right-4 w-8">
                <div className="h-[2px] w-full bg-gradient-to-r from-student-accent to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
