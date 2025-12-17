import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const investments = await prisma.investment.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          investments: investments.map((inv) => ({
            id: inv.id,
            planName: inv.plan.name,
            amount: parseFloat(inv.amount.toString()),
            dailyReturn: parseFloat(inv.dailyReturn.toString()),
            totalReturn: parseFloat(inv.totalReturn.toString()),
            earnedReturn: parseFloat(inv.earnedReturn.toString()),
            startDate: inv.startDate.toISOString(),
            endDate: inv.endDate.toISOString(),
            status: inv.status,
          })),
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Investments fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
