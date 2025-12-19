import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword, confirmPassword } = await request.json();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirm password do not match' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password must be different from current password' } as ApiResponse,
        { status: 400 }
      );
    }

    // Get admin from database (assuming only one admin exists)
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Verify current password
    if (admin.password !== currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' } as ApiResponse,
        { status: 401 }
      );
    }

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: newPassword },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully',
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
