import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, signUp } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  const result = tab === 'login' ? await login(username, password) : await signUp(username, email || undefined, password);
    if (!result.success) setError(result.error || 'Something went wrong');
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen bg-[#0a0a0a] overflow-hidden font-inter">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-[#0d0d10] border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(36,196,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.08),transparent_50%)]" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-400/10 border border-sky-400/30 rounded-xl flex items-center justify-center">
            <img
              src="https://c.animaapp.com/mmuuezyrLXbx4q/img/uploaded-asset-1773842433902-0.png"
              alt="Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Bloxify Services</span>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-400/10 border border-sky-400/20 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
            <span className="text-sky-400 text-xs font-medium">Discord Tools & Services</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your tools,
            <br />
            <span className="text-sky-400">one place.</span>
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed max-w-sm">
            Manage your Discord tools, redeem product keys, and access your purchased software — all from one dashboard.
          </p>
          <div className="flex flex-wrap gap-2 mt-8">
            {['Key Redemption', 'Instant Downloads', 'Rebrand Tools', 'Admin Panel'].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-neutral-300 text-xs"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-neutral-600 text-xs">© 2026 Bloxify Services. All rights reserved.</p>
      </div>

      {/* Right auth panel */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(36,196,255,0.07),transparent_60%)]" />

        <div className="relative w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-sky-400/10 border border-sky-400/30 rounded-xl flex items-center justify-center">
              <img
                src="https://c.animaapp.com/mmuuezyrLXbx4q/img/uploaded-asset-1773842433902-0.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-white font-semibold tracking-tight">Bloxify Services</span>
          </div>

          <div className="w-14 h-14 bg-sky-400/10 border border-sky-400/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <img
              src="https://c.animaapp.com/mmuuezyrLXbx4q/img/uploaded-asset-1773842433902-0.png"
              alt="Logo"
              className="w-9 h-9 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-neutral-500 text-sm text-center mb-6">
            {tab === 'login' ? 'Sign in to your Bloxify Services account' : 'Sign up to access your dashboard'}
          </p>

          {/* Tabs */}
          <div className="flex bg-white/[0.05] border border-white/[0.08] rounded-xl p-1 mb-6">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError('');
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  tab === t ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-neutral-400 text-xs font-medium mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="e.g. cooluser123"
                autoComplete="username"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-700 outline-none focus:border-sky-500/50 focus:bg-sky-500/[0.03] transition-all"
              />
            </div>

            {tab === 'signup' && (
              <div>
                <label className="block text-neutral-400 text-xs font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-700 outline-none focus:border-sky-500/50 focus:bg-sky-500/[0.03] transition-all mb-3"
                />
              </div>
            )}

            <div>
              <label className="block text-neutral-400 text-xs font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-neutral-700 outline-none focus:border-sky-500/50 focus:bg-sky-500/[0.03] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading || !username.trim() || !password || (tab === 'signup' && !email.trim())
              }
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-sky-500/20 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : tab === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {tab === 'login' && (
            <p className="text-neutral-600 text-xs text-center mt-5">
              Protected by 8-Bit Security <span className="text-neutral-400 font-mono"></span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
