import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Api } from "@/lib/api";

/**
 * @description Senior API Designer compliant Diet API
 * Version: 1.1
 * Patterns: Resource-oriented, Standardized Envelope
 */

// GET: Retrieve today's diet logs (all fueling events)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Api.unauthorized();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const meals = await prisma.dietLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startOfDay, lte: endOfDay }
      },
      orderBy: { createdAt: 'asc' }
    });

    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return Api.success({ meals }, 200, { totals, count: meals.length });
  } catch (error) {
    console.error("[Diet API] Fetch error:", error);
    return Api.error("Failed to retrieve diet logs.");
  }
}

// POST: Log a fueling event (Resource-first design)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Api.unauthorized();

    const body = await req.json();
    const { calories, protein, carbs, fats, mealType, foodItems, foodName } = body;

    // Simple validation (future: replace with Zod schema from design agent)
    if (calories === undefined || protein === undefined || carbs === undefined || fats === undefined) {
      return Api.badRequest("Missing required macronutrient inputs.", { required: ['calories', 'protein', 'carbs', 'fats'] });
    }

    const dietLog = await prisma.dietLog.create({
      data: {
        date: new Date(),
        mealType: mealType || "Single Item",
        foodItems: foodItems ? JSON.stringify(foodItems) : (foodName || "Unspecified Event"),
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fats: Number(fats),
        userId: session.user.id,
      }
    });

    return Api.success(dietLog, 201, { message: "Fueling event synchronized." });
  } catch (error: any) {
    console.error("[Diet API] Log error:", error);
    return Api.error("Failed to synchronize fueling event.", "SYNC_FAILED", 500, { error: error.message });
  }
}

