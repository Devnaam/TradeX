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

    const referralIncomes = await prisma.referralIncome.findMany({
      where: {
        referrerId: parseInt(userId),
      },
      include: {
        referredUser: {
          select: {
            name: true,
            phone: true,
          },
        },
        deposit: {
          select: {
            id: true,
            amount: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedIncomes = referralIncomes.map((income) => ({
      id: income.id,
      amount: parseFloat(income.amount.toString()),
      createdAt: income.createdAt.toISOString(),
      referredUserName: income.referredUser.name,
      referredUserPhone: income.referredUser.phone,
      depositAmount: parseFloat(income.deposit.amount.toString()),
      depositId: income.deposit.id,
    }));

    const totalIncome = referralIncomes.reduce(
      (sum, income) => sum + parseFloat(income.amount.toString()),
      0
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          referralIncomes: formattedIncomes,
          totalIncome,
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get referral income error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
