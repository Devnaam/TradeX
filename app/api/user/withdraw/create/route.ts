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

    const { amount, method } = await request.json();

    // Validation
    if (!amount || !method) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' } as ApiResponse,
        { status: 400 }
      );
    }

    if (amount < 300) {
      return NextResponse.json(
        { success: false, error: 'Minimum withdrawal amount is ₹300' } as ApiResponse,
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

    const currentBalance = parseFloat(user.incomeBalance.toString());

    if (amount > currentBalance) {
      return NextResponse.json(
        { success: false, error: 'Insufficient income balance' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if bank details exist
    const bankDetails = await prisma.bankDetail.findFirst({
      where: { userId: parseInt(userId) },
    });

    if (!bankDetails) {
      return NextResponse.json(
        { success: false, error: 'Please add bank details first' } as ApiResponse,
        { status: 400 }
      );
    }

    // Deduct amount from income balance immediately
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        incomeBalance: {
          decrement: amount,
        },
      },
    });

    // Create withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: parseInt(userId),
        amount,
        method,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal request created successfully',
        data: { withdrawalId: withdrawal.id },
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Withdrawal creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
