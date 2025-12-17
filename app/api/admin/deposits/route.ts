import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const deposits = await prisma.deposit.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedDeposits = deposits.map((deposit) => ({
      id: deposit.id,
      amount: parseFloat(deposit.amount.toString()),
      utrNumber: deposit.utrNumber,
      screenshotUrl: deposit.screenshotUrl,
      status: deposit.status,
      adminRemark: deposit.adminRemark,
      createdAt: deposit.createdAt.toISOString(),
      user: {
        id: deposit.user.id,
        name: deposit.user.name,
        phone: deposit.user.phone,
      },
    }));

    return NextResponse.json(
      {
        success: true,
        data: { deposits: formattedDeposits },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get deposits error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
