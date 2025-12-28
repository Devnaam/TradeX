import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userId: true, // ✅ ADDED - Include userId
        name: true,
        phone: true,
        password: true,
        referralCode: true,
        rechargeBalance: true,
        incomeBalance: true,
        totalWithdraw: true,
        isBlocked: true,
        createdAt: true,
        userPlans: {
          where: { status: 'active' },
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      userId: user.userId, // ✅ ADDED - Include userId in response
      name: user.name,
      phone: user.phone,
      password: user.password,
      referralCode: user.referralCode,
      rechargeBalance: parseFloat(user.rechargeBalance.toString()),
      incomeBalance: parseFloat(user.incomeBalance.toString()),
      totalWithdraw: parseFloat(user.totalWithdraw.toString()),
      isBlocked: user.isBlocked,
      createdAt: user.createdAt.toISOString(),
      activePlansCount: user.userPlans.length,
    }));

    return NextResponse.json(
      {
        success: true,
        data: { users: formattedUsers },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
