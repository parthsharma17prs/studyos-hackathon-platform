'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuZap, LuLock, LuMail, LuUser, LuArrowRight } from 'react-icons/lu';

/**
 * Auth Page — Student-only login
 * Premium luxury minimalist design
 */
export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    // Mock login for demo
    setTimeout(() => {
      const mockUser = { name: 'Demo Student', email: email, role: 'student' };
      localStorage.setItem('studyos_user', JSON.stringify(mockUser));
      localStorage.setItem('studyos_role', 'student');
      router.push('/student/dashboard');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-lg glass-card p-12 md:p-16 relative z-10 animate-fade-up">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.4)] mb-8">
            <span className="text-white font-black text-3xl">S</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">
            Study<span className="text-student-accent">OS</span>
          </h1>
          <p className="text-os-muted text-xs uppercase tracking-[0.2em] font-bold">The Complete AI Student Platform</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-os-muted group-focus-within:text-student-accent transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-os-border focus:border-student-accent rounded-xl p-4 pl-12 text-white outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 text-os-muted group-focus-within:text-student-accent transition-colors" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-os-border focus:border-student-accent rounded-xl p-4 pl-12 text-white outline-none transition-all"
              />
            </div>
          </div>

          {errorMsg && <p className="text-red-500 text-center text-xs font-bold uppercase tracking-widest">{errorMsg}</p>}

          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full btn-primary-student group flex items-center justify-center gap-3 py-5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignup ? 'Create Account' : 'Secure Student Login'}
                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-os-muted hover:text-white transition-all"
          >
            {isSignup ? "Already have a session? Log in." : "New user? Initialize Session."}
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-os-border text-center">
          <p className="text-[9px] text-os-muted uppercase tracking-[0.3em] font-bold leading-relaxed">
            Saarthi-AI Integrated <br /> JWT Session Management v1.0.4
          </p>
        </div>
      </div>
    </main>
  );
}
