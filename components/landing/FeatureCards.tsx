'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Feature Cards — 6 cards with 3D tilt effect on hover
 */
const features = [
  {
    icon: '🧠',
    title: 'AI Quiz Generator',
    desc: 'Paste notes → get instant MCQs with difficulty control, explanations, and adaptive retries.',
    gradient: 'from-red-600/20 to-transparent',
  },
  {
    icon: '📊',
    title: 'Scorecard Analyzer',
    desc: 'Upload your marksheet — AI reads it, ranks subjects, and shows placement readiness.',
    gradient: 'from-orange-600/20 to-transparent',
  },
  {
    icon: '📄',
    title: 'ATS Resume Checker',
    desc: 'Match your resume against any JD. See missing keywords, get AI-rewritten bullets.',
    gradient: 'from-blue-600/20 to-transparent',
  },
  {
    icon: '📞',
    title: 'Voice Calling Agent',
    desc: 'Score low on a quiz? Your phone rings. AI calls you with a personalized study plan.',
    gradient: 'from-green-600/20 to-transparent',
  },
  {
    icon: '🔍',
    title: 'RAG Gap Detector',
    desc: 'Notes vs syllabus — find what you missed. Traffic-light coverage map, auto gap filling.',
    gradient: 'from-purple-600/20 to-transparent',
  },
  {
    icon: '⚔️',
    title: 'Peer Battle Mode',
    desc: 'Challenge friends to real-time quiz battles. Same questions, live scoreboard, bragging rights.',
    gradient: 'from-pink-600/20 to-transparent',
  },
];

export default function FeatureCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /**
   * 3D tilt effect — tracks mouse position on card
   * and applies perspective transform
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <section ref={sectionRef} className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
          Everything you need to <span className="gradient-text-red">dominate</span>
        </h2>
        <p className="mt-4 text-os-muted text-lg">
          14 AI-powered tools. One platform. Zero excuses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <div
            key={i}
            className={`
              glass-card p-8 cursor-pointer transition-all duration-300
              ${visible ? 'animate-fade-up' : 'opacity-0'}
            `}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationFillMode: 'forwards',
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <div className="relative z-10">
              <div className="text-5xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-black mb-3 tracking-tight">{feat.title}</h3>
              <p className="text-os-muted text-sm leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
