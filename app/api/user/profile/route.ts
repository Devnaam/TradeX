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

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        userId: true, // ✅ Select userId
        name: true,
        phone: true,
        referralCode: true,
        createdAt: true,
        rechargeBalance: true,
        incomeBalance: true,
        totalWithdraw: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    const profile = {
      id: user.id,
      userId: user.userId, // ✅ Return userId
      name: user.name,
      phone: user.phone,
      referralCode: user.referralCode,
      createdAt: user.createdAt.toISOString(),
      rechargeBalance: parseFloat(user.rechargeBalance.toString()),
      incomeBalance: parseFloat(user.incomeBalance.toString()),
      totalWithdraw: parseFloat(user.totalWithdraw.toString()),
    };

    return NextResponse.json(
      {
        success: true,
        data: { profile },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
