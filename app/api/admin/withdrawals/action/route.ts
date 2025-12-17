import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { withdrawalId, action, remark } = await request.json();

    // Validation
    if (!withdrawalId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' } as ApiResponse,
        { status: 400 }
      );
    }

    if (action === 'reject' && !remark?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Remark is required for rejection' } as ApiResponse,
        { status: 400 }
      );
    }

    // Get withdrawal details
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: {
        user: {
          select: {
            id: true,
            incomeBalance: true,
          },
        },
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, error: 'Withdrawal not found' } as ApiResponse,
        { status: 404 }
      );
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Withdrawal already processed' } as ApiResponse,
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Approve withdrawal - Use transaction
      await prisma.$transaction(async (tx) => {
        // 1. Update withdrawal status
        await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: 'approved',
            adminRemark: remark || 'Payment transferred successfully',
          },
        });

        // 2. Add to user's total withdraw count
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: {
            totalWithdraw: {
              increment: withdrawal.amount,
            },
          },
        });

        // Note: Income balance was already deducted when user requested withdrawal
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Withdrawal approved successfully. Total withdraw updated.',
        } as ApiResponse,
        { status: 200 }
      );
    } else {
      // Reject withdrawal - Use transaction
      await prisma.$transaction(async (tx) => {
        // 1. Update withdrawal status
        await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: 'rejected',
            adminRemark: remark,
          },
        });

        // 2. Refund amount back to user's income balance
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: {
            incomeBalance: {
              increment: withdrawal.amount,
            },
          },
        });
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Withdrawal rejected. Amount refunded to income balance.',
        } as ApiResponse,
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Withdrawal action error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
