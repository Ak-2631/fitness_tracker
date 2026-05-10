import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const routine = await prisma.workoutRoutine.findUnique({
      where: { id }
    });

    if (!routine || routine.userId !== session.user.id) {
      return NextResponse.json({ message: "Routine not found" }, { status: 404 });
    }

    await prisma.workoutRoutine.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Routine terminated" }, { status: 200 });
  } catch (error) {
    console.error("Routine deletion error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
