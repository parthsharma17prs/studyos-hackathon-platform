'use client';

/**
 * Animated Ribbon Component
 * Reusable gradient ribbon separator
 */
export default function Ribbon({ theme = 'student' }: { theme?: 'student' | 'faculty' | 'landing' }) {
  const classes = {
    student: 'ribbon-student',
    faculty: 'ribbon-faculty',
    landing: 'ribbon-landing',
  };

  return <div className={`${classes[theme]} rounded-full`} />;
}
