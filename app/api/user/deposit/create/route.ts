import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { uploadImage } from '@/lib/cloudinary'; // ✅ NEW import

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

    // ✅ Validate file type before uploading
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(screenshot.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPG and PNG files are allowed' } as ApiResponse,
        { status: 400 }
      );
    }

    // ✅ Validate file size (5MB)
    if (screenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' } as ApiResponse,
        { status: 400 }
      );
    }

    // ✅ Upload screenshot to Cloudinary
    const arrayBuffer = await screenshot.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const screenshotUrl = await uploadImage(buffer, 'deposits');

    // Create deposit record with real Cloudinary URL
    const deposit = await prisma.deposit.create({
      data: {
        userId: parseInt(userId),
        amount: parseFloat(amount),
        utrNumber,
        screenshotUrl, // ✅ Real URL: https://res.cloudinary.com/dgrttneu8/image/upload/deposits/xxx.jpg
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
