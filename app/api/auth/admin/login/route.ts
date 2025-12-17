import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { ApiResponse } from '@/types';

// Hardcoded admin credentials (as per PRD)
const ADMIN_USERNAME = 'tradex_admin';
const ADMIN_PASSWORD = 'TrX@2025#Secure';

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

    // Check credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse,
        { status: 401 }
      );
    }

    // Generate JWT token for admin
    const token = generateToken({
      userId: 0, // Admin doesn't have userId
      phone: 'admin',
      role: 'admin',
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin login successful',
        data: { role: 'admin' },
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
