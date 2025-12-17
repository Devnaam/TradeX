import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

// GET payment settings
export async function GET() {
  try {
    const settings = await prisma.paymentSetting.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { settings },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST/UPDATE payment settings
export async function POST(request: NextRequest) {
  try {
    const { qrCodeUrl, upiId } = await request.json();

    // Validation
    if (!qrCodeUrl || !upiId) {
      return NextResponse.json(
        { success: false, error: 'QR Code URL and UPI ID are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if settings exist
    const existing = await prisma.paymentSetting.findFirst();

    let settings;

    if (existing) {
      // Update existing
      settings = await prisma.paymentSetting.update({
        where: { id: existing.id },
        data: {
          qrCodeUrl,
          upiId,
        },
      });
    } else {
      // Create new
      settings = await prisma.paymentSetting.create({
        data: {
          qrCodeUrl,
          upiId,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment settings updated successfully',
        data: { settings },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
