'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Crosshair, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  ShieldAlert, 
  Activity,
  Flame,
  Target
} from 'lucide-react';

export default function OperationsPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]); // today
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('1');
  const [newTaskTime, setNewTaskTime] = useState('30');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tasks?date=${viewDate}`);
        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks || []);
        }
      } catch (e) {
        console.error("UPLINK_FAILURE", e);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchTasks();
  }, [session, viewDate]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          priority: parseInt(newTaskPriority),
          estimatedTime: parseInt(newTaskTime),
          datePlannedFor: new Date(viewDate).toISOString()
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(prev => [data.task, ...prev].sort((a, b) => b.priority - a.priority));
        setNewTaskTitle('');
      }
    } catch (e) {
      console.error("MISSION_ADD_FAILED", e);
    }
  };

  const toggleTask = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !current })
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !current } : t));
      }
    } catch (e) {
      console.error("TASK_TOGGLE_FAILURE", e);
    }
  };

  const isToday = viewDate === new Date().toISOString().split('T')[0];
  const allCriticalDone = tasks.filter(t => t.priority >= 3).every(t => t.isCompleted);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#1a1e2b] pb-6">
        <div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-[#9b5de5] uppercase tracking-[0.3em] mb-2">
            <Crosshair size={14} /> TACTICAL OPERATIONS HUB
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            MISSION DIRECTIVES
          </h1>
        </div>
        
        {/* Date Selector */}
        <div className="flex bg-[#111520] border border-[#1a1e2b] rounded-sm p-1">
          <button 
            onClick={() => setViewDate(new Date().toISOString().split('T')[0])}
            className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${isToday ? 'bg-[#9b5de5] text-[#0B0F19]' : 'text-[#a0a5b5] hover:text-white'}`}
          >
            TODAY's OPS
          </button>
          <button 
            onClick={() => {
              const tmrw = new Date();
              tmrw.setDate(tmrw.getDate() + 1);
              setViewDate(tmrw.toISOString().split('T')[0]);
            }}
            className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${!isToday ? 'bg-[#9b5de5] text-[#0B0F19]' : 'text-[#a0a5b5] hover:text-white'}`}
          >
            FUTURE RECON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Directives List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="glass-card p-0 overflow-hidden border border-[#1a1e2b]">
            <div className="p-6 bg-[#111520] border-b border-[#1a1e2b] flex justify-between items-center">
              <h2 className="text-[12px] font-bold text-white tracking-[0.2em] uppercase m-0 flex items-center gap-2">
                <Target size={16} className="text-[#9b5de5]" /> ACTIVE TARGETS
              </h2>
              <span className="text-[10px] font-mono text-[#a0a5b5]">DATE: {viewDate}</span>
            </div>

            <div className="p-0">
              {loading ? (
                <div className="py-16 flex justify-center opacity-50">
                  <Activity className="animate-spin text-[#9b5de5]" size={32} />
                </div>
              ) : tasks.length > 0 ? (
                <div className="divide-y divide-[#1a1e2b]">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTask(task.id, task.isCompleted)}
                      className={`flex justify-between items-center p-6 cursor-pointer transition-all hover:bg-[#1a1e2b]/50 ${task.isCompleted ? 'opacity-40' : ''}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-6 h-6 border ${task.isCompleted ? 'bg-[#9b5de5] border-[#9b5de5] text-[#0e111a]' : 'border-[#a0a5b5] text-transparent'} flex items-center justify-center transition-colors`}>
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className={`text-lg font-bold tracking-wider uppercase ${task.isCompleted ? 'line-through text-[#a0a5b5]' : 'text-white'}`}>
                            {task.title}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-[10px] font-mono text-[#a0a5b5] flex items-center gap-1">
                              <Clock size={10} /> T-MINUS {task.estimatedTime}m
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Priority Badge */}
                      <div className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase border ${
                        task.priority >= 3 ? 'text-red-400 border-red-400/30 bg-red-400/10' : 
                        task.priority === 2 ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' : 
                        'text-[#a0a5b5] border-[#a0a5b5]/30 bg-[#a0a5b5]/10'
                      }`}>
                        {task.priority >= 3 ? 'CRITICAL' : task.priority === 2 ? 'HIGH' : 'ROUTINE'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                  <ShieldAlert size={48} className="mb-4 text-[#a0a5b5]" />
                  <p className="text-[12px] font-bold tracking-[0.2em] text-[#a0a5b5] uppercase">NO DIRECTIVES ASSIGNED</p>
                  <p className="text-[10px] text-[#a0a5b5]/50 mt-2">AWAITING COMMAND INPUT</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mission Planner & Brief */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Add Task Form */}
          <div className="glass-card border border-[#1a1e2b]">
            <h3 className="text-[12px] font-bold text-white tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
              <Plus size={16} className="text-[#9b5de5]" /> INITIALIZE NEW PROTOCOL
            </h3>
            
            <form onSubmit={addTask} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#a0a5b5] tracking-widest uppercase block mb-2">OBJECTIVE DESIGNATION</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="E.g., Complete System Audit"
                  className="w-full bg-[#0e111a] border border-[#1a1e2b] text-white px-4 py-3 focus:outline-none focus:border-[#9b5de5] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#a0a5b5] tracking-widest uppercase block mb-2">THREAT LEVEL</label>
                  <select 
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full bg-[#0e111a] border border-[#1a1e2b] text-white px-4 py-3 focus:outline-none focus:border-[#9b5de5] text-sm appearance-none"
                  >
                    <option value="1">ROUTINE (1)</option>
                    <option value="2">HIGH (2)</option>
                    <option value="3">CRITICAL (3)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#a0a5b5] tracking-widest uppercase block mb-2">EST. DURATION</label>
                  <input 
                    type="number" 
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full bg-[#0e111a] border border-[#1a1e2b] text-white px-4 py-3 focus:outline-none focus:border-[#9b5de5] text-sm"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary mt-2 flex items-center justify-center gap-2">
                <Plus size={18} /> CONFIRM DIRECTIVE
              </button>
            </form>
          </div>

          {/* After Action Report (AAR) */}
          {isToday && (
            <div className={`glass-card border ${allCriticalDone && tasks.length > 0 ? 'border-green-500/30 bg-green-500/5' : 'border-[#1a1e2b]'}`}>
              <h3 className="text-[12px] font-bold text-white tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <Flame size={16} className={allCriticalDone && tasks.length > 0 ? 'text-green-400' : 'text-[#a0a5b5]'} /> 
                AFTER ACTION REPORT
              </h3>
              
              {allCriticalDone && tasks.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">ALL CRITICAL OBJECTIVES NEUTRALIZED.</p>
                  <p className="text-xs text-[#a0a5b5]">Operator is cleared for recovery phase. Standby for tomorrow's briefing.</p>
                  <button className="w-full bg-green-500/20 text-green-400 border border-green-500/50 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-green-500/30 transition-colors">
                    LOG DAY SUCCESS
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#a0a5b5]">
                  Complete all CRITICAL priority objectives to unlock the daily debriefing sequence.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
