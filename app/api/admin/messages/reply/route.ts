import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication (matching your pattern)
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const { messageId, adminReply } = await request.json();

    // Validation
    if (!messageId || !adminReply) {
      return NextResponse.json(
        { success: false, error: 'Message ID and reply are required' } as ApiResponse,
        { status: 400 }
      );
    }

    if (adminReply.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Reply must be at least 10 characters' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if message exists
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Update message with reply
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        adminReply,
        status: 'replied',
        repliedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Reply sent successfully',
        data: {
          message: {
            id: updatedMessage.id,
            status: updatedMessage.status,
            repliedAt: updatedMessage.repliedAt?.toISOString(),
          },
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Admin reply error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send reply',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
