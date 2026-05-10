'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Zap, ShieldAlert, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function EfficiencyTracker() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks/efficiency')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/5 p-8 flex flex-col justify-center items-center h-full">
        <Activity className="animate-pulse text-brand mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">CALCULATING_EFFICIENCY...</p>
      </div>
    );
  }

  if (!data || !data.analysis) {
    return (
      <div className="bg-white/5 border border-white/5 p-8 flex flex-col justify-center items-center h-full">
        <ShieldAlert className="text-red-500 mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">ANALYSIS_UNAVAILABLE</p>
      </div>
    );
  }

  const { totalTasks, completedTasks, missedTasks, efficiencyPercent, analysis } = data;
  let aiFeedback = "STABLE";
  if (analysis.trend === "improving") aiFeedback = "OPTIMAL PERFORMANCE. High execution consistency detected. Maintain current operational tempo.";
  if (analysis.trend === "stable") aiFeedback = "MODERATE PERFORMANCE. Task completion is adequate but leaves room for optimization. Reassess high-priority targets.";
  if (analysis.trend === "declining") aiFeedback = "SUB-OPTIMAL PERFORMANCE. Execution drift detected. Recommend reducing task volume and focusing on critical path objectives only.";

  let patterns = [];
  try { patterns = JSON.parse(analysis.patterns); } catch (e) {}

  let recommendations = [];
  try { recommendations = JSON.parse(analysis.recommendations); } catch (e) {}

  return (
    <div className="bg-black border border-white/10 flex flex-col overflow-hidden h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">EFFICIENCY_AI</h3>
          <Target className="text-brand" size={20} />
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col space-y-8">
        
        {/* OVERVIEW SCORE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/5 p-6 flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">COMPLETION_RATE</span>
            <span className="text-5xl font-black italic text-brand">{efficiencyPercent}%</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-center space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-white/60">TOTAL_ASSIGNED</span>
              <span className="text-white">{totalTasks}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-brand/80">SUCCESSFUL_EXECS</span>
              <span className="text-brand">{completedTasks}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-red-500/80">MISSED_TARGETS</span>
              <span className="text-red-500">{missedTasks}</span>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-center items-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">TREND_VECTOR</span>
            {analysis.trend === 'improving' && <TrendingUp className="text-brand" size={48} />}
            {analysis.trend === 'stable' && <Minus className="text-yellow-500" size={48} />}
            {analysis.trend === 'declining' && <TrendingDown className="text-red-500" size={48} />}
            <span className="text-xs font-black uppercase tracking-widest mt-2">{analysis.trend}</span>
          </div>
        </div>

        {/* AI FEEDBACK */}
        <div className="bg-brand/10 border border-brand/20 p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={64} />
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand flex items-center gap-2">
            <Activity size={12} /> AI_DIAGNOSTIC_REPORT
          </h4>
          <p className="text-sm font-bold text-white/80 leading-relaxed italic pr-12">
            {aiFeedback}
          </p>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/10 pb-2">DETECTED_PATTERNS</h4>
            <ul className="space-y-3">
              {patterns.map((p: string, i: number) => (
                <li key={i} className="flex gap-3 text-xs font-bold text-white/70">
                  <BarChart3 className="text-white/20 shrink-0" size={14} /> <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand border-b border-brand/20 pb-2">RECOMMENDATIONS</h4>
            <ul className="space-y-3">
              {recommendations.map((r: string, i: number) => (
                <li key={i} className="flex gap-3 text-xs font-bold text-white/70">
                  <Target className="text-brand/50 shrink-0" size={14} /> <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
