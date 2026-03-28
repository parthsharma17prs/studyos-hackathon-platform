'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Auth Page — Role selection + Google OAuth
 * Split layout: left (brand visuals) + right (auth form)
 */
function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-select role if coming from landing page CTA
  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'student' || role === 'faculty') {
      setSelectedRole(role);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    if (!selectedRole || !email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      // Saarthi-AI style session management
      localStorage.setItem('studyos_role', data.user.role);
      localStorage.setItem('studyos_user', JSON.stringify(data.user));

      router.push(`/${data.user.role}/dashboard`);
    } catch (e: any) {
      setErrorMsg(e.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex">
      {/* Left — Brand Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px]" />

        {/* Animated ribbons background */}
        <div className="absolute inset-0 flex flex-col justify-center gap-16 px-12 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="ribbon-student rounded-full opacity-30"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>

        {/* Brand content */}
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <span className="text-white font-black text-3xl">S</span>
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            Study<span className="text-student-accent">OS</span>
          </h1>
          <p className="text-os-muted text-lg max-w-sm mx-auto">
            The AI that knows your strengths, finds your gaps, and calls you when you need it.
          </p>
        </div>
      </div>

      {/* Right — Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black tracking-tight">
              Study<span className="text-student-accent">OS</span>
            </span>
          </div>

          <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome</h2>
          <p className="text-os-muted mb-10">Choose your role to get started.</p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Student card */}
            <button
              onClick={() => setSelectedRole('student')}
              className={`
                p-6 rounded-2xl border-2 transition-all duration-300 text-left
                ${selectedRole === 'student'
                  ? 'border-student-accent bg-student-accent/10 glow-red'
                  : 'border-os-border bg-os-card hover:border-os-muted'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-4
                ${selectedRole === 'student' ? 'bg-student-accent' : 'bg-os-border'}
              `}>
                <span className={`font-black text-lg ${selectedRole === 'student' ? 'text-white' : 'text-os-muted'}`}>
                  S
                </span>
              </div>
              <div className="font-black text-lg mb-1">Student</div>
              <div className="text-xs text-os-muted">
                Quiz, scorecard, resume, battle mode & more
              </div>
              {selectedRole === 'student' && (
                <div className="ribbon-student rounded-full mt-4" />
              )}
            </button>

            {/* Faculty card */}
            <button
              onClick={() => setSelectedRole('faculty')}
              className={`
                p-6 rounded-2xl border-2 transition-all duration-300 text-left
                ${selectedRole === 'faculty'
                  ? 'border-faculty-accent bg-faculty-accent/10 glow-gold'
                  : 'border-os-border bg-os-card hover:border-os-muted'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-4
                ${selectedRole === 'faculty' ? 'bg-faculty-accent' : 'bg-os-border'}
              `}>
                <span className={`font-black text-lg ${selectedRole === 'faculty' ? 'text-black' : 'text-os-muted'}`}>
                  F
                </span>
              </div>
              <div className="font-black text-lg mb-1">Faculty</div>
              <div className="text-xs text-os-muted">
                Assignments, analytics, notices & batch tools
              </div>
              {selectedRole === 'faculty' && (
                <div className="ribbon-faculty rounded-full mt-4" />
              )}
            </button>
          </div>

          {/* Email / Password Form (Saarthi-AI Session Integration) */}
          <div className="space-y-4 mb-6 transition-all">
             <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-os-card border border-os-border focus:border-student-accent rounded-xl p-4 text-white outline-none" />
             <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-os-card border border-os-border focus:border-student-accent rounded-xl p-4 text-white outline-none" />
             {errorMsg && <p className="text-status-bad text-xs">{errorMsg}</p>}
          </div>

          {/* Action Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedRole || isLoading || !email || !password}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-lg uppercase tracking-wider
              flex items-center justify-center gap-3 transition-all duration-300
              ${selectedRole
                ? selectedRole === 'student'
                  ? 'bg-white text-black hover:bg-student-accent hover:text-white'
                  : 'bg-faculty-accent text-black hover:bg-faculty-hover'
                : 'bg-os-border text-os-muted cursor-not-allowed'
              }
              ${isLoading ? 'opacity-60 cursor-wait' : ''}
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{isSignup ? 'Create Session Account' : 'Secure JWT Login'}</>
            )}
          </button>
          
          <button onClick={() => setIsSignup(!isSignup)} className="w-full text-center text-xs text-os-muted mt-4 hover:text-white transition-colors">
            {isSignup ? "Already have an account? Log in." : "New user? Create an account."}
          </button>

          {/* Terms */}
          <p className="text-center text-os-muted/60 text-xs mt-6">
            Saarthi-AI Integrated JWT Session Management.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-student-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
