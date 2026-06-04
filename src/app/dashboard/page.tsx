'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Heart, 
  Droplet, 
  Activity, 
  Moon, 
  Dumbbell,
  Wifi
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [intelLogs, setIntelLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackerConnected, setTrackerConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await fetch('/api/user/profile');
        if (pRes.ok) {
          const pData = await pRes.json();
          setProfile(pData.user || null);
        }

        const iRes = await fetch('/api/intel');
        if (iRes.ok) {
          const iData = await iRes.json();
          setIntelLogs(iData.logs || []);
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32">
       <Activity className="text-[#9b5de5] animate-spin mb-4" size={48} />
       <p className="text-[12px] font-black text-[#9b5de5] tracking-[0.5em] uppercase">SYSTEM BOOT...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* Top Banner Area */}
      <section className="glass-card flex items-center justify-between">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            SYSTEM ACTIVATED
          </h1>
          <p className="text-[14px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">
            OPERATOR STATUS: <span className="text-[#9b5de5]">READY FOR DEPLOYMENT</span>
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">XP PROGRESSION</p>
            <p className="text-[12px] font-bold text-[#9b5de5]">{profile?.xp || 8420} / 10,000</p>
          </div>
          <div className="w-64 h-2 bg-[#1a1e2b] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#9b5de5] shadow-[0_0_10px_#9b5de5]" style={{ width: '84%' }}></div>
          </div>
          <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">NEXT RANK: ELITE COMMANDER</p>
        </div>
      </section>

      {/* Telemetry Grid */}
      <section>
        <div className="grid grid-cols-4 gap-6">
          <div className="glass-card flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <Heart size={20} className="text-white" />
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">HEART RATE</p>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black text-white">72</span>
              <span className="text-sm font-bold text-[#a0a5b5]">BPM</span>
            </div>
            <div className="flex gap-1 h-6 items-end mt-auto">
              <div className="w-1/5 bg-[#1a1e2b] h-1/4 rounded-sm"></div>
              <div className="w-1/5 bg-[#1a1e2b] h-2/4 rounded-sm"></div>
              <div className="w-1/5 bg-[#9b5de5] h-3/4 rounded-sm shadow-[0_0_8px_#9b5de5]"></div>
              <div className="w-1/5 bg-[#1a1e2b] h-full rounded-sm"></div>
              <div className="w-1/5 bg-[#1a1e2b] h-2/4 rounded-sm"></div>
            </div>
          </div>

          <div className="glass-card flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <Droplet size={20} className="text-white" />
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">HYDRATION</p>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black text-white">2.4</span>
              <span className="text-sm font-bold text-[#a0a5b5] uppercase">Liters</span>
            </div>
            <div className="mt-auto">
              <div className="w-full h-1 bg-[#1a1e2b] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white" style={{ width: '60%' }}></div>
              </div>
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">TARGET: 4.0L</p>
            </div>
          </div>

          <div className="glass-card flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <Activity size={20} className="text-white" />
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">STRAIN</p>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black text-white">88</span>
              <span className="text-sm font-bold text-[#a0a5b5]">%</span>
            </div>
            <div className="mt-auto">
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">ZONE: HIGH INTENSITY</p>
            </div>
          </div>

          <div className="glass-card flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <Moon size={20} className="text-white" />
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">RECOVERY</p>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black text-white">92</span>
              <span className="text-sm font-bold text-[#a0a5b5]">%</span>
            </div>
            <div className="mt-auto">
              <p className="text-[10px] font-bold text-green-400 tracking-[0.1em] uppercase drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">OPTIMAL FOR TRAINING</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature & Stats */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left: Mission Card */}
        <div className="col-span-8 glass-card p-0 overflow-hidden relative min-h-[350px] flex flex-col justify-end border border-[#1a1e2b]">
          {/* Background image placeholder */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
          
          <div className="relative z-20 p-8 space-y-4">
            <div className="inline-block bg-[#9b5de5]/20 border border-[#9b5de5]/30 text-[#9b5de5] text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-2">
              CORE PROTOCOL <span className="text-white ml-2">90 MINUTES</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              PHASE IV: HYPERTROPHY
            </h2>
            <p className="text-[#a0a5b5] text-sm max-w-xl mb-6">
              Integrated compound movements designed for maximum muscle density and tactical endurance. High volume, controlled tempo.
            </p>
            <div className="flex gap-4">
              <button className="btn-primary" onClick={() => window.location.href = '/workouts'}>ENGAGE WORKOUT</button>
              <button className="btn-outline">INTEL</button>
            </div>
          </div>
        </div>

        {/* Right: Specific Stat */}
        <div className="col-span-4 glass-card flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <Dumbbell size={24} className="text-[#9b5de5]" />
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase">SESSION ID</p>
              <p className="text-[10px] font-bold text-white tracking-[0.1em] uppercase">STR-0922</p>
            </div>
          </div>

          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            DEADLIFT MAX REPS
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-[#1a1e2b] pb-2">
              <span className="text-[#a0a5b5] text-xs font-bold tracking-widest uppercase">PREVIOUS</span>
              <span className="text-white font-black text-lg">180 KG</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#1a1e2b] pb-2">
              <span className="text-[#a0a5b5] text-xs font-bold tracking-widest uppercase">TARGET</span>
              <span className="text-[#9b5de5] font-black text-lg">185 KG</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#1a1e2b] pb-2">
              <span className="text-[#a0a5b5] text-xs font-bold tracking-widest uppercase">RPE</span>
              <span className="text-white font-black text-lg">9.5</span>
            </div>
          </div>

          <button className="w-full border border-[#1a1e2b] text-[#a0a5b5] hover:text-white hover:border-[#9b5de5] py-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-all mt-auto">
            UPDATE LOGS
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Operational Intel (Logs) */}
        <div className="col-span-5 glass-card flex flex-col h-[400px]">
          <h4 className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase border-b border-[#1a1e2b] pb-4 mb-4 shrink-0">
            OPERATIONAL INTEL (TODAY)
          </h4>
          <div className="space-y-6 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-[#1a1e2b] scrollbar-track-transparent">
            {intelLogs.length === 0 ? (
              <p className="text-xs text-[#a0a5b5] italic">NO INTEL CAPTURED TODAY.</p>
            ) : (
              intelLogs.map((log: any, i) => {
                const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const iconColor = log.type === 'WORKOUT' ? 'text-[#9b5de5]' : log.type === 'DIET' ? 'text-blue-400' : 'text-[#3be282]';
                return (
                  <div key={log.id} className={`flex gap-4 ${i === intelLogs.length - 1 ? 'opacity-50' : ''}`}>
                    <span className="text-[10px] font-mono text-[#a0a5b5] shrink-0 mt-1">{time}</span>
                    <div>
                      <p className={`text-sm font-bold ${log.type === 'WORKOUT' ? 'text-white' : 'text-[#a0a5b5]'}`}>{log.title}</p>
                      <p className={`text-[10px] ${iconColor}`}>{log.subtitle}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Energy Balance Module */}
        <div className="col-span-7 glass-card flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-[#1a1e2b] pb-4 mb-6">
            <h4 className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.1em] uppercase flex items-center gap-2">
              <Activity size={14} /> DAILY ENERGY BALANCE
            </h4>
            <span className="text-[10px] font-bold text-[#9b5de5] tracking-[0.1em] uppercase">REAL-TIME TELEMETRY</span>
          </div>
          
          <div className="flex-1">
             {(() => {
                const baseMaintenance = profile?.baseExpenditure || 2400;
                const activeBurn = intelLogs.filter(log => log.type === 'WORKOUT').reduce((sum, log) => sum + (log.calories || 0), 0);
                const totalExpenditure = baseMaintenance + activeBurn;
                const totalConsumed = intelLogs.filter(log => log.type === 'DIET').reduce((sum, log) => sum + (log.calories || 0), 0);
                
                const netBalance = totalConsumed - totalExpenditure;
                const isSurplus = netBalance > 0;
                const balanceColor = isSurplus ? 'text-red-500' : 'text-[#3be282]';
                const balanceLabel = isSurplus ? 'CALORIC SURPLUS' : 'CALORIC DEFICIT';
                const balanceSign = isSurplus ? '+' : '';

                // Calculate progress bar widths
                const maxVal = Math.max(totalExpenditure, totalConsumed, 1);
                const expWidth = (totalExpenditure / maxVal) * 100;
                const conWidth = (totalConsumed / maxVal) * 100;

                return (
                  <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase mb-2">TOTAL EXPENDITURE</p>
                           <p className="text-4xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{totalExpenditure.toLocaleString()} <span className="text-sm text-[#a0a5b5] font-sans">KCAL</span></p>
                           <div className="mt-2 text-[10px] font-bold text-[#a0a5b5] uppercase tracking-wider">
                              BASE: {baseMaintenance} + BURN: <span className="text-[#9b5de5]">{activeBurn}</span>
                           </div>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase mb-2">TOTAL INTAKE</p>
                           <p className="text-4xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{totalConsumed.toLocaleString()} <span className="text-sm text-[#a0a5b5] font-sans">KCAL</span></p>
                           <div className="mt-2 text-[10px] font-bold text-[#a0a5b5] uppercase tracking-wider">
                              TRACKED MACROS
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-1">
                           <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#a0a5b5]">
                              <span>EXPENDED</span>
                           </div>
                           <div className="w-full h-3 bg-[#0e111a] border border-[#1a1e2b] rounded-full overflow-hidden">
                              <div className="h-full bg-[#9b5de5] shadow-[0_0_10px_#9b5de5] transition-all duration-1000" style={{ width: `${expWidth}%` }}></div>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#a0a5b5]">
                              <span>CONSUMED</span>
                           </div>
                           <div className="w-full h-3 bg-[#0e111a] border border-[#1a1e2b] rounded-full overflow-hidden">
                              <div className="h-full bg-[#3be282] shadow-[0_0_10px_#3be282] transition-all duration-1000" style={{ width: `${conWidth}%` }}></div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#0e111a] border border-[#1a1e2b] p-4 flex justify-between items-center">
                        <span className="text-xs font-bold text-[#a0a5b5] uppercase tracking-widest">NET BALANCE</span>
                        <div className="text-right">
                           <span className={`text-2xl font-black ${balanceColor}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                              {balanceSign}{netBalance.toLocaleString()} KCAL
                           </span>
                           <p className={`text-[10px] font-bold uppercase tracking-widest ${balanceColor}`}>{balanceLabel}</p>
                        </div>
                     </div>
                  </div>
                );
             })()}
          </div>
        </div>

      </div>

    </div>
  );
}
