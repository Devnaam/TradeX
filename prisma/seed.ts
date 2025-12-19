import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Delete existing plans if any
  await prisma.plan.deleteMany({});

  // Create 6 fixed investment plans as per PRD
  const plans = [
    { planNumber: 1, amount: 5000, dailyIncome: 50 },
    { planNumber: 2, amount: 10000, dailyIncome: 150 },
    { planNumber: 3, amount: 20000, dailyIncome: 400 },
    { planNumber: 4, amount: 30000, dailyIncome: 750 },
    { planNumber: 5, amount: 50000, dailyIncome: 1500 },
    { planNumber: 6, amount: 100000, dailyIncome: 5000 },
  ];

  for (const plan of plans) {
    await prisma.plan.create({
      data: {
        planNumber: plan.planNumber,
        amount: plan.amount,
        dailyIncome: plan.dailyIncome,
        validityDays: 365,
        // REMOVED isActive
      },
    });
    console.log(`✅ Plan ${plan.planNumber} created: ₹${plan.amount} - ₹${plan.dailyIncome}/day`);
  }

  console.log('✅ All 6 Investment Plans created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
