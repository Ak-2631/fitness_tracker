'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Shield, 
  Database, 
  Settings, 
  ChevronRight, 
  Zap, 
  Cpu, 
  Lock,
  RefreshCw,
  Plus,
  Save,
  CheckCircle2,
  Loader2,
  Activity
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const [formData, setFormData] = useState({
    baseExpenditure: '',
    targetCalories: '',
    targetProtein: '',
    targetCarbs: '',
    targetWater: '',
    name: ''
  });

  useEffect(() => {
    if (session) {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data.user);
          setFormData({
            baseExpenditure: data.user.baseExpenditure?.toString() || '2400',
            targetCalories: data.user.targetCalories?.toString() || '2500',
            targetProtein: data.user.targetProtein?.toString() || '150',
            targetCarbs: data.user.targetCarbs?.toString() || '300',
            targetWater: data.user.targetWater?.toString() || '2000',
            name: data.user.name || ''
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session]);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedStatus(false);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSavedStatus(true);
        setTimeout(() => setSavedStatus(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32">
       <Activity className="text-[#9b5de5] animate-spin mb-4" size={48} />
       <p className="text-[12px] font-black text-[#9b5de5] tracking-[0.5em] uppercase">RECALIBRATING SYSTEM KERNEL...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-32">
      
      {/* Top Banner Area */}
      <section className="glass-card flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#9b5de5] uppercase tracking-[0.3em] mb-2">
             <Settings size={14} /> SYSTEM KERNEL // CALIBRATION_v0.2
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            SETTINGS
          </h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`btn-primary flex items-center gap-2 ${savedStatus ? 'bg-[#3be282] text-black border-[#3be282]' : ''}`}
        >
          {isSaving ? (
            <><RefreshCw size={18} className="animate-spin" /> SAVING...</>
          ) : savedStatus ? (
            <><CheckCircle2 size={18} /> CHANGES SAVED</>
          ) : (
            <><Save size={18} /> SAVE CHANGES</>
          )}
        </button>
      </section>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEF_COL: CALIBRATION_PARAMETERS */}
        <div className="col-span-8 space-y-6">
          
          <section className="glass-card space-y-6">
            <h3 className="text-2xl font-black tracking-tighter uppercase text-white pb-4 border-b border-[#1a1e2b]" style={{ fontFamily: 'Orbitron, sans-serif' }}>IDENT PROTOCOL</h3>
            <div className="grid grid-cols-1 gap-6 max-w-md">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">OPERATOR NAME</label>
                <input 
                  className="w-full bg-[#0e111a] border border-[#1a1e2b] p-4 text-xl font-bold text-white outline-none focus:border-[#9b5de5] transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="glass-card space-y-6">
            <h3 className="text-2xl font-black tracking-tighter uppercase text-white pb-4 border-b border-[#1a1e2b]" style={{ fontFamily: 'Orbitron, sans-serif' }}>CALORIE DETAILS</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'BASE EXPENDITURE (KCAL)', key: 'baseExpenditure' },
                { label: 'CALORIE TARGET (KCAL)', key: 'targetCalories' },
                { label: 'PROTEIN TARGET (G)', key: 'targetProtein' },
                { label: 'CARB TARGET (G)', key: 'targetCarbs' },
                { label: 'WATER TARGET (ML)', key: 'targetWater' }
              ].map(field => (
                <div key={field.label} className="space-y-4">
                  <label className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">{field.label}</label>
                  <input 
                    type="number"
                    className="w-full bg-[#0e111a] border border-[#1a1e2b] p-4 text-3xl font-black text-[#9b5de5] outline-none focus:border-[#9b5de5] transition-all"
                    value={(formData as any)[field.key]}
                    onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card border-l-4 border-l-[#3be282] space-y-4 bg-[#3be282]/5">
             <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#3be282]/20 flex items-center justify-center text-[#3be282] rounded-full shrink-0">
                   <Shield size={24} />
                </div>
                <div>
                   <h4 className="text-lg font-black uppercase text-white tracking-widest mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>NEURAL PRIVACY ACTIVE</h4>
                   <p className="text-[11px] font-bold text-[#a0a5b5] uppercase tracking-wider leading-relaxed">
                     ALL PERFORMANCE TELEMETRY IS SECURED UNDER AES-256 ENCRYPTION. NO DATA DEVIATION PERMITTED. SECTOR-01 ENHANCED.
                   </p>
                </div>
             </div>
          </section>
        </div>

        {/* RIGHT_COL: KERNEL_DIAGNOSTICS */}
        <div className="col-span-4 space-y-6">
           <div className="glass-card border-red-500/20 relative overflow-hidden group hover:border-red-500/50 transition-all flex flex-col justify-between h-[200px]">
              <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-all text-red-500">
                 <RefreshCw size={160} className="animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase mb-2">LAST MAINTENANCE</h4>
                <p className="text-xl font-black text-white break-words" style={{ fontFamily: 'Orbitron, sans-serif' }}>APR_25_2026</p>
                <p className="text-xs text-[#a0a5b5] mt-1 font-mono">20:07_IST</p>
              </div>
              <button 
                className="w-full border border-[#1a1e2b] text-[#a0a5b5] p-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all font-sans break-words z-10 relative"
              >
                FORCE SYSTEM RESET
              </button>
           </div>
        </div>

      </div>

    </div>
  );
}
