import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { token } = await context.params;

    // Find withdrawal by verification token
    const withdrawal = await prisma.withdrawal.findFirst({
      where: {
        verificationToken: token,
        status: 'approved',
        verificationExpiry: {
          gt: new Date(), // Check not expired
        },
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
          error: 'Invalid or expired verification link',
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.withdrawal.update({
      where: { id: withdrawal.id },
      data: {
        verificationViewCount: {
          increment: 1,
        },
      },
    });

    // Mask user name for privacy (show first name + initial)
    const nameParts = withdrawal.user.name.split(' ');
    const maskedName =
      nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[1][0]}.`
        : withdrawal.user.name;

    return NextResponse.json(
      {
        success: true,
        data: {
          amount: parseFloat(withdrawal.amount.toString()),
          userName: maskedName,
          date: withdrawal.createdAt.toISOString(),
          method: withdrawal.method,
          isValid: true,
          expiresAt: withdrawal.verificationExpiry?.toISOString(),
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify withdrawal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify withdrawal',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
