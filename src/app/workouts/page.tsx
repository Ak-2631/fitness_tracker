'use client';

import { 
  Play, 
  History, 
  Layout, 
  Activity, 
  Zap, 
  Target,
  Database,
  Box
} from 'lucide-react';

export default function TrainingLandingPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      
      {/* Top Banner Area */}
      <section className="glass-card flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#9b5de5] uppercase tracking-[0.3em] mb-2">
            <Activity size={14} /> COMMAND // TRAINING_OS_v4.2
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            TRAINING
          </h1>
          <p className="text-[14px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">
            STATUS: <span className="text-[#9b5de5]">READY FOR MISSION EXECUTION</span>
          </p>
        </div>
      </section>

      {/* Primary Sectors */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Active Engagement Card */}
        <section 
          onClick={() => window.location.href = '/workouts/active'}
          className="col-span-8 glass-card p-0 overflow-hidden relative min-h-[400px] flex flex-col justify-end border border-[#1a1e2b] cursor-pointer group"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
           <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop" alt="Tactical Rack" className="w-full h-full object-cover grayscale brightness-50" />
           </div>
           
           <div className="absolute top-8 left-8 right-8 flex justify-between items-start text-white z-20">
              <p className="text-[11px] font-bold text-[#9b5de5] uppercase tracking-[0.5em]">SECTOR_01_COMMAND</p>
              <Play size={32} className="text-[#9b5de5] drop-shadow-[0_0_15px_rgba(217,166,255,0.8)]" />
           </div>

           <div className="relative z-20 p-8 space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-[#9b5de5] transition-colors" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                 START ACTIVE SESSION
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">
                 NEURAL_LINK_STABLE // REAL_TIME_MOTION_CAPTURE // DATA_SYNC_ON
              </div>
           </div>
        </section>

        {/* Right Asset Management */}
        <div className="col-span-4 flex flex-col gap-6">
            <section 
              onClick={() => window.location.href = '/workouts/history'}
              className="glass-card flex-1 flex flex-col justify-between cursor-pointer hover:border-[#9b5de5] transition-all group"
            >
               <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.4em]">HISTORICAL LOGS</p>
                  <History className="text-[#a0a5b5] group-hover:text-[#9b5de5] transition-colors" size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>SESSION ARCHIVE</h3>
                  <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">REVIEW PERFORMANCE GAINS</p>
               </div>
            </section>

            <section 
              onClick={() => window.location.href = '/workouts/routines'}
              className="glass-card flex-1 flex flex-col justify-between cursor-pointer hover:border-[#9b5de5] transition-all group"
            >
               <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.4em]">ROUTINE PROTOCOLS</p>
                  <Layout className="text-[#a0a5b5] group-hover:text-[#9b5de5] transition-colors" size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>TACTICAL ROUTINES</h3>
                  <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">CONFIGURE PRESET ENGAGEMENTS</p>
               </div>
            </section>
        </div>
      </div>

      {/* Footer Telemetry Grid */}
      <footer className="grid grid-cols-3 gap-6">
         {[
           { label: 'AVG INTENSITY', val: '84%', icon: Target },
           { label: 'VOLUME YTD', val: '42.8T', icon: Database },
           { label: 'RECOVERY INDEX', val: 'STABLE', icon: Box, valColor: 'text-[#9b5de5]' }
         ].map(m => (
           <div key={m.label} className="glass-card flex flex-col items-center text-center">
              <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-2">
                 <m.icon size={16} /> {m.label}
              </p>
              <p className={`text-4xl font-black tracking-tighter ${m.valColor || 'text-white'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>{m.val}</p>
           </div>
         ))}
      </footer>

    </div>
  );
}
