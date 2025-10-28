import { NextRequest, NextResponse } from 'next/server';
import { addContactToBrevo } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Add contact to Brevo
    const result = await addContactToBrevo({
      email,
      listIds: [2], // Newsletter list ID
      updateEnabled: true,
      attributes: {
        SUBSCRIBED_DATE: new Date().toISOString(),
        SOURCE: 'Website Newsletter',
      },
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to subscribe' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to subscribe to newsletter'
      },
      { status: 500 }
    );
  }
}
