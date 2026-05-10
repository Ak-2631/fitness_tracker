'use client';

import { CheckCircle2, Circle, SkipForward, Zap, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface FeedbackToast {
  message: string;
  type: "success" | "warning" | "info";
  xpDelta: number;
}

export function TaskListItem({ task }: { task: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackToast | null>(null);

  const showFeedback = useCallback((fb: FeedbackToast) => {
    setFeedback(fb);
    setTimeout(() => setFeedback(null), 3000);
  }, []);

  const toggleTask = async () => {
    if (loading || task.isSkipped) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });
      const data = await res.json();
      if (data.feedback) {
        showFeedback({
          message: data.feedback.message,
          type: data.feedback.type,
          xpDelta: data.xpDelta || 0,
        });
      }
    } catch {
      // Silently fail
    }
    setLoading(false);
    router.refresh();
  };

  const skipTask = async () => {
    if (task.isCompleted || task.isSkipped || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSkipped: true }),
      });
      const data = await res.json();
      if (data.feedback) {
        showFeedback({
          message: data.feedback.message,
          type: data.feedback.type,
          xpDelta: data.xpDelta || 0,
        });
      }
    } catch {
      // Silently fail
    }
    setLoading(false);
    router.refresh();
  };

  const priorityColor = task.priority >= 8
    ? 'var(--danger-accent)'
    : task.priority >= 5
    ? 'var(--warning-accent)'
    : 'var(--primary-accent)';

  const priorityVariant = task.priority >= 8 ? 'danger' : task.priority >= 5 ? 'warning' : 'primary';
  const priorityLabel = task.priority >= 8 ? 'CRITICAL' : task.priority >= 5 ? 'HIGH' : 'STABLE';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ position: 'relative' }}
    >
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: '-50%' }}
            animate={{ opacity: 1, y: -45, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
            style={{
              position: 'absolute',
              left: '50%',
              zIndex: 50,
              padding: '0.4rem 1.25rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              background: feedback.type === 'success' ? 'var(--success-accent)' : 'var(--primary-accent)',
              color: '#000',
              boxShadow: feedback.type === 'success' ? '0 4px 20px var(--success-glow)' : '0 4px 20px var(--primary-glow)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {feedback.message} {feedback.xpDelta > 0 ? `(+${feedback.xpDelta} XP)` : ''}
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard 
        padding="md"
        hoverLift={!task.isCompleted && !task.isSkipped}
        className={`flex justify-between items-center gap-4 transition-opacity duration-300 ${task.isCompleted ? 'opacity-50' : task.isSkipped ? 'opacity-30' : 'opacity-100'}`}
        style={{
          borderLeft: task.isCompleted ? '4px solid var(--success-accent)' : `4px solid ${priorityColor}`,
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={priorityVariant}>{priorityLabel}</Badge>
            {task.deadline && (
              <span className="text-[10px] text-white/30 font-bold uppercase flex items-center gap-1">
                <Clock size={10} /> {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          
          <h3 className={`text-[1.1rem] font-bold truncate ${task.isCompleted ? 'line-through text-white/30' : 'text-white'}`}>
            {task.title}
          </h3>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Zap size={10} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">{task.energyLevel} Load</span>
            </div>
            <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">
              {task.estimatedTime}M Duration
            </span>
            {task.isSkipped && <Badge variant="danger" size="xs">SKIPPED</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!task.isCompleted && !task.isSkipped && (
            <Button 
              variant="icon" 
              size="icon" 
              onClick={skipTask} 
              disabled={loading}
              className="text-white/20 hover:text-red-400 transition-colors"
            >
              <SkipForward size={18} />
            </Button>
          )}
          
          <button
            onClick={toggleTask}
            disabled={loading || task.isSkipped}
            className={`p-1 transition-all focus:outline-none ${loading || task.isSkipped ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {task.isCompleted ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <CheckCircle2 size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </motion.div>
            ) : (
              <Circle size={32} className="text-white/10 hover:text-white/30 transition-colors" />
            )}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
