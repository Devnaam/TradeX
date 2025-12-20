import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from header
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    // Get all user plans with plan details
    const userPlans = await prisma.userPlan.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        plan: true, // Include plan details
      },
      orderBy: {
        createdAt: 'desc', // Latest first
      },
    });

    // Get daily income logs for each plan to calculate earned return
    const investments = await Promise.all(
      userPlans.map(async (userPlan) => {
        // Get total earned from daily income logs
        const dailyLogs = await prisma.dailyIncomeLog.findMany({
          where: {
            userPlanId: userPlan.id,
          },
        });

        const earnedReturn = dailyLogs.reduce(
          (sum, log) => sum + parseFloat(log.amount.toString()),
          0
        );

        // Calculate days remaining
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(userPlan.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);
        
        const daysRemaining = Math.max(
          0,
          Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        );

        // Calculate total days
        const startDate = new Date(userPlan.startDate);
        startDate.setHours(0, 0, 0, 0);
        const totalDays = Math.ceil((expiryDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          id: userPlan.id,
          planNumber: userPlan.plan.planNumber,
          amount: parseFloat(userPlan.amount.toString()),
          dailyIncome: parseFloat(userPlan.dailyIncome.toString()),
          earnedReturn,
          // Convert dates to ISO strings for proper JSON serialization
          startDate: startDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          daysRemaining,
          totalDays,
          status: userPlan.status,
          createdAt: userPlan.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: { investments },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Get investments error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
