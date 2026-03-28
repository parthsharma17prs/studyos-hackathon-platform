'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Modular Sidebar Navigation
 * Supports both student (red) and faculty (gold) themes
 * Each nav item has icon, label, and href
 */

export interface SidebarItem {
  icon: string;
  label: string;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  theme: 'student' | 'faculty';
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({ items, theme, userName = 'User', userEmail = '' }: SidebarProps) {
  const pathname = usePathname();
  const isStudent = theme === 'student';
  const accentClass = isStudent ? 'text-student-accent' : 'text-faculty-accent';
  const glowClass = isStudent ? 'bg-student-glow' : 'bg-faculty-glow';
  const ribbonClass = isStudent ? 'ribbon-student' : 'ribbon-faculty';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-os-dark border-r border-os-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${isStudent
              ? 'bg-gradient-to-br from-red-600 to-red-800'
              : 'bg-gradient-to-br from-yellow-500 to-yellow-700'
            }
          `}>
            <span className="text-white font-black text-lg">S</span>
          </div>
          <span className="text-lg font-black tracking-tight">
            Study<span className={accentClass}>OS</span>
          </span>
        </Link>
      </div>

      <div className={ribbonClass} />

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {items.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link key={i} href={item.href}>
              <div
                className={`
                  sidebar-link
                  ${isActive ? `${accentClass} ${glowClass} bg-opacity-10` : ''}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
                {isActive && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${isStudent ? 'bg-student-accent' : 'bg-faculty-accent'}`} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-os-border">
        <div className="flex items-center gap-3">
          <div className={`
            w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black
            ${isStudent ? 'bg-student-accent/20 text-student-accent' : 'bg-faculty-accent/20 text-faculty-accent'}
          `}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">{userName}</div>
            <div className="text-xs text-os-muted truncate">{userEmail}</div>
          </div>
          <Link href="/" className="text-os-muted hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
