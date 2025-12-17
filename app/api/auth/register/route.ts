import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReferralCode, generateToken } from '@/lib/auth';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, password, referralCode } = await request.json();

    // Validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be 10 digits' } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate referral code if provided
    let referrerId = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (!referrer) {
        return NextResponse.json(
          { success: false, error: 'Invalid referral code' } as ApiResponse,
          { status: 400 }
        );
      }

      referrerId = referrer.id;
    }

    // Generate unique referral code for new user
    let newReferralCode = generateReferralCode();
    let codeExists = await prisma.user.findUnique({
      where: { referralCode: newReferralCode },
    });

    // Regenerate if code already exists
    while (codeExists) {
      newReferralCode = generateReferralCode();
      codeExists = await prisma.user.findUnique({
        where: { referralCode: newReferralCode },
      });
    }

    // Create user (password stored as plain text as per PRD requirements)
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password, // Plain text as per PRD
        referralCode: newReferralCode,
        referredById: referrerId,
      },
    });

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
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            referralCode: user.referralCode,
          },
        },
      } as ApiResponse,
      { status: 201 }
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
