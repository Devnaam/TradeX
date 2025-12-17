import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            bankDetails: {
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                bankName: true,
                accountHolderName: true,
                accountNumber: true,
                ifscCode: true,
                upiId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedWithdrawals = withdrawals.map((withdrawal) => ({
      id: withdrawal.id,
      amount: parseFloat(withdrawal.amount.toString()),
      method: withdrawal.method,
      status: withdrawal.status,
      adminRemark: withdrawal.adminRemark,
      createdAt: withdrawal.createdAt.toISOString(),
      user: {
        id: withdrawal.user.id,
        name: withdrawal.user.name,
        phone: withdrawal.user.phone,
      },
      bankDetails: withdrawal.user.bankDetails[0] || null,
    }));

    return NextResponse.json(
      {
        success: true,
        data: { withdrawals: formattedWithdrawals },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get withdrawals error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
