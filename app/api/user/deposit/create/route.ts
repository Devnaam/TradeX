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

    const { amount, utrNumber, screenshotUrl, paymentMethod } = await request.json();

    // Validation
    if (!amount || !utrNumber || !screenshotUrl) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' } as ApiResponse,
        { status: 400 }
      );
    }

    if (amount < 300) {
      return NextResponse.json(
        { success: false, error: 'Minimum deposit amount is ₹300' } as ApiResponse,
        { status: 400 }
      );
    }

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: parseInt(userId),
        amount,
        utrNumber,
        screenshotUrl,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit request created successfully',
        data: { depositId: deposit.id },
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Deposit creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
