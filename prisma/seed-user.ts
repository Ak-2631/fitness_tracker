import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      password: hashedPassword
    },
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      targetCalories: 2500,
      targetProtein: 150,
    },
  });
  console.log('Seeded user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
