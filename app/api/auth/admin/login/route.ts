import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // ✅ NEW: Find admin in database
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse,
        { status: 401 }
      );
    }

    // Check password (plain text comparison)
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse,
        { status: 401 }
      );
    }

    // Generate JWT token for admin
    const token = generateToken({
      userId: admin.id, // ✅ Now uses actual admin ID
      phone: 'admin',
      role: 'admin',
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin login successful',
        data: { 
          role: 'admin',
          username: admin.username 
        },
      } as ApiResponse,
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
