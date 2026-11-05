import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { getAdminAuthCollection } from '@/lib/db/collections';

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const CREDENTIALS_KEY = 'admin_credentials' as const;
const HASH_PREFIX = 'scrypt';
const KEY_LENGTH = 64;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

function getEnvUsernames(): string[] {
  return (process.env.ADMIN_USERNAME || '')
    .split(',')
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_SESSION_SECRET);
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `${HASH_PREFIX}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

async function verifyPasswordHash(password: string, stored: string): Promise<boolean> {
  const [prefix, saltB64, hashB64] = stored.split('$');
  if (prefix !== HASH_PREFIX || !saltB64 || !hashB64) return false;

  const expected = Buffer.from(hashB64, 'base64');
  const derived = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length);
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

function secureStringEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

let seedPromise: Promise<void> | null = null;

/**
 * Seeds MongoDB with the current env credentials (ADMIN_USERNAME / ADMIN_PASSWORD)
 * the first time it runs. Uses $setOnInsert, so it never overwrites credentials
 * that already exist in the database (e.g. a password changed from the dashboard).
 */
export function ensureAdminCredentialsSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const usernames = getEnvUsernames();
      const envPassword = process.env.ADMIN_PASSWORD;
      if (usernames.length === 0 || !envPassword) return;

      const collection = await getAdminAuthCollection();
      const existing = await collection.findOne({ key: CREDENTIALS_KEY }, { projection: { _id: 1 } });
      if (existing) return;

      const now = new Date().toISOString();
      await collection.updateOne(
        { key: CREDENTIALS_KEY },
        {
          $setOnInsert: {
            key: CREDENTIALS_KEY,
            usernames,
            passwordHash: await hashPassword(envPassword),
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true },
      );
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

async function getStoredCredentials() {
  await ensureAdminCredentialsSeeded();
  const collection = await getAdminAuthCollection();
  return collection.findOne(
    { key: CREDENTIALS_KEY },
    { projection: { _id: 0, usernames: 1, passwordHash: 1, updatedAt: 1 } },
  );
}

/** Admin usernames from MongoDB, falling back to ADMIN_USERNAME if none are stored. */
export async function getAdminUsernames(): Promise<string[]> {
  const doc = await getStoredCredentials();
  const stored = Array.isArray(doc?.usernames) ? doc.usernames.map((u) => u.trim().toLowerCase()).filter(Boolean) : [];
  return stored.length > 0 ? stored : getEnvUsernames();
}

/**
 * Checks the admin password against the hash stored in MongoDB. ADMIN_PASSWORD
 * from env is only used if the database has no credentials yet.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;

  const doc = await getStoredCredentials();
  if (doc?.passwordHash) {
    return verifyPasswordHash(password, doc.passwordHash);
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) return false;
  return secureStringEqual(password, envPassword);
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const isValidUser = (await getAdminUsernames()).includes(username.trim().toLowerCase());
  // Always run the password check so response timing doesn't reveal valid usernames.
  const isValidPassword = await verifyAdminPassword(password);
  return isValidUser && isValidPassword;
}

export function validateNewPassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `New password must be at most ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'New password must contain at least one letter and one number.';
  }
  return null;
}

export async function setAdminPassword(newPassword: string) {
  const passwordHash = await hashPassword(newPassword);
  const collection = await getAdminAuthCollection();
  const updatedAt = new Date().toISOString();

  await collection.updateOne(
    { key: CREDENTIALS_KEY },
    {
      $set: { key: CREDENTIALS_KEY, passwordHash, updatedAt },
      $setOnInsert: { usernames: getEnvUsernames(), createdAt: updatedAt },
    },
    { upsert: true },
  );

  return { updatedAt };
}

export async function getAdminPasswordInfo() {
  const doc = await getStoredCredentials();
  return {
    source: doc ? ('database' as const) : ('env' as const),
    updatedAt: doc?.updatedAt || null,
  };
}
