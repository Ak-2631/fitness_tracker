'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Trophy, 
  CheckCircle2,
  X,
  Target,
  Flame,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Analytics } from '@/lib/analytics';

export default function ExecutionModePage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [currentSet] = useState({ number: 3, total: 4, targetReps: 10, targetWeight: 100 });
  const [exerciseName] = useState('BARBELL SQUAT');

  const handleComplete = async () => {
    await Analytics.track({ 
      name: 'Set_Completed_In_HUD', 
      properties: { exercise: exerciseName, set: currentSet.number, reps: currentSet.targetReps } 
    });
    router.back();
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans overflow-hidden">
      
      {/* 01. HUD_TOP_BAR_COMMAND */}
      <div className="flex justify-between items-center px-16 py-10 border-b border-white/5 bg-black">
        <div className="flex items-center gap-6">
          <div className="w-1.5 h-1.5 bg-brand animate-pulse" />
          <p className="text-[11px] font-black text-brand tracking-[0.5em] uppercase italic">EXECUTION_MODE_STITCH_v4.2</p>
        </div>
        
        <div className="flex items-center gap-12">
           <div className="flex items-center gap-4">
              <div className="flex gap-2">
                 {[1,1,1,1,0,0].map((b, i) => (
                   <div key={i} className={`w-3 h-5 ${b ? 'bg-brand' : 'bg-white/5'}`} />
                 ))}
              </div>
              <p className="text-[11px] font-black text-white/30 tracking-[0.2em] uppercase italic">INTENSITY_PROFILE</p>
           </div>
           <button 
             onClick={() => router.back()}
             className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-black transition-all"
           >
             <X size={24} />
           </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative px-16">
        
        {/* HUD_BACKGROUND_TELEMETRY */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center">
           <p className="text-[40vw] font-black italic tracking-tighter uppercase whitespace-nowrap">KINETIC_OS</p>
        </div>

        <div className="w-full max-w-[1400px] grid grid-cols-12 gap-24 items-center relative z-10">
          
          {/* PERF_GAUGE_LANE */}
          <div className="col-span-3 space-y-12">
             <motion.div 
               initial={{ x: -60, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="bg-white/5 p-12 border-l-4 border-l-brand"
             >
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 bg-brand flex items-center justify-center">
                     <Trophy size={32} className="text-black" />
                   </div>
                   <h4 className="text-[11px] font-black text-white/40 tracking-[0.3em] uppercase">SYSTEM_XP</h4>
                </div>
                <p className="text-8xl font-black italic text-white tracking-tighter leading-none">450</p>
                <p className="text-[11px] font-black text-brand tracking-[0.2em] uppercase mt-6 italic">EXECUTION_BONUS_ACTIVE</p>
             </motion.div>

             <motion.div 
               initial={{ x: -60, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.1 }}
               className="bg-red-500/5 p-10 border border-red-500/20"
             >
                <div className="flex items-center gap-6">
                   <Flame size={24} className="text-red-500" />
                   <div>
                      <p className="text-[11px] font-black text-red-500 tracking-widest uppercase italic">STREAK_AT_RISK</p>
                      <p className="text-2xl font-black italic uppercase text-white mt-1">FAILURE = -12 DAYS</p>
                   </div>
                </div>
             </motion.div>
          </div>

          {/* CENTRAL_FOCUS_PROTOCOL */}
          <div className="col-span-6 flex flex-col items-center">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="flex flex-col items-center"
             >
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-2 h-2 bg-brand animate-ping" />
                   <h2 className="text-5xl font-black italic tracking-tighter text-brand uppercase">{exerciseName}</h2>
                </div>
                
                <div className="text-center relative">
                   <p className="text-[180px] font-black italic tabular-nums leading-none tracking-tighter text-white">
                      {formatTime(seconds)}
                   </p>
                   <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-8 h-1 bg-white/10" />
                      ))}
                   </div>
                   <p className="text-[14px] font-black text-brand tracking-[1em] uppercase mt-6 opacity-60 italic">ELAPSED_SECONDS</p>
                </div>

                <div className="mt-20 flex gap-8">
                   <button 
                     onClick={() => setIsActive(!isActive)}
                     className="px-16 py-8 bg-white/5 border border-white/10 text-white font-black italic tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-6 text-xl"
                   >
                     {isActive ? (
                       <><Activity size={24} className="text-brand" /> PAUSE_COMMAND</>
                     ) : (
                       <><Zap size={24} className="text-brand" /> RESUME_COMMAND</>
                     )}
                   </button>
                </div>
             </motion.div>
          </div>

          {/* OUTPUT_LOG_LANE */}
          <div className="col-span-3 space-y-12">
             <motion.div 
               initial={{ x: 60, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="bg-white/5 p-12 border-r-4 border-r-brand"
             >
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                   <h4 className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase italic">SET_LOG</h4>
                   <span className="text-2xl font-black text-brand italic">0{currentSet.number}/0{currentSet.total}</span>
                </div>
                
                <div className="space-y-10">
                   <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">TARGET_LOAD</p>
                      <p className="text-6xl font-black italic text-white tracking-tighter underline decoration-brand/50 decoration-4">{currentSet.targetWeight}KG</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">OUTPUT_REPS</p>
                      <p className="text-6xl font-black italic text-white tracking-tighter underline decoration-brand/50 decoration-4">{currentSet.targetReps}</p>
                   </div>
                </div>

                <button 
                  onClick={handleComplete}
                  className="w-full mt-12 py-8 bg-brand text-black font-black italic uppercase tracking-widest text-xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(208,255,0,0.2)]"
                >
                   LOG_EXECUTION <CheckCircle2 size={24} />
                </button>
             </motion.div>

             <motion.div 
               initial={{ x: 60, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.1 }}
               className="bg-white/5 p-10 border border-white/5"
             >
                <div className="flex items-center gap-4 mb-6">
                   <ShieldAlert size={18} className="text-brand" />
                   <h4 className="text-[11px] font-black text-white/40 tracking-[0.2em] uppercase italic">BIOMETRIC_CHECK</h4>
                </div>
                <div className="space-y-5">
                   {['NEURAL_FOCUS_LOCK', 'CORE_REINFORCED', 'DRIVE_HIPS_BACK'].map((check, i) => (
                     <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-5 h-5 border border-brand/30 flex items-center justify-center group-hover:bg-brand/20 transition-all">
                           <div className="w-2 h-2 bg-brand" />
                        </div>
                        <span className="text-[12px] font-black italic uppercase tracking-tighter text-white opacity-40 group-hover:opacity-100 transition-opacity">{check}</span>
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>

        </div>
      </main>

      {/* FOOTER_TELEMETRY_DASHBOARD */}
      <div className="px-16 py-12 grid grid-cols-4 gap-16 border-t border-white/10 bg-black">
         {[
           { label: 'HEART_RATE_BPM', val: '142', trend: '+4%_VIBE', icon: Activity },
           { label: 'SESSION_VOLUME', val: '4,280KG', trend: 'OPTIMA_STABLE', icon: Target },
           { label: 'CNS_FATIGUE', val: 'LOW', trend: 'RECOVERY_SYNCED', icon: Zap },
           { label: 'RECOVERY_CLOCK', val: '64S', trend: 'FLOW_MAINTAINED', icon: Clock }
         ].map(m => (
           <div key={m.label} className="border-l border-white/5 pl-8">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-3 italic">{m.label}</p>
              <div className="flex items-end gap-4">
                 <p className="text-5xl font-black italic tracking-tighter text-white leading-none">{m.val}</p>
                 <span className="text-[10px] font-black text-brand/40 uppercase tracking-widest mb-1.5">{m.trend}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
