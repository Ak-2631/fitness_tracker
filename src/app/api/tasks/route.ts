import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date') || new Date().toISOString();
    
    // Check task count for the specified date
    const targetDate = new Date(dateStr);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        datePlannedFor: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      orderBy: {
        priority: 'desc'
      }
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Task fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, priority: rawPriority, energyLevel: rawEnergy, estimatedTime: rawEstimated, deadline, datePlannedFor } = await req.json();

    if (!title || !datePlannedFor) {
      return NextResponse.json({ message: "Missing required title or date" }, { status: 400 });
    }

    const priority = parseInt(rawPriority) || 1;
    const energyLevel = parseInt(rawEnergy) || 3;
    const estimatedTime = parseInt(rawEstimated) || 30;

    // Check task count for the specified date
    const targetDate = new Date(datePlannedFor);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const taskCount = await prisma.task.count({
      where: {
        userId: session.user.id,
        datePlannedFor: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    if (taskCount >= 12) {
      return NextResponse.json({ message: "Maximum discipline boundary reached (12 tasks limits per day)." }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        priority,
        energyLevel,
        estimatedTime,
        datePlannedFor: new Date(datePlannedFor),
        deadline: deadline ? new Date(deadline) : null,
        userId: session.user.id,
      }
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Task creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
