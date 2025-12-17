import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const { planId, amount } = await request.json();

    // Validation
    if (!planId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Plan ID and amount are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Get plan details
    const plan = await prisma.investmentPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' } as ApiResponse,
        { status: 404 }
      );
    }

    if (!plan.isActive) {
      return NextResponse.json(
        { success: false, error: 'This plan is currently inactive' } as ApiResponse,
        { status: 400 }
      );
    }

    const investAmount = parseFloat(amount);

    // Validate amount
    if (investAmount < parseFloat(plan.minInvestment.toString())) {
      return NextResponse.json(
        { success: false, error: `Minimum investment is ₹${plan.minInvestment}` } as ApiResponse,
        { status: 400 }
      );
    }

    if (investAmount > parseFloat(plan.maxInvestment.toString())) {
      return NextResponse.json(
        { success: false, error: `Maximum investment is ₹${plan.maxInvestment}` } as ApiResponse,
        { status: 400 }
      );
    }

    // Get user and check balance
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    const currentBalance = parseFloat(user.rechargeBalance.toString());

    if (investAmount > currentBalance) {
      return NextResponse.json(
        { success: false, error: 'Insufficient recharge balance' } as ApiResponse,
        { status: 400 }
      );
    }

    // Calculate returns
    const dailyReturn = (investAmount * parseFloat(plan.dailyReturn.toString())) / 100;
    const totalReturn = (investAmount * parseFloat(plan.totalReturn.toString())) / 100;

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    // Deduct from recharge balance
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        rechargeBalance: {
          decrement: investAmount,
        },
      },
    });

    // Create investment
    const investment = await prisma.investment.create({
      data: {
        userId: parseInt(userId),
        planId,
        amount: investAmount,
        dailyReturn,
        totalReturn,
        startDate,
        endDate,
        status: 'active',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Investment created successfully',
        data: { investmentId: investment.id },
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Investment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
