// =============================================================================
// AI ENGINE — Rule-Based Intelligence for Discipline Engine
// 3 tiers: Real-time task feedback, end-of-day evaluation, weekly analysis
// =============================================================================

// ─── Types ───────────────────────────────────────────────────────────────────

interface TaskData {
  id: string;
  title: string;
  priority: number;
  isCompleted: boolean;
  isSkipped: boolean;
  completedAt?: Date | null;
}

interface DietData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealCount: number;
}

interface UserTargets {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
}

interface WorkoutData {
  sessions: number;
  totalVolume: number;
  totalDuration: number;
  exercisesCompleted: number;
}

interface DailyScoreRecord {
  date: Date;
  productivityScore: number;
  dietCompliance: number;
  tasksPlanned: number;
  tasksCompleted: number;
}

export interface XpBreakdown {
  tasks: number;
  diet: number;
  workout: number;
  bonus: number;
  penalty: number;
  total: number;
}

export interface DailyEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  xpBreakdown: XpBreakdown;
  newStreak: number;
  newXp: number;
  newLevel: number;
}

export interface TaskFeedback {
  message: string;
  xpChange: number;
  type: "success" | "warning" | "info";
}

export interface WeeklyReport {
  avgScore: number;
  trend: "improving" | "declining" | "stable";
  patterns: string[];
  bestDay: string;
  worstDay: string;
  recommendations: string[];
  totalXp: number;
  streakDays: number;
}

// ─── Tier A: Real-Time Task Feedback ─────────────────────────────────────────

const COMPLETE_MESSAGES_HIGH = [
  "Critical objective neutralized. Momentum locked.",
  "High-priority directive cleared. The system approves.",
  "Priority target eliminated. You're operating at peak.",
  "Dominant execution on a critical task. Keep this energy.",
];

const COMPLETE_MESSAGES_MED = [
  "Task complete. Steady progress.",
  "Directive acknowledged. Moving forward.",
  "Another one down. Consistency compounds.",
  "Checked off. The system is watching, and it likes what it sees.",
];

const COMPLETE_MESSAGES_LOW = [
  "Low-priority task done. Every rep counts.",
  "Minor win logged. Small actions compound.",
  "Task cleared. Don't neglect the big ones though.",
];

const SKIP_MESSAGES_HIGH = [
  "⚠ Critical directive abandoned. This damages your score significantly.",
  "⚠ High-priority target skipped. The system does not forget.",
  "⚠ You just sacrificed a major objective. Recalibrate immediately.",
];

const SKIP_MESSAGES_MED = [
  "⚠ Task skipped. This impacts your daily evaluation.",
  "⚠ Directive bypassed. Your score absorbs the hit.",
];

const SKIP_MESSAGES_LOW = [
  "Task skipped. Minor impact, but patterns compound.",
  "Low-priority skip noted. Don't let this become habit.",
];

export function generateTaskFeedback(
  action: "complete" | "skip",
  priority: number,
  completedCount: number,
  totalCount: number,
  currentStreak: number
): TaskFeedback {
  const xpChange = action === "complete" ? priority * 20 : -(priority * 5);

  // All tasks complete?
  if (action === "complete" && completedCount === totalCount && totalCount > 0) {
    return {
      message: `🏆 ALL DIRECTIVES COMPLETE. Perfect execution. +${priority * 20} XP. ${
        currentStreak >= 7 ? "Your streak is fire." : "Building momentum."
      }`,
      xpChange,
      type: "success",
    };
  }

  let pool: string[];
  let type: TaskFeedback["type"];

  if (action === "complete") {
    type = "success";
    if (priority >= 8) pool = COMPLETE_MESSAGES_HIGH;
    else if (priority >= 5) pool = COMPLETE_MESSAGES_MED;
    else pool = COMPLETE_MESSAGES_LOW;
  } else {
    type = "warning";
    if (priority >= 8) pool = SKIP_MESSAGES_HIGH;
    else if (priority >= 5) pool = SKIP_MESSAGES_MED;
    else pool = SKIP_MESSAGES_LOW;
  }

  const message = pool[Math.floor(Math.random() * pool.length)];
  const xpLabel = xpChange > 0 ? `+${xpChange} XP` : `${xpChange} XP`;

  return {
    message: `${message} ${xpLabel}`,
    xpChange,
    type,
  };
}

