import { NextResponse } from 'next/server';
import { sendTestNotificationEmail } from '@/services/mail/resend';
import { getAdminNotificationEmails } from '@/services/settings/notification-settings';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    let targetEmails: string[] = [];

    try {
      const body = await request.json();
      if (Array.isArray(body?.recipientEmails) && body.recipientEmails.length > 0) {
        targetEmails = body.recipientEmails.map((e: unknown) => String(e).trim().toLowerCase());
      }
    } catch {
      // Body may be empty, fallback to saved settings
    }

    if (targetEmails.length === 0) {
      targetEmails = await getAdminNotificationEmails();
    }

    if (targetEmails.length === 0) {
      return NextResponse.json(
        { error: 'No recipient emails specified or configured.' },
        { status: 400 }
      );
    }

    const result = await sendTestNotificationEmail(targetEmails);

    if (result.error) {
      console.error('Test email delivery error:', result.error);
      return NextResponse.json(
        { error: result.error.message || 'Failed to send test email via Resend' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email successfully sent to ${targetEmails.join(', ')}`,
      data: result.data,
    });
  } catch (error: unknown) {
    console.error('Test email error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send test email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
