import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 1. Get latest meal for each type
    const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];
    const latestMealsPromises = mealTypes.map(type => 
      prisma.dietLog.findFirst({
        where: { userId: session.user.id, mealType: type },
        orderBy: { date: 'desc' }
      })
    );
    
    const latestMealsRaw = await Promise.all(latestMealsPromises);
    const latestMeals: Record<string, any> = {};
    latestMealsRaw.forEach((meal, i) => {
      if (meal) latestMeals[mealTypes[i]] = meal;
    });

    // 2. Get frequent foods (aggregating from JSON foodItems in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLogs = await prisma.dietLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: thirtyDaysAgo },
        foodItems: { not: null }
      },
      select: { foodItems: true }
    });

    const foodFrequency: Record<string, { count: number, data: any }> = {};
    
    recentLogs.forEach(log => {
      try {
        const items = JSON.parse(log.foodItems || '[]');
        if (Array.isArray(items)) {
          items.forEach(item => {
            const key = item.name.toLowerCase().trim();
            if (foodFrequency[key]) {
              foodFrequency[key].count++;
            } else {
              foodFrequency[key] = { count: 1, data: item };
            }
          });
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });

    const frequentFoods = Object.values(foodFrequency)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(f => f.data);

    return NextResponse.json({ latestMeals, frequentFoods });
  } catch (error) {
    console.error("Diet history error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
