import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userId, block } = await request.json();

    // Validation
    if (!userId || typeof block !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // If blocking user, cancel all active plans
    if (block) {
      await prisma.userPlan.updateMany({
        where: {
          userId: userId,
          status: 'active',
        },
        data: {
          status: 'blocked',
        },
      });
    }

    // Update user blocked status
    await prisma.user.update({
      where: { id: userId },
      data: { isBlocked: block },
    });

    return NextResponse.json(
      {
        success: true,
        message: block ? 'User blocked successfully' : 'User unblocked successfully',
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Block/Unblock user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
