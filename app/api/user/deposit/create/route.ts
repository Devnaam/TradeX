import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
// import { put } from '@vercel/blob'; // Uncomment when blob is ready

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
    const amount = formData.get('amount') as string;
    const utrNumber = formData.get('utrNumber') as string;
    const screenshot = formData.get('screenshot') as File;

    if (!amount || !utrNumber || !screenshot) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate amount
    if (parseFloat(amount) < 300) {
      return NextResponse.json(
        { success: false, error: 'Minimum deposit amount is ₹300' } as ApiResponse,
        { status: 400 }
      );
    }

    // TODO: Upload to Vercel Blob when token is available
    // const blob = await put(screenshot.name, screenshot, {
    //   access: 'public',
    //   token: process.env.BLOB_READ_WRITE_TOKEN,
    // });
    // const screenshotUrl = blob.url;

    // Temporary: Use placeholder URL (replace with Blob later)
    const screenshotUrl = `https://placeholder.com/deposit-${Date.now()}-${screenshot.name}`;

    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: parseInt(userId),
        amount: parseFloat(amount),
        utrNumber,
        screenshotUrl,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit request submitted successfully',
        data: { depositId: deposit.id },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Create deposit error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
