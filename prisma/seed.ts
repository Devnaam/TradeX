import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed 6 Investment Plans
  const plans = [
    { planNumber: 1, amount: 5000, dailyIncome: 50, validityDays: 95 },
    { planNumber: 2, amount: 10000, dailyIncome: 150, validityDays: 95 },
    { planNumber: 3, amount: 20000, dailyIncome: 400, validityDays: 95 },
    { planNumber: 4, amount: 30000, dailyIncome: 750, validityDays: 95 },
    { planNumber: 5, amount: 50000, dailyIncome: 1500, validityDays: 95 },
    { planNumber: 6, amount: 100000, dailyIncome: 5000, validityDays: 95 },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { planNumber: plan.planNumber },
      update: {},
      create: plan,
    });
  }

  console.log('✅ Created 6 investment plans');

  // Seed Default Payment Settings
  await prisma.paymentSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      qrCodeUrl: 'https://placeholder.com/qr-code.png',
      upiId: 'admin@upi',
    },
  });

  console.log('✅ Created payment settings');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
