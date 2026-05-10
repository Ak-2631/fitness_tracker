'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  AlertTriangle, 
  Target, 
  Clock, 
  Zap, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import InputField from '@/components/ui/InputField';
import Badge from '@/components/ui/Badge';

export default function Plan() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (deadline) {
      const selectedTime = new Date(`${tomorrowStr}T${deadline}`);
      const hoursFromNow = (selectedTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
      
      if (hoursFromNow < 12) {
        setWarning('Operational Alert: Tight execution window. Verify realism.');
      } else if (title.trim().length > 0 && priority >= 8 && hoursFromNow < 16) {
        setWarning('Priority Advisory: Critical directives require maximum cognitive buffer.');
      } else {
        setWarning('');
      }
    }
  }, [deadline, priority, title, tomorrowStr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          priority,
          energyLevel,
          estimatedTime,
          datePlannedFor: tomorrow,
          deadline: deadline ? `${tomorrowStr}T${deadline}:00Z` : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to plan task');

      setTitle('');
      setPriority(5);
      setEnergyLevel(3);
      setEstimatedTime(30);
      setDeadline('');
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in max-w-[900px] flex flex-col gap-[var(--space-6)]">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[var(--font-label)] font-black uppercase tracking-[0.2em] text-white/40">STRATEGIC_COMMAND</span>
          </div>
          <h1 className="text-[var(--font-h1)] font-black mb-2 leading-tight">Mission Planning</h1>
          <p className="text-[var(--font-body)] text-white/60">Synchronize directives for system day: <span className="text-blue-500 font-bold">{tomorrow.toLocaleDateString()}</span></p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[var(--space-6)] items-start">
        
        <GlassCard padding="lg" className="relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-[var(--font-h2)] flex items-center gap-3">
                <PlusCircle size={22} className="text-blue-500" />
                Queue Directive
             </h2>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold mb-6 flex items-center gap-3 animate-shake">
              <AlertTriangle size={18} />
              ERROR: {error}
            </div>
          )}

          {warning && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-sm font-bold mb-8 flex items-center gap-3">
              <Info size={18} />
              <span>{warning}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-5)]">
            <InputField 
              label="OBJECTIVE_TITLE" 
              placeholder="Declare your intent..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
               <div className="flex flex-col gap-2">
                 <label className="text-[var(--font-label)] font-black text-white/30 uppercase tracking-widest px-1">PRIORITY_LOCKED</label>
                 <select 
                   className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white font-bold focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                   value={priority}
                   onChange={(e) => setPriority(parseInt(e.target.value))}
                 >
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <option key={i} value={i} className="bg-[#0f1115]">LVL {i} {i >= 8 ? 'CRITICAL' : i >= 5 ? 'STABLE' : 'ROUTINE'}</option>)}
                 </select>
               </div>
               
               <InputField 
                 label="TIME_ALLOCATION (MIN)" 
                 type="number"
                 min={5}
                 max={480}
                 step={5}
                 value={estimatedTime}
                 onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                 required
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-4)]">
               <div className="flex flex-col gap-2">
                 <label className="text-[var(--font-label)] font-black text-white/30 uppercase tracking-widest px-1">ENERGY_LOAD</label>
                 <div className="flex gap-2">
                   {[1,2,3,4,5].map(i => (
                     <button
                        key={i}
                        type="button"
                        onClick={() => setEnergyLevel(i)}
                        className={`flex-1 h-12 rounded-xl border border-transparent transition-all flex items-center justify-center group ${i <= energyLevel ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
                     >
                        <Zap size={18} fill={i <= energyLevel ? 'currentColor' : 'none'} className={i <= energyLevel ? '' : 'group-hover:text-amber-500/50'} />
                     </button>
                   ))}
                 </div>
               </div>
               
               <InputField 
                 label="DEADLINE_SYNC" 
                 type="time"
                 value={deadline}
                 onChange={(e) => setDeadline(e.target.value)}
               />
            </div>

            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              className="w-full mt-4" 
              disabled={loading}
              isLoading={loading}
            >
              COMMIT_DIRECTIVE
              {!loading && <ChevronRight size={20} className="ml-2" />}
            </Button>
          </form>
        </GlassCard>

        <div className="flex flex-col gap-[var(--space-4)] sticky top-6">
           <GlassCard padding="md" className="relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <div className="flex items-center gap-3 mb-4">
                <Info size={18} className="text-blue-500" />
                <h3 className="font-bold">Realism Protocol</h3>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Operational capacity is limited to <span className="text-red-400 font-black">8 tasks per cycle</span>. 
                Over-commitment triggers neural fatigue and decreases the Discipline Score.
              </p>
           </GlassCard>

           <GlassCard padding="md" className="bg-white/[0.01] border-dashed border-white/10">
              <div className="text-[var(--font-label)] font-black text-white/30 mb-4 uppercase tracking-[0.2em]">ACTIVE_WINDOW</div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                   <Calendar className="text-blue-500" size={20} />
                 </div>
                 <div>
                    <div className="font-black text-sm uppercase tracking-wider">{tomorrow.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <div className="text-xs text-white/40 font-mono italic">{tomorrow.toLocaleDateString()}</div>
                 </div>
              </div>
           </GlassCard>
        </div>

      </div>
    </div>
  );
}
