import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { query } = await req.json();
    if (!query) return NextResponse.json({ message: "Query is required" }, { status: 400 });

    // Step 1: Basic parsing logic
    // We'll split the query by "and", "with", or commas
    const separators = /and|with|,|\+/i;
    const items = query.split(separators).map((s: string) => s.trim()).filter(Boolean);

    const parsedItems = [];
    let queryCalories = 0;
    let queryProtein = 0;
    let queryCarbs = 0;
    let queryFats = 0;

    for (const rawItem of items) {
      // Step 2: Try to extract quantity and name
      // e.g. "3 eggs" -> qty 3, name eggs
      // e.g. "100g chicken" -> qty 100, name chicken, unit g
      const match = rawItem.match(/^(\d+(?:\.\d+)?)\s*(g|ml|oz|lb|cups?|items?)?\s*(.*)$/i) ||
                    rawItem.match(/^(.*)\s*(\d+(?:\.\d+)?)\s*(g|ml|oz|lb|cups?|items?|)$/i);
      
      let quantity = 1;
      let unit = "item";
      let name = rawItem;

      if (match) {
        if (!isNaN(parseFloat(match[1]))) {
          quantity = parseFloat(match[1]);
          unit = match[2] || "item";
          name = match[3].trim();
        } else {
          name = match[1].trim();
          quantity = parseFloat(match[2]);
          unit = match[3] || "item";
        }
      }

      // Step 3: Search local Food DB for matching name
      const foodMatch = await prisma.food.findFirst({
        where: {
          name: {
            contains: name.toLowerCase(),
          }
        }
      });

      if (foodMatch) {
         // Calculate macros based on quantity
         // If unit is 'g' and food is per 100g, adjust
         const ratio = (unit.toLowerCase() === 'g' || unit.toLowerCase() === 'ml') 
            ? quantity / 100 
            : quantity; // Simplified: assumes 1 item = 1 serving if not 'g'

         const calories = Math.round(foodMatch.calories * ratio);
         const protein = Math.round(foodMatch.protein * ratio);
         const carbs = Math.round(foodMatch.carbs * ratio);
         const fats = Math.round(foodMatch.fats * ratio);

         parsedItems.push({
           name: foodMatch.name,
           quantity,
           unit,
           calories,
           protein,
           carbs,
           fats,
           foodId: foodMatch.id
         });

         queryCalories += calories;
         queryProtein += protein;
         queryCarbs += carbs;
         queryFats += fats;
      } else {
        // Fallback: If no match in DB, we could alert the user or use a general estimation
        // For this demo, we'll return as "unmatched"
        parsedItems.push({
          name: name,
          quantity,
          unit,
          unmatched: true
        });
      }
    }

    return NextResponse.json({
      items: parsedItems,
      totals: {
        calories: queryCalories,
        protein: queryProtein,
        carbs: queryCarbs,
        fats: queryFats
      }
    });

  } catch (error) {
    console.error("AI Parser error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
