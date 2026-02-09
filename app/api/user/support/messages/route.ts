import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          messages: messages.map((m) => ({
            id: m.id,
            subject: m.subject,
            category: m.category,
            message: m.message,
            adminReply: m.adminReply,
            status: m.status,
            createdAt: m.createdAt.toISOString(),
            repliedAt: m.repliedAt?.toISOString(),
          })),
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
