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
       <Activity className="text-[#9b5de5] animate-spin mb-4" size={48} />
       <p className="text-[12px] font-black text-[#9b5de5] tracking-[0.5em] uppercase">SYNCING FUELING TERMINAL...</p>
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
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in">
      
      {/* Top Banner Area */}
      <section className="glass-card flex justify-between items-end">
        <div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#9b5de5] uppercase tracking-[0.3em] mb-2">
             <Box size={14} /> ASSETS // FUELING_TERMINAL_v0.3
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            FUELING HUD
          </h1>
          <p className="text-[14px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">
            STATUS: <span className="text-[#9b5de5]">{percentCal < 100 ? `COMMAND: CONSUME ${targets.cal - totals.calories} CAL REMAINING` : 'CALORIC OPTIMA REACHED'}</span>
          </p>
        </div>
        
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="bg-[#9b5de5]/20 text-[#9b5de5] border border-[#9b5de5]/50 px-6 py-3 font-bold tracking-widest text-[10px] uppercase flex items-center gap-3 rounded-sm"
            >
              <CheckCircle2 size={16} /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Macro Ledger Progress */}
      <section className="glass-card space-y-10">
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-[#1a1e2b] pb-4">
             <h2 className="text-3xl font-black tracking-tighter uppercase text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>CALORIC INTAKE</h2>
             <span className="text-2xl font-black text-[#9b5de5]">{totals.calories} <span className="text-sm text-[#a0a5b5]">/ {targets.cal}</span></span>
          </div>
          <div className="h-12 bg-[#1a1e2b] relative overflow-hidden rounded-sm">
            <div 
              className="h-full bg-[#9b5de5] shadow-[0_0_15px_#9b5de5] transition-all duration-1000 flex items-center justify-end px-4"
              style={{ width: `${percentCal}%` }}
            >
              {percentCal > 15 && <span className="text-[10px] font-bold text-[#0e111a] uppercase tracking-widest">ENERGY SYNCHRONIZED</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
           {[
             { label: 'PROTEIN', val: totals.protein, target: targets.pro, color: 'bg-[#9b5de5] shadow-[0_0_8px_#9b5de5]' },
             { label: 'CARBS', val: totals.carbs, target: targets.carb, color: 'bg-white' },
             { label: 'FATS', val: totals.fats, target: targets.fat, color: 'bg-white/40' }
           ].map(m => (
             <div key={m.label} className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                   <p className="text-[#a0a5b5]">{m.label}</p>
                   <p className="text-white">{m.val}G / {m.target}G</p>
                </div>
                <div className="h-3 bg-[#1a1e2b] rounded-sm overflow-hidden">
                   <div 
                     className={`h-full ${m.color} transition-all duration-1000`} 
                     style={{ width: `${Math.min(100, (m.val/m.target)*100)}%` }}
                   />
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Tactical Input Lane */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 glass-card space-y-8">
           <div className="flex items-center justify-between border-b border-[#1a1e2b] pb-4">
              <h3 className="text-xl font-black tracking-tighter uppercase text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>SEARCH PROTOCOLS</h3>
              <Utensils className="text-[#9b5de5]" size={24} />
           </div>
           
           <FoodSearch onSelect={handleFuelingEntry} />
           
           <div className="pt-8">
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase mb-4">FREQ PROTOCOLS (QUICK SYNC)</p>
              <div className="grid grid-cols-2 gap-4">
                 {frequentFoods.map(f => (
                   <button 
                     key={f.name}
                     onClick={() => handleFuelingEntry(f)}
                     className="bg-[#111520] border border-[#1a1e2b] p-4 text-left hover:border-[#9b5de5] transition-all group rounded-sm"
                   >
                     <p className="text-sm font-black uppercase text-white group-hover:text-[#9b5de5] whitespace-nowrap overflow-hidden text-ellipsis mb-1">{f.name}</p>
                     <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">{f.calories} KCAL // {f.protein}P_{f.carbs}C_{f.fats}F</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
           <button 
             onClick={repeatLastMeal}
             disabled={dietLogs.length === 0}
             className="w-full glass-card border-[#9b5de5]/30 text-[#9b5de5] py-8 font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-3 hover:bg-[#9b5de5]/10 hover:border-[#9b5de5] transition-all disabled:opacity-50 disabled:hover:bg-[#111520] disabled:cursor-not-allowed"
           >
             <RefreshCw size={24} className="text-[#9b5de5]" />
             <span>REPEAT LAST ENTRY</span>
           </button>
           
            <div className="glass-card flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6 border-b border-[#1a1e2b] pb-4">
                 <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.2em]">MACRO DISTRIBUTION</p>
                 <span className="text-[10px] font-bold text-[#9b5de5] tracking-widest uppercase">ACTUAL</span>
              </div>
              
              <div className="flex gap-1 h-12 w-full rounded-sm overflow-hidden mb-6">
                 <div className="bg-[#9b5de5] transition-all duration-1000" style={{ flexGrow: Math.max(0.1, (totals.protein * 4)) }} />
                 <div className="bg-white transition-all duration-1000" style={{ flexGrow: Math.max(0.1, (totals.carbs * 4)) }} />
                 <div className="bg-white/20 transition-all duration-1000" style={{ flexGrow: Math.max(0.1, (totals.fats * 9)) }} />
              </div>
              
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                 <span className="text-[#9b5de5]">PRO: {totals.calories > 0 ? Math.round(((totals.protein * 4) / totals.calories) * 100) : 0}%</span>
                 <span className="text-white">CARB: {totals.calories > 0 ? Math.round(((totals.carbs * 4) / totals.calories) * 100) : 0}%</span>
                 <span className="text-[#a0a5b5]">FAT: {totals.calories > 0 ? Math.round(((totals.fats * 9) / totals.calories) * 100) : 0}%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Consumption History */}
      <section className="glass-card">
        <h3 className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.2em] pb-4 border-b border-[#1a1e2b] mb-4">HISTORICAL TELEMETRY</h3>
        <div className="space-y-2">
          {(dietLogs || []).map((log, i) => (
            <div key={log.id} className="flex justify-between items-center p-4 bg-[#111520] hover:bg-[#1a1e2b]/50 border border-[#1a1e2b] rounded-sm transition-all group">
               <div className="flex gap-6 items-center">
                  <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tabular-nums">{(i+1).toString().padStart(2, '0')}</p>
                  <div>
                    <p className="text-base font-black uppercase text-white leading-tight mb-1">{log.foodName}</p>
                    <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">TIME_STAMP // {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
               </div>
               <div className="flex gap-8 items-center">
                  <div className="text-right">
                     <p className="text-xl font-black text-[#9b5de5] leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>{log.calories} KCAL</p>
                     <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest mt-1">{log.protein}P / {log.carbs}C / {log.fats}F</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteEntry(log.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all font-bold uppercase text-[10px] tracking-widest w-16 text-right"
                  >
                    DELETE
                  </button>
               </div>
            </div>
          ))}
          {dietLogs.length === 0 && (
            <div className="py-12 text-center text-[#a0a5b5] text-sm">No telemetry logs found for current cycle.</div>
          )}
        </div>
      </section>

    </div>
  );
}
