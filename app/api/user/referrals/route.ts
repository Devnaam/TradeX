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

    // Get user with referral code
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        referralCode: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Get referred users
    const referredUsers = await prisma.user.findMany({
      where: {
        referredById: parseInt(userId),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        createdAt: true,
        deposits: {
          where: {
            status: 'approved',
          },
          select: {
            amount: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get total referral income
    const referralIncomes = await prisma.referralIncome.findMany({
      where: {
        referrerId: parseInt(userId),
      },
      select: {
        amount: true,
      },
    });

    const totalReferralIncome = referralIncomes.reduce(
      (sum, income) => sum + parseFloat(income.amount.toString()),
      0
    );

    // Format referred users data
    const formattedReferredUsers = referredUsers.map((refUser) => {
      const totalDeposits = refUser.deposits.reduce(
        (sum, deposit) => sum + parseFloat(deposit.amount.toString()),
        0
      );
      const commissionEarned = totalDeposits * 0.1; // 10%

      return {
        id: refUser.id,
        name: refUser.name,
        phone: refUser.phone,
        joinDate: refUser.createdAt.toISOString(),
        totalDeposits,
        commissionEarned,
      };
    });

    // Generate referral link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const referralLink = `${baseUrl}/signup?ref=${user.referralCode}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          referralCode: user.referralCode,
          referralLink,
          totalReferrals: referredUsers.length,
          totalReferralIncome,
          referredUsers: formattedReferredUsers,
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get referrals error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
