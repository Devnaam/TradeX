import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // ✅ FIX: Check for 'auth-token' cookie (not 'admin-token')
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    // Fetch all stats in parallel
    const [
      totalUsers,
      blockedUsers,
      pendingDeposits,
      approvedDeposits,
      rejectedDeposits,
      pendingWithdrawals,
      approvedWithdrawals,
      rejectedWithdrawals,
      activePlans,
      totalPlans,
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),
      
      // Blocked users count
      prisma.user.count({
        where: { isBlocked: true },
      }),
      
      // Pending deposits count
      prisma.deposit.count({
        where: { status: 'pending' },
      }),
      
      // Approved deposits count
      prisma.deposit.count({
        where: { status: 'approved' },
      }),
      
      // Rejected deposits count
      prisma.deposit.count({
        where: { status: 'rejected' },
      }),
      
      // Pending withdrawals count
      prisma.withdrawal.count({
        where: { status: 'pending' },
      }),
      
      // Approved withdrawals count
      prisma.withdrawal.count({
        where: { status: 'approved' },
      }),
      
      // Rejected withdrawals count
      prisma.withdrawal.count({
        where: { status: 'rejected' },
      }),
      
      // Active user plans count (status = active)
      prisma.userPlan.count({
        where: { status: 'active' },
      }),
      
      // Total user plans count
      prisma.userPlan.count(),
    ]);

    const stats = {
      totalUsers,
      blockedUsers,
      totalDeposits: {
        pending: pendingDeposits,
        approved: approvedDeposits,
        rejected: rejectedDeposits,
      },
      totalWithdrawals: {
        pending: pendingWithdrawals,
        approved: approvedWithdrawals,
        rejected: rejectedWithdrawals,
      },
      activePlans,
      totalPlans,
    };

    return NextResponse.json(
      {
        success: true,
        data: { stats },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Admin dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' } as ApiResponse,
      { status: 500 }
    );
  }
}
