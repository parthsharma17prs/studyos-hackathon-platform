'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Ribbon from '@/components/shared/Ribbon';

/**
 * Student Dashboard — Home screen
 * Shows quick stats, recent activity, due reviews, and quick actions
 */

interface StudySession {
  topic: string;
  score: number;
  date: string;
  questionsCount: number;
}

export default function StudentDashboard() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [dueReviews, setDueReviews] = useState<string[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const stored = localStorage.getItem('studyos_sessions');
    if (stored) setSessions(JSON.parse(stored));

    const reviews = localStorage.getItem('studyos_spaced_repetition');
    if (reviews) {
      const parsed = JSON.parse(reviews);
      const today = new Date().toISOString().split('T')[0];
      const due = Object.entries(parsed)
        .filter(([_, data]: [string, any]) => data.nextReview <= today)
        .map(([topic]: [string, any]) => topic);
      setDueReviews(due);
    }

    const time = localStorage.getItem('studyos_total_time');
    if (time) setTotalStudyTime(parseInt(time));
  }, []);

  // Calculate stats
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
    : 0;
  const totalQuizzes = sessions.length;
  const streakDays = Math.min(sessions.length, 7); // Simplified streak

  const quickActions = [
    { icon: '📝', title: 'Generate Quiz', desc: 'Paste notes & create instant MCQs', href: '/student/study', color: 'from-red-600/20' },
    { icon: '📊', title: 'Analyze Scorecard', desc: 'Upload marksheet for AI analysis', href: '/student/scorecard', color: 'from-orange-600/20' },
    { icon: '📄', title: 'Check Resume', desc: 'ATS score your resume', href: '/student/resume', color: 'from-blue-600/20' },
    { icon: '🔍', title: 'Find Gaps', desc: 'Compare notes vs syllabus', href: '/student/gaps', color: 'from-purple-600/20' },
    { icon: '⚔️', title: 'Start Battle', desc: 'Challenge a friend to quiz battle', href: '/student/battle', color: 'from-pink-600/20' },
    { icon: '🎤', title: 'Interview Prep', desc: 'Practice with AI interviewer', href: '/student/interview', color: 'from-green-600/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Average Score', value: `${avgScore}%`, icon: '🎯', highlight: avgScore > 70 },
          { label: 'Quizzes Taken', value: totalQuizzes.toString(), icon: '📝', highlight: false },
          { label: 'Study Streak', value: `${streakDays} days`, icon: '🔥', highlight: streakDays > 3 },
          { label: 'Reviews Due', value: dueReviews.length.toString(), icon: '📅', highlight: dueReviews.length > 0 },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-6 hover:border-student-accent/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-os-muted uppercase tracking-wider font-semibold mb-2">
                  {stat.label}
                </p>
                <p className={`text-3xl font-black ${stat.highlight ? 'text-student-accent' : 'text-white'}`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <Ribbon theme="student" />

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-2xl font-black mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href}>
              <div className={`
                glass-card p-6 cursor-pointer group hover:border-student-accent/30
                transition-all duration-300 hover:-translate-y-1
              `}>
                <div className="flex items-start gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} to-transparent
                    flex items-center justify-center text-2xl
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-os-muted">{action.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-os-muted group-hover:text-student-accent transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Due Reviews */}
      {dueReviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-black mb-6 tracking-tight">
            <span className="text-student-accent">{dueReviews.length}</span> Topics Due for Review
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueReviews.map((topic, i) => (
              <Link key={i} href={`/student/study?topic=${encodeURIComponent(topic)}`}>
                <div className="glass-card p-4 flex items-center gap-3 hover:border-student-accent/30 transition-all cursor-pointer group">
                  <div className="w-2 h-2 rounded-full bg-student-accent animate-pulse" />
                  <span className="text-sm font-semibold flex-1">{topic}</span>
                  <span className="text-xs text-os-muted group-hover:text-student-accent transition-colors">
                    Review now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div>
        <h2 className="text-2xl font-black mb-6 tracking-tight">Recent Sessions</h2>
        {sessions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">No sessions yet</h3>
            <p className="text-os-muted text-sm mb-6">
              Start by generating a quiz from your study notes.
            </p>
            <Link href="/student/study">
              <button className="btn-primary-student">
                Generate Your First Quiz →
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(-5).reverse().map((session, i) => (
              <div key={i} className="glass-card p-4 flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg
                  ${session.score >= 70 ? 'bg-student-accent/20 text-student-accent' : 'bg-os-border text-os-muted'}
                `}>
                  {session.score}%
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{session.topic}</p>
                  <p className="text-xs text-os-muted">
                    {session.questionsCount} questions · {session.date}
                  </p>
                </div>
                <div className="progress-bar w-24">
                  <div
                    className={session.score >= 70 ? 'progress-fill-red' : 'progress-fill-green'}
                    style={{ width: `${session.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
