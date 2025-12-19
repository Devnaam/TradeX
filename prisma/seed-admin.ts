import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdmin() {
  console.log('🔐 Seeding admin credentials...');

  // Delete existing admin if any
  await prisma.admin.deleteMany({});

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      username: 'tradex_admin',
      password: 'TrX@2025#Secure', // Plain text as per your requirement
    },
  });

  console.log(`✅ Admin created: ${admin.username}`);
  console.log('✅ Admin seeding completed!');
}

seedAdmin()
  .catch((e) => {
    console.error('❌ Admin seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
