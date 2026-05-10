'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Play, Square, Dumbbell, Activity, Flame, Save, BarChart3, ChevronRight, X } from 'lucide-react';

type Exercise = { id: string; name: string; targetMuscle: string };
type Set = { weight: string; reps: string; isCompleted: boolean };
type SessionExercise = { exerciseId: string; exerciseName: string; sets: Set[] };

export default function WorkoutTracker() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([]);
  const [isSelectingExercise, setIsSelectingExercise] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [durationTimer, setDurationTimer] = useState(0);

  useEffect(() => {
    fetch('/api/workouts/exercises')
      .then(res => res.json())
      .then(data => {
        if (data.exercises) setExercises(data.exercises);
      });
  }, []);

  useEffect(() => {
    let interval: any;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setDurationTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setStartTime(new Date());
    setDurationTimer(0);
  };

  const addExerciseToSession = (exercise: Exercise) => {
    setSessionExercises([...sessionExercises, {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [{ weight: '', reps: '', isCompleted: false }]
    }]);
    setIsSelectingExercise(false);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...sessionExercises];
    const prevSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
    updated[exerciseIndex].sets.push({
      weight: prevSet ? prevSet.weight : '',
      reps: prevSet ? prevSet.reps : '',
      isCompleted: false
    });
    setSessionExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const updated = [...sessionExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setSessionExercises(updated);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const updated = [...sessionExercises];
    updated[exerciseIndex].sets[setIndex].isCompleted = !updated[exerciseIndex].sets[setIndex].isCompleted;
    setSessionExercises(updated);
  };

  const removeExercise = (exerciseIndex: number) => {
    const updated = [...sessionExercises];
    updated.splice(exerciseIndex, 1);
    setSessionExercises(updated);
  };

  const finishWorkout = async () => {
    if (!startTime) return;
    const allSets = sessionExercises.flatMap(se => 
      se.sets.filter(s => s.isCompleted && s.weight && s.reps).map(s => ({
        exerciseId: se.exerciseId,
        weight: parseFloat(s.weight),
        reps: parseInt(s.reps)
      }))
    );

    if (allSets.length === 0) {
      alert("No completed sets to save!");
      return;
    }

    const totalVolume = allSets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
    const durationMins = Math.floor(durationTimer / 60);

    const payload = {
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      duration: durationMins,
      totalVolume,
      sets: allSets
    };

    const res = await fetch('/api/workouts/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("WORKOUT_SAVED_TO_MAINFRAME");
      setIsWorkoutActive(false);
      setSessionExercises([]);
      setStartTime(null);
      setDurationTimer(0);
    } else {
      alert("ERROR_SAVING_WORKOUT");
    }
  };

  return (
    <div className="bg-black border border-white/10 rounded-sm flex flex-col overflow-hidden w-full h-full">
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">TRAINING_MODULE</h3>
          <Dumbbell className="text-brand" size={20} />
        </div>
        {isWorkoutActive && (
          <div className="bg-brand/20 text-brand px-4 py-2 font-black italic tracking-widest text-sm uppercase rounded-sm flex items-center gap-2">
            <Flame size={14} /> {formatDuration(durationTimer)}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col min-h-[400px]">
        {!isWorkoutActive ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <Activity size={48} className="text-white/10" />
            <p className="text-[12px] font-black text-white/40 tracking-[0.3em] uppercase italic text-center">
              AWAITING_TRAINING_INITIATION<br/>
              <span className="text-white/20 text-[10px]">RECORD_YOUR_STRENGTH_DATA</span>
            </p>
            <button 
              onClick={startWorkout}
              className="bg-brand text-black px-12 py-4 font-black italic tracking-widest uppercase flex items-center gap-3 hover:scale-105 transition-all"
            >
              <Play fill="black" size={16} /> INITIATE_WORKOUT
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-8">
            
            {/* EXERCISES LIST */}
            <div className="space-y-6 flex-1">
              {sessionExercises.length === 0 ? (
                <div className="py-12 border border-dashed border-white/10 flex flex-col items-center justify-center opacity-40">
                  <Dumbbell size={32} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">NO_EXERCISES_ADDED_YET</p>
                </div>
              ) : (
                sessionExercises.map((se, eIndex) => (
                  <div key={eIndex} className="bg-white/[0.02] border border-white/5 p-4 space-y-4 relative group">
                    <button 
                      onClick={() => removeExercise(eIndex)}
                      className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                    <h4 className="text-lg font-black text-brand uppercase italic tracking-tight">{se.exerciseName}</h4>
                    
                    {/* SETS HEADER */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 pb-2 border-b border-white/5">
                      <div className="col-span-2 text-center">SET</div>
                      <div className="col-span-4 text-center">KG</div>
                      <div className="col-span-4 text-center">REPS</div>
                      <div className="col-span-2 text-center"><Check size={12} className="mx-auto" /></div>
                    </div>

                    {/* SETS LIST */}
                    <div className="space-y-2">
                      {se.sets.map((set, sIndex) => (
                        <div key={sIndex} className={`grid grid-cols-12 gap-2 items-center p-2 transition-colors ${set.isCompleted ? 'bg-brand/10' : ''}`}>
                          <div className="col-span-2 text-center text-xs font-black text-white/50">{sIndex + 1}</div>
                          <div className="col-span-4">
                            <input 
                              type="number" 
                              value={set.weight}
                              onChange={(e) => updateSet(eIndex, sIndex, 'weight', e.target.value)}
                              className="w-full bg-black border border-white/10 p-2 text-center text-sm font-bold text-white outline-none focus:border-brand"
                              placeholder="0"
                              disabled={set.isCompleted}
                            />
                          </div>
                          <div className="col-span-4">
                            <input 
                              type="number" 
                              value={set.reps}
                              onChange={(e) => updateSet(eIndex, sIndex, 'reps', e.target.value)}
                              className="w-full bg-black border border-white/10 p-2 text-center text-sm font-bold text-white outline-none focus:border-brand"
                              placeholder="0"
                              disabled={set.isCompleted}
                            />
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <button 
                              onClick={() => toggleSetComplete(eIndex, sIndex)}
                              className={`w-8 h-8 flex items-center justify-center rounded-sm transition-all ${set.isCompleted ? 'bg-brand text-black' : 'bg-white/10 text-white/30 hover:bg-white/20'}`}
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ADD SET BTN */}
                    <button 
                      onClick={() => addSet(eIndex)}
                      className="w-full py-2 border border-dashed border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/30 transition-all flex justify-center items-center gap-2"
                    >
                      <Plus size={12} /> ADD_SET
                    </button>
                  </div>
                ))
              )}

              {/* SELECT EXERCISE OVERLAY OR BUTTON */}
              {isSelectingExercise ? (
                <div className="bg-black border border-brand/50 p-4 max-h-[300px] overflow-y-auto space-y-2 relative">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50">SELECT_EXERCISE</h5>
                    <button onClick={() => setIsSelectingExercise(false)}><X size={14} className="text-white/50 hover:text-white" /></button>
                  </div>
                  {exercises.map(ex => (
                    <button 
                      key={ex.id}
                      onClick={() => addExerciseToSession(ex)}
                      className="w-full text-left p-3 hover:bg-white/5 flex justify-between items-center group transition-all"
                    >
                      <span className="text-sm font-bold text-white group-hover:text-brand transition-colors">{ex.name}</span>
                      <span className="text-[10px] font-black tracking-wider uppercase text-white/30">{ex.targetMuscle}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <button 
                  onClick={() => setIsSelectingExercise(true)}
                  className="w-full py-4 bg-white/5 border border-white/10 text-[12px] font-black uppercase tracking-widest text-brand hover:bg-white/10 transition-all flex justify-center items-center gap-2"
                >
                  <Plus size={16} /> ADD_EXERCISE
                </button>
              )}
            </div>

            {/* FINISH BTN */}
            <button 
              onClick={finishWorkout}
              className="w-full bg-brand text-black py-4 font-black italic uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all flex justify-center items-center gap-3"
            >
              <Save size={18} /> FINISH_WORKOUT_AND_SAVE
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
