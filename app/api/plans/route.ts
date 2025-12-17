import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        planNumber: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          plans: plans.map((p) => ({
            id: p.id,
            planNumber: p.planNumber,
            amount: parseFloat(p.amount.toString()),
            dailyIncome: parseFloat(p.dailyIncome.toString()),
            validityDays: p.validityDays,
            isActive: true, // All plans are always active for now
          })),
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Plans fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
