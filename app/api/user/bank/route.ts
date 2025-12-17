import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

// GET bank details
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const bankDetails = await prisma.bankDetail.findFirst({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json(
      {
        success: true,
        data: { bankDetails },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get bank details error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST/PUT bank details
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const { bankName, accountHolderName, accountNumber, ifscCode, upiId } = await request.json();

    // Validation
    if (!accountHolderName) {
      return NextResponse.json(
        { success: false, error: 'Account holder name is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if bank details exist
    const existing = await prisma.bankDetail.findFirst({
      where: { userId: parseInt(userId) },
    });

    let bankDetails;

    if (existing) {
      // Update existing
      bankDetails = await prisma.bankDetail.update({
        where: { id: existing.id },
        data: {
          bankName,
          accountHolderName,
          accountNumber,
          ifscCode,
          upiId,
        },
      });
    } else {
      // Create new
      bankDetails = await prisma.bankDetail.create({
        data: {
          userId: parseInt(userId),
          bankName,
          accountHolderName,
          accountNumber,
          ifscCode,
          upiId,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bank details saved successfully',
        data: { bankDetails },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Save bank details error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
