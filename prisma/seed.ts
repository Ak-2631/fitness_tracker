import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding standard exercises...');
  const exercises = [
    { name: 'Bench Press', targetMuscle: 'Chest', equipment: 'Barbell' },
    { name: 'Incline Dumbbell Press', targetMuscle: 'Chest', equipment: 'Dumbbell' },
    { name: 'Push Ups', targetMuscle: 'Chest', equipment: 'Bodyweight' },
    { name: 'Squat', targetMuscle: 'Legs', equipment: 'Barbell' },
    { name: 'Leg Press', targetMuscle: 'Legs', equipment: 'Machine' },
    { name: 'Deadlift', targetMuscle: 'Back', equipment: 'Barbell' },
    { name: 'Pull Ups', targetMuscle: 'Back', equipment: 'Bodyweight' },
    { name: 'Dumbbell Rows', targetMuscle: 'Back', equipment: 'Dumbbell' },
    { name: 'Overhead Press', targetMuscle: 'Shoulders', equipment: 'Barbell' },
    { name: 'Lateral Raises', targetMuscle: 'Shoulders', equipment: 'Dumbbell' },
    { name: 'Bicep Curls', targetMuscle: 'Arms', equipment: 'Dumbbell' },
    { name: 'Tricep Extensions', targetMuscle: 'Arms', equipment: 'Cable' },
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { name: ex.name },
      update: {},
      create: ex,
    });
  }

  console.log('Seeding common foods (USDA-informed)...');
  const foods = [
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, servingSize: 100, servingUnit: 'g' },
    { name: 'Lean Beef (95%)', calories: 170, protein: 26, carbs: 0, fats: 7, servingSize: 100, servingUnit: 'g' },
    { name: 'Beef (Ribeye)', calories: 291, protein: 24, carbs: 0, fats: 22, servingSize: 100, servingUnit: 'g' },
    { name: 'Salmon Filet', calories: 208, protein: 20, carbs: 0, fats: 13, servingSize: 100, servingUnit: 'g' },
    { name: 'Tilapia', calories: 128, protein: 26, carbs: 0, fats: 2.7, servingSize: 100, servingUnit: 'g' },
    { name: 'Egg (Large)', calories: 70, protein: 6, carbs: 0.6, fats: 5, servingSize: 1, servingUnit: 'unit' },
    { name: 'Egg Whites', calories: 52, protein: 11, carbs: 0.7, fats: 0.2, servingSize: 100, servingUnit: 'g' },
    { name: 'Greek Yogurt (Non-fat)', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, servingSize: 100, servingUnit: 'g' },
    { name: 'Greek Yogurt (Whole)', calories: 97, protein: 9, carbs: 4, fats: 5, servingSize: 100, servingUnit: 'g' },
    { name: 'Cottage Cheese (Low fat)', calories: 82, protein: 11, carbs: 3.4, fats: 2.3, servingSize: 100, servingUnit: 'g' },
    { name: 'Skim Milk', calories: 35, protein: 3.4, carbs: 5, fats: 0.1, servingSize: 100, servingUnit: 'ml' },
    { name: 'White Rice (Cooked)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingSize: 100, servingUnit: 'g' },
    { name: 'Brown Rice (Cooked)', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, servingSize: 100, servingUnit: 'g' },
    { name: 'Oatmeal (Old Fashioned)', calories: 389, protein: 16.9, carbs: 66, fats: 7, servingSize: 100, servingUnit: 'g' },
    { name: 'Quinoa (Cooked)', calories: 120, protein: 4.4, carbs: 21, fats: 1.9, servingSize: 100, servingUnit: 'g' },
    { name: 'Sweet Potato (Baked)', calories: 90, protein: 2, carbs: 21, fats: 0.1, servingSize: 100, servingUnit: 'g' },
    { name: 'Potato (Boiled)', calories: 87, protein: 1.9, carbs: 20, fats: 0.1, servingSize: 100, servingUnit: 'g' },
    { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fats: 3.4, servingSize: 100, servingUnit: 'g' },
    { name: 'Pasta (Cooked)', calories: 131, protein: 5, carbs: 25, fats: 1.1, servingSize: 100, servingUnit: 'g' },
    { name: 'Broccoli (RAW)', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, servingSize: 100, servingUnit: 'g' },
    { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, servingSize: 100, servingUnit: 'g' },
    { name: 'Kale', calories: 49, protein: 4.3, carbs: 9, fats: 0.9, servingSize: 100, servingUnit: 'g' },
    { name: 'Asparagus', calories: 20, protein: 2.2, carbs: 3.9, fats: 0.1, servingSize: 100, servingUnit: 'g' },
    { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fats: 15, servingSize: 100, servingUnit: 'g' },
    { name: 'Banana (Medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, servingSize: 1, servingUnit: 'unit' },
    { name: 'Apple (Medium)', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, servingSize: 1, servingUnit: 'unit' },
    { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fats: 0.3, servingSize: 100, servingUnit: 'g' },
    { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fats: 50, servingSize: 100, servingUnit: 'g' },
    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50, servingSize: 100, servingUnit: 'g' },
    { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fats: 65, servingSize: 100, servingUnit: 'g' },
    { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fats: 100, servingSize: 100, servingUnit: 'ml' },
    { name: 'Whey Protein Isolate', calories: 110, protein: 25, carbs: 1, fats: 0.5, servingSize: 30, servingUnit: 'g' },
    { name: 'Creatine Monohydrate', calories: 0, protein: 0, carbs: 0, fats: 0, servingSize: 5, servingUnit: 'g' },
    { name: 'Casein Protein', calories: 120, protein: 24, carbs: 3, fats: 1, servingSize: 32, servingUnit: 'g' },
    { name: 'Black Coffee', calories: 1, protein: 0.1, carbs: 0, fats: 0, servingSize: 240, servingUnit: 'ml' },
    { name: 'Green Tea', calories: 1, protein: 0, carbs: 0, fats: 0, servingSize: 240, servingUnit: 'ml' },
    { name: 'Almond Milk (Unsweetened)', calories: 15, protein: 0.5, carbs: 0.5, fats: 1.1, servingSize: 100, servingUnit: 'ml' },
    { name: 'Chicken Biryani', calories: 160, protein: 8, carbs: 20, fats: 5, servingSize: 100, servingUnit: 'g' },
    { name: 'Paneer Butter Masala', calories: 240, protein: 10, carbs: 6, fats: 20, servingSize: 100, servingUnit: 'g' },
    { name: 'Dal Tadka', calories: 120, protein: 6, carbs: 15, fats: 5, servingSize: 100, servingUnit: 'g' },
    { name: 'Masala Dosa', calories: 350, protein: 6, carbs: 60, fats: 8, servingSize: 1, servingUnit: 'unit' },
    { name: 'Idli', calories: 60, protein: 2, carbs: 12, fats: 0.3, servingSize: 1, servingUnit: 'unit' },
    { name: 'Chappati (Roti)', calories: 80, protein: 3, carbs: 15, fats: 1, servingSize: 1, servingUnit: 'unit' },
    { name: 'Tandoori Chicken', calories: 150, protein: 25, carbs: 1, fats: 5, servingSize: 100, servingUnit: 'g' },
    { name: 'Butter Chicken', calories: 250, protein: 15, carbs: 8, fats: 18, servingSize: 100, servingUnit: 'g' },
    { name: 'Palak Paneer', calories: 150, protein: 10, carbs: 8, fats: 10, servingSize: 100, servingUnit: 'g' },
    { name: 'Samosa', calories: 250, protein: 4, carbs: 25, fats: 15, servingSize: 1, servingUnit: 'unit' },
    { name: 'Gulab Jamun', calories: 150, protein: 2, carbs: 25, fats: 5, servingSize: 1, servingUnit: 'unit' },
    { name: 'Medu Vada', calories: 100, protein: 3, carbs: 10, fats: 6, servingSize: 1, servingUnit: 'unit' },
    { name: 'Poha', calories: 180, protein: 3, carbs: 32, fats: 4, servingSize: 100, servingUnit: 'g' },
  ];

  for (const food of foods) {
    await prisma.food.upsert({
      where: { id: `seed-${food.name}` }, // Using a custom ID to avoid duplicates but allow re-seeding
      update: {},
      create: {
        id: `seed-${food.name}`,
        ...food,
      },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
