import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate unique 8-character user ID (TRX + 5 random chars)
function generateUserId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'TRX';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function populateUserIds() {
  try {
    console.log('🚀 Starting to populate user IDs...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        userId: true,
      },
    });

    console.log(`📊 Found ${users.length} total users\n`);

    let updated = 0;
    let skipped = 0;

    for (const user of users) {
      // Skip if already has userId
      if (user.userId) {
        console.log(`⏭️  User #${user.id} (${user.phone}) already has userId: ${user.userId}`);
        skipped++;
        continue;
      }

      let userId = generateUserId();
      
      // Ensure uniqueness
      let existing = await prisma.user.findFirst({
        where: { userId },
      });

      while (existing) {
        userId = generateUserId();
        existing = await prisma.user.findFirst({
          where: { userId },
        });
      }

      // Update user
      await prisma.user.update({
        where: { id: user.id },
        data: { userId },
      });

      console.log(`✅ User #${user.id} (${user.phone}) → ${userId}`);
      updated++;
    }

    console.log(`\n🎉 Complete!`);
    console.log(`   ✅ Updated: ${updated} users`);
    console.log(`   ⏭️  Skipped: ${skipped} users (already had userId)`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateUserIds();
