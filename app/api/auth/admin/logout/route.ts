import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      } as ApiResponse,
      { status: 200 }
    );

    // Clear the auth-token cookie (same cookie used in login)
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('❌ Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
