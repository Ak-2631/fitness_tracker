'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Key, Mail, ChevronRight, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import InputField from '@/components/ui/InputField';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        setError('Invalid credentials. Operational access denied.');
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Connection failure. Verify system uplink.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in flex flex-col justify-center items-center min-h-screen py-12 px-4">
      <GlassCard padding="lg" className="w-full max-w-[440px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_15px_rgba(208,255,0,0.5)]" />
        
        <div className="p-12 space-y-6 text-center">
          <div className="w-20 h-20 bg-brand/10 rounded-none flex items-center justify-center mx-auto mb-6 border border-brand/20 group hover:scale-110 transition-transform duration-500">
            <LogIn size={40} className="text-brand" />
          </div>
          <div className="text-[10px] font-black text-white/40 mb-2 uppercase tracking-[0.3em]">OPERATIONAL GATE</div>
          <h2 className="text-3xl font-black uppercase italic tracking-widest">SYSTEM ACCESS</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold mb-8 flex items-center gap-3 animate-shake">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-6)]">
          <InputField 
            label="CLASSIFICATION ID (EMAIL)" 
            type="email" 
            placeholder="authorized@system.core"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} />}
          />

          <InputField 
            label="PASSCODE" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Key size={18} />}
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full h-14 mt-4 text-lg group" 
            disabled={loading}
            isLoading={loading}
          >
            INITIALIZE SESSION
            {!loading && <ChevronRight size={22} className="ml-1 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <div className="text-center mt-10 p-6 bg-white/[0.02] -mx-8 -mb-8 border-t border-white/5">
          <span className="text-sm text-white/40">No operational credentials? </span>
          <Link href="/signup" className="text-sm font-black text-brand hover:text-white transition-colors uppercase tracking-widest ml-1">
            Request Entry
          </Link>
        </div>
      </GlassCard>
      
      <div className="mt-12 text-[10px] font-black text-white/40 uppercase tracking-[0.5em] pointer-events-none select-none">
        ENCRYPTED UPLINK SECURE
      </div>
    </div>
  );
}
