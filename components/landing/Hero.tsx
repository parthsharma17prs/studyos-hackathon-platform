'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Hero Section — The money shot
 * Giant typewriter text, animated underline, dual CTAs
 */
export default function Hero() {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecondLine(true), 1200);
    const t2 = setTimeout(() => setShowContent(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-2xl font-black tracking-tight">
            Study<span className="text-student-accent">OS</span>
          </span>
        </div>
      </div>

      {/* Main headline with typewriter */}
      <div className="text-center max-w-5xl">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter">
          <span className="inline-block overflow-hidden">
            <span className="inline-block animate-fade-up">STUDY SMARTER.</span>
          </span>
          <br />
          {showSecondLine && (
            <span className="inline-block overflow-hidden">
              <span className="inline-block animate-fade-up gradient-text-red">
                NOT HARDER.
              </span>
            </span>
          )}
        </h1>

        {/* Animated underline ribbon */}
        <div className="mt-6 mx-auto max-w-lg">
          <div className="ribbon-student rounded-full" />
        </div>

        {/* Subtitle */}
        {showContent && (
          <div className="animate-fade-up mt-8">
            <p className="text-lg sm:text-xl md:text-2xl text-os-muted max-w-2xl mx-auto leading-relaxed">
              The AI platform that knows you — your notes, your marks,<br className="hidden sm:block" />
              your gaps, your goals.
            </p>
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      {showContent && (
        <div className="animate-fade-up mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link href="/auth?role=student">
            <button className="group relative px-10 py-5 bg-white text-black font-black text-lg uppercase tracking-widest rounded-xl border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 transform hover:scale-105 min-w-[260px]">
              <span className="relative z-10">I AM A STUDENT</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
              <span className="absolute inset-0 z-10 flex items-center justify-center font-black text-lg uppercase tracking-widest opacity-0 group-hover:opacity-100 text-white transition-opacity">
                I AM A STUDENT
              </span>
            </button>
          </Link>

          <Link href="/auth?role=faculty">
            <button className="px-10 py-5 bg-student-accent text-white font-black text-lg uppercase tracking-widest rounded-xl border-2 border-student-accent hover:bg-transparent hover:text-student-accent transition-all duration-300 transform hover:scale-105 min-w-[260px]">
              I AM A FACULTY
            </button>
          </Link>
        </div>
      )}

      {/* Scroll indicator */}
      {showContent && (
        <div className="absolute bottom-8 animate-bounce-subtle">
          <div className="flex flex-col items-center gap-2 text-os-muted">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
