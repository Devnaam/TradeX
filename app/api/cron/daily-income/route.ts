import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🕐 Daily Income Cron Job Started:', new Date().toISOString());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Step 1: Get all active user plans
    const activePlans = await prisma.userPlan.findMany({
      where: {
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            isBlocked: true,
          },
        },
      },
    });

    console.log(`📊 Found ${activePlans.length} active plans`);

    let processedCount = 0;
    let expiredCount = 0;
    let skippedCount = 0;
    let totalIncomeAdded = 0;

    // Step 2: Process each active plan
    for (const userPlan of activePlans) {
      try {
        // Skip if user is blocked
        if (userPlan.user.isBlocked) {
          console.log(`⏭️ Skipping plan ${userPlan.id} - User blocked`);
          skippedCount++;
          continue;
        }

        // Check if plan has expired
        const expiryDate = new Date(userPlan.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);

        if (today >= expiryDate) {
          // Mark plan as expired
          await prisma.userPlan.update({
            where: { id: userPlan.id },
            data: { status: 'expired' },
          });
          console.log(`⏰ Plan ${userPlan.id} marked as expired`);
          expiredCount++;
          continue;
        }

        // Add daily income using transaction
        await prisma.$transaction(async (tx) => {
          // 1. Add to user's income balance
          await tx.user.update({
            where: { id: userPlan.userId },
            data: {
              incomeBalance: {
                increment: userPlan.dailyIncome,
              },
            },
          });

          // 2. Create daily income log
          await tx.dailyIncomeLog.create({
            data: {
              userId: userPlan.userId,
              userPlanId: userPlan.id,
              amount: userPlan.dailyIncome,
              date: today,
            },
          });
        });

        totalIncomeAdded += parseFloat(userPlan.dailyIncome.toString());
        processedCount++;
        console.log(
          `✅ Processed plan ${userPlan.id} - Added ₹${userPlan.dailyIncome} to user ${userPlan.userId}`
        );
      } catch (error) {
        console.error(`❌ Error processing plan ${userPlan.id}:`, error);
        // Continue with next plan even if one fails
      }
    }

    const summary = {
      timestamp: new Date().toISOString(),
      totalPlans: activePlans.length,
      processed: processedCount,
      expired: expiredCount,
      skipped: skippedCount,
      totalIncomeAdded: totalIncomeAdded.toFixed(2),
    };

    console.log('✅ Daily Income Cron Job Completed:', summary);

    return NextResponse.json(
      {
        success: true,
        message: 'Daily income distribution completed',
        data: summary,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Daily Income Cron Job Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
