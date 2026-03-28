'use client';

/**
 * Full-screen loading screen with animated spinner
 */
export default function LoadingScreen({ theme = 'student' }: { theme?: 'student' | 'faculty' }) {
  const isStudent = theme === 'student';

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className={`
        w-12 h-12 rounded-full border-[3px] border-os-border animate-spin
        ${isStudent ? 'border-t-student-accent' : 'border-t-faculty-accent'}
      `} />

      {/* Brand */}
      <div className="mt-6 flex items-center gap-2">
        <span className="text-lg font-black tracking-tight">
          Study<span className={isStudent ? 'text-student-accent' : 'text-faculty-accent'}>OS</span>
        </span>
      </div>

      <p className="text-os-muted text-sm mt-2">Loading your workspace...</p>
    </div>
  );
}
