'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Zap, 
  Activity, 
  Database, 
  Target, 
  TrendingUp, 
  ArrowUpRight,
  Droplets,
  BarChart3,
  Calendar,
  Box,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MonitoringPage() {
  const { data: session } = useSession();
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(7);

  useEffect(() => {
    if (session) {
      setLoading(true);
      fetch(`/api/analytics?days=${timeRange}`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.trends)) {
            setTrends(data.trends);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session, timeRange]);

  if (loading && trends.length === 0) return (
    <div className="flex flex-col items-center justify-center p-32">
       <Activity className="text-brand animate-spin mb-4" size={48} />
       <p className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">SYNCING_NEURAL_TRENDS...</p>
    </div>
  );

  const maxCal = Math.max(...trends.map(t => t.calories), 3200);

  return (
    <div className="max-w-7xl mx-auto space-y-24 bg-black min-h-screen pb-32" style={{ backgroundColor: '#000000' }}>
      
      {/* 01. ANALYTICS_HUD_HEADER */}
      <section>
        <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
           <BarChart3 size={14} /> DISCIPLINE_TRACKER // MONITORING_TERMINAL_v4.2
        </div>
        <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-6 italic">
          ANALYTICS
        </h1>
        <div className="flex items-center gap-3 text-brand">
          <TrendingUp size={24} fill="#D0FF00" />
          <p className="text-2xl font-black italic tracking-tighter uppercase">
            STATUS: NEURAL_TREND_LINK_ACTIVE
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-16">
        
        {/* LEF_COL: PERFORMANCE_MATRICS */}
        <div className="col-span-8 space-y-24">
          
          {/* 7-DAY CALORIC LOAD */}
          <section className="space-y-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white">DIET_TRACKING 7D</h3>
               <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase font-sans">KCAL_DENSITY</p>
            </div>
            
            <div className={`h-[300px] flex items-end ${trends.length > 7 ? 'gap-1' : 'gap-6'}`}>
               {trends.map((t, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                    <div className="w-full bg-white/5 relative flex items-end h-full">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${(t.calories / maxCal) * 100}%` }}
                         className="w-full bg-white group-hover:bg-brand transition-colors relative"
                       >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                             <p className="text-[10px] font-black text-brand italic tracking-widest">{t.calories}_KCAL</p>
                          </div>
                       </motion.div>
                    </div>
                    <div className="flex items-center justify-center" style={{ height: '40px', overflow: 'visible' }}>
                     <p className="text-[8px] font-black text-white/30 uppercase italic whitespace-nowrap" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>{t.label}</p>
                   </div>
                 </div>
               ))}
            </div>
          </section>

          {/* 7-DAY DISCIPLINE INTEGRITY */}
          <section className="space-y-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white">TASK_TRACKING 7D</h3>
               <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase font-sans">COMPLETION_RATIO</p>
            </div>
            
            <div className={`h-[200px] flex items-end ${trends.length > 7 ? 'gap-1' : 'gap-4'}`}>
               {trends.map((t, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                    <div className="w-full bg-white/5 relative flex items-end h-full border border-white/5">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${t.taskIntegrity}%` }}
                         className="w-full bg-brand transition-all relative"
                       >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <p className="text-[10px] font-black text-black italic tracking-tighter">{t.taskIntegrity}%</p>
                          </div>
                       </motion.div>
                    </div>
                    <div className="flex items-center justify-center" style={{ height: '40px', overflow: 'visible' }}>
                     <p className="text-[8px] font-black text-white/20 uppercase italic whitespace-nowrap" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>{t.label}</p>
                   </div>
                 </div>
               ))}
            </div>
          </section>

        </div>

        {/* RIGHT_COL: BIO_FEEDBACK_TELEMETRY */}
        <div className="col-span-4 space-y-12">
           
           {timeRange !== 30 && (
             <section className="bg-white/5 border border-white/5 p-10 space-y-10">
               <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">HYDRATION_SYNC</p>
                 <Droplets className="text-brand" size={20} />
               </div>
               <div className="flex flex-col items-center">
                 <div className="w-48 h-48 rounded-full border-[10px] border-white/5 flex items-center justify-center relative">
                   <div className="absolute inset-[15px] rounded-full border border-brand/20 border-dashed animate-spin-slow" />
                   <p className="text-5xl font-black italic tracking-tighter text-white">85<span className="text-xl">%</span></p>
                 </div>
                 <p className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase mt-8 italic">FLUID_SATURATION_STABLE</p>
               </div>
             </section>
           )}

           {timeRange !== 30 && (
             <section className="bg-white/5 border border-white/5 p-10 space-y-8">
               <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-white/30 tracking-[0.5em] uppercase italic">RECOVERY_STATUS</p>
                 <Activity className="text-white/30" size={18} />
               </div>
               <div className="space-y-6">
                 {[
                   { label: 'CNS LOAD', val: 'ADAPTIVE', color: 'text-brand' },
                   { label: 'HEART RATE VAR', val: 'NON OPTIMAL', color: 'text-red-500' },
                   { label: 'BLOOD OXY SYNC', val: 'STABLE', color: 'text-brand' }
                 ].map(m => (
                   <div key={m.label} className="flex justify-between items-center border-b border-white/5 pb-3">
                     <p className="text-[10px] font-black text-white/20 tracking-wider uppercase">{m.label}</p>
                     <span className={`text-[10px] font-black uppercase italic ${m.color}`}>{m.val}</span>
                   </div>
                 ))}
               </div>
             </section>
           )}

           <section 
             onClick={() => setTimeRange(timeRange === 30 ? 7 : 30)}
             className="p-8 border border-white/10 text-white flex flex-col items-center gap-4 cursor-pointer hover:bg-white hover:text-black transition-all group"
           >
              <Calendar size={32} className="text-white group-hover:text-black transition-colors" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] italic text-center text-white group-hover:text-black transition-colors">
                {timeRange === 30 ? 'ANALYZE_LAST_7_DAYS' : 'ANALYZE_LAST_30_DAYS'}
              </p>
           </section>

        </div>

      </div>

    </div>
  );
}
