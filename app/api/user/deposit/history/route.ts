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

    const deposits = await prisma.deposit.findMany({
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
          deposits: deposits.map((d) => ({
            id: d.id,
            amount: parseFloat(d.amount.toString()),
            utrNumber: d.utrNumber,
            screenshotUrl: d.screenshotUrl,
            status: d.status,
            adminRemark: d.adminRemark,
            createdAt: d.createdAt.toISOString(),
          })),
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Deposit history error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
