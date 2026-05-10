import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Exercise fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
