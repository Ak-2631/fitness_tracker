'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Plus, 
  Trash2, 
  Play, 
  Square, 
  PlusCircle, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Database,
  ChevronRight,
  Target,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@/lib/analytics';

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
          } else {
            console.error("EXPECTED_ARRAY_GOT:", data);
            setAvailableExercises([]);
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
    let totalVolume = 0;
    
    exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.weight && s.reps) {
          flatSets.push({
            exerciseId: ex.id,
            weight: Number(s.weight),
            reps: Number(s.reps)
          });
          totalVolume += Number(s.weight) * Number(s.reps);
        }
      });
    });

    if (flatSets.length === 0) {
      alert("No valid sets completed. Cannot save empty session.");
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
          totalVolume,
          duration,
          startTime: startTime.toISOString(),
          endTime: new Date().toISOString()
        })
      });
      if (response.ok) {
        window.location.href = '/dashboard';
      }
    } catch (e) {
      console.error("TERMINATION_FAILURE:", e);
    } finally {
      setIsTerminating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-24 bg-black min-h-screen">
      
      {/* 01. WKT_HUD_HEADER */}
      <section>
        <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
           <Activity size={14} /> COMMAND // WKT_OS_v4.2
        </div>
        <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-6 italic">
          WKT_OS
        </h1>
        <div className="flex items-center gap-3 text-brand">
          <Zap size={24} fill="#D0FF00" />
          <p className="text-2xl font-black italic tracking-tighter uppercase">
            STATUS: ACTIVE_COMBAT_SESSION
          </p>
        </div>
      </section>

      {/* 02. SESSION_TELEMETRY_STRIP */}
      <section className="grid grid-cols-3 gap-12 py-8 border-y border-white/5 bg-white/[0.02]">
         {[
           { label: 'EXECUTION_TIME', val: elapsedTime, icon: Clock },
           { label: 'VOLUME_DENSITY', val: `${totalVolume.toLocaleString()} KG`, icon: Database },
           { label: 'MOVEMENT_COUNT', val: exercises.length, icon: Target }
         ].map(m => (
           <div key={m.label} className="flex flex-col items-center text-center">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{m.label}</p>
              <p className="text-4xl font-black italic text-white tracking-tighter">{m.val}</p>
           </div>
         ))}
      </section>

      <div className="grid grid-cols-12 gap-16">
        {/* LEF_COL: FIELD_INPUT_PROTOCOL */}
        <div className="col-span-8 space-y-16">
          <section className="p-12 border border-white/5 bg-white/5 space-y-8">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">ADD_MOVEMENT_PROTOCOL</h3>
            <div className="flex gap-4">
              <select 
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="flex-1 bg-black border border-white/10 p-6 text-white text-[12px] font-black uppercase tracking-widest outline-none focus:border-brand transition-all"
              >
                <option value="">SELECT_MOVEMENT</option>
                {availableExercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
              <button 
                onClick={addExercise}
                className="bg-brand text-black px-12 font-black uppercase tracking-widest text-[12px] hover:scale-105 transition-all"
              >
                DEPLOY
              </button>
            </div>
          </section>

          <section className="space-y-12">
            {exercises.map((ex, exIndex) => (
              <div key={exIndex} className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                   <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white">{ex.name}</h3>
                   <button onClick={() => addSet(exIndex)} className="text-brand text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-100 opacity-60">
                     <Plus size={12} /> ADD_SET
                   </button>
                </div>
                <div className="space-y-px">
                  {ex.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-12 gap-4 items-center py-4 bg-white/[0.02] px-6">
                       <div className="col-span-1 text-[10px] font-black text-white/20 uppercase tabular-nums">S_0{setIndex+1}</div>
                       <div className="col-span-4 flex items-center gap-3">
                          <input 
                            type="number" 
                            value={set.weight || ''} 
                            onChange={(e) => updateSet(exIndex, setIndex, 'weight', parseInt(e.target.value))}
                            placeholder="LOAD"
                            className="w-full bg-transparent border-b border-white/5 text-white p-2 font-black italic text-xl outline-none focus:border-brand"
                          />
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">KG</span>
                       </div>
                       <div className="col-span-4 flex items-center gap-3">
                          <input 
                            type="number" 
                            value={set.reps || ''} 
                            onChange={(e) => updateSet(exIndex, setIndex, 'reps', parseInt(e.target.value))}
                            placeholder="REPS"
                            className="w-full bg-transparent border-b border-white/5 text-white p-2 font-black italic text-xl outline-none focus:border-brand"
                          />
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">REPS</span>
                       </div>
                       <div className="col-span-3 flex justify-end">
                          <button onClick={() => removeSet(exIndex, setIndex)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
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
        <div className="col-span-4 space-y-8">
           <section className="bg-white/5 p-10 border border-white/5 space-y-12">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">SYSTEM_ACTION</p>
                 <button 
                  onClick={() => {
                    Analytics.track({ name: 'Execution_Mode_Launched' });
                    window.location.href = '/workouts/execute';
                  }}
                  className="w-full bg-brand text-white p-3 font-black italic text-sm uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group whitespace-nowrap overflow-hidden text-ellipsis"
                 >
                   LAUNCH_FOCUS <Zap size={16} className="group-hover:animate-bounce" />
                 </button>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">FINALIZE_SESSION</p>
                 <button 
                  onClick={handleTerminate}
                  disabled={isTerminating || exercises.length === 0}
                  className="w-full border border-white/10 text-white p-3 font-black italic text-sm uppercase tracking-widest hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
                 >
                   TERMINATE <Square size={16} />
                 </button>
              </div>
           </section>


        </div>
      </div>

    </div>
  );
}
