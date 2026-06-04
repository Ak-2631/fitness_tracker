'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Key, Mail, ChevronRight, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('ACCESS DENIED: INVALID CREDENTIALS');
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('UPLINK FAILURE: SYSTEM DISCONNECTED');
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen py-12 px-4 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
      
      <div className="w-full max-w-[480px] relative z-10 glass-card p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-[#1a1e2b]">
        {/* Top Scanner Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#9b5de5] shadow-[0_0_15px_rgba(217,166,255,0.8)] animate-pulse" />
        
        <div className="p-12 space-y-8 text-center bg-gradient-to-b from-[#111520] to-[#0e111a]">
          <div className="mx-auto mb-6 flex justify-center">
            <Shield size={64} className="text-[#9b5de5] drop-shadow-[0_0_15px_rgba(217,166,255,0.4)]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#a0a5b5] mb-2 uppercase tracking-[0.3em]">SECURE TERMINAL</div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>SYSTEM ACCESS</h2>
          </div>
        </div>

        <div className="px-12 pb-12 bg-[#0e111a]">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-500 text-xs font-bold mb-8 flex items-center gap-3">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} /> CLASSIFICATION ID
              </label>
              <input 
                type="email" 
                placeholder="operator@apex.tactical"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111520] border border-[#1a1e2b] text-white px-4 py-4 focus:outline-none focus:border-[#9b5de5] focus:ring-1 focus:ring-[#9b5de5]/50 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest flex items-center gap-2">
                <Key size={14} /> SECURITY CLEARANCE
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#111520] border border-[#1a1e2b] text-white px-4 py-4 pr-12 focus:outline-none focus:border-[#9b5de5] focus:ring-1 focus:ring-[#9b5de5]/50 transition-all font-mono text-sm tracking-widest"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a5b5] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#9b5de5] hover:bg-[#f3a6ff] text-[#0B0F19] font-black uppercase tracking-widest py-4 rounded-sm transition-all shadow-[0_0_15px_rgba(217,166,255,0.3)] hover:shadow-[0_0_25px_rgba(217,166,255,0.5)] transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? 'VERIFYING...' : 'LOGIN'}
              {!loading && <ChevronRight size={20} />}
            </button>
          </form>

          <div className="text-center mt-10 pt-6 border-t border-[#1a1e2b]">
            <span className="text-xs text-[#a0a5b5] uppercase tracking-wider">NO ACCOUNT? </span>
            <Link href="/signup" className="text-xs font-bold text-[#9b5de5] hover:text-white transition-colors uppercase tracking-widest ml-2 border-b border-[#9b5de5]/30 pb-0.5 hover:border-white">
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.5em] pointer-events-none select-none flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#9b5de5] animate-pulse"></div>
        ENCRYPTED CONNECTION SECURE
      </div>
    </div>
  );
}
