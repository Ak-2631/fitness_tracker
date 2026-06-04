import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDailyEvaluation } from "@/lib/ai-engine";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        tasks: {
          where: {
            datePlannedFor: { gte: startOfDay, lte: endOfDay }
          }
        },
        dietLogs: {
          where: {
            date: { gte: startOfDay, lte: endOfDay }
          }
        },
        dailyScores: {
          orderBy: { date: 'desc' },
          take: 7
        },
        workoutSessions: {
          where: {
            startTime: { gte: startOfDay, lte: endOfDay }
          },
          include: {
            sets: true
          }
        }
      }
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Check if daily score already exists for today
    const existingScore = await prisma.dailyScore.findFirst({
      where: {
        userId: user.id,
        date: { gte: startOfDay, lte: endOfDay }
      }
    });

    if (existingScore) {
      return NextResponse.json({ message: "Analysis already generated for today." }, { status: 400 });
    }

    // Aggregate diet data
    const dietData = {
      calories: user.dietLogs.reduce((sum, d) => sum + d.calories, 0),
      protein: user.dietLogs.reduce((sum, d) => sum + d.protein, 0),
      carbs: user.dietLogs.reduce((sum, d) => sum + d.carbs, 0),
      fats: user.dietLogs.reduce((sum, d) => sum + d.fats, 0),
      mealCount: user.dietLogs.length,
    };

    const targets = {
      targetCalories: user.targetCalories,
      targetProtein: user.targetProtein,
      targetCarbs: user.targetCarbs,
      targetFats: 0, // Fallback since targetFats is not in schema
    };

    // Aggregate workout data
    const workoutData = {
      sessions: user.workoutSessions.length,
      totalVolume: user.workoutSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0),
      totalDuration: user.workoutSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      exercisesCompleted: user.workoutSessions.reduce((sum, s) => sum + s.sets.length, 0),
    };

    // Map tasks to AI engine format
    const taskData = user.tasks.map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      isCompleted: t.isCompleted,
      isSkipped: t.isSkipped,
      completedAt: t.completedAt,
    }));

    // Previous scores for pattern detection
    const recentScores = user.dailyScores.map(s => ({
      date: s.date,
      productivityScore: s.productivityScore,
      dietCompliance: s.dietCompliance,
      tasksPlanned: s.tasksPlanned,
      tasksCompleted: s.tasksCompleted,
    }));

    // Generate structured AI evaluation
    const evaluation = generateDailyEvaluation(
      taskData,
      dietData,
      workoutData,
      targets,
      user.xp,
      user.streak,
      recentScores
    );

    // Save daily snapshot + update user in a transaction
    const scoreDate = new Date(startOfDay);

    const [, dailyScore] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          streak: evaluation.newStreak,
          xp: evaluation.newXp,
          level: evaluation.newLevel,
        }
      }),
      prisma.dailyScore.create({
        data: {
          date: scoreDate,
          productivityScore: evaluation.score,
          dietCompliance: dietData.mealCount > 0 ? Math.round((dietData.calories / user.targetCalories) * 100) : 0,
          tasksPlanned: user.tasks.length,
          tasksCompleted: user.tasks.filter(t => t.isCompleted).length,
          tasksSkipped: user.tasks.filter(t => t.isSkipped).length,
          totalXpEarned: evaluation.xpBreakdown.total,
          streakAtEnd: evaluation.newStreak,
          levelAtEnd: evaluation.newLevel,
          caloriesLogged: dietData.calories,
          proteinLogged: dietData.protein,
          carbsLogged: dietData.carbs,
          fatsLogged: dietData.fats,
          aiFeedback: evaluation.feedback,
          aiStrengths: JSON.stringify(evaluation.strengths),
          aiWeaknesses: JSON.stringify(evaluation.weaknesses),
          aiSuggestions: JSON.stringify(evaluation.suggestions),
          userId: user.id,
        }
      })
    ]);

    return NextResponse.json({
      dailyScore,
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestions: evaluation.suggestions,
        xpBreakdown: evaluation.xpBreakdown,
        newStreak: evaluation.newStreak,
        newLevel: evaluation.newLevel,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Analysis generation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
