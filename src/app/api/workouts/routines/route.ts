import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const routines = await prisma.workoutRoutine.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ routines });
  } catch (error) {
    console.error("Routine fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, exercises } = await req.json();

    if (!name || !exercises) {
      return NextResponse.json({ message: "Name and exercises are required" }, { status: 400 });
    }

    const routine = await prisma.workoutRoutine.create({
      data: {
        name,
        exercises: JSON.stringify(exercises), // Storing exercise metadata or IDs
        userId: session.user.id
      }
    });

    return NextResponse.json({ routine }, { status: 201 });
  } catch (error) {
    console.error("Routine creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
