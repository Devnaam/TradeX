import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    // Validation
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone and password are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number or password' } as ApiResponse,
        { status: 401 }
      );
    }

    // Check password (plain text comparison as per PRD)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number or password' } as ApiResponse,
        { status: 401 }
      );
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return NextResponse.json(
        { success: false, error: 'Your account has been blocked. Contact support.' } as ApiResponse,
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      role: 'user',
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            referralCode: user.referralCode,
          },
          token, // Send token in response too
        },
      } as ApiResponse,
      { status: 200 }
    );

    // Set HTTP-only cookie with explicit options
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
