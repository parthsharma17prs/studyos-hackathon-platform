import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyOS — The Complete AI Student Platform',
  description:
    'The AI platform that knows you — your notes, your marks, your gaps, your goals. Built at Hack-A-Sprint 2026.',
  keywords: ['AI', 'study', 'platform', 'quiz', 'education', 'hackathon'],
  openGraph: {
    title: 'StudyOS — The Complete AI Student Platform',
    description: 'Study smarter. Not harder.',
    type: 'website',
  },
};

import ScrollEffects from '@/components/shared/ScrollEffects';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-inter bg-os-black text-white min-h-screen antialiased">
        <ScrollEffects />
        {children}
      </body>
    </html>
  );
}
