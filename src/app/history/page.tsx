import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  History as HistoryIcon, 
  ActivitySquare, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronRight, 
  Target, 
  Utensils, 
  Flame,
  Search,
  Download,
  Calendar,
  Zap,
  ShieldCheck,
  Award,
  BarChart3
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default async function History() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const scores = await prisma.dailyScore.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: 14
  });

  const weeklyAnalysis = await prisma.weeklyAnalysis.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  const last7 = [...scores.slice(0, 7)].reverse();

  return (
    <div className="container animate-fade-in max-w-[1000px] flex flex-col gap-[var(--space-8)]">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <HistoryIcon size={18} />
            </div>
            <span className="text-[var(--font-label)] font-black uppercase tracking-[0.2em] text-white/40">PERFORMANCE_ARCHIVES</span>
          </div>
          <h1 className="text-[var(--font-h1)] font-black mb-2 tracking-tight">Operational Logs</h1>
          <p className="text-[var(--font-body)] text-white/60">Historical data retrieval from the Discipline Engine core.</p>
        </div>
        <Button variant="secondary" size="md">
          <Download size={18} className="mr-2" /> Export Audit
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-[var(--space-8)] items-start">
        
        <div className="flex flex-col gap-[var(--space-8)]">
          
          {/* 7-Day Trend Visual */}
          {last7.length > 0 && (
            <GlassCard padding="lg">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[var(--font-label)] font-black uppercase tracking-widest text-white/30">CORE_METRIC_TRENDS</h2>
                <div className="p-2 bg-white/5 rounded-lg">
                   <BarChart3 size={18} className="text-blue-500" />
                </div>
              </div>
              <div className="flex items-end gap-3 h-[180px] px-2">
                {last7.map((s, i) => {
                  const score = s.productivityScore;
                  const colorClass = score >= 85 ? 'bg-blue-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
                  const glowClass = score >= 85 ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' : score >= 60 ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full gap-4 group">
                      <div className="w-full h-full flex items-end relative px-1">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 ease-out cursor-help ${colorClass} ${glowClass} group-hover:scale-x-110 group-hover:opacity-100 opacity-80`}
                          style={{ height: `${score}%` }} 
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 text-white whitespace-nowrap">
                          {score}% EFF
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-white/30 tracking-tighter uppercase whitespace-nowrap">
                        {new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {/* Daily Logs List */}
          <div className="flex flex-col gap-[var(--space-6)]">
            <div className="flex items-center gap-3 px-2">
               <ShieldCheck size={18} className="text-blue-500/50" />
               <h3 className="text-[var(--font-label)] font-black uppercase tracking-widest text-white/40">DAILY_AUDIT_TRAIL</h3>
            </div>
            
            {scores.length === 0 ? (
              <GlassCard padding="lg" className="text-center py-16 opacity-50">
                <Search size={48} className="mx-auto mb-6 text-white/20" />
                <p className="text-[var(--font-body)] text-white/60 font-medium">No historical records found for active directive.</p>
              </GlassCard>
            ) : (
              scores.map((score, idx) => (
                <GlassCard key={score.id} padding="none" className="group overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] border-b border-white/5 group-hover:bg-white/[0.04] transition-colors">
                       <div>
                          <div className="text-[var(--font-label)] font-black text-blue-500 mb-1 uppercase tracking-widest">
                            {new Date(score.date).toLocaleDateString(undefined, { weekday: 'long' })}
                          </div>
                          <h3 className="text-[var(--font-h3)] font-black">
                            {new Date(score.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </h3>
                       </div>
                       <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                          <div className="flex flex-col items-end">
                             <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">PRODUCTIVITY</div>
                             <div className={`text-2xl font-black ${score.productivityScore >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>
                               {score.productivityScore}%
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                             <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">FUEL_STATUS</div>
                             <div className="text-2xl font-black text-blue-500">
                               {score.caloriesLogged} <span className="text-xs text-white/40 font-medium uppercase ml-1">kcal</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 md:p-8">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                             <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">XPG</div>
                             <div className="font-black text-blue-400">+{score.totalXpEarned}</div>
                          </div>
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                             <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">TASKS</div>
                             <div className="font-black text-white">{score.tasksCompleted}/{score.tasksPlanned}</div>
                          </div>
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                             <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">STREAK</div>
                             <div className="font-black text-white">{score.streakAtEnd}D</div>
                          </div>
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                             <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">RANK</div>
                             <div className="font-black text-blue-500">LVL {score.levelAtEnd}</div>
                          </div>
                       </div>

                       <div className="bg-blue-500/5 p-6 rounded-2xl border-l-4 border-blue-500/50">
                          <div className="flex items-center gap-3 mb-4">
                             <ActivitySquare size={16} className="text-blue-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">AI_TECHNICAL_AUDIT</span>
                          </div>
                          <p className="text-[var(--font-body)] italic leading-relaxed text-white/80 mb-6">
                             &ldquo;{score.aiFeedback}&rdquo;
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {JSON.parse(score.aiStrengths || '[]').length > 0 && (
                               <div className="flex flex-col gap-3">
                                  <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">STRENGTHS_DETECTED</div>
                                  <div className="flex flex-col gap-2">
                                    {JSON.parse(score.aiStrengths).map((s: string, i: number) => (
                                      <div key={i} className="flex items-start gap-3 group/item">
                                         <ChevronRight size={14} className="text-blue-500/50 group-hover/item:text-blue-400 mt-1 transition-colors" />
                                         <span className="text-sm text-white/60 group-hover/item:text-white/80 transition-colors">{s}</span>
                                      </div>
                                    ))}
                                  </div>
                               </div>
                             )}
                             {JSON.parse(score.aiSuggestions || '[]').length > 0 && (
                               <div className="flex flex-col gap-3">
                                  <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-1">OPTIMIZATION_REQUIRED</div>
                                  <div className="flex flex-col gap-2">
                                    {JSON.parse(score.aiSuggestions).map((s: string, i: number) => (
                                      <div key={i} className="flex items-start gap-3 group/item">
                                         <Target size={14} className="text-amber-500/50 group-hover/item:text-amber-400 mt-1 transition-colors" />
                                         <span className="text-sm text-white/60 group-hover/item:text-white/80 transition-colors">{s}</span>
                                      </div>
                                    ))}
                                  </div>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        {/* Sidebar History Stats */}
        <div className="flex flex-col gap-[var(--space-6)] sticky top-6">
          
          {weeklyAnalysis && (
            <>
              <GlassCard padding="lg" className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <h2 className="text-[var(--font-label)] font-black uppercase tracking-widest text-white/30 mb-8">WEEKLY_REPORT</h2>
                
                <div className="flex items-center gap-5 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                      <TrendingUp size={28} />
                   </div>
                   <div>
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Efficiency Trend</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black">{weeklyAnalysis.avgScore}%</span>
                        <Badge variant={weeklyAnalysis.trend === 'up' ? 'success' : 'warning'} className="text-[10px]">
                          {weeklyAnalysis.trend.toUpperCase()}
                        </Badge>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">TOTAL_XP</div>
                      <div className="font-black text-lg text-blue-400">{weeklyAnalysis.totalXp}</div>
                   </div>
                   <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">MAX_STREAK</div>
                      <div className="font-black text-lg text-white">{weeklyAnalysis.streakDays}D</div>
                   </div>
                </div>

                <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10">
                   <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Target size={14} />
                     SYSTEM_RECOMMENDATIONS
                   </div>
                   <div className="flex flex-col gap-4">
                      {JSON.parse(weeklyAnalysis.recommendations || '[]').slice(0, 3).map((r: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 order-1 group/rec">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0 group-hover/rec:scale-125 transition-transform" />
                           <span className="text-sm text-white/50 leading-relaxed group-hover/rec:text-white/70 transition-colors">{r}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </GlassCard>

              <GlassCard padding="lg">
                 <div className="flex items-center gap-3 mb-6">
                    <Award size={18} className="text-blue-400" />
                    <h3 className="text-[var(--font-label)] font-black uppercase tracking-widest text-white/40">LATEST_ACHIEVEMENTS</h3>
                 </div>
                 <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-center group">
                       <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                          <Zap size={20} className="fill-amber-500" />
                       </div>
                       <div className="text-sm text-white/60">
                         <span className="text-white font-black block text-xs tracking-wider uppercase mb-0.5">Kinetic Pulse</span>
                         3 Day Streak Active
                       </div>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-center group">
                       <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                          <ActivitySquare size={20} />
                       </div>
                       <div className="text-sm text-white/60">
                         <span className="text-white font-black block text-xs tracking-wider uppercase mb-0.5">Hypertrophy Peak</span>
                         High Volume Session Logged
                       </div>
                    </div>
                 </div>
              </GlassCard>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