// ─── Tier B: End-of-Day Evaluation ───────────────────────────────────────────

function calculatePriorityWeightedScore(tasks: TaskData[]): number {
  if (tasks.length === 0) return 0;

  const totalWeight = tasks.reduce((sum, t) => sum + t.priority, 0);
  const completedWeight = tasks
    .filter((t) => t.isCompleted)
    .reduce((sum, t) => sum + t.priority, 0);

  return totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);
}

function calculateDietCompliance(diet: DietData, targets: UserTargets): number {
  if (diet.mealCount === 0) return 0;

  const calRatio = Math.min(diet.calories / targets.targetCalories, 1.2);
  const proRatio = Math.min(diet.protein / targets.targetProtein, 1.2);

  // Score: how close to targets (cap at 100)
  const calScore = calRatio > 0.8 && calRatio <= 1.1 ? 100 : Math.round(calRatio * 80);
  const proScore = proRatio > 0.8 && proRatio <= 1.1 ? 100 : Math.round(proRatio * 80);

  return Math.min(100, Math.round((calScore + proScore) / 2));
}

function calculateWorkoutScore(workout: WorkoutData): number {
  if (workout.sessions === 0) return 0;
  
  // Basic score based on activity
  // 1 session with volume > 0 is a base 100 for compliance
  const activityScore = workout.totalVolume > 0 ? 100 : 50;
  
  return activityScore;
}

