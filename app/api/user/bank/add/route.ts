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

    const { bankName, accountHolderName, accountNumber, ifscCode, upiId } = await request.json();

    // Validation
    if (!bankName || !accountHolderName || !accountNumber || !ifscCode) {
      return NextResponse.json(
        { success: false, error: 'All bank details are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if bank details already exist
    const existingBank = await prisma.bankDetail.findFirst({
      where: { userId: parseInt(userId) },
    });

    let bankDetails;

    if (existingBank) {
      // Update existing bank details
      bankDetails = await prisma.bankDetail.update({
        where: { id: existingBank.id },
        data: {
          bankName,
          accountHolderName,
          accountNumber,
          ifscCode,
          upiId: upiId || null,
        },
      });
    } else {
      // Create new bank details
      bankDetails = await prisma.bankDetail.create({
        data: {
          userId: parseInt(userId),
          bankName,
          accountHolderName,
          accountNumber,
          ifscCode,
          upiId: upiId || null,
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
    console.error('Bank details save error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save bank details' } as ApiResponse,
      { status: 500 }
    );
  }
}
