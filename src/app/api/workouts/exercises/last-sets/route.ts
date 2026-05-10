import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const exerciseId = searchParams.get("exerciseId");

    if (!exerciseId) {
      return NextResponse.json({ message: "Exercise ID is required" }, { status: 400 });
    }

    // Get the most recent session that contains this exercise
    const lastSession = await prisma.workoutSession.findFirst({
      where: {
        userId: session.user.id,
        sets: {
          some: { exerciseId }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sets: {
          where: { exerciseId },
          orderBy: { order: 'asc' }
        }
      }
    });

    // Also get all-time PR for this exercise
    const prSet = await prisma.workoutSet.findFirst({
      where: {
        exerciseId,
        session: { userId: session.user.id }
      },
      orderBy: [
        { weight: 'desc' },
        { reps: 'desc' }
      ]
    });

    return NextResponse.json({ 
      lastSets: lastSession?.sets || [],
      pr: prSet ? { weight: prSet.weight, reps: prSet.reps } : null
    });
  } catch (error) {
    console.error("Workout history error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
