const { execSync } = require('child_process');
process.env.DATABASE_URL = "file:./dev.db"; // Prisma resolves this relative to prisma directory usually, or root. Let's use file:./dev.db if it's in prisma? Actually schema is in prisma, so file:./dev.db resolves to prisma/dev.db
execSync('npx tsx prisma/seed-user.ts', { stdio: 'inherit' });
