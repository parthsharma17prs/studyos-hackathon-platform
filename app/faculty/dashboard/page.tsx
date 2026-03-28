'use client';

import Ribbon from '@/components/shared/Ribbon';

export default function FacultyDashboard() {
  const stats = [
    { label: 'Total Students', value: '156', icon: '👥' },
    { label: 'Avg Class Score', value: '78%', icon: '📊' },
    { label: 'Pending Assignments', value: '12', icon: '📝' },
    { label: 'Weak Topics', value: '3', icon: '⚠️', color: 'text-status-warn' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 border-faculty-accent/20 hover:border-faculty-accent/50 transition-colors group">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs uppercase font-bold tracking-widest text-os-muted mb-2">{stat.label}</p>
                   <p className={`text-3xl font-black ${stat.color || 'text-white'}`}>{stat.value}</p>
                </div>
                <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
             </div>
          </div>
        ))}
      </div>

      <Ribbon theme="faculty" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-card p-8 border-os-border border-t-faculty-accent border-t-2">
            <h3 className="text-xl font-black mb-6 flex justify-between">
              <span>Class Performance Heatmap</span>
              <span className="text-xs text-faculty-accent font-bold uppercase tracking-widest bg-faculty-accent/10 px-3 py-1 rounded-full">Section A</span>
            </h3>
            
            <div className="space-y-4">
              {[
                 { topic: 'Thermodynamics', score: 45 },
                 { topic: 'Kinematics', score: 62 },
                 { topic: 'Optics', score: 85 },
                 { topic: 'Electromagnetism', score: 91 },
              ].map((t, i) => (
                 <div key={i} className="bg-os-card p-4 mx-[-1rem] border-l-4 border-l-transparent hover:bg-black transition-colors" style={{ borderLeftColor: t.score < 50 ? '#FF3344' : t.score < 70 ? '#FFB800' : '#00FF88' }}>
                    <div className="flex justify-between items-center px-4">
                        <span className="text-sm font-bold">{t.topic}</span>
                        <span className={`font-black text-sm ${t.score < 50 ? 'text-status-bad' : t.score < 70 ? 'text-status-warn' : 'text-status-good'}`}>{t.score}% Avg</span>
                    </div>
                 </div>
              ))}
            </div>
            {/* Action item block */}
            <div className="mt-6 bg-status-warn/10 border border-status-warn/20 p-4 rounded-xl flex items-start gap-4">
               <span>⚠️</span>
               <div>
                  <h4 className="text-status-warn font-bold text-sm">AI Recommendation</h4>
                  <p className="text-xs text-os-muted mt-1 leading-relaxed">Thermodynamics average is extremely low (45%). The AI suggests running a 15-minute quick review quiz focusing on the First Law next class.</p>
                  <button className="text-xs mt-2 underline text-white hover:text-faculty-accent">Generate targeted quiz for next class →</button>
               </div>
            </div>
         </div>

         <div className="glass-card p-8">
            <h3 className="text-xl font-black mb-6 tracking-tight">Recent Assignments</h3>
            <div className="space-y-4">
               <div className="bg-os-card p-4 rounded-xl border border-os-border hover:border-faculty-accent/50 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-sm">Physics Mid-Term Mock</span>
                     <span className="text-xs uppercase tracking-widest text-status-good border border-status-good/30 bg-status-good/10 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <p className="text-xs text-os-muted">145 / 156 Submitted</p>
               </div>
               
               <div className="bg-os-card p-4 rounded-xl border border-os-border hover:border-faculty-accent/50 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-sm">Weekly Quiz 4 - Optics</span>
                     <span className="text-xs uppercase tracking-widest text-os-muted border border-os-border px-2 py-0.5 rounded">Closed</span>
                  </div>
                  <p className="text-xs text-os-muted">Auto-graded · Avg: 85%</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
