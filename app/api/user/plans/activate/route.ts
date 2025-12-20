import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();
    
    // Get user ID from header (your existing auth method)
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    // Validation
    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return NextResponse.json(
        { success: false, error: 'Your account is blocked' } as ApiResponse,
        { status: 403 }
      );
    }

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Check if plan is active
    if (!plan.isActive) {
      return NextResponse.json(
        { success: false, error: 'This plan is currently unavailable' } as ApiResponse,
        { status: 400 }
      );
    }

    // ✅ FIX: Convert Decimal to number for comparison
    const userBalance = parseFloat(user.rechargeBalance.toString());
    const planAmount = parseFloat(plan.amount.toString());

    console.log('💰 Balance Check:', {
      userId: user.id,
      userBalance,
      planAmount,
      hasSufficientBalance: userBalance >= planAmount
    });

    // Check if user has sufficient recharge balance
    if (userBalance < planAmount) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Insufficient recharge balance. You have ₹${userBalance}, but need ₹${planAmount}.` 
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Calculate expiry date (using validityDays from database)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + plan.validityDays);

    // Create user plan and deduct balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct from recharge balance
      await tx.user.update({
        where: { id: parseInt(userId) },
        data: {
          rechargeBalance: {
            decrement: plan.amount,
          },
        },
      });

      // 2. Create user plan
      const userPlan = await tx.userPlan.create({
        data: {
          userId: parseInt(userId),
          planId: plan.id,
          amount: plan.amount,
          dailyIncome: plan.dailyIncome,
          startDate: startDate,
          expiryDate: expiryDate,
          status: 'active',
        },
      });

      return userPlan;
    });

    console.log('✅ Plan activated successfully:', {
      userId: user.id,
      planId: plan.id,
      userPlanId: result.id
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Plan activated successfully',
        data: {
          userPlanId: result.id,
          expiryDate: result.expiryDate,
          planNumber: plan.planNumber,
        },
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Activate plan error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
