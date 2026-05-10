'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ShieldCheck, Mail, Lock, User, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import InputField from '@/components/ui/InputField';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'REGISTRATION_ERROR: REJECTED_BY_SYSTEM');
      }

      // Automatically sign in upon successful registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError('REGISTRATION_COMPLETE: AUTO_LOGIN_FAILURE');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in flex flex-col justify-center items-center min-h-[90vh] py-12">
      <GlassCard padding="lg" className="w-full max-w-[500px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_15px_rgba(208,255,0,0.5)]" />
        
        <div className="p-12 space-y-10">
          <div className="w-20 h-20 bg-brand/10 rounded-none flex items-center justify-center mx-auto mb-6 border border-brand/20 group hover:scale-110 transition-transform duration-500">
            <ShieldCheck size={40} className="text-brand" />
          </div>
          <div className="text-[var(--font-label)] font-black text-white/30 mb-2 uppercase tracking-[0.3em]">Operator_Provisioning</div>
          <h2 className="text-[var(--font-h2)] font-black">New Subject Entry</h2>
          <p className="text-sm text-white/40 mt-1 font-mono italic">INITIALIZE_OPERATOR_CREDENTIALS</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold mb-8 flex items-center gap-3 animate-shake">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-6)]">
          <InputField 
            label="DESIGNATION_NAME" 
            type="text" 
            placeholder="Operator Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={<User size={18} />}
          />

          <InputField 
            label="CLASSIFICATION_ID (EMAIL)" 
            type="email" 
            placeholder="operator@discipline.engine"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} />}
          />

          <InputField 
            label="SECURITY_TOKEN (PASSWORD)" 
            type="password" 
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            icon={<Lock size={18} />}
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full h-14 mt-4 text-lg group" 
            disabled={loading}
            isLoading={loading}
          >
            REGISTER_PROTOCOL
            {!loading && <ChevronRight size={22} className="ml-1 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <div className="text-center mt-10 p-6 bg-white/[0.02] -mx-8 -mb-8 border-t border-white/5">
          <span className="text-sm text-white/40">Operator active? </span>
          <Link href="/login" className="text-sm font-black text-brand hover:text-white transition-colors uppercase tracking-widest ml-1">
            Authenticate Session
          </Link>
        </div>
      </GlassCard>
      
      <div className="mt-8 text-[10px] font-black text-white/10 uppercase tracking-[0.5em] pointer-events-none select-none">
        ENCRYPTED_UPLINK_SECURE
      </div>
    </div>
  );
}
