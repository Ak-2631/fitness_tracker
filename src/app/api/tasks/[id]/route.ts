import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTaskFeedback } from "@/lib/ai-engine";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { isCompleted, isSkipped } = body;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== session.user.id) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
      updateData.completedAt = isCompleted ? new Date() : null;
      if (isCompleted) updateData.isSkipped = false;
    }
    if (isSkipped !== undefined) {
      updateData.isSkipped = isSkipped;
      if (isSkipped) {
        updateData.isCompleted = false;
        updateData.completedAt = null;
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    // XP and Level handling
    let xpDelta = 0;
    if ((isCompleted && !task.isCompleted) || (isCompleted === false && task.isCompleted) || (isSkipped && !task.isSkipped)) {
      if (isCompleted && !task.isCompleted) {
        xpDelta = task.priority * 20;
      } else if (isCompleted === false && task.isCompleted) {
        xpDelta = -(task.priority * 20);
      } else if (isSkipped && !task.isSkipped) {
        xpDelta = -(task.priority * 5);
      }

      const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (currentUser) {
        const newXp = Math.max(0, currentUser.xp + xpDelta);
        const newLevel = Math.floor(newXp / 100) + 1;
        
        await prisma.user.update({
          where: { id: session.user.id },
          data: { 
            xp: newXp,
            level: newLevel
          },
        });
      }
    }

    // Get task stats for feedback context
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const dayTasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        datePlannedFor: { gte: startOfDay, lte: endOfDay }
      }
    });

    const completedCount = dayTasks.filter(t => t.isCompleted).length;
    const totalCount = dayTasks.length;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { streak: true }
    });

    // Generate real-time AI feedback
    const action = isSkipped ? "skip" : isCompleted ? "complete" : "complete";
    const feedback = generateTaskFeedback(
      action,
      task.priority,
      completedCount,
      totalCount,
      user?.streak || 0
    );

    return NextResponse.json({
      task: updatedTask,
      feedback,
      xpDelta,
      progress: {
        completed: completedCount,
        total: totalCount,
        percent: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Task update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
