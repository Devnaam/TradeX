import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    // 1. Total Users (including blocked count)
    const [totalUsers, blockedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isBlocked: true } }),
    ]);

    // 2. Deposits Statistics
    const [pendingDeposits, approvedDeposits, rejectedDeposits] = await Promise.all([
      prisma.deposit.count({ where: { status: 'pending' } }),
      prisma.deposit.count({ where: { status: 'approved' } }),
      prisma.deposit.count({ where: { status: 'rejected' } }),
    ]);

    // 3. Withdrawals Statistics
    const [pendingWithdrawals, approvedWithdrawals, rejectedWithdrawals] = await Promise.all([
      prisma.withdrawal.count({ where: { status: 'pending' } }),
      prisma.withdrawal.count({ where: { status: 'approved' } }),
      prisma.withdrawal.count({ where: { status: 'rejected' } }),
    ]);

    // 4. Plans Statistics
    const [activePlans, totalPlans] = await Promise.all([
      prisma.userPlan.count({ where: { status: 'active' } }),
      prisma.userPlan.count(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: {
            totalUsers,
            blockedUsers,
            totalDeposits: {
              pending: pendingDeposits,
              approved: approvedDeposits,
              rejected: rejectedDeposits,
              totalAmount: 0, // Can calculate if needed
            },
            totalWithdrawals: {
              pending: pendingWithdrawals,
              approved: approvedWithdrawals,
              rejected: rejectedWithdrawals,
              totalAmount: 0, // Can calculate if needed
            },
            activePlans,
            totalPlans,
          },
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
