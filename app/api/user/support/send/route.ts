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

    const { subject, category, message } = await request.json();

    // Validation
    if (!subject || !category || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' } as ApiResponse,
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 10 characters' } as ApiResponse,
        { status: 400 }
      );
    }

    // Create message
    const newMessage = await prisma.message.create({
      data: {
        userId: parseInt(userId),
        subject,
        category,
        message,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! Admin will reply soon.',
        data: {
          messageId: newMessage.id,
        },
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
