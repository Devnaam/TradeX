import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const { withdrawalId } = await request.json();

    // Find withdrawal - must be approved and belong to user
    const withdrawal = await prisma.withdrawal.findFirst({
      where: {
        id: withdrawalId,
        userId: parseInt(userId),
        status: 'approved', // Only approved withdrawals can be verified
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        {
          success: false,
          error: 'Withdrawal not found or not approved',
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Generate unique verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Set expiry (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Update withdrawal with verification data
    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        verificationToken,
        verificationExpiry: expiresAt,
      },
    });

    // Generate shareable link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifiedLink = `${baseUrl}/verified-withdrawal/${verificationToken}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          verifiedLink,
          expiresAt: expiresAt.toISOString(),
          withdrawal: {
            id: updatedWithdrawal.id,
            amount: parseFloat(updatedWithdrawal.amount.toString()),
            userName: withdrawal.user.name,
            date: updatedWithdrawal.createdAt.toISOString(),
          },
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Generate verified link error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate verified link',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
