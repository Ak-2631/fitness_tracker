'use client';

import Link from 'next/link';
import { 
  Zap, 
  Activity, 
  Database, 
  Target, 
  ChevronRight, 
  ActivitySquare,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand selection:text-black overflow-hidden relative font-sans">
      
      {/* 01. AMBIENT_SHARP_GRID */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-12 pt-32 pb-64 min-h-screen flex flex-col justify-between">
        
        {/* TOP_STATUS_HUD */}
        <div className="flex justify-between items-start mb-32">
          <div className="space-y-4">
             <div className="flex items-center gap-4 text-brand font-black uppercase text-[10px] tracking-[0.4em] italic animate-pulse">
                <Activity size={14} /> SYSTEM_ONLINE // KINETIC_OS_v4.5
             </div>
             <div className="px-4 py-2 border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                AUTH_REQ: ELITE_LEVEL_ACCESS_ONLY
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">LATENCY: 1.4ms</p>
             <p className="text-[10px] font-black text-brand uppercase tracking-widest">ENCRYPTION: AES_256_ACTIVE</p>
          </div>
        </div>

        {/* HERO_COMMAND */}
        <section className="space-y-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[64px] md:text-[96px] font-black tracking-tighter uppercase leading-[0.75] mb-4 italic">
              KINETIC
            </h1>
            <h1 className="text-[64px] md:text-[96px] font-black tracking-tighter uppercase leading-[0.75] text-brand italic">
              PERFORMANCE
            </h1>
          </motion.div>
          
          <div className="grid grid-cols-12 gap-12 max-w-5xl">
            <div className="col-span-12 md:col-span-8">
              <p className="text-3xl font-black italic tracking-tighter uppercase text-white/60 leading-tight">
                THE MISSION_CRITICAL OPERATING SYSTEM FOR <span className="text-white">ULTRA-HIGH_VELOCITY</span> HUMAN PERFORMANCE.
              </p>
            </div>
            <div className="hidden md:block md:col-span-4 flex items-end">
               <div className="w-full border-b-4 border-brand pb-2">
                  <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">AUTHORIZED_BY: TACTICAL_COMMAND</p>
               </div>
            </div>
          </div>
        </section>

        {/* ACTION_TERMINAL */}
        <section className="pt-24 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <Link href="/dashboard" className="group">
             <div className="bg-brand text-black p-10 flex justify-between items-center group-hover:scale-[1.02] transition-all cursor-pointer rounded-none">
                <div className="space-y-1">
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter">LAUNCH_MISSION</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">GOTO_DASHBOARD_TERMINAL</p>
                </div>
                <ChevronRight size={48} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
             </div>
          </Link>

          <Link href="/signup" className="group">
             <div className="border border-white/10 p-10 flex justify-between items-center group-hover:bg-white/5 transition-all cursor-pointer rounded-none relative">
                <div className="space-y-1 text-white">
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter">ENLIST_NOW</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/30">REGISTER_NEURAL_RECORDS</p>
                </div>
                <ShieldCheck size={48} strokeWidth={1} className="text-white/20 group-hover:text-brand" />
             </div>
          </Link>
        </section>

        {/* FOOTER_TELEMETRY */}
        <section className="absolute bottom-16 left-12 right-12 flex flex-col md:flex-row justify-between items-end border-t border-white/5 pt-16 gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 flex-1 w-full">
             {[
               { label: 'FUEL_ENGINE', val: 'OPTIMIZED', icon: Database },
               { label: 'WKT_LOAD', val: 'CRITICAL', icon: ActivitySquare },
               { label: 'SYNC_STATUS', val: 'LOCKED', icon: Maximize2 }
             ].map(t => (
               <div key={t.label} className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                     <t.icon size={12} /> {t.label}
                  </div>
                  <div className="text-2xl font-black italic uppercase tracking-tighter text-white">{t.val}</div>
               </div>
             ))}
          </div>
          <div className="text-right w-full md:w-auto">
             <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic shrink-0">BUILD_v4.51_STABLE // NO_SOFT_ARTIFACTS</p>
          </div>
        </section>

      </main>

    </div>
  );
}
