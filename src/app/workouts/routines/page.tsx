'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Dumbbell, Save, ChevronRight, Loader2, Info, BookOpen, Clock, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
}

interface Routine {
  id: string;
  name: string;
  exercises: string; // JSON string
  createdAt: string;
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [routinesRes, exercisesRes] = await Promise.all([
          fetch('/api/workouts/routines'),
          fetch('/api/workouts/exercises')
        ]);
        
        if (routinesRes.ok && exercisesRes.ok) {
          const routinesData = await routinesRes.json();
          const exercisesData = await exercisesRes.json();
          setRoutines(routinesData.routines);
          setExercises(exercisesData.exercises);
        }
      } catch (err) {
        console.error("Failed to load routines/exercises", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addExerciseToRoutine = (exercise: Exercise) => {
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExerciseFromRoutine = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
  };

  const createRoutine = async () => {
    if (!newRoutineName || selectedExercises.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/workouts/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoutineName,
          exercises: selectedExercises.map(e => e.id)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRoutines([data.routine, ...routines]);
        setNewRoutineName('');
        setSelectedExercises([]);
        setCreating(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteRoutine = async (id: string) => {
    if (!confirm('TERMINATE_PROTOCOL? THIS_ACTION_IS_IRREVERSIBLE.')) return;
    
    try {
      const res = await fetch(`/api/workouts/routines/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRoutines(routines.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error("DESTRUCTION_FAILURE:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32">
        <Activity className="animate-spin text-brand mb-4" size={48} />
        <p className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">INITIATING_ROUTINE_DATABASE...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-24 bg-black min-h-screen pb-32">
      
      {/* 01. ROUTINES_HEADER */}
      <section className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
             <BookOpen size={14} /> COMMAND // ROUTINES_v4.2
          </div>
          <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-6 italic">
            ROUTINES
          </h1>
          <div className="flex items-center gap-3 text-brand">
            <Zap size={24} fill="#D0FF00" />
             <p className="text-2xl font-black italic tracking-tighter uppercase">
               STATUS: SELECT_TACTICAL_TEMPLATE
             </p>
          </div>
        </div>

        <button 
          onClick={() => setCreating(!creating)}
          className={`px-12 py-6 font-black italic tracking-widest text-sm uppercase transition-all border ${creating ? 'border-white text-white' : 'bg-brand text-black border-brand'}`}
        >
          {creating ? 'CANCEL_PROTOCOL' : 'NEW_PROTOCOL'}
        </button>
      </section>

      {/* 02. ROUTINE_CREATION_LANE */}
      <AnimatePresence>
        {creating && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-b border-white/10 py-16 space-y-12 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white">FORGE_NEW_PROTOCOL</h3>
               <p className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase font-sans">PROTOCOL_ENGINE</p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">DESIGNATION</p>
              <input 
                 className="w-full bg-white/5 border border-white/10 p-6 text-xl font-black uppercase tracking-tighter text-white focus:border-brand focus:outline-none"
                 placeholder="e.g. HYPERTROPHY_BASE_A"
                 value={newRoutineName}
                 onChange={(e) => setNewRoutineName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-16">
               <div className="space-y-8">
                  <header className="flex justify-between items-center border-b border-white/5 pb-4">
                     <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">LIBRARY_EXTRACTION</h4>
                     <span className="text-[10px] font-black text-brand uppercase">{exercises.length}_AVAILABLE</span>
                  </header>
                  <div className="max-h-[400px] overflow-y-auto space-y-px">
                     {exercises.map(ex => (
                       <div 
                         key={ex.id}
                         onClick={() => addExerciseToRoutine(ex)}
                         className="p-6 bg-white/[0.02] border border-white/5 flex justify-between items-center hover:bg-white/10 cursor-pointer transition-all group"
                       >
                         <div>
                            <p className="text-lg font-black uppercase text-white group-hover:text-brand">{ex.name}</p>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{ex.targetMuscle} // {ex.equipment}</p>
                         </div>
                         <Plus size={16} className="text-white/20" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-8">
                  <header className="flex justify-between items-center border-b border-white/5 pb-4">
                     <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">SEQUENCE_ARCHITECTURE</h4>
                     <span className="text-[10px] font-black text-brand uppercase">{selectedExercises.length}_DIRECTIVES</span>
                  </header>
                  <div className="min-h-[100px] max-h-[400px] overflow-y-auto bg-brand/[0.02] border border-brand/10 space-y-px">
                     {selectedExercises.map((ex, i) => (
                       <div key={ex.id} className="p-6 bg-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-6">
                             <span className="text-[10px] font-black text-brand italic">0{i+1}</span>
                             <p className="text-lg font-black uppercase text-white">{ex.name}</p>
                          </div>
                          <button onClick={() => removeExerciseFromRoutine(ex.id)} className="text-white/20 hover:text-red-500">
                             <Trash2 size={16} />
                          </button>
                       </div>
                     ))}
                  </div>
                  <div className="pt-8">
                     <button 
                       onClick={createRoutine}
                       disabled={saving || !newRoutineName || selectedExercises.length === 0}
                       className="w-full bg-brand text-black p-8 font-black italic uppercase tracking-widest text-xl hover:scale-[1.01] transition-all disabled:opacity-30"
                     >
                        {saving ? 'SYNCHRONIZING...' : 'COMMIT_STRUCTURE'}
                     </button>
                  </div>
               </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 03. TEMPLATE_GRID */}
      <section className="grid grid-cols-3 gap-12">
        {routines.map(routine => {
          const routineExercises = JSON.parse(routine.exercises);
          return (
            <div key={routine.id} className="bg-white/5 border border-white/10 p-10 flex flex-col justify-between hover:border-brand transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Dumbbell size={80} />
               </div>
               
               <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                     <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none pr-8">{routine.name}</h3>
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRoutine(routine.id);
                          }}
                          className="text-white/10 hover:text-red-500 transition-colors"
                        >
                           <Trash2 size={16} />
                        </button>
                        <Clock size={16} className="text-white/20" />
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-brand tracking-widest uppercase italic">{routineExercises.length}_EXERCISE_PROTOCOLS</p>
                     <div className="flex flex-wrap gap-2">
                        {routineExercises.slice(0, 4).map((exId: string) => {
                          const ex = exercises.find(e => e.id === exId);
                          return ex ? (
                            <span key={exId} className="text-[9px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-2 py-1">
                              {ex.name}
                            </span>
                          ) : null;
                        })}
                     </div>
                  </div>
               </div>

               <button className="w-full mt-12 bg-white/5 border border-white/10 py-6 font-black italic uppercase tracking-widest text-sm hover:bg-brand hover:text-black hover:border-brand transition-all flex items-center justify-between px-8">
                  START_PROTOCOL <ChevronRight size={18} />
               </button>
            </div>
          );
        })}
      </section>

      {/* 04. SYSTEM_AWARENESS */}
      <section className="p-10 border border-brand/20 bg-brand/[0.02] flex gap-8">
         <Info className="text-brand shrink-0" size={32} />
         <div className="space-y-2">
            <h4 className="text-lg font-black italic uppercase tracking-widest text-brand">SUBJECT_AWARENESS</h4>
            <p className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
               ROUTINES REPRESENT PRE-CALCULATED PERFORMANCE PATHS. CONSISTENT ADHERENCE INCREASES DISCIPLINE_SCORE AND METABOLIC XP.
            </p>
         </div>
      </section>

    </div>
  );
}
