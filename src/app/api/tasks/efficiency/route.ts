import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Fetch tasks from last 7 days
    const recentTasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        datePlannedFor: {
          gte: sevenDaysAgo,
          lte: now
        }
      }
    });

    const totalTasks = recentTasks.length;
    const completedTasks = recentTasks.filter(t => t.isCompleted).length;
    const skippedTasks = recentTasks.filter(t => t.isSkipped).length;
    
    // Consider missed if it's not completed, not skipped, and datePlannedFor is before today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const missedTasks = recentTasks.filter(t => !t.isCompleted && !t.isSkipped && new Date(t.datePlannedFor) < startOfToday).length;

    const efficiencyRatio = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
    const efficiencyPercent = Math.round(efficiencyRatio * 100);

    // Simulated AI Analysis
    let trend = "stable";
    let aiFeedback = "";
    if (efficiencyPercent >= 80) {
      trend = "improving";
      aiFeedback = "OPTIMAL PERFORMANCE. High execution consistency detected. Maintain current operational tempo.";
    } else if (efficiencyPercent >= 50) {
      trend = "stable";
      aiFeedback = "MODERATE PERFORMANCE. Task completion is adequate but leaves room for optimization. Reassess high-priority targets.";
    } else {
      trend = "declining";
      aiFeedback = "SUB-OPTIMAL PERFORMANCE. Execution drift detected. Recommend reducing task volume and focusing on critical path objectives only.";
    }

    const patterns = JSON.stringify([
      `Completed ${completedTasks} out of ${totalTasks} scheduled tasks.`,
      `Missed ${missedTasks} tasks that passed their deadline without action.`,
      `Skipped ${skippedTasks} tasks intentionally.`
    ]);

    const recommendations = JSON.stringify([
      "Prioritize top 3 tasks daily before taking on secondary objectives.",
      "If missing tasks consistently, lower daily expectations to rebuild momentum.",
      "Hydration and Fueling might impact discipline. Monitor physical metrics alongside tasks."
    ]);

    // Calculate start of week (e.g. last Monday)
    const weekStartDate = new Date(sevenDaysAgo);
    weekStartDate.setHours(0,0,0,0);
    
    const analysis = await prisma.weeklyAnalysis.upsert({
      where: {
        userId_weekStartDate: {
          userId: session.user.id,
          weekStartDate: weekStartDate
        }
      },
      update: {
        avgScore: efficiencyPercent,
        trend: trend,
        patterns: patterns,
        recommendations: recommendations
      },
      create: {
        userId: session.user.id,
        weekStartDate: weekStartDate,
        weekEndDate: now,
        avgScore: efficiencyPercent,
        totalXp: completedTasks * 10,
        streakDays: 0,
        trend: trend,
        patterns: patterns,
        recommendations: recommendations
      }
    });

    return NextResponse.json({
      totalTasks,
      completedTasks,
      missedTasks,
      skippedTasks,
      efficiencyPercent,
      analysis
    });

  } catch (error) {
    console.error("Efficiency fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
