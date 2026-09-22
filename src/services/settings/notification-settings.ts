import { getSettingsCollection } from '@/lib/db/collections';
import { envConfig } from '@/config/env.config';

const SETTINGS_KEY = 'admin_notifications' as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getDefaultAdminEmails(): string[] {
  const fromEnv = envConfig.adminUsername;
  const parsed = fromEnv
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => EMAIL_REGEX.test(e));

  if (parsed.length > 0) {
    return parsed;
  }

  return ['careers@pfundit.com'];
}

export async function getAdminNotificationEmails(): Promise<string[]> {
  try {
    const collection = await getSettingsCollection();
    const doc = await collection.findOne({ key: SETTINGS_KEY });

    if (doc && Array.isArray(doc.recipientEmails) && doc.recipientEmails.length > 0) {
      const validEmails = doc.recipientEmails
        .map((e) => (typeof e === 'string' ? e.trim().toLowerCase() : ''))
        .filter((e) => EMAIL_REGEX.test(e));

      if (validEmails.length > 0) {
        return Array.from(new Set(validEmails));
      }
    }
  } catch (error) {
    console.error('Error fetching admin notification settings from DB:', error);
  }

  return getDefaultAdminEmails();
}

export async function setAdminNotificationEmails(emails: string[]): Promise<string[]> {
  const validEmails = Array.from(
    new Set(
      emails
        .map((e) => (typeof e === 'string' ? e.trim().toLowerCase() : ''))
        .filter((e) => EMAIL_REGEX.test(e))
    )
  );

  if (validEmails.length === 0) {
    throw new Error('At least one valid email address is required.');
  }

  const collection = await getSettingsCollection();
  const now = new Date().toISOString();

  await collection.updateOne(
    { key: SETTINGS_KEY },
    {
      $set: {
        key: SETTINGS_KEY,
        recipientEmails: validEmails,
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  return validEmails;
}
