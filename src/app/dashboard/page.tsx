'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Zap, 
  Activity, 
  Database, 
  ChevronRight, 
  Target, 
  Clock, 
  Plus, 
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Box,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [dietTotals, setDietTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, dRes, tRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/diet'),
          fetch('/api/tasks')
        ]);
        
        if (pRes.ok) {
          const pData = await pRes.json();
          setProfile(pData.user || null);
        }
        
        if (dRes.ok) {
          const dData = await dRes.json();
          if (dData && dData.pagination?.totals) {
            setDietTotals(dData.pagination.totals);
          }
        }

        if (tRes.ok) {
          const tData = await tRes.json();
          if (tData && Array.isArray(tData.tasks)) {
            setTasks(tData.tasks);
          }
        }
      } catch (e) {
        console.error("DIAGNOSTIC_FAILURE:", e);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchData();
    else setLoading(false);
  }, [session]);

  const toggleTask = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !current })
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !current } : t));
        fetch('/api/user/profile').then(r => r.json()).then(d => setProfile(d.user));
      }
    } catch (e) {
      console.error("TASK_TOGGLE_FAILURE:", e);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32">
       <Activity className="text-brand animate-spin mb-4" size={48} />
       <p className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">HYDRATING_MISSION_CONTROL...</p>
    </div>
  );

  const targets = { cal: profile?.targetCalories || 3200, water: profile?.targetWater || 2000 };
  const percentCal = Math.min(100, Math.round((dietTotals.calories / targets.cal) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-24 bg-black min-h-screen">
      
      {/* 01. DAILY_OUTPUT_HEADER */}
      <section>
        <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
           <Activity size={14} /> STATUS // OPERATIONAL_HUB_v4.2
        </div>
        <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-6 italic">
          DAILY OUTPUT
        </h1>
        <div className="flex items-center gap-3 text-brand">
          <Zap size={24} fill="#D0FF00" />
          <p className="text-2xl font-black italic tracking-tighter uppercase">
            INTEGRITY: {percentCal}%STABLE // STREAK: {profile?.streak || 0} DAYS
          </p>
        </div>
      </section>

      {/* 02. SYSTEM_DIRECTIVE_AI */}
      <section className="bg-brand text-black p-12 border-l-[16px] border-black/20">
        <div className="flex justify-between items-start mb-6">
           <p className="text-[11px] font-black uppercase tracking-[0.5em] italic">SYSTEM_DIRECTIVE</p>
           <Database size={24} />
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-tight mb-4 break-words text-left text-white">
          RECALIBRATE_FUELING_PROTOCOL_01
        </h2>
        <p className="text-sm font-black uppercase tracking-tight opacity-70 italic">
          CAUTION: CALORIC_DEFICIT_DETECTED // INCREASE_PROTEIN_DENSITY // EXECUTE_MOVEMENT_X1
        </p>
      </section>

      <div className="grid grid-cols-12 gap-16">
        
        {/* LEF_COL: DISCIPLINE_ENGINE (TASKS) */}
        <div className="col-span-8 space-y-16">
          <section className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <h3 className="text-3xl lg:text-4xl font-black italic tracking-tighter uppercase text-white">DISCIPLINE_ENGINE</h3>
               <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">ACTIVE_OPS</p>
            </div>
            
            <div className="space-y-px">
               {tasks.length > 0 ? tasks.map((task, i) => (
                 <div 
                   key={task.id} 
                   onClick={() => toggleTask(task.id, task.isCompleted)}
                   className={`flex justify-between items-center py-6 px-6 cursor-pointer transition-all ${task.isCompleted ? 'bg-brand/5 opacity-40' : 'bg-white/5 hover:bg-white/[0.08]'}`}
                 >
                    <div className="flex gap-8 items-center">
                       <span className={`text-xl font-black italic tracking-tighter ${task.isCompleted ? 'line-through text-white/30' : 'text-white'}`}>
                          {task.title.toUpperCase()}
                       </span>
                    </div>
                    <div className="flex items-center gap-8">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">{task.priority}_PRIORITY</p>
                       <div className={`w-8 h-8 flex items-center justify-center border ${task.isCompleted ? 'bg-brand border-brand text-black' : 'border-white/10 text-white'}`}>
                          {task.isCompleted && <CheckCircle2 size={16} />}
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="py-12 border border-dashed border-white/10 flex flex-col items-center opacity-30">
                    <AlertCircle size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">NO_TASKS_INITIALIZED</p>
                 </div>
               )}
            </div>
          </section>

          <section className="h-20 bg-white/5 relative overflow-hidden">
            <div 
              className="h-full bg-brand transition-all duration-1000 flex items-center justify-center"
              style={{ width: `${percentCal}%` }}
            >
              <span className="text-[11px] font-black text-black uppercase tracking-[0.1em] italic">PROTOCOL_MAINTAINED_{percentCal}%</span>
            </div>
          </section>
        </div>

        {/* RIGHT_COL: TELEMETRY_CARDS */}
        <div className="col-span-4 space-y-8">
           <div className="border border-white/5 bg-white/5 p-10 space-y-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">XP_LEVEL</p>
              <p className="text-7xl md:text-[100px] font-black italic tracking-tighter text-white leading-none">LV.{profile?.level || 1}</p>
              <div className="h-1.5 bg-white/5">
                 <div className="h-full bg-brand" style={{ width: `${Math.min(100, (profile?.xp%100))}%` }} />
              </div>
              <p className="text-[10px] font-black text-brand tracking-[0.3em] uppercase italic">{profile?.xp || 0} / {(profile?.level || 1)*100} XP_TO_NEXT</p>
           </div>

           <div className="border border-white/5 bg-white/5 p-10 space-y-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">DAILY_FUELING</p>
              <div className="space-y-4">
                 <div className="flex justify-between text-[11px] font-black uppercase italic tracking-widest">
                    <p className="text-white/40">CALORIES</p>
                    <p className="text-white">{dietTotals.calories} / {targets.cal}</p>
                 </div>
                 <div className="h-4 bg-white/5">
                    <div 
                      className="h-full bg-white transition-all duration-1000" 
                      style={{ width: `${percentCal}%` }}
                    />
                 </div>
              </div>
           </div>

           <div className="bg-brand py-10 pl-4 pr-10 space-y-6 cursor-pointer hover:scale-[1.02] transition-all" onClick={() => window.location.href = '/log'}>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">COMMAND_INTERFACE</p>
              <div className="flex items-center gap-4 text-white">
                 <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">LOG_ENTRY</h4>
                 <Plus size={32} className="text-white" />
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