export function generateDailyEvaluation(
  tasks: TaskData[],
  diet: DietData,
  workout: WorkoutData, // ADDED
  targets: UserTargets,
  currentXp: number,
  currentStreak: number,
  recentScores: DailyScoreRecord[]
): DailyEvaluation {
  const prodScore = calculatePriorityWeightedScore(tasks);
  const dietScore = calculateDietCompliance(diet, targets);
  const workoutScore = calculateWorkoutScore(workout);

  // Consistency bonus: based on recent streak
  const consistencyBonus = Math.min(15, currentStreak * 2);

  // Final weighted score (Adjusted weights to include workout)
  const score = Math.min(
    100,
    Math.round(prodScore * 0.5 + dietScore * 0.2 + workoutScore * 0.15 + consistencyBonus)
  );

  // ── XP Calculation ──
  const xpBreakdown: XpBreakdown = {
    tasks: tasks.filter((t) => t.isCompleted).reduce((sum, t) => sum + t.priority * 20, 0),
    diet: dietScore >= 80 ? 100 : dietScore >= 50 ? 50 : 0,
    workout: workoutScore === 100 ? 250 : workoutScore >= 50 ? 100 : 0,
    bonus: 0,
    penalty: 0,
    total: 0,
  };

  // Perfect day bonus
  if (prodScore === 100 && dietScore >= 80) {
    xpBreakdown.bonus = 200;
  }
  // Score bonus tiers
  if (score >= 90) xpBreakdown.bonus += 100;
  else if (score >= 75) xpBreakdown.bonus += 50;

  // Penalties
  if (prodScore < 50) xpBreakdown.penalty = -150;
  if (diet.mealCount === 0) xpBreakdown.penalty -= 50;

  xpBreakdown.total =
    xpBreakdown.tasks + xpBreakdown.diet + xpBreakdown.bonus + xpBreakdown.penalty;

  // ── Streak ──
  let newStreak = currentStreak;
  if (score >= 60) {
    newStreak += 1;
  } else {
    newStreak = 0;
  }

  // ── XP & Level ──
  const newXp = Math.max(0, currentXp + xpBreakdown.total);
  const newLevel = Math.floor(newXp / 1000) + 1;

  // ── Strengths ──
  const strengths: string[] = [];
  const highPriorityTasks = tasks.filter((t) => t.priority >= 8);
  const highCompleted = highPriorityTasks.filter((t) => t.isCompleted);
  if (highCompleted.length === highPriorityTasks.length && highPriorityTasks.length > 0) {
    strengths.push("All high-priority tasks completed");
  }
  if (prodScore === 100) strengths.push("100% task completion — perfect execution");
  if (dietScore >= 90) strengths.push("Diet tracking excellent — macros on target");
  if (currentStreak >= 7) strengths.push(`${currentStreak}-day streak maintained`);
  if (prodScore >= 80 && prodScore < 100) strengths.push("Strong task completion rate");
  if (diet.protein >= targets.targetProtein * 0.9)
    strengths.push("Protein intake on target");
  if (workout.totalVolume > 5000)
    strengths.push("High-volume training session detected");
  if (workout.sessions > 0)
    strengths.push("Physical training objective met");

  // ── Weaknesses ──
  const weaknesses: string[] = [];
  const skippedTasks = tasks.filter((t) => t.isSkipped);
  if (skippedTasks.length > 0) {
    const skippedPriorities = skippedTasks.map((t) => t.priority);
    const maxSkipped = Math.max(...skippedPriorities);
    weaknesses.push(
      `${skippedTasks.length} task(s) skipped${maxSkipped >= 8 ? " including critical priorities" : ""}`
    );
  }
  if (diet.mealCount === 0) weaknesses.push("No diet data logged — unacceptable");
  else if (dietScore < 60) weaknesses.push("Diet compliance below threshold");
  if (prodScore < 50) weaknesses.push("Less than half of planned work completed");
  if (
    tasks.length > 0 &&
    tasks.filter((t) => !t.isCompleted && !t.isSkipped).length > 0
  ) {
    weaknesses.push("Unresolved tasks left incomplete (not completed or skipped)");
  }

  // ── Pattern detection from history ──
  const suggestions: string[] = [];
  if (recentScores.length >= 3) {
    const lastThree = recentScores.slice(0, 3).map((s) => s.productivityScore);
    const trending = lastThree[0] < lastThree[1] && lastThree[1] < lastThree[2];
    if (trending) suggestions.push("Your productivity is declining — simplify tomorrow's plan");

    const dietMisses = recentScores.filter((s) => s.dietCompliance < 50).length;
    if (dietMisses >= 2)
      suggestions.push("Diet tracking is inconsistent — set meal reminders");
  }

  if (prodScore < 80 && tasks.length > 5)
    suggestions.push("Consider planning fewer, higher-impact tasks");
  if (highCompleted.length < highPriorityTasks.length)
    suggestions.push("Front-load P8+ tasks before noon for better completion rates");
  if (score >= 85) suggestions.push("Excellent day — maintain this standard tomorrow");
  if (diet.mealCount > 0 && diet.protein < targets.targetProtein * 0.7)
    suggestions.push("Protein intake low — add a high-protein snack or meal");

  // ── Narrative Feedback ──
  let feedback = "";
  if (score >= 90) {
    feedback = `Outstanding discipline. ${prodScore}% task execution with ${
      dietScore >= 80 ? "nutrition locked in" : "nutrition needing attention"
    }${workout.sessions > 0 ? " and physical training conquered" : ""}. ${newStreak > 1 ? `${newStreak}-day streak is compounding real results.` : "Keep building."}`;
  } else if (score >= 70) {
    feedback = `Solid day. ${prodScore}% on tasks, ${
      dietScore >= 60 ? "diet tracked" : "but diet logging was missed"
    }. ${
      weaknesses.length > 0 ? weaknesses[0] + "." : ""
    } You're building consistency.`;
  } else if (score >= 50) {
    feedback = `Mediocre execution. ${prodScore}% task completion is below your capability. ${
      weaknesses.length > 0 ? weaknesses[0] + "." : ""
    } The system expects more.`;
  } else {
    feedback = `Catastrophic day. ${prodScore}% completion rate. ${
      diet.mealCount === 0 ? "No diet data." : ""
    } Streak broken. Consequences applied. Tomorrow is non-negotiable.`;
  }

  return {
    score,
    feedback,
    strengths,
    weaknesses,
    suggestions,
    xpBreakdown,
    newStreak,
    newXp,
    newLevel,
  };
}

