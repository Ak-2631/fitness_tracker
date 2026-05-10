import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const sessions = await prisma.workoutSession.findMany({
      where: { userId: session.user.id },
      include: {
        routine: true,
        sets: {
          include: {
            exercise: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { routineId, duration, startTime, endTime, totalVolume, sets } = await req.json();

    if (!sets || sets.length === 0) {
      return NextResponse.json({ message: "At least one set is required" }, { status: 400 });
    }

    // Create session in a transaction
    const workoutSession = await prisma.$transaction(async (tx) => {
      const newSession = await tx.workoutSession.create({
        data: {
          userId: session.user.id,
          routineId: routineId || null,
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : new Date(),
          duration: duration || 0,
          totalVolume: totalVolume || 0,
        }
      });

      // Create sets
      const setPromises = sets.map((set: any, index: number) => {
        return tx.workoutSet.create({
          data: {
            workoutSessionId: newSession.id,
            exerciseId: set.exerciseId,
            weight: parseFloat(set.weight),
            reps: parseInt(set.reps),
            isCompleted: true,
            order: index
          }
        });
      });

      await Promise.all(setPromises);
      return newSession;
    });

    return NextResponse.json({ workoutSession }, { status: 201 });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
