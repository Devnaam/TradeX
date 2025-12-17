import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from localStorage (we'll pass it in header)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        phone: true,
        referralCode: true,
        rechargeBalance: true,
        incomeBalance: true,
        totalWithdraw: true,
        isBlocked: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { success: false, error: 'Your account has been blocked' } as ApiResponse,
        { status: 403 }
      );
    }

    // Count active plans
    const activePlansCount = await prisma.userPlan.count({
      where: {
        userId: user.id,
        status: 'active',
      },
    });

    // Count total referrals
    const referralsCount = await prisma.user.count({
      where: {
        referredById: user.id,
      },
    });

    // Calculate total referral income
    const referralIncome = await prisma.referralIncome.aggregate({
      where: {
        referrerId: user.id,
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            referralCode: user.referralCode,
          },
          wallet: {
            rechargeBalance: parseFloat(user.rechargeBalance.toString()),
            incomeBalance: parseFloat(user.incomeBalance.toString()),
            totalWithdraw: parseFloat(user.totalWithdraw.toString()),
          },
          stats: {
            activePlans: activePlansCount,
            totalReferrals: referralsCount,
            referralIncome: parseFloat(referralIncome._sum.amount?.toString() || '0'),
          },
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
