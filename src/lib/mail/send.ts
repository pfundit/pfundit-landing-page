import type { SendMailOptions } from 'nodemailer';
import { getMailTransport } from '@/lib/mail/transport';

export async function sendMail(options: SendMailOptions) {
  try {
    const transport = getMailTransport();
    const fromAddress = process.env.MAIL_FROM;
    const toAddress = process.env.MAIL_TO;

    if (!fromAddress || !toAddress) {
      console.warn('MAIL_FROM or MAIL_TO missing. Skipping email notification.');
      return null;
    }

    return await transport.sendMail({
      ...options,
      from: options.from || fromAddress,
      to: options.to || toAddress,
    });
  } catch (error) {
    console.error('Mail delivery failed (likely missing/invalid SMTP settings). Error:', error);
    return null;
  }
}
