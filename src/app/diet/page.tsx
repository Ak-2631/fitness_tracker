'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Zap, 
  Database, 
  Utensils, 
  Plus, 
  ChevronRight,
  Target,
  Activity,
  Box,
  RefreshCw,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import FoodSearch from '@/components/ui/FoodSearch';

export default function NutritionPage() {
  const { data: session } = useSession();
  const [dietLogs, setDietLogs] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [res, pRes] = await Promise.all([
        fetch('/api/diet'),
        fetch('/api/user/profile')
      ]);
      
      if (res.ok) {
        const payload = await res.json();
        const meals = payload.data?.meals || [];
        if (Array.isArray(meals)) {
          const mappedLogs = meals.map((m: any) => ({
             ...m,
             foodName: m.foodItems || m.mealType || 'Unspecified Event'
          }));
          setDietLogs(mappedLogs);
          setTotals(payload.meta?.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 });
        }
      }
      
      if (pRes.ok) {
        const pData = await pRes.json();
        setProfile(pData.user);
      }
    } catch (e) {
      console.error("TELEMETRY_FAILURE:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
    else setLoading(false);
  }, [session]);

  const handleFuelingEntry = async (food: any) => {
    try {
      const res = await fetch('/api/diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: food.name.toUpperCase(),
          calories: Math.round(food.calories),
          protein: Math.round(food.protein),
          carbs: Math.round(food.carbs),
          fats: Math.round(food.fats)
        })
      });
      if (res.ok) {
        setSuccessMsg(`SYNCED: ${food.name.toUpperCase()}`);
        setTimeout(() => setSuccessMsg(null), 2000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/diet/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccessMsg(`ENTRY_DELETED`);
        setTimeout(() => setSuccessMsg(null), 2000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const repeatLastMeal = () => {
    if (dietLogs.length > 0) {
      const last = dietLogs[dietLogs.length - 1];
      handleFuelingEntry({
        name: last.foodName,
        calories: last.calories,
        protein: last.protein,
        carbs: last.carbs,
        fats: last.fats
      });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32">
       <Activity className="text-brand animate-spin mb-4" size={48} />
       <p className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">SYNCING_FUELING_TERMINAL...</p>
    </div>
  );

  const targets = { 
    cal: profile?.targetCalories || 3200, 
    pro: profile?.targetProtein || 200, 
    carb: profile?.targetCarbs || 400, 
    fat: profile?.targetCalories ? Math.round((profile.targetCalories - ((profile.targetProtein || 0) * 4) - ((profile.targetCarbs || 0) * 4)) / 9) : 80 
  };
  const percentCal = Math.min(100, Math.round((totals.calories / targets.cal) * 100));

  const frequentFoods = [
    { name: 'PROTOCOL_WHEY', calories: 126, protein: 24, carbs: 3, fats: 2 },
    { name: 'OATS_BASIC', calories: 301, protein: 10, carbs: 54, fats: 5 },
    { name: 'BEEF_ELITE', calories: 246, protein: 30, carbs: 0, fats: 14 },
    { name: 'CHICKEN_ISO', calories: 160, protein: 31, carbs: 0, fats: 4 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-24 bg-black min-h-screen">
      
      {/* 01. FUELING_HUD_HEADER */}
      <section className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
             <Box size={14} /> ASSETS // FUELING_TERMINAL_v0.3
          </div>
          <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-6 italic">
            FUELING HUD
          </h1>
          <div className="flex items-center gap-3 text-brand">
            <Zap size={24} fill="#D0FF00" />
            <p className="text-2xl font-black italic tracking-tighter uppercase">
              {percentCal < 100 ? `COMMAND: CONSUME ${targets.cal - totals.calories} CAL REMAINING` : 'STATUS: CALORIC OPTIMA REACHED'}
            </p>
          </div>
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

      {/* 02. MACRO_LEDGER_PROGRESS */}
      <section className="space-y-16">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <h2 className="text-5xl font-black tracking-tighter uppercase italic">CALORIES</h2>
             <span className="text-3xl font-black text-white italic tracking-tighter">{totals.calories} / {targets.cal}</span>
          </div>
          <div className="h-20 bg-white/5 relative overflow-hidden">
            <div 
              className="h-full bg-brand transition-all duration-1000 flex items-center justify-center"
              style={{ width: `${percentCal}%` }}
            >
              <span className="text-[11px] font-black text-black uppercase tracking-[0.1em] italic">ENERGY_INTAKE_SYNCHRONIZED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-12">
           {[
             { label: 'PROTEIN', val: totals.protein, target: targets.pro, color: 'brand' },
             { label: 'CARBS', val: totals.carbs, target: targets.carb, color: 'white' },
             { label: 'FATS', val: totals.fats, target: targets.fat, color: 'white/30' }
           ].map(m => (
             <div key={m.label} className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase italic tracking-widest">
                   <p className="text-white/40">{m.label}</p>
                   <p className="text-white">{m.val}G / {m.target}G</p>
                </div>
                <div className="h-4 bg-white/5">
                   <div 
                     className={`h-full bg-${m.color} transition-all duration-1000`} 
                     style={{ width: `${Math.min(100, (m.val/m.target)*100)}%` }}
                   />
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 03. TACTICAL_INPUT_LANE */}
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 p-12 border border-white/5 bg-white/5 space-y-12">
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">SEARCH_PROTOCOLS</h3>
              <Utensils className="text-white/10" size={32} />
           </div>
           <FoodSearch onSelect={handleFuelingEntry} />
           
           <div className="pt-8 border-t border-white/5">
              <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase mb-8 italic">FREQ_PROTOCOLS (QUICK_SYNC)</p>
              <div className="grid grid-cols-2 gap-6">
                 {frequentFoods.map(f => (
                   <button 
                     key={f.name}
                     onClick={() => handleFuelingEntry(f)}
                     className="bg-white/[0.02] border border-white/10 p-6 text-left hover:border-brand hover:bg-white/[0.05] transition-all group"
                   >
                     <p className="text-sm md:text-base font-black italic uppercase text-white group-hover:text-brand whitespace-nowrap overflow-hidden text-ellipsis">{f.name}</p>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{f.calories} KCAL // {f.protein}P_{f.carbs}C_{f.fats}F</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="col-span-4 space-y-6">
           <button 
             onClick={repeatLastMeal}
             disabled={dietLogs.length === 0}
             className="w-full bg-brand text-white p-10 font-black italic uppercase tracking-widest text-sm flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-all"
           >
             <RefreshCw size={32} className="text-white" />
             <span>REPEAT_LAST_ENTRY</span>
           </button>
           
            <div className="bg-white/5 border border-white/5 p-8 space-y-4">
              <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">MACRO_DISTRIBUTION</p>
                 <span className="text-[8px] text-brand tracking-widest font-black italic">ACTUAL</span>
              </div>
              <div className="flex gap-1 h-8 w-full">
                 <div className="bg-brand transition-all duration-1000" style={{ flexGrow: Math.max(0.1, (totals.protein * 4)) }} />
                 <div className="bg-white transition-all duration-1000" style={{ flexGrow: Math.max(0.1, (totals.carbs * 4)) }} />
                 <div className="bg-white/20 transition-all duration-1000" style={{ flexGrow: Math.max(0.1, (totals.fats * 9)) }} />
              </div>
              <div className="flex justify-between text-[9px] font-black uppercase italic tracking-widest">
                 <span className="text-brand">PRO: {totals.calories > 0 ? Math.round(((totals.protein * 4) / totals.calories) * 100) : 0}%</span>
                 <span className="text-white">CARB: {totals.calories > 0 ? Math.round(((totals.carbs * 4) / totals.calories) * 100) : 0}%</span>
                 <span className="text-white/40">FAT: {totals.calories > 0 ? Math.round(((totals.fats * 9) / totals.calories) * 100) : 0}%</span>
              </div>
           </div>
        </div>
      </div>

      {/* 04. CONSUMPTION_HISTORY */}
      <section className="space-y-8">
        <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic pb-4 border-b border-white/5">HISTORICAL_TELEMETRY</h3>
        <div className="space-y-px">
          {(dietLogs || []).map((log, i) => (
            <div key={log.id} className="flex justify-between items-center py-6 hover:bg-white/5 px-4 transition-all group">
               <div className="flex gap-8 items-center">
                  <p className="text-[10px] font-black text-white/20 uppercase tabular-nums">0{i+1}</p>
                  <div>
                    <p className="text-xl font-black uppercase text-white leading-tight">{log.foodName}</p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">TIME_STAMP // {new Date(log.createdAt).toLocaleTimeString()}</p>
                  </div>
               </div>
               <div className="flex gap-12 items-center">
                  <div className="text-right">
                     <p className="text-2xl font-black italic text-brand leading-tight">{log.calories}_KCAL</p>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{log.protein}P / {log.carbs}C / {log.fats}F</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteEntry(log.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all font-black uppercase text-[10px] tracking-widest"
                  >
                    DELETE
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
