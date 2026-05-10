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
       <Activity className="text-brand animate-spin mb-4" size={48} />
       <p className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">RECALIBRATING_SYSTEM_KERNEL...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-24 bg-black min-h-screen">
      
      {/* 01. SETTINGS_HUD_HEADER */}
      <section className="flex justify-between items-end border-b border-white/5 pb-16">
        <div>
          <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
             <Settings size={14} /> SYSTEM_KERNEL // CALIBRATION_v0.2
          </div>
          <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-2 italic">
            SETTINGS
          </h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand text-black px-16 py-8 font-black italic tracking-widest text-2xl uppercase hover:scale-[1.02] transition-all"
        >
          {isSaving ? 'OPTIMIZING...' : savedStatus ? 'CONFIG_LOCKED' : 'COMMIT_CONFIG'}
        </button>
      </section>

      <div className="grid grid-cols-12 gap-16">
        
        {/* LEF_COL: CALIBRATION_PARAMETERS */}
        <div className="col-span-8 space-y-20">
          
          <section className="space-y-12">
            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic pb-4 border-b border-white/5">IDENT_PROTOCOL</h3>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest italic font-sans">OPERATOR_ALIAS</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 p-6 text-2xl font-black italic text-white outline-none focus:border-brand transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest italic font-sans">ACCESS_LEVEL</label>
                <div className="w-full bg-black border border-white/10 p-6 text-2xl font-black italic text-white/20 cursor-not-allowed">
                  SUPERUSER_01
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic pb-4 border-b border-white/5">FUELING_CALIBRATION</h3>
            <div className="grid grid-cols-2 gap-12">
              {[
                { label: 'CALORIE_TARGET_KCAL', key: 'targetCalories' },
                { label: 'PROTEIN_TARGET_G', key: 'targetProtein' },
                { label: 'CARB_TARGET_G', key: 'targetCarbs' },
                { label: 'WATER_TARGET_ML', key: 'targetWater' }
              ].map(field => (
                <div key={field.label} className="space-y-4">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest italic font-sans">{field.label}</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 p-6 text-4xl font-black italic text-brand outline-none focus:border-brand transition-all"
                    value={(formData as any)[field.key]}
                    onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-brand/5 border border-brand/20 p-10 space-y-6">
             <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-brand flex items-center justify-center text-black">
                   <Shield size={32} />
                </div>
                <div>
                   <h4 className="text-2xl font-black uppercase italic mb-2">NEURAL_PRIVACY_ACTIVE</h4>
                   <p className="text-[11px] font-black text-white/40 uppercase tracking-tighter leading-loose">
                     ALL PERFORMANCE TELEMETRY IS SECURED UNDER AES-256 ENCRYPTION // NO DATA DEVIATION PERMITTED // SECTOR-01 ENHANCED
                   </p>
                </div>
             </div>
          </section>
        </div>

        {/* RIGHT_COL: KERNEL_DIAGNOSTICS */}
        <div className="col-span-4 space-y-12">
           <section className="border border-white/5 bg-white/5 p-10 space-y-10">
              <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic mb-6">SYSTEM_DAEMONS</h3>
              <div className="space-y-8">
                 {[
                   { label: 'STITCH_SYNC_ENGINE', status: 'ACTIVE', color: 'text-brand' },
                   { label: 'WKT_OS_KERNEL', status: 'STANDBY', color: 'text-white/20' },
                   { label: 'BIO_FEEDBACK_MATRIX', status: 'ENCRYPTED', color: 'text-brand' },
                   { label: 'XP_LEDGER_SYNC', status: 'SYNCHRONIZED', color: 'text-brand' }
                 ].map(daemon => (
                   <div key={daemon.label} className="flex justify-between items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <p className="text-[10px] font-black text-white/40 tracking-wider uppercase truncate">{daemon.label}</p>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className={`w-1.5 h-1.5 ${daemon.color === 'text-brand' ? 'bg-brand animate-pulse' : 'bg-white/10'}`} />
                        <span className={`text-[10px] font-black uppercase italic ${daemon.color}`}>{daemon.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           <div className="border border-white/5 p-10 bg-black relative overflow-hidden group hover:bg-white/[0.02] transition-all">
              <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-all">
                 <RefreshCw size={160} className="animate-spin-slow" />
              </div>
              <h4 className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase mb-4 italic">LAST_MAINTENANCE</h4>
              <p className="text-xl lg:text-2xl font-black italic mb-8 break-words leading-tight">APR_25_2026 // 20:07_IST</p>
              <button 
                className="w-full border border-white/10 text-white/20 p-4 text-[10px] font-black tracking-widest uppercase hover:border-red-500 hover:text-red-500 transition-all font-sans break-words"
              >
                FORCE_SYSTEM_RESET
              </button>
           </div>
        </div>

      </div>

      <footer className="pt-24 opacity-10 pb-16">
         <p className="text-[10px] font-black tracking-[1em] uppercase text-center">KINETIC // KERNEL_STABLE_v0.2</p>
      </footer>
    </div>
  );
}
