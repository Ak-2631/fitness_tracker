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
    <div className="max-w-6xl mx-auto space-y-24 bg-black min-h-screen">
      
      {/* 01. TRAINING_OS_HEADER */}
      <section>
        <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
           <Activity size={14} /> COMMAND // TRAINING_OS_v4.2
        </div>
        <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-6 italic">
          TRAINING
        </h1>
        <div className="flex items-center gap-3 text-brand">
          <Zap size={24} fill="#D0FF00" />
          <p className="text-2xl font-black italic tracking-tighter uppercase">
            STATUS: READY_FOR_MISSION_EXECUTION
          </p>
        </div>
      </section>

      {/* 02. PRIMARY_SECTOR_LANES */}
      <div className="grid grid-cols-12 gap-12">
        
        {/* SECTOR_01: ACTIVE_ENGAGEMENT */}
        <section 
          onClick={() => window.location.href = '/workouts/active'}
          className="col-span-8 bg-brand cursor-pointer hover:scale-[1.01] transition-all group relative overflow-hidden h-[400px]"
        >
           <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
              <img src="/api/media?path=/Users/koushik/.gemini/antigravity/brain/571ffc4f-81f4-4d6a-a0b0-34ab9d781bfb/tactical_gym_rack_1777197778301.png" alt="Tactical Rack" className="w-full h-full object-cover grayscale brightness-50" />
           </div>
           <div className="relative z-10 p-12 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start text-white">
                 <p className="text-[11px] font-black uppercase tracking-[0.5em] italic opacity-80">SECTOR_01_COMMAND</p>
                 <Play size={32} />
              </div>
              <div>
                 <h2 className="text-2xl lg:text-3xl font-black italic tracking-tighter uppercase text-white leading-tight mb-6 break-words whitespace-normal">
                    START_ACTIVE_SESSION
                 </h2>
                 <div className="flex items-center gap-4 text-white/60 font-black uppercase text-[10px] tracking-widest italic">
                    NEURAL_LINK_STABLE // REAL_TIME_MOTION_CAPTURE // DATA_SYNC_ON
                 </div>
              </div>
           </div>
        </section>

        {/* SECTOR_02: ASSET_MANAGEMENT */}
        <div className="col-span-4 space-y-8">
            <section 
              onClick={() => window.location.href = '/workouts/history'}
              className="bg-white/5 border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all group relative overflow-hidden h-[184px]"
            >
               <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-white/5 to-transparent">
               </div>
               <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">HISTORICAL_LOGS</p>
                     <History className="text-white/20 group-hover:text-brand" size={24} />
                  </div>
                  <div>
                     <h3 className="text-base font-black italic tracking-tighter uppercase text-left text-white mb-2 break-words">SESSION_ARCHIVE</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">REVIEW_PERFORMANCE_GAINS</p>
                  </div>
               </div>
            </section>

            <section 
              onClick={() => window.location.href = '/workouts/routines'}
              className="bg-white/5 border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all group relative overflow-hidden h-[184px]"
            >
               <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-tl from-white/5 to-transparent">
               </div>
               <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">ROUTINE_PROTOCOLS</p>
                     <Layout className="text-white/20 group-hover:text-brand" size={24} />
                  </div>
                  <div>
                     <h3 className="text-sm lg:text-base font-black italic tracking-tighter uppercase text-left text-white mb-2 whitespace-nowrap">TACTICAL_ROUTINES</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">CONFIGURE_PRESET_ENGAGEMENTS</p>
                  </div>
               </div>
            </section>
        </div>
      </div>

      {/* 03. SYSTEM_TELEMETRY_FOOTER */}
      <footer className="pt-24 grid grid-cols-3 gap-16 border-t border-white/5 pb-16">
         {[
           { label: 'AVG_INTENSITY', val: '84%', icon: Target },
           { label: 'VOLUME_YTD', val: '42.8T', icon: Database },
           { label: 'RECOVERY_INDEX', val: 'STABLE', icon: Box }
         ].map(m => (
           <div key={m.label} className="space-y-4">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic flex items-center gap-2">
                 <m.icon size={12} /> {m.label}
              </p>
              <p className="text-5xl font-black italic tracking-tighter text-white">{m.val}</p>
           </div>
         ))}
      </footer>

    </div>
  );
}
