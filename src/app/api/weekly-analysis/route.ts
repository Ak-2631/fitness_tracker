import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWeeklyAnalysis } from "@/lib/ai-engine";

// GET: Retrieve latest weekly analysis
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const latest = await prisma.weeklyAnalysis.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!latest) {
      return NextResponse.json({ message: "No weekly analysis available yet." }, { status: 404 });
    }

    return NextResponse.json({
      analysis: {
        ...latest,
        patterns: latest.patterns ? JSON.parse(latest.patterns) : [],
        recommendations: latest.recommendations ? JSON.parse(latest.recommendations) : [],
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Weekly analysis fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST: Generate weekly analysis for the last 7 days
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(now);
    weekEnd.setHours(23, 59, 59, 999);

    // Check if analysis already exists for this week
    const weekStartNorm = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
    const existing = await prisma.weeklyAnalysis.findFirst({
      where: {
        userId: session.user.id,
        weekStartDate: weekStartNorm,
      }
    });

    if (existing) {
      return NextResponse.json({
        message: "Weekly analysis already exists for this period.",
        analysis: {
          ...existing,
          patterns: existing.patterns ? JSON.parse(existing.patterns) : [],
          recommendations: existing.recommendations ? JSON.parse(existing.recommendations) : [],
        }
      }, { status: 200 });
    }

    // Fetch last 7 days of data
    const dailyScores = await prisma.dailyScore.findMany({
      where: {
        userId: session.user.id,
        date: { gte: weekStart, lte: weekEnd }
      },
      orderBy: { date: 'asc' }
    });

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        datePlannedFor: { gte: weekStart, lte: weekEnd }
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { streak: true, xp: true }
    });

    const scoreRecords = dailyScores.map(s => ({
      date: s.date,
      productivityScore: s.productivityScore,
      dietCompliance: s.dietCompliance,
      tasksPlanned: s.tasksPlanned,
      tasksCompleted: s.tasksCompleted,
    }));

    const taskData = tasks.map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      isCompleted: t.isCompleted,
      isSkipped: t.isSkipped,
      completedAt: t.completedAt,
    }));

    const totalXp = dailyScores.reduce((sum, s) => sum + s.totalXpEarned, 0);

    // Generate analysis
    const report = generateWeeklyAnalysis(
      scoreRecords,
      taskData,
      totalXp,
      user?.streak || 0
    );

    // Save
    const analysis = await prisma.weeklyAnalysis.create({
      data: {
        weekStartDate: weekStartNorm,
        weekEndDate: weekEnd,
        avgScore: report.avgScore,
        totalXp: report.totalXp,
        streakDays: report.streakDays,
        bestDay: report.bestDay,
        worstDay: report.worstDay,
        trend: report.trend,
        patterns: JSON.stringify(report.patterns),
        recommendations: JSON.stringify(report.recommendations),
        userId: session.user.id,
      }
    });

    return NextResponse.json({
      analysis: {
        ...analysis,
        patterns: report.patterns,
        recommendations: report.recommendations,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Weekly analysis generation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
