'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LuLayoutDashboard,
  LuBookOpen,
  LuTrendingUp,
  LuFileSearch,
  LuSearch,
  LuSwords,
  LuMic,
  LuWrench,
  LuCalendar,
  LuSettings,
  LuLogOut
} from 'react-icons/lu';

/**
 * Modular Sidebar Navigation
 * Premium student-only theme
 */

export interface SidebarItem {
  icon: any; // Lucide Icon component
  label: string;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  theme: 'student';
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({ items, theme, userName = 'User', userEmail = '' }: SidebarProps) {
  const pathname = usePathname();
  const accentClass = 'text-student-accent';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-os-border flex flex-col z-40 transition-all duration-500">
      {/* Logo */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter">
            Study<span className={accentClass}>OS</span>
          </span>
        </Link>
      </div>

      <div className="ribbon-student" />

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {items.map((item, i) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={i} href={item.href}>
              <div
                className={`
                  sidebar-link group
                  ${isActive ? 'bg-white/5 !text-white' : 'text-os-muted hover:text-white'}
                `}
              >
                <Icon
                  size={20}
                  className={`transition-colors ${isActive ? 'text-student-accent' : 'group-hover:text-student-accent'}`}
                />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-4 rounded-full bg-student-accent shadow-[0_0_10px_rgba(229,9,20,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-os-border bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-student-accent/10 border border-student-accent/20 flex items-center justify-center text-student-accent font-black text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate text-white">{userName}</div>
            <div className="text-[10px] text-os-muted truncate uppercase tracking-widest">{userEmail}</div>
          </div>
          <Link href="/" className="text-os-muted hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
            <LuLogOut size={18} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
