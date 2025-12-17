import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' } as ApiResponse,
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const depositId = formData.get('depositId') as string;
    const utrNumber = formData.get('utrNumber') as string;
    const screenshot = formData.get('screenshot') as File;

    if (!depositId || !utrNumber || !screenshot) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Verify deposit belongs to user and is rejected
    const deposit = await prisma.deposit.findFirst({
      where: {
        id: parseInt(depositId),
        userId: parseInt(userId),
        status: 'rejected',
      },
    });

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: 'Deposit not found or not rejected' } as ApiResponse,
        { status: 404 }
      );
    }

    // TODO: Upload screenshot to Vercel Blob
    // For now, using placeholder URL
    const screenshotUrl = `https://placeholder.com/${screenshot.name}`;

    // Update deposit
    await prisma.deposit.update({
      where: { id: parseInt(depositId) },
      data: {
        utrNumber,
        screenshotUrl,
        status: 'pending',
        adminRemark: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit resubmitted successfully',
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resubmit deposit error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
