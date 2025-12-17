import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const cronSecret = process.env.CRON_SECRET || 'test-secret-key';

    // Call the cron job API
    const response = await fetch(`${baseUrl}/api/cron/daily-income`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: 'Cron job triggered manually',
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Manual cron trigger error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger cron job',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
