import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Api } from "@/lib/api";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Api.unauthorized();

    // Next.js 15 requires params to be awaited, we do it safely:
    const { id } = await Promise.resolve(params);

    const log = await prisma.dietLog.findUnique({
      where: { id }
    });

    if (!log || log.userId !== session.user.id) {
      return Api.notFound("Diet log not found or unauthorized.");
    }

    await prisma.dietLog.delete({
      where: { id }
    });

    return Api.success({ deleted: true }, 200, { message: "Fueling entry deleted." });
  } catch (error) {
    console.error("Delete Diet Log Error:", error);
    return Api.error("Failed to delete diet log.", "INTERNAL_ERROR", 500, error);
  }
}
