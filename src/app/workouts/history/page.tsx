'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Dumbbell, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  TrendingUp,
  Activity,
  Award,
  Zap,
  BarChart3,
  Dna,
  Database,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface Set {
  id: string;
  weight: number;
  reps: number;
  exercise: {
    name: string;
  };
}

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalVolume: number;
  routine?: {
    name: string;
  };
  sets: Set[];
}

export default function WorkoutHistoryPage() {
  const { data: sessionData } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch('/api/workouts/sessions');
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
        }
      } catch (err) {
        console.error("Failed to load sessions", err);
      } finally {
        setLoading(false);
      }
    }
    if (sessionData) loadSessions();
    else setLoading(false);
  }, [sessionData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32">
        <Activity className="animate-spin text-brand mb-4" size={48} />
        <p className="text-[10px] font-black text-brand tracking-[0.5em] uppercase italic">RETRIEVING_DATA_LOGS...</p>
      </div>
    );
  }

  const totalVolume = sessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalWorkouts = sessions.length;

  return (
    <div className="max-w-6xl mx-auto space-y-24 bg-black min-h-screen pb-32">
      
      {/* 01. HISTORY_HEADER */}
      <section>
        <div className="flex items-center gap-4 text-white/30 mb-8 font-black uppercase text-[10px] tracking-[0.3em] italic">
           <History size={14} /> COMMAND // ARCHIVE_v4.2
        </div>
        <h1 className="text-[80px] font-black tracking-tighter uppercase leading-[0.8] mb-6 italic">
          HISTORY
        </h1>
        <div className="flex items-center gap-3 text-brand">
          <Database size={24} fill="#D0FF00" />
          <p className="text-2xl font-black italic tracking-tighter uppercase">
            STATUS: BIOMETRIC_ARCHIVE_SYNCED
          </p>
        </div>
      </section>

      {/* 02. AGGREGATE_TELEMETRY */}
      <div className="grid grid-cols-3 gap-12">
         {[
           { label: 'TOTAL_VOLUME_KG', val: totalVolume.toLocaleString(), sub: 'AGGREGATE_DISPLACEMENT', icon: BarChart3, color: 'text-brand' },
           { label: 'TIME_IN_ZONE', val: `${Math.floor(totalDuration/60)}H ${totalDuration%60}M`, sub: 'CUMULATIVE_EXERTION', icon: Clock, color: 'text-white' },
           { label: 'COMPLETIONS', val: totalWorkouts, sub: 'PROTOCOL_CYCLES', icon: Zap, color: 'text-brand' }
         ].map(m => (
           <div key={m.label} className="bg-white/5 border border-white/10 p-10 space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-white/30 uppercase">
                 <span>{m.label}</span>
                 <m.icon size={14} className={m.color} />
              </div>
              <p className={`text-5xl font-black italic tracking-tighter ${m.color}`}>{m.val}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{m.sub}</p>
           </div>
         ))}
      </div>

      {/* 03. SESSION_LEDGER */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic pb-4 border-b border-white/5">AUTHENTICATED_LOGS</h3>
        <div className="space-y-2">
          {sessions.map((session, i) => {
            const isExpanded = expandedSession === session.id;
            const exerciseGroups: Record<string, Set[]> = {};
            session.sets.forEach(set => {
              const name = set.exercise.name;
              if (!exerciseGroups[name]) exerciseGroups[name] = [];
              exerciseGroups[name].push(set);
            });

            return (
              <div key={session.id} className={`border border-white/10 transition-all ${isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}>
                <div 
                  className="p-10 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                >
                  <div className="flex gap-16 items-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tabular-nums">0{i+1}</p>
                    <div>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{new Date(session.startTime).toLocaleDateString().toUpperCase()}</p>
                      {editingId === session.id ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onBlur={() => { setSessions(prev => prev.map(s => s.id === session.id ? { ...s, routine: { name: editName } } : s)); setEditingId(null); }}
                          onKeyDown={e => { if (e.key === 'Enter') { setSessions(prev => prev.map(s => s.id === session.id ? { ...s, routine: { name: editName } } : s)); setEditingId(null); } }}
                          className="bg-transparent border-b border-brand text-3xl font-black italic tracking-tighter uppercase text-white outline-none w-full"
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <h4
                          className="text-3xl font-black italic tracking-tighter uppercase text-white cursor-text hover:text-brand transition-colors"
                          onClick={e => { e.stopPropagation(); setEditingId(session.id); setEditName(session.routine?.name || 'WORKOUT'); }}
                          title="Click to rename"
                        >
                          {session.routine?.name || 'WORKOUT'}
                        </h4>
                      )}
                    </div>
                    <div className="flex gap-12 border-l border-white/10 pl-12 h-12 items-center">
                       <div className="text-center">
                          <p className="text-[10px] font-black text-white/20">DUR</p>
                          <p className="text-xl font-black italic text-white">{session.duration}M</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] font-black text-white/20">VOL</p>
                          <p className="text-xl font-black italic text-brand">{session.totalVolume}KG</p>
                       </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={24} className="text-brand" /> : <ChevronDown size={24} className="text-white/20" />}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <div className="p-12 grid grid-cols-2 gap-12">
                        {Object.entries(exerciseGroups).map(([name, sets]) => (
                          <div key={name} className="space-y-6">
                            <h5 className="text-sm font-black italic uppercase tracking-[0.2em] text-brand border-b border-white/5 pb-2">{name}</h5>
                            <div className="space-y-2">
                              {sets.map((set, si) => (
                                <div key={set.id} className="flex justify-between items-center text-[11px] font-bold">
                                   <span className="text-white/20">SET_0{si+1}</span>
                                   <span className="text-white">{set.weight}KG x {set.reps}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white/5 p-6 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <Award size={14} className="text-brand" />
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">SESSION_INTEGRITY_VERIFIED</span>
                         </div>
                         <span className="text-[10px] font-black text-white/20 tabular-nums">ID: {session.id.toUpperCase()}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
