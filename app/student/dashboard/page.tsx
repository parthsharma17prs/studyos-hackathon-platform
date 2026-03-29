'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LuBookOpen,
  LuFileSearch,
  LuSearch,
  LuSwords,
  LuMic,
  LuTarget,
  LuFlame,
  LuCalendar,
  LuChevronRight,
  LuClock,
  LuTrophy,
  LuZap,
  LuActivity,
  LuTrendingUp
} from 'react-icons/lu';

/**
 * Student Dashboard — Home screen
 * Premium design with mock data injection
 */

interface StudySession {
  topic: string;
  score: number;
  date: string;
  questionsCount: number;
}

const mockSessions: StudySession[] = [
  { topic: 'Data Structures: Hash Tables', score: 92, date: '2024-03-28', questionsCount: 12 },
  { topic: 'Computer Networks: TCP/IP', score: 78, date: '2024-03-27', questionsCount: 10 },
  { topic: 'Operating Systems: Deadlocks', score: 45, date: '2024-03-26', questionsCount: 15 },
  { topic: 'Database Systems: Normalization', score: 88, date: '2024-03-25', questionsCount: 8 },
];

export default function StudentDashboard() {
  const [sessions, setSessions] = useState<StudySession[]>(mockSessions);
  const [totalStudyTime, setTotalStudyTime] = useState(12.5); // Hours

  const avgScore = 76;
  const totalQuizzes = 24;
  const streakDays = 12;
  const reviewsDue = 3;

  const quickActions = [
    { icon: LuBookOpen, title: 'Generate Quiz', desc: 'Paste notes & create MCQs', href: '/student/study', color: 'bg-red-500' },
    { icon: LuTrendingUp, title: 'Analyze Scorecard', desc: 'AI marksheet analysis', href: '/student/scorecard', color: 'bg-orange-500' },
    { icon: LuFileSearch, title: 'Check Resume', desc: 'ATS score your resume', href: '/student/resume', color: 'bg-blue-500' },
    { icon: LuSearch, title: 'Find Gaps', desc: 'Notes vs syllabus mapping', href: '/student/gaps', color: 'bg-purple-500' },
    { icon: LuSwords, title: 'Start Battle', desc: 'Challenge friend to quiz', href: '/student/battle', color: 'bg-pink-500' },
    { icon: LuMic, title: 'Interview Prep', desc: 'Practice with AI agent', href: '/student/interview', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Score', value: `${avgScore}%`, icon: LuTarget, color: 'text-student-accent' },
          { label: 'Quizzes Taken', value: totalQuizzes, icon: LuBookOpen, color: 'text-white' },
          { label: 'Study Streak', value: `${streakDays} Days`, icon: LuFlame, color: 'text-orange-500' },
          { label: 'Hours Studied', value: totalStudyTime, icon: LuClock, color: 'text-blue-400' },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-8 group overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[10px] text-os-muted uppercase tracking-[0.2em] font-black mb-3">
                  {stat.label}
                </p>
                <p className={`text-4xl font-black ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} size={32} />
            </div>
          </div>
        ))}
      </div>

      <div className="ribbon-student" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <LuZap className="text-student-accent" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <div className="glass-card p-6 flex items-center gap-5 group hover:border-student-accent/30">
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                    ${action.color === 'bg-red-500' ? 'bg-red-500/10 border border-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white' : ''}
                    ${action.color === 'bg-orange-500' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' : ''}
                    ${action.color === 'bg-blue-500' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' : ''}
                    ${action.color === 'bg-purple-500' ? 'bg-purple-500/10 border border-purple-500/20 text-purple-500 group-hover:bg-purple-500 group-hover:text-white' : ''}
                    ${action.color === 'bg-pink-500' ? 'bg-pink-500/10 border border-pink-500/20 text-pink-500 group-hover:bg-pink-500 group-hover:text-white' : ''}
                    ${action.color === 'bg-green-500' ? 'bg-green-500/10 border border-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-white' : ''}
                  `}>
                    <action.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-sm mb-1">{action.title}</h3>
                    <p className="text-[10px] text-os-muted uppercase tracking-wider">{action.desc}</p>
                  </div>
                  <LuChevronRight size={18} className="text-os-border group-hover:text-student-accent transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <LuClock className="text-os-muted" /> Recent Sessions
          </h2>
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <div key={i} className="glass-card p-5 flex items-center gap-5 hover:bg-white/[0.02]">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs border
                  ${session.score >= 70 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}
                `}>
                  {session.score}%
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm truncate">{session.topic}</p>
                  <p className="text-[10px] text-os-muted uppercase tracking-widest mt-1">
                    {session.questionsCount} questions · {session.date}
                  </p>
                </div>
              </div>
            ))}
            <Link href="/student/study" className="block text-center p-4 rounded-xl border border-os-border text-[10px] font-black uppercase tracking-widest text-os-muted hover:text-white hover:border-white transition-all">
              View All Sessions
            </Link>
          </div>
        </div>
      </div>

      {/* Study Pulse / Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <LuActivity className="text-student-accent" /> Study Pulse
            </h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-student-accent animate-pulse" />
              <span className="text-[10px] text-os-muted uppercase tracking-widest">Live Activity</span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
              <div
                key={i}
                className="w-full bg-os-border/50 rounded-t-sm group relative"
                style={{ height: `${h}%` }}
              >
                <div
                  className="absolute bottom-0 left-0 w-full bg-student-accent/40 group-hover:bg-student-accent transition-all duration-500 rounded-t-sm"
                  style={{ height: '0%', animation: `riseUp 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s forwards` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-os-border px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes riseUp {
              to { height: 100%; }
            }
          `}</style>
          <div className="flex justify-between mt-4 text-[8px] text-os-muted uppercase tracking-[0.2em] font-black">
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>00:00</span>
          </div>
        </div>

        <div className="glass-card p-8 bg-gradient-to-br from-student-accent/5 to-transparent border-student-accent/20">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-student-accent flex items-center justify-center shadow-student-shadow">
              <LuTrophy size={40} className="text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tighter mb-2">Weekly Top 1%</h3>
              <p className="text-os-muted text-sm max-w-sm leading-relaxed">
                You've outperformed 99% of students this week. Keep up the streak to earn the "Alpha Scholar" badge.
              </p>
            </div>
            <button className="btn-primary-student !py-3 !px-8 !text-xs">
              See Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
