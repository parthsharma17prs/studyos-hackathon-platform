'use client';

import { LuUpload, LuZap, LuTarget, LuCircleCheck } from 'react-icons/lu';

/**
 * How It Works — High-interactivity timeline
 * Premium responsive design with scroll reveal
 */
const steps = [
  {
    step: '01',
    title: 'Inject Knowledge',
    desc: 'Paste text, upload PDFs, or feed marksheets. Our AI reads everything — even handwritten scrawls via Gemini Vision.',
    icon: LuUpload,
    color: 'text-blue-500',
  },
  {
    step: '02',
    title: 'Neural Processing',
    desc: 'Gemini 1.5 Flash benchmarks your content against 100k+ syllabus vectors to find exactly what you are missing.',
    icon: LuZap,
    color: 'text-student-accent',
  },
  {
    step: '03',
    title: 'Command Mastery',
    desc: 'Get a tailored study map, adaptive quizzes, and AI interventions. Real-time motivation when focus drops.',
    icon: LuTarget,
    color: 'text-green-500',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-student-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-24 reveal">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
          System <span className="gradient-text-red">Architecture</span>
        </h2>
        <p className="text-os-muted text-lg max-w-2xl mx-auto">
          The three-stage pipeline that turns chaos into academic dominance.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line (Hidden on Mobile) */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-os-border to-transparent -translate-y-1/2" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
          {steps.map((s, i) => (
            <div
              key={i}
              className="reveal group bg-black/50 border border-os-border p-10 rounded-3xl backdrop-blur-xl hover:border-student-accent/30 transition-all duration-500 hover:-translate-y-2 pb-16"
              style={{ transitionDelay: `${i * 0.2}s` }}
            >
              {/* Step Badge */}
              <div className="absolute -top-5 left-10 px-4 py-1.5 bg-os-card border border-os-border rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-student-accent group-hover:bg-student-accent group-hover:text-white transition-all">
                Stage {s.step}
              </div>

              {/* Icon Circle */}
              <div className="w-20 h-20 rounded-2xl bg-os-card border border-os-border flex items-center justify-center mb-10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(229,9,20,0.1)] transition-all">
                <s.icon className={`${s.color}`} size={32} />
              </div>

              {/* Content */}
              <h3 className="text-3xl font-black mb-6 tracking-tight group-hover:text-student-accent transition-colors">
                {s.title}
              </h3>
              <p className="text-os-muted text-sm leading-relaxed mb-8">
                {s.desc}
              </p>

              {/* Status List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-os-muted">
                  <LuCircleCheck className="text-status-good" size={14} /> 100% Automated
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-os-muted">
                  <LuCircleCheck className="text-status-good" size={14} /> Millisecond Latency
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute bottom-4 right-8 text-8xl font-black text-white/[0.02] select-none pointer-events-none group-hover:text-student-accent/5 transition-colors">
                {s.step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
