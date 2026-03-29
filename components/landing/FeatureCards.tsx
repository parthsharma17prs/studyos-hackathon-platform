'use client';

import { useEffect, useRef, useState } from 'react';
import { LuBrain, LuTrendingUp, LuFileSearch, LuPhoneCall, LuSearch, LuSwords, LuInfo } from 'react-icons/lu';

/**
 * Feature Cards — Interactive 3D Flashcards
 * Flips on click to show deep-dive details
 */
const features = [
  {
    icon: LuBrain,
    title: 'AI Quiz Generator',
    desc: 'Paste notes → get instant MCQs with difficulty control, explanations, and adaptive retries.',
    back: 'Our neural engine parses your text to identify 14+ Bloom Taxonomy levels, ensuring every quiz targets your specific knowledge gaps with surgical precision.',
    gradient: 'from-red-600/20 to-transparent',
  },
  {
    icon: LuTrendingUp,
    title: 'Scorecard Analyzer',
    desc: 'Upload your marksheet — AI reads it, ranks subjects, and shows placement readiness.',
    back: 'Using Gemini Vision, we extract tabular data from any marksheet or certificate, then run a percentile prediction model against current industry hiring trends.',
    gradient: 'from-orange-600/20 to-transparent',
  },
  {
    icon: LuFileSearch,
    title: 'ATS Resume Checker',
    desc: 'Match your resume against any JD. See missing keywords, get AI-rewritten bullets.',
    back: 'We simulate the exact parsing algorithms used by Workday and Lever. Our AI then quantifies your achievements using the Google X-Y-Z formula for maximum impact.',
    gradient: 'from-blue-600/20 to-transparent',
  },
  {
    icon: LuPhoneCall,
    title: 'Voice Calling Agent',
    desc: 'Score low on a quiz? Your phone rings. AI calls you with a personalized study plan.',
    back: 'Integrated with Vapi.ai, our voice agent detects frustration in your tone and provides verbal encouragement and audio-based summaries of complex topics.',
    gradient: 'from-green-600/20 to-transparent',
  },
  {
    icon: LuSearch,
    title: 'RAG Gap Detector',
    desc: 'Notes vs syllabus — find what you missed. Traffic-light coverage map, auto gap filling.',
    back: 'We index your notes and compare the vector embeddings against your official university syllabus. If a concept is missing, it’s flagged in red instantly.',
    gradient: 'from-purple-600/20 to-transparent',
  },
  {
    icon: LuSwords,
    title: 'Peer Battle Mode',
    desc: 'Challenge friends to real-time quiz battles. Same questions, live scoreboard, bragging rights.',
    back: 'Built on Firebase Realtime Database. Sync your screens and battle in the arena. Winner gets the "Alpha Student" badge; loser gets a forced 10-minute study timer.',
    gradient: 'from-pink-600/20 to-transparent',
  },
];

export default function FeatureCards() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-24">
      <div className="text-center mb-20 reveal">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
          Everything you need to <span className="gradient-text-red">dominate</span>
        </h2>
        <p className="text-os-muted text-lg max-w-2xl mx-auto">
          Built for high-performance students. Click a card to peek under the hood.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {features.map((feat, i) => (
          <div
            key={i}
            className="reveal group h-[350px] cursor-pointer"
            style={{ transitionDelay: `${i * 0.1}s` }}
            onClick={() => setFlipped(flipped === i ? null : i)}
          >
            <div className={`
              relative w-full h-full transition-transform duration-700 preserve-3d
              ${flipped === i ? 'rotate-y-180' : ''}
            `}>
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden">
                <div className="glass-card p-10 h-full flex flex-col justify-center hover:border-student-accent/50 transition-colors">
                  <div className="card-glare absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="w-14 h-14 rounded-2xl bg-student-accent/10 flex items-center justify-center mb-8 border border-student-accent/10">
                    <feat.icon className="text-student-accent" size={28} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{feat.title}</h3>
                  <p className="text-os-muted text-sm leading-relaxed">{feat.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold text-student-accent uppercase tracking-widest">
                    <LuInfo size={14} /> Tap to deep dive
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <div className="glass-card p-10 h-full flex flex-col justify-center border-student-accent bg-black">
                  <h3 className="text-xl font-black mb-6 text-student-accent flex items-center gap-3">
                    <LuBrain size={20} /> Under the Hood
                  </h3>
                  <p className="text-white text-sm leading-relaxed font-medium">
                    {feat.back}
                  </p>
                  <div className="mt-8 text-[10px] text-os-muted uppercase font-black tracking-[0.2em] border-t border-os-border pt-4">
                    Neural Pipeline Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </section>
  );
}
