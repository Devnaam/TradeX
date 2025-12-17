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

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          withdrawals: withdrawals.map((w) => ({
            id: w.id,
            amount: parseFloat(w.amount.toString()),
            method: w.method,
            status: w.status,
            adminRemark: w.adminRemark,
            createdAt: w.createdAt.toISOString(),
          })),
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Withdrawal history error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
