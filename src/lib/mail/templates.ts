import type { JobApplicationRecord, ContactSubmissionRecord } from '@/lib/db/types';

type Attachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function baseSubmissionHtml(title: string, rows: Array<[string, string | undefined]>, extra?: string) {
  const safeRows = rows
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `<tr><td style="padding:8px 0;color:#73809a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 0;color:#0f1b3d;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(value || '')}</td></tr>`)
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f8ff;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#fff;border:1px solid rgba(15,27,61,0.08);border-radius:20px;padding:28px;">
        <p style="margin:0 0 10px;color:#D4A437;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">Pfundit Submission</p>
        <h2 style="margin:0 0 20px;color:#0f1b3d;font-size:24px;line-height:1.2;">${title}</h2>
        <table style="width:100%;border-collapse:collapse;">${safeRows}</table>
        ${extra || ''}
      </div>
    </div>
  `;
}

export function buildContactSubmissionEmail(submission: ContactSubmissionRecord) {
  const subject = `New Contact Submission - ${submission.name}`;
  const text = [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.company ? `Company: ${submission.company}` : null,
    submission.subject ? `Subject: ${submission.subject}` : null,
    `Message: ${submission.message}`,
    `Submitted At: ${submission.createdAt}`,
  ]
    .filter(Boolean)
    .join('\n');

  const html = baseSubmissionHtml('New Contact Submission', [
    ['Name', submission.name],
    ['Email', submission.email],
    ['Company', submission.company],
    ['Subject', submission.subject],
    ['Message', submission.message],
    ['Submitted At', submission.createdAt],
  ]);

  return { subject, text, html };
}

export function buildJobApplicationEmail(
  submission: JobApplicationRecord,
  attachment?: Attachment,
) {
  const subject = `New Job Application - ${submission.role}`;
  const text = [
    `Role: ${submission.role}`,
    submission.category ? `Category: ${submission.category}` : null,
    submission.type ? `Type: ${submission.type}` : null,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.linkedin ? `LinkedIn: ${submission.linkedin}` : null,
    `Resume: ${submission.resumeName || submission.resumeUrl || 'Not provided'}`,
    `Resume URL: ${submission.resumeUrl || 'Not provided'}`,
    `Why Pfundit: ${submission.whyPfundit}`,
    `Submitted At: ${submission.createdAt}`,
  ]
    .filter(Boolean)
    .join('\n');

  const html = baseSubmissionHtml('New Job Application', [
    ['Role', submission.role],
    ['Category', submission.category],
    ['Type', submission.type],
    ['Name', submission.name],
    ['Email', submission.email],
    ['LinkedIn', submission.linkedin],
    ['Resume', submission.resumeName || submission.resumeUrl],
    ['Why Pfundit', submission.whyPfundit],
    ['Submitted At', submission.createdAt],
  ], attachment ? `<p style="margin:18px 0 0;color:#0f1b3d;font-size:13px;">Resume attached to this email.</p>` : undefined);

  return { subject, text, html, attachment };
}
