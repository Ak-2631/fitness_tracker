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
       <Activity className="text-[#9b5de5] animate-spin mb-4" size={48} />
       <p className="text-[12px] font-black text-[#9b5de5] tracking-[0.5em] uppercase">SYNCING NEURAL TRENDS...</p>
    </div>
  );

  const maxCal = Math.max(...trends.map(t => t.calories), 3200);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-32">
      
      {/* Top Banner Area */}
      <section className="glass-card flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#9b5de5] uppercase tracking-[0.3em] mb-2">
             <BarChart3 size={14} /> DISCIPLINE_TRACKER // MONITORING_TERMINAL_v4.2
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            ANALYTICS
          </h1>
          <p className="text-[14px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">
            STATUS: <span className="text-[#9b5de5]">NEURAL TREND LINK ACTIVE</span>
          </p>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Performance Metrics */}
        <div className="col-span-8 space-y-6">
          
          {/* 7-DAY CALORIC LOAD */}
          <section className="glass-card space-y-8">
            <div className="flex justify-between items-end border-b border-[#1a1e2b] pb-4">
               <h3 className="text-2xl font-black tracking-tighter uppercase text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>DIET TRACKING 7D</h3>
               <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">KCAL DENSITY</p>
            </div>
            
            <div className={`h-[250px] flex items-end ${trends.length > 7 ? 'gap-1' : 'gap-6'}`}>
               {trends.map((t, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                    <div className="w-full bg-[#111520] border border-[#1a1e2b] relative flex items-end h-full rounded-sm overflow-hidden">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${(t.calories / maxCal) * 100}%` }}
                         className="w-full bg-[#9b5de5]/20 border-t border-[#9b5de5] group-hover:bg-[#9b5de5]/40 transition-colors relative"
                       >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#0B0F19] border border-[#9b5de5] px-2 py-1 z-10 rounded-sm">
                             <p className="text-[10px] font-bold text-[#9b5de5] uppercase tracking-widest">{t.calories} KCAL</p>
                          </div>
                       </motion.div>
                    </div>
                    <div className="flex items-center justify-center" style={{ height: '30px', overflow: 'visible' }}>
                     <p className="text-[10px] font-bold text-[#a0a5b5] uppercase whitespace-nowrap">{t.label}</p>
                   </div>
                 </div>
               ))}
            </div>
          </section>

          {/* 7-DAY DISCIPLINE INTEGRITY */}
          <section className="glass-card space-y-8">
            <div className="flex justify-between items-end border-b border-[#1a1e2b] pb-4">
               <h3 className="text-2xl font-black tracking-tighter uppercase text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>TASK TRACKING 7D</h3>
               <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">COMPLETION RATIO</p>
            </div>
            
            <div className={`h-[200px] flex items-end ${trends.length > 7 ? 'gap-1' : 'gap-6'}`}>
               {trends.map((t, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                    <div className="w-full bg-[#111520] border border-[#1a1e2b] relative flex items-end h-full rounded-sm overflow-hidden">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${t.taskIntegrity}%` }}
                         className="w-full bg-[#9b5de5] shadow-[0_0_15px_rgba(217,166,255,0.4)] transition-all relative"
                       >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <p className="text-[10px] font-black text-[#0B0F19] tracking-tighter">{t.taskIntegrity}%</p>
                          </div>
                       </motion.div>
                    </div>
                    <div className="flex items-center justify-center" style={{ height: '30px', overflow: 'visible' }}>
                     <p className="text-[10px] font-bold text-[#a0a5b5] uppercase whitespace-nowrap">{t.label}</p>
                   </div>
                 </div>
               ))}
            </div>
          </section>

        </div>

        {/* Right Column: Bio Feedback Telemetry */}
        <div className="col-span-4 flex flex-col gap-6">
           
           {timeRange !== 30 && (
             <section className="glass-card flex-1 flex flex-col items-center justify-center space-y-6">
               <div className="w-full flex justify-between items-center mb-4">
                 <p className="text-[10px] font-bold text-[#9b5de5] tracking-[0.2em] uppercase">HYDRATION SYNC</p>
                 <Droplets className="text-[#9b5de5]" size={20} />
               </div>
               <div className="flex flex-col items-center py-4">
                 <div className="w-40 h-40 rounded-full border-[8px] border-[#1a1e2b] flex items-center justify-center relative">
                   <div className="absolute inset-[10px] rounded-full border border-[#9b5de5]/40 border-dashed animate-spin-slow" />
                   <p className="text-4xl font-black text-white tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>85<span className="text-lg text-[#a0a5b5]">%</span></p>
                 </div>
                 <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase mt-6">FLUID SATURATION STABLE</p>
               </div>
             </section>
           )}

           <section 
             onClick={() => setTimeRange(timeRange === 30 ? 7 : 30)}
             className="glass-card flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#9b5de5] hover:bg-[#9b5de5]/5 transition-all group py-8"
           >
              <Calendar size={32} className="text-[#a0a5b5] group-hover:text-[#9b5de5] transition-colors" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center text-[#a0a5b5] group-hover:text-[#9b5de5] transition-colors">
                {timeRange === 30 ? 'ANALYZE LAST 7 DAYS' : 'ANALYZE LAST 30 DAYS'}
              </p>
           </section>

        </div>

      </div>

    </div>
  );
}
