import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' } as ApiResponse,
    { status: 200 }
  );

  // Clear auth cookie
  response.cookies.delete('auth-token');

  return response;
}
