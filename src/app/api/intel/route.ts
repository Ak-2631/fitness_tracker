import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch Workouts
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: today }
      }
    });

    // Fetch Diet Logs
    const diets = await prisma.dietLog.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: today }
      }
    });

    // Fetch Tasks
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        isCompleted: true,
        completedAt: { gte: today }
      }
    });

    // Merge into Unified Intel Logs
    const intelLogs: any[] = [];

    workouts.forEach(w => {
      // Estimate calories burned as duration * 8
      const estimatedCals = (w.duration || 0) * 8;
      intelLogs.push({
        id: `wkt-${w.id}`,
        timestamp: w.createdAt,
        type: 'WORKOUT',
        title: 'Gym Session Successfully Logged.',
        subtitle: `Volume: ${w.totalVolume} KG. Est. Burn: ${estimatedCals} KCAL.`,
        icon: 'Activity',
        calories: estimatedCals,
        volume: w.totalVolume
      });
    });

    diets.forEach(d => {
      intelLogs.push({
        id: `diet-${d.id}`,
        timestamp: d.createdAt,
        type: 'DIET',
        title: 'Fuel Intake Verified.',
        subtitle: `Logged ${d.calories} KCAL, ${d.protein}g Protein.`,
        icon: 'Target',
        calories: d.calories
      });
    });

    tasks.forEach(t => {
      intelLogs.push({
        id: `task-${t.id}`,
        timestamp: t.completedAt || t.createdAt,
        type: 'TASK',
        title: 'Mission Objective Completed.',
        subtitle: `Task: ${t.title}`,
        icon: 'CheckCircle'
      });
    });

    // Sort by timestamp descending
    intelLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ logs: intelLogs });
  } catch (error) {
    console.error("Intel fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
