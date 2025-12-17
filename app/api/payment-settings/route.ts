import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const settings = await prisma.paymentSetting.findFirst({
      where: { id: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          qrCodeUrl: settings?.qrCodeUrl || 'https://via.placeholder.com/400?text=QR+Code',
          upiId: settings?.upiId || 'admin@upi',
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
