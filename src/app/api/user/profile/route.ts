import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, xp, level, streak, target_calories, base_expenditure, target_protein, target_carbs, target_water')
      .eq('id', session.user.id)
      .single();
    if (error) throw error;

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { targetCalories, baseExpenditure, targetProtein, targetCarbs, targetWater, name } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name !== undefined ? name : undefined,
        targetCalories: targetCalories !== undefined ? Number(targetCalories) : undefined,
        baseExpenditure: baseExpenditure !== undefined ? Number(baseExpenditure) : undefined,
        targetProtein: targetProtein !== undefined ? Number(targetProtein) : undefined,
        targetCarbs: targetCarbs !== undefined ? Number(targetCarbs) : undefined,
        targetWater: targetWater !== undefined ? Number(targetWater) : undefined,
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
