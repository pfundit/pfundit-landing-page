import { Resend } from 'resend';
import { envConfig } from '@/config/env.config';
import type { JobApplicationRecord } from '@/lib/db/types';
import { getAdminNotificationEmails } from '@/services/settings/notification-settings';

function getResendClient() {
  if (!envConfig.resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured in .env');
  }
  return new Resend(envConfig.resendApiKey);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return iso;
  }
}

export function buildJobApplicationPlainText(application: JobApplicationRecord, resumeUrl: string): string {
  const lines = [
    '=================================================================',
    'NEW JOB APPLICATION RECEIVED - PFUNDIT CAREERS',
    '=================================================================',
    '',
    `ROLE: ${application.role}`,
    application.category ? `CATEGORY: ${application.category}` : null,
    application.type ? `TYPE: ${application.type}` : null,
    `SUBMISSION DATE: ${formatDate(application.createdAt)}`,
    '',
    '-----------------------------------------------------------------',
    'CANDIDATE INFORMATION',
    '-----------------------------------------------------------------',
    `Full Name: ${application.name}`,
    `Email: ${application.email}`,
    `LinkedIn Profile: ${application.linkedin || 'Not provided'}`,
    '',
    '-----------------------------------------------------------------',
    'RESUME / CV DOCUMENT',
    '-----------------------------------------------------------------',
    `Document Name: ${application.resumeName || 'Resume'}`,
    `Cloudinary URL: ${resumeUrl}`,
    '',
    '-----------------------------------------------------------------',
    'WHY PFUNDIT / COVER STATEMENT',
    '-----------------------------------------------------------------',
    application.whyPfundit,
    '',
    '=================================================================',
    'ADMIN ACTIONS',
    '=================================================================',
    'To review and manage all applications, visit the Pfundit Admin Portal:',
    'https://www.pfundit.com/admin',
    '',
    '(Tip: To reply directly to this candidate, simply click "Reply" in your email client.)',
    '=================================================================',
  ];

  return lines.filter((line): line is string => line !== null).join('\n');
}

export async function sendJobApplicationNotificationEmail(
  application: JobApplicationRecord,
  resumeUrl: string
) {
  try {
    const resend = getResendClient();
    const recipientEmails = await getAdminNotificationEmails();

    if (recipientEmails.length === 0) {
      console.warn('No admin recipient emails configured. Skipping email notification.');
      return { success: false, reason: 'No recipients configured' };
    }

    const plainText = buildJobApplicationPlainText(application, resumeUrl);
    const subject = `[Pfundit Careers] New Application: ${application.role} - ${application.name}`;

    const result = await resend.emails.send({
      from: envConfig.emailFrom,
      to: recipientEmails,
      replyTo: application.email,
      subject,
      text: plainText,
    });

    if (result.error) {
      console.error('Resend delivery error:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Failed to send job application notification via Resend:', error);
    return { success: false, error };
  }
}

export async function sendTestNotificationEmail(recipientEmails: string[]) {
  const resend = getResendClient();
  const subject = '[Pfundit Careers] Admin Notification Test';
  const text = [
    '=================================================================',
    'PFUNDIT CAREERS - NOTIFICATION TEST EMAIL',
    '=================================================================',
    '',
    'This is a verification email from the Pfundit Admin System.',
    'If you are reading this, Resend email notifications are configured properly.',
    '',
    `Configured Recipients: ${recipientEmails.join(', ')}`,
    `Sender Address: ${envConfig.emailFrom}`,
    `Timestamp: ${new Date().toISOString()}`,
    '',
    'You will receive plain-text candidate notifications on these addresses whenever someone applies for an open position at Pfundit.',
    '',
    '=================================================================',
  ].join('\n');

  return await resend.emails.send({
    from: envConfig.emailFrom,
    to: recipientEmails,
    subject,
    text,
  });
}
