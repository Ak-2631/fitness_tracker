'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Plus, 
  Trash2, 
  Square, 
  Activity, 
  Zap, 
  Database,
  Target,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface SetRecord {
  weight: number;
  reps: number;
}

interface ExerciseRecord {
  id: string;
  name: string;
  sets: SetRecord[];
}

export default function ActiveWorkoutPage() {
  const { data: session } = useSession();
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminationSuccess, setTerminationSuccess] = useState(false);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      const mins = Math.floor(diff / 60).toString().padStart(2, '0');
      const secs = (diff % 60).toString().padStart(2, '0');
      setElapsedTime(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (session) {
      fetch('/api/workouts/exercises')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.exercises)) {
            setAvailableExercises(data.exercises);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const addExercise = () => {
    const ex = availableExercises.find(e => e.id === selectedExerciseId);
    if (!ex) return;
    setExercises([...exercises, { id: ex.id, name: ex.name, sets: [{ weight: 0, reps: 0 }] }]);
    setSelectedExerciseId('');
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({ 
      weight: lastSet?.weight || 0, 
      reps: lastSet?.reps || 0 
    });
    setExercises(newExercises);
  };

  const totalVolume = exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, s) => sAcc + ((s.weight || 0) * (s.reps || 0)), 0);
  }, 0);

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof SetRecord, value: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    if (newExercises[exerciseIndex].sets.length === 0) {
      newExercises.splice(exerciseIndex, 1);
    }
    setExercises(newExercises);
  };

  const handleTerminate = async () => {
    setIsTerminating(true);
    
    const flatSets: any[] = [];
    let totalVolumeCalc = 0;
    
    exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.weight && s.reps) {
          flatSets.push({
            exerciseId: ex.id,
            weight: Number(s.weight),
            reps: Number(s.reps)
          });
          totalVolumeCalc += Number(s.weight) * Number(s.reps);
        }
      });
    });

    if (flatSets.length === 0) {
      alert("NO COMBAT DATA. ABORTING TERMINATION.");
      setIsTerminating(false);
      return;
    }

    const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);

    try {
      const response = await fetch('/api/workouts/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sets: flatSets,
          totalVolume: totalVolumeCalc,
          duration,
          startTime: startTime.toISOString(),
          endTime: new Date().toISOString()
        })
      });
      if (response.ok) {
        setTerminationSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
         setIsTerminating(false);
         alert("ERROR LOGGING SESSION");
      }
    } catch (e) {
      console.error("TERMINATION_FAILURE:", e);
      setIsTerminating(false);
    }
  };

  if (terminationSuccess) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
           <CheckCircle2 className="text-[#3be282] drop-shadow-[0_0_15px_rgba(59,226,130,0.5)]" size={64} />
           <h2 className="text-4xl font-black uppercase text-white tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>SESSION TERMINATED</h2>
           <p className="text-[12px] font-bold text-[#a0a5b5] tracking-[0.3em] uppercase">SYNCING LOGS TO INTEL CORE...</p>
        </div>
     );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-32">
      
      {/* Top Banner Area */}
      <section className="glass-card flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#9b5de5] uppercase tracking-[0.3em] mb-2">
            <Activity size={14} /> COMMAND // WKT_OS_v4.2
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            WKT OS
          </h1>
          <p className="text-[14px] font-bold text-[#a0a5b5] tracking-[0.2em] uppercase">
            STATUS: <span className="text-[#9b5de5] animate-pulse">ACTIVE GYM SESSION</span>
          </p>
        </div>
      </section>

      {/* SESSION_TELEMETRY_STRIP */}
      <section className="grid grid-cols-3 gap-6">
         {[
           { label: 'EXECUTION TIME', val: elapsedTime, icon: Clock },
           { label: 'VOLUME DENSITY', val: `${totalVolume.toLocaleString()} KG`, icon: Database },
           { label: 'MOVEMENT COUNT', val: exercises.length, icon: Target }
         ].map(m => (
           <div key={m.label} className="glass-card flex flex-col items-center text-center">
              <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-2">
                 <m.icon size={16} /> {m.label}
              </p>
              <p className="text-4xl font-black tracking-tighter text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{m.val}</p>
           </div>
         ))}
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* LEF_COL: FIELD_INPUT_PROTOCOL */}
        <div className="col-span-8 space-y-6">
          <section className="glass-card space-y-6">
            <h3 className="text-2xl font-black tracking-tighter uppercase text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>ADD MOVEMENT PROTOCOL</h3>
            <div className="flex gap-4">
              <select 
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="flex-1 bg-[#0e111a] border border-[#1a1e2b] p-4 text-white text-[12px] font-bold uppercase tracking-widest outline-none focus:border-[#9b5de5] transition-all"
              >
                <option value="">SELECT MOVEMENT</option>
                {availableExercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
              <button 
                onClick={addExercise}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} /> DEPLOY
              </button>
            </div>
          </section>

          <section className="space-y-6">
            {exercises.map((ex, exIndex) => (
              <div key={exIndex} className="glass-card space-y-6 border-l-4 border-l-[#9b5de5]">
                <div className="flex justify-between items-center border-b border-[#1a1e2b] pb-4">
                   <h3 className="text-2xl font-black tracking-tighter uppercase text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>{ex.name}</h3>
                   <button onClick={() => addSet(exIndex)} className="text-[#9b5de5] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[#f3a6ff] transition-colors">
                     <Plus size={14} /> ADD SET
                   </button>
                </div>
                <div className="space-y-2">
                  {ex.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-12 gap-4 items-center p-4 bg-[#0e111a] border border-[#1a1e2b]">
                       <div className="col-span-1 text-[10px] font-bold text-[#a0a5b5] uppercase tabular-nums">S_0{setIndex+1}</div>
                       <div className="col-span-4 flex items-center gap-3">
                          <input 
                            type="number" 
                            value={set.weight || ''} 
                            onChange={(e) => updateSet(exIndex, setIndex, 'weight', parseInt(e.target.value))}
                            placeholder="LOAD"
                            className="w-full bg-transparent border-b border-[#1a1e2b] text-white p-2 font-black text-xl outline-none focus:border-[#9b5de5] transition-colors"
                          />
                          <span className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">KG</span>
                       </div>
                       <div className="col-span-4 flex items-center gap-3">
                          <input 
                            type="number" 
                            value={set.reps || ''} 
                            onChange={(e) => updateSet(exIndex, setIndex, 'reps', parseInt(e.target.value))}
                            placeholder="REPS"
                            className="w-full bg-transparent border-b border-[#1a1e2b] text-white p-2 font-black text-xl outline-none focus:border-[#9b5de5] transition-colors"
                          />
                          <span className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-widest">REPS</span>
                       </div>
                       <div className="col-span-3 flex justify-end">
                          <button onClick={() => removeSet(exIndex, setIndex)} className="p-2 text-[#a0a5b5] hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT_COL: COMMAND_INTERACTIONS */}
        <div className="col-span-4 space-y-6">
           <section className="glass-card flex flex-col justify-between h-full border-[#9b5de5]/30">
              <div className="space-y-4 mb-12">
                 <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.4em]">SYSTEM ACTION</p>
                 <button 
                  onClick={() => window.location.href = '/workouts/execute'}
                  className="w-full border border-[#1a1e2b] text-[#a0a5b5] p-4 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a1e2b] hover:text-white transition-all flex items-center justify-center gap-2"
                 >
                   LAUNCH FOCUS <Zap size={14} />
                 </button>
              </div>

              <div className="space-y-4 mt-auto">
                 <p className="text-[10px] font-bold text-[#a0a5b5] uppercase tracking-[0.4em]">FINALIZE SESSION</p>
                 <button 
                  onClick={handleTerminate}
                  disabled={isTerminating || exercises.length === 0}
                  className="w-full bg-red-500/10 text-red-500 border border-red-500/30 p-4 font-black text-sm uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isTerminating ? 'TERMINATING...' : 'TERMINATE PROTOCOL'} <Square size={16} />
                 </button>
              </div>
           </section>
        </div>
      </div>

    </div>
  );
}
