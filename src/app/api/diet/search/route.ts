import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ foods: [] });
    }

    const foods = await prisma.food.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 10,
    });

    return NextResponse.json({ foods });
  } catch (error) {
    console.error("Food search error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
