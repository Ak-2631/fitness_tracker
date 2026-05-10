'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Activity, 
  Utensils, 
  ClipboardList, 
  CheckCircle2, 
  Flame,
  Target,
  Square,
  Droplets,
  Keyboard,
  Search,
  History,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FoodSearch from '@/components/ui/FoodSearch';
import WorkoutTracker from '@/components/ui/WorkoutTracker';
import EfficiencyTracker from '@/components/ui/EfficiencyTracker';

export default function LogEntryPage() {
  const { data: session } = useSession();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fuelingMode, setFuelingMode] = useState<'search' | 'manual'>('search');
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const fetchRecentLogs = async () => {
    try {
      const res = await fetch('/api/diet');
      if (res.ok) {
        const data = await res.json();
        setRecentLogs(data.data?.meals || []);
      }
    } catch (e) {
      console.error("LOG_FETCH_FAILURE:", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (session) fetchRecentLogs();
  }, [session]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleTaskEntry = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title') as string;
    const priority = parseInt(formData.get('priority') as string);
    if (!title) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          priority, 
          datePlannedFor: new Date().toISOString(), 
          energyLevel: 3, 
          estimatedTime: 30 
        })
      });
      if (res.ok) {
        showSuccess('DISCIPLINE_ENGINE_SYNCED');
        e.target.reset();
      }
    } catch (e) {
       console.error("TASK_ENTRY_FAILURE:", e);
    }
  };

  const handleFuelingEntry = async (food: any) => {
    try {
      // DEBUG_LOG: Ensure we have numbers
      console.log("SYNC_ATTEMPT:", food);
      
      const payload = {
        mealType: food.name || "UNSPECIFIED_FUELING",
        foodItems: food.name || "MANUAL_ENTRY",
        calories: Number(food.calories || 0),
        protein: Number(food.protein || 0),
        carbs: Number(food.carbs || 0),
        fats: Number(food.fats || 0)
      };

      const res = await fetch('/api/diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        showSuccess('FUELING_TELEMETRY_LOCKED');
        fetchRecentLogs(); // IMMEDIATELY REFRESH HUD
      } else {
        const err = await res.json();
        console.error("SYNC_REJECTED:", err);
      }
    } catch (e) {
      console.error("FUELING_ENTRY_FAILURE:", e);
    }
  };

  const handleManualFueling = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('description') || 'MANUAL_OVERRIDE',
      calories: formData.get('calories'),
      protein: formData.get('protein'),
      carbs: formData.get('carbs'),
      fats: formData.get('fats')
    };
    await handleFuelingEntry(data);
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-24 bg-black min-h-screen pb-32">
      
      {/* 01. LOG_HUD_HEADER */}
      <section className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
             <Activity size={14} /> COMMAND // LOG_ENTRY_HUD_v0.6
          </div>
          <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-2 italic">
            LOG ENTRY
          </h1>
          <p className="text-2xl font-black text-brand italic tracking-tighter uppercase">
            STATUS: READY_FOR_DATA_INPUT // SYNC_ACTIVE
          </p>
        </div>
        
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="bg-brand text-black px-8 py-4 font-black italic tracking-widest text-sm uppercase flex items-center gap-3"
            >
              <CheckCircle2 size={16} /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 02. TRIPLE_PRIMARY_LANES */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-12 gap-6 lg:gap-8"
      >
        
        {/* LANE_01: FUELING_INPUT */}
        <section className="col-span-12 lg:col-span-4 bg-white/5 border border-white/5 flex flex-col p-6 lg:p-8 space-y-8 min-h-[500px] overflow-hidden">
           <div className="flex justify-between items-center pb-6 border-b border-white/5">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">FUELING</h3>
              <Utensils className="text-white/20" size={24} />
           </div>
           
           <div className="flex gap-2">
              <button 
                onClick={() => setFuelingMode('search')}
                className={`flex-1 py-3 font-black text-[10px] tracking-widest uppercase italic transition-all ${fuelingMode === 'search' ? 'bg-brand text-black' : 'border border-white/10 text-white/40'}`}
              >
                 <Search className="inline mr-2" size={12} /> SEARCH
              </button>
              <button 
                onClick={() => setFuelingMode('manual')}
                className={`flex-1 py-3 font-black text-[10px] tracking-widest uppercase italic transition-all ${fuelingMode === 'manual' ? 'bg-brand text-black' : 'border border-white/10 text-white/40'}`}
              >
                 <Keyboard className="inline mr-2" size={12} /> MANUAL
              </button>
           </div>

           <div className="flex-1 space-y-8">
              <AnimatePresence mode="wait">
                {fuelingMode === 'search' ? (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-wider italic leading-relaxed">
                       EXTRACT_FROM_DATABASE
                    </p>
                    <FoodSearch onSelect={handleFuelingEntry} />
                  </motion.div>
                ) : (
                  <motion.form
                    key="manual"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleManualFueling}
                    className="space-y-6"
                  >
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-wider italic leading-relaxed">
                       OVERRIDE_MANUAL_MACROS
                    </p>
                    <div className="space-y-4">
                      <input name="description" placeholder="IDENTIFIER" className="w-full bg-black border border-white/10 p-3 text-[10px] font-black italic text-white outline-none focus:border-brand" />
                      <div className="grid grid-cols-2 gap-4">
                        <input name="calories" type="number" placeholder="CALORIES" className="bg-black border border-white/10 p-4 text-[12px] font-black italic text-white outline-none focus:border-brand" required />
                        <input name="protein" type="number" placeholder="PROTEIN (G)" className="bg-black border border-white/10 p-4 text-[12px] font-black italic text-white outline-none focus:border-brand" required />
                        <input name="carbs" type="number" placeholder="CARBS (G)" className="bg-black border border-white/10 p-4 text-[12px] font-black italic text-white outline-none focus:border-brand" required />
                        <input name="fats" type="number" placeholder="FATS (G)" className="bg-black border border-white/10 p-4 text-[12px] font-black italic text-white outline-none focus:border-brand" required />
                      </div>
                      <button type="submit" className="w-full bg-white text-black py-4 font-black italic uppercase tracking-widest text-[10px] hover:bg-brand transition-all">
                        COMMIT_MACROS
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
           </div>
        </section>

        {/* LANE_02: DISCIPLINE_INPUT */}
        <section className="col-span-12 lg:col-span-4 bg-white/5 border border-white/5 flex flex-col p-6 lg:p-8 space-y-12 overflow-hidden">
           <div className="flex justify-between items-center pb-6 border-b border-white/5">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">DISCIPLINE</h3>
              <ClipboardList className="text-white/20" size={24} />
           </div>
           <form onSubmit={handleTaskEntry} className="flex-1 space-y-6">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-wider italic leading-relaxed">
                 MISSION_CRITICAL_TASK
              </p>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">TASK_IDENTIFIER</label>
                    <input 
                      name="title"
                      className="w-full bg-black border border-white/10 p-4 text-base font-black italic text-white outline-none focus:border-brand transition-all"
                      placeholder="E.G. DEPLOY_AGENT_v2"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">INTENSITY_PRIORITY</label>
                    <select 
                      name="priority"
                      className="w-full bg-black border border-white/10 p-4 text-base font-black italic text-white outline-none focus:border-brand appearance-none"
                    >
                       {[...Array(10)].map((_, i) => (
                         <option key={i+1} value={i+1}>0{i+1}_INTENSITY</option>
                       ))}
                    </select>
                 </div>
                 <button 
                  type="submit"
                  className="w-full bg-brand text-black p-4 font-black italic uppercase tracking-widest text-sm hover:scale-[1.02] transition-all overflow-hidden text-ellipsis"
                 >
                   REGISTER_TASK
                 </button>
              </div>
           </form>
        </section>

        {/* LANE_03: FLUID_LANES (RELOCATED FOR SPACE) */}
        <section className="col-span-12 lg:col-span-4 bg-white/5 border border-white/5 flex flex-col p-6 lg:p-8 space-y-12 overflow-hidden">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">FLUIDS</h3>
              <Droplets className="text-white/20" size={24} />
           </div>
           <div className="space-y-6">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-wider italic leading-relaxed">
                 FLUID_SATURATION_PROTOCOL
              </p>
              <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => handleFuelingEntry({ name: 'WATER_SYNC', calories: 0, protein: 0, carbs: 0, fats: 0 })}
                    className="border border-white/10 p-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <Droplets size={16} /> +250ML_HYDRATE
                  </button>
                  <button 
                    onClick={() => handleFuelingEntry({ name: 'WATER_SYNC_HIGH', calories: 0, protein: 0, carbs: 0, fats: 0 })}
                    className="border border-white/10 p-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <Droplets size={16} /> +500ML_MAX_HYDRATE
                  </button>
              </div>
           </div>
        </section>

      </motion.div>

      {/* 02.5. SECONDARY_LANES (FULL WIDTH) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <WorkoutTracker />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full"
        >
          <EfficiencyTracker />
        </motion.div>
      </div>

      {/* 03. MISSION_RECAP_LOGS */}
      <section className="space-y-8">
         <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
               <h3 className="text-5xl font-black italic tracking-tighter uppercase text-white">MISSION_RECAP</h3>
               <History className="text-brand" size={24} />
            </div>
            <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">TODAY_PROTOCOLS</p>
         </div>
         
         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 space-y-px">
               {recentLogs.length > 0 ? (
                 recentLogs.map((log) => (
                   <div key={log.id} className="bg-white/[0.02] border border-white/5 p-6 flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                      <div className="flex items-center gap-8">
                         <div className="w-2 h-10 bg-brand/40" />
                         <div>
                            <p className="text-xl font-black italic tracking-tight text-white uppercase">{log.mealType}</p>
                            <div className="flex gap-4 text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">
                               <span>CAL: {log.calories}</span>
                               <span>PRO: {log.protein}G</span>
                               <span>CARB: {log.carbs}G</span>
                               <span>FAT: {log.fats}G</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <p className="text-[10px] font-black text-white/10 uppercase tracking-widest italic">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                         <CheckCircle2 size={16} className="text-brand opacity-40" />
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-24 border border-dashed border-white/10 flex flex-col items-center justify-center opacity-20">
                    <Activity size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">NO_TELEMETRY_LOGGED_TODAY</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* 04. LOG_FOOTER_COMMAND */}
      <footer className="pt-16 border-t border-white/5">
         <button 
           onClick={() => window.location.href = '/dashboard'}
           className="w-full border border-white/5 bg-white/[0.02] text-white/40 p-10 font-black italic uppercase tracking-[0.5em] text-2xl hover:text-brand hover:border-brand transition-all flex items-center justify-center gap-6 group"
         >
           TERMINATE_SESSION <Square size={32} />
         </button>
      </footer>

    </div>
  );
}
