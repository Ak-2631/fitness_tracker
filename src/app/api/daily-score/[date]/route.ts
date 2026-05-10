import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/daily-score/2026-04-12 — Retrieve full snapshot for a specific date
export async function GET(req: Request, { params }: { params: Promise<{ date: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { date: dateStr } = await params;
    const targetDate = new Date(dateStr);

    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ message: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

    // Get the daily score
    const score = await prisma.dailyScore.findFirst({
      where: {
        userId: session.user.id,
        date: { gte: startOfDay, lte: endOfDay }
      }
    });

    // Get tasks for that day
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        datePlannedFor: { gte: startOfDay, lte: endOfDay }
      },
      orderBy: { priority: 'desc' }
    });

    // Get diet logs for that day
    const dietLogs = await prisma.dietLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startOfDay, lte: endOfDay }
      },
      orderBy: { createdAt: 'asc' }
    });

    const dietTotals = dietLogs.reduce(
      (acc, d) => ({
        calories: acc.calories + d.calories,
        protein: acc.protein + d.protein,
        carbs: acc.carbs + d.carbs,
        fats: acc.fats + d.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    if (!score && tasks.length === 0 && dietLogs.length === 0) {
      return NextResponse.json({ message: "No data found for this date." }, { status: 404 });
    }

    return NextResponse.json({
      date: dateStr,
      score: score ? {
        productivityScore: score.productivityScore,
        dietCompliance: score.dietCompliance,
        tasksPlanned: score.tasksPlanned,
        tasksCompleted: score.tasksCompleted,
        tasksSkipped: score.tasksSkipped,
        xpEarned: score.totalXpEarned,
        streak: score.streakAtEnd,
        level: score.levelAtEnd,
        feedback: score.aiFeedback,
        strengths: score.aiStrengths ? JSON.parse(score.aiStrengths) : [],
        weaknesses: score.aiWeaknesses ? JSON.parse(score.aiWeaknesses) : [],
        suggestions: score.aiSuggestions ? JSON.parse(score.aiSuggestions) : [],
      } : null,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        isCompleted: t.isCompleted,
        isSkipped: t.isSkipped,
        completedAt: t.completedAt,
      })),
      diet: {
        meals: dietLogs.map(d => ({
          id: d.id,
          mealType: d.mealType,
          foodItems: d.foodItems ? JSON.parse(d.foodItems) : null,
          calories: d.calories,
          protein: d.protein,
          carbs: d.carbs,
          fats: d.fats,
        })),
        totals: dietTotals,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Daily score fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
