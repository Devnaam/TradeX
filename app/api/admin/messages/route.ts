import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication (matching your pattern)
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // all, pending, replied

    const where: any = {};
    if (filter === 'pending') {
      where.status = 'pending';
    } else if (filter === 'replied') {
      where.status = 'replied';
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            userId: true,
          },
        },
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
            userId: m.userId,
            user: {
              id: m.user.id,
              name: m.user.name,
              phone: m.user.phone,
              userId: m.user.userId,
            },
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
    console.error('Admin get messages error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
