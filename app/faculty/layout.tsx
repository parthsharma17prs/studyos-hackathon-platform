'use client';

import Sidebar, { SidebarItem } from '@/components/shared/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const facultyNavItems: SidebarItem[] = [
  { icon: '🏠', label: 'Dashboard', href: '/faculty/dashboard' },
  { icon: '📝', label: 'Create Assignment', href: '/faculty/assign' },
  { icon: '📊', label: 'Student Analytics', href: '/faculty/analytics' },
  { icon: '📢', label: 'Notice Board', href: '/faculty/notices' },
  { icon: '👥', label: 'Class Performance', href: '/faculty/performance' },
];

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('studyos_user');
    if (!stored) {
      router.push('/auth?role=faculty');
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'faculty') {
      router.push('/auth?role=faculty');
      return;
    }
    setUser(parsed);
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-faculty-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar
        items={facultyNavItems}
        theme="faculty"
        userName={user.name}
        userEmail={user.email}
      />

      <main className="ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-os-border px-8 py-4 flex justify-between items-center">
           <div>
              <h1 className="text-lg font-black tracking-tight">
                Welcome back, Professor <span className="text-faculty-accent">{user.name.split(' ')[0] || user.name}</span>
              </h1>
              <p className="text-xs text-os-muted">Monitor batches and manage assignments.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-os-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-faculty-accent" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-faculty-accent/20 flex items-center justify-center text-faculty-accent font-black text-sm">
                F
              </div>
           </div>
        </header>
        
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
