'use client';

/**
 * Footer — Hackathon credit + links
 */
export default function Footer() {
  return (
    <footer className="relative pt-16 pb-8 px-4 reveal">
      {/* Top ribbon */}
      <div className="ribbon-student mb-12" />

      <div className="max-w-5xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <span className="text-xl font-black tracking-tight">
            Study<span className="text-student-accent">OS</span>
          </span>
        </div>

        <p className="text-os-muted text-sm max-w-lg mx-auto leading-relaxed mb-8">
          The AI platform that knows you — your notes, your marks, your gaps, your goals.
          Built with love + caffeine in 24 hours.
        </p>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm">
          <a href="#" className="text-os-muted hover:text-white transition-colors">Features</a>
          <a href="#" className="text-os-muted hover:text-white transition-colors">For Students</a>
          <a href="#" className="text-os-muted hover:text-white transition-colors">For Faculty</a>
          <a href="#" className="text-os-muted hover:text-white transition-colors">GitHub</a>
        </div>

        {/* Hackathon credit */}
        <div className="border-t border-os-border pt-6">
          <p className="text-os-muted text-xs uppercase tracking-widest">
            Built at <span className="text-white font-bold">Hack-A-Sprint 2026</span> · Sri Aurobindo Group of Institutions, Indore
          </p>
          <p className="text-os-muted/60 text-xs mt-2">
            Powered by Google Gemini · Next.js · Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}
