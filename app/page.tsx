'use client';

import Hero from '@/components/landing/Hero';
import ComparisonTable from '@/components/landing/ComparisonTable';
import FeatureCards from '@/components/landing/FeatureCards';
import RolePreview from '@/components/landing/RolePreview';
import HowItWorks from '@/components/landing/HowItWorks';
import Stats from '@/components/landing/Stats';
import Footer from '@/components/landing/Footer';

/**
 * StudyOS Landing Page
 * Pure black, bold Inter, animated ribbons, high-impact design
 * This is the first thing judges see — must WOW immediately
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Hero — Giant animated headline + CTAs */}
      <Hero />

      {/* Animated ribbon separator */}
      <div className="ribbon-landing" />

      {/* Floating stats */}
      <Stats />

      {/* Comparison table vs ChatGPT/Gemini */}
      <ComparisonTable />

      <div className="ribbon-landing" />

      {/* 6 Feature cards with 3D tilt */}
      <FeatureCards />

      <div className="ribbon-landing" />

      {/* Student / Faculty role preview */}
      <RolePreview />

      <div className="ribbon-landing" />

      {/* How it works — 3 steps */}
      <HowItWorks />

      <div className="ribbon-landing" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