// ─── Tier C: Weekly Analysis ─────────────────────────────────────────────────

export function generateWeeklyAnalysis(
  dailyScores: DailyScoreRecord[],
  tasks: TaskData[],
  totalXpEarned: number,
  streakDays: number
): WeeklyReport {
  if (dailyScores.length === 0) {
    return {
      avgScore: 0,
      trend: "stable",
      patterns: ["No data available for analysis"],
      bestDay: "N/A",
      worstDay: "N/A",
      recommendations: ["Start logging daily to enable pattern detection"],
      totalXp: 0,
      streakDays: 0,
    };
  }

  // Basic stats
  const scores = dailyScores.map((s) => s.productivityScore);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // Trend detection
  let trend: WeeklyReport["trend"] = "stable";
  if (scores.length >= 3) {
    const firstHalf = scores.slice(Math.floor(scores.length / 2));
    const secondHalf = scores.slice(0, Math.floor(scores.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (secondAvg - firstAvg > 10) trend = "improving";
    else if (firstAvg - secondAvg > 10) trend = "declining";
  }

  // Best / worst day
  const sorted = [...dailyScores].sort(
    (a, b) => b.productivityScore - a.productivityScore
  );
  const bestDay = sorted[0].date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const worstDay = sorted[sorted.length - 1].date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Pattern detection
  const patterns: string[] = [];

  // Day-of-week patterns
  const dayScores: Record<string, number[]> = {};
  dailyScores.forEach((s) => {
    const dayName = s.date.toLocaleDateString(undefined, { weekday: "long" });
    if (!dayScores[dayName]) dayScores[dayName] = [];
    dayScores[dayName].push(s.productivityScore);
  });
  for (const [day, dayVals] of Object.entries(dayScores)) {
    const dayAvg = dayVals.reduce((a, b) => a + b, 0) / dayVals.length;
    if (dayAvg < avgScore - 15) patterns.push(`Performance drops on ${day}s`);
    if (dayAvg > avgScore + 15) patterns.push(`Strong performance on ${day}s`);
  }

  // Diet consistency
  const dietLogs = dailyScores.filter((s) => s.dietCompliance > 0).length;
  const dietRate = Math.round((dietLogs / dailyScores.length) * 100);
  if (dietRate < 60) patterns.push(`Diet tracked only ${dietRate}% of days`);
  else if (dietRate >= 90) patterns.push("Excellent diet tracking consistency");

  // Completion trends
  const completionRates = dailyScores.map((s) =>
    s.tasksPlanned > 0 ? s.tasksCompleted / s.tasksPlanned : 0
  );
  const avgCompletion = completionRates.reduce((a, b) => a + b, 0) / completionRates.length;
  if (avgCompletion < 0.6)
    patterns.push("Average task completion below 60% — consider fewer daily tasks");

  // Recommendations
  const recommendations: string[] = [];
  if (trend === "declining")
    recommendations.push("Simplify your daily plan and focus on 3 critical tasks");
  if (trend === "improving")
    recommendations.push("Momentum is building — increase difficulty slightly");
  if (dietRate < 60)
    recommendations.push("Set meal logging reminders at 8am, 1pm, and 7pm");
  if (avgCompletion < 0.7)
    recommendations.push("Plan no more than 5 tasks per day until completion rate improves");
  if (streakDays >= 7)
    recommendations.push("7+ day streak — consider adding a stretch goal");
  if (avgScore >= 80)
    recommendations.push("High performer — focus on diet optimization for the next level");

  return {
    avgScore,
    trend,
    patterns,
    bestDay,
    worstDay,
    recommendations,
    totalXp: totalXpEarned,
    streakDays,
  };
}
