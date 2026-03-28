'use client';

import Sidebar, { SidebarItem } from '@/components/shared/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Student Layout — Red theme wrapper with sidebar
 * All student pages are rendered inside this layout
 */

const studentNavItems: SidebarItem[] = [
  { icon: '🏠', label: 'Dashboard', href: '/student/dashboard' },
  { icon: '📝', label: 'Study Notes + Quiz', href: '/student/study' },
  { icon: '📊', label: 'My Scorecard', href: '/student/scorecard' },
  { icon: '📄', label: 'ATS Resume', href: '/student/resume' },
  { icon: '🔍', label: 'Learning Gaps', href: '/student/gaps' },
  { icon: '⚔️', label: 'Battle Mode', href: '/student/battle' },
  { icon: '🎤', label: 'Interview Prep', href: '/student/interview' },
  { icon: '🛠️', label: 'MCP AI Tools', href: '/student/mcp' },
  { icon: '📅', label: 'Study Schedule', href: '/student/schedule' },
  { icon: '📈', label: 'Exam Predictor', href: '/student/predictor' },
  { icon: '⚙️', label: 'Settings', href: '/student/settings' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('studyos_user');
    if (!stored) {
      router.push('/auth?role=student');
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'student') {
      router.push('/auth?role=student');
      return;
    }
    setUser(parsed);
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-student-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar
        items={studentNavItems}
        theme="student"
        userName={user.name}
        userEmail={user.email}
      />

      {/* Main content area */}
      <main className="ml-64 min-h-screen">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-os-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black tracking-tight">
                Welcome back, <span className="text-student-accent">{user.name}</span>
              </h1>
              <p className="text-xs text-os-muted">Ready to dominate today?</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-os-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-student-accent" />
              </button>

              {/* User avatar */}
              <div className="w-9 h-9 rounded-lg bg-student-accent/20 flex items-center justify-center">
                <span className="text-student-accent font-black text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
