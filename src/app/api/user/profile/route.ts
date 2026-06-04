import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

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

    // 1. Update in local Prisma database so the rest of the app continues working
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

    // 2. Mirror the update to Supabase
    const { error } = await supabaseAdmin.from('users').upsert({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      target_calories: updatedUser.targetCalories,
      base_expenditure: updatedUser.baseExpenditure,
      target_protein: updatedUser.targetProtein,
      target_carbs: updatedUser.targetCarbs,
      target_water: updatedUser.targetWater,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (error) {
      console.error("Failed to sync to Supabase:", error);
      // We don't throw here to avoid breaking the local app if Supabase schema is mismatched
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
