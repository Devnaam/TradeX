import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { depositId, action, remark } = await request.json();

    // Validation
    if (!depositId || !action || !['approve', 'reject'].includes(action)) {
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

    // Get deposit with user details
    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: {
        user: {
          select: {
            id: true,
            referredById: true,
          },
        },
      },
    });

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: 'Deposit not found' } as ApiResponse,
        { status: 404 }
      );
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Deposit already processed' } as ApiResponse,
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Approve deposit - Use transaction for atomic operation
      await prisma.$transaction(async (tx) => {
        // 1. Update deposit status
        await tx.deposit.update({
          where: { id: depositId },
          data: {
            status: 'approved',
            adminRemark: remark || 'Approved by admin',
          },
        });

        // 2. Add amount to user's recharge balance
        await tx.user.update({
          where: { id: deposit.userId },
          data: {
            rechargeBalance: {
              increment: deposit.amount,
            },
          },
        });

        // 3. Calculate and add 10% referral commission (if user was referred)
        if (deposit.user.referredById) {
          const referralCommission = deposit.amount.toNumber() * 0.1; // 10%

          // Add commission to referrer's income balance
          await tx.user.update({
            where: { id: deposit.user.referredById },
            data: {
              incomeBalance: {
                increment: referralCommission,
              },
            },
          });

          // Create referral income record
          await tx.referralIncome.create({
            data: {
              referrerId: deposit.user.referredById,
              referredUserId: deposit.userId,
              depositId: depositId,
              amount: referralCommission,
            },
          });
        }
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Deposit approved successfully. Recharge balance updated and referral commission added.',
        } as ApiResponse,
        { status: 200 }
      );
    } else {
      // Reject deposit
      await prisma.deposit.update({
        where: { id: depositId },
        data: {
          status: 'rejected',
          adminRemark: remark,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Deposit rejected successfully',
        } as ApiResponse,
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Deposit action error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
