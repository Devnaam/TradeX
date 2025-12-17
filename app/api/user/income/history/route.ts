import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' } as ApiResponse,
        { status: 401 }
      );
    }

    const incomeLogs = await prisma.dailyIncomeLog.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        userPlan: {
          include: {
            plan: {
              select: {
                planNumber: true,
                amount: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const formattedLogs = incomeLogs.map((log) => ({
      id: log.id,
      amount: parseFloat(log.amount.toString()),
      date: log.date.toISOString(),
      planName: `Plan ${log.userPlan.plan.planNumber}`,
      planNumber: log.userPlan.plan.planNumber,
    }));

    const totalIncome = incomeLogs.reduce(
      (sum, log) => sum + parseFloat(log.amount.toString()),
      0
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          incomeLogs: formattedLogs,
          totalIncome,
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get income history error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
