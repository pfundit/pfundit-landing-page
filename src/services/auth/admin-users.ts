import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { getAdminAuthCollection, getAdminsCollection } from '@/lib/db/collections';
import { createRecordId } from '@/lib/server/ids';
import {
  ADMIN_PERMISSIONS,
  type AdminPermission,
  type AdminPublic,
  type AdminUserRecord,
} from '@/lib/db/types';

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const HASH_PREFIX = 'scrypt';
const KEY_LENGTH = 64;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
const USERNAME_REGEX = /^[a-z0-9._@+-]{3,64}$/;
const MAX_NAME_LENGTH = 80;

/** Thrown for user-facing validation / rule violations (mapped to 400/409 by routes). */
export class AdminRuleError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

// ---------------------------------------------------------------------------
// Password hashing
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
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

// Used when the username doesn't exist, so response timing doesn't reveal valid usernames.
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash() {
  if (!dummyHashPromise) dummyHashPromise = hashPassword(randomBytes(16).toString('hex'));
  return dummyHashPromise;
}

export function validateNewPassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

// ---------------------------------------------------------------------------
// Normalisation helpers
// ---------------------------------------------------------------------------

export function normalizeUsername(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeName(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_NAME_LENGTH) : '';
}

/** Keeps only known permissions. `admins` (full control) implies every other permission. */
export function sanitizePermissions(value: unknown): AdminPermission[] {
  if (!Array.isArray(value)) return [];
  const requested = new Set(value.filter((p): p is AdminPermission => ADMIN_PERMISSIONS.includes(p)));
  if (requested.has('admins')) return [...ADMIN_PERMISSIONS];
  return ADMIN_PERMISSIONS.filter((p) => requested.has(p));
}

export function toPublicAdmin(record: AdminUserRecord): AdminPublic {
  return {
    id: record.id,
    username: record.username,
    name: record.name || '',
    permissions: sanitizePermissions(record.permissions),
    active: record.active !== false,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy: record.createdBy,
    lastLoginAt: record.lastLoginAt,
    passwordChangedAt: record.passwordChangedAt,
  };
}

// ---------------------------------------------------------------------------
// Seeding / migration
// ---------------------------------------------------------------------------

function getEnvUsernames(): string[] {
  return (process.env.ADMIN_USERNAME || '')
    .split(',')
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_SESSION_SECRET);
}

let seedPromise: Promise<void> | null = null;

/**
 * Makes sure at least one admin exists. Runs once per server instance:
 *  1. If the `admins` collection already has users, nothing happens.
 *  2. Otherwise it migrates the legacy shared-password doc (`adminAuth`): one admin
 *     per username, keeping the existing password hash, with full access.
 *  3. Otherwise it seeds from ADMIN_USERNAME / ADMIN_PASSWORD in env.
 */
export function ensureAdminsSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const admins = await getAdminsCollection();
      await Promise.all([
        admins.createIndex({ id: 1 }, { unique: true }),
        admins.createIndex({ username: 1 }, { unique: true }),
      ]);

      if ((await admins.estimatedDocumentCount()) > 0) return;

      const now = new Date().toISOString();
      let usernames: string[] = [];
      let passwordHash = '';

      const legacy = await (await getAdminAuthCollection()).findOne({ key: 'admin_credentials' });
      if (legacy?.passwordHash && Array.isArray(legacy.usernames) && legacy.usernames.length > 0) {
        usernames = legacy.usernames.map((u) => u.trim().toLowerCase()).filter(Boolean);
        passwordHash = legacy.passwordHash;
      } else {
        const envPassword = process.env.ADMIN_PASSWORD;
        usernames = getEnvUsernames();
        if (usernames.length === 0 || !envPassword) return;
        passwordHash = await hashPassword(envPassword);
      }

      for (const username of new Set(usernames)) {
        await admins.updateOne(
          { username },
          {
            $setOnInsert: {
              id: createRecordId('adm'),
              username,
              name: '',
              passwordHash,
              permissions: [...ADMIN_PERMISSIONS],
              active: true,
              sessionVersion: 1,
              createdAt: now,
              updatedAt: now,
              createdBy: 'system',
            },
          },
          { upsert: true },
        );
      }
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getAdminById(id: string): Promise<AdminUserRecord | null> {
  await ensureAdminsSeeded();
  const admins = await getAdminsCollection();
  return admins.findOne({ id }, { projection: { _id: 0 } });
}

export async function listAdmins(): Promise<AdminPublic[]> {
  await ensureAdminsSeeded();
  const admins = await getAdminsCollection();
  const records = await admins.find({}, { projection: { _id: 0 } }).sort({ createdAt: 1 }).toArray();
  return records.map(toPublicAdmin);
}

export type AuthResult =
  | { ok: true; admin: AdminUserRecord }
  | { ok: false; reason: 'invalid' | 'disabled' };

export async function authenticateAdmin(username: string, password: string): Promise<AuthResult> {
  await ensureAdminsSeeded();
  const admins = await getAdminsCollection();
  const record = await admins.findOne({ username: normalizeUsername(username) }, { projection: { _id: 0 } });

  // Always run a hash comparison so timing doesn't reveal whether the username exists.
  const isValidPassword = await verifyPasswordHash(password || '', record?.passwordHash || (await getDummyHash()));
  if (!record || !isValidPassword) return { ok: false, reason: 'invalid' };
  if (record.active === false) return { ok: false, reason: 'disabled' };

  await admins.updateOne({ id: record.id }, { $set: { lastLoginAt: new Date().toISOString() } });
  return { ok: true, admin: record };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Throws if the change would leave no active admin who can manage admins. */
async function assertAnotherAdminManagerRemains(excludingId: string) {
  const admins = await getAdminsCollection();
  const others = await admins.countDocuments({
    id: { $ne: excludingId },
    active: { $ne: false },
    permissions: 'admins',
  });
  if (others === 0) {
    throw new AdminRuleError('At least one active admin must keep “Manage admins” access.', 409);
  }
}

export async function createAdmin(input: {
  username: unknown;
  name?: unknown;
  password: unknown;
  permissions: unknown;
  createdBy: string;
}): Promise<AdminPublic> {
  await ensureAdminsSeeded();
  const username = normalizeUsername(input.username);
  if (!USERNAME_REGEX.test(username)) {
    throw new AdminRuleError('Username must be 3–64 characters: letters, numbers, and . _ @ + -');
  }

  const password = typeof input.password === 'string' ? input.password : '';
  const passwordError = validateNewPassword(password);
  if (passwordError) throw new AdminRuleError(passwordError);

  const admins = await getAdminsCollection();
  if (await admins.findOne({ username }, { projection: { _id: 1 } })) {
    throw new AdminRuleError('An admin with that username already exists.', 409);
  }

  const now = new Date().toISOString();
  const record: AdminUserRecord = {
    id: createRecordId('adm'),
    username,
    name: normalizeName(input.name),
    passwordHash: await hashPassword(password),
    permissions: sanitizePermissions(input.permissions),
    active: true,
    sessionVersion: 1,
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
    passwordChangedAt: now,
  };

  try {
    await admins.insertOne({ ...record });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      throw new AdminRuleError('An admin with that username already exists.', 409);
    }
    throw error;
  }
  return toPublicAdmin(record);
}

export async function updateAdmin(
  id: string,
  actorId: string,
  input: { name?: unknown; permissions?: unknown; active?: unknown; password?: unknown },
): Promise<AdminPublic> {
  const existing = await getAdminById(id);
  if (!existing) throw new AdminRuleError('Admin not found.', 404);

  const isSelf = id === actorId;
  const $set: Partial<AdminUserRecord> = { updatedAt: new Date().toISOString() };
  let revokeSessions = false;

  if (input.name !== undefined) {
    $set.name = normalizeName(input.name);
  }

  if (input.permissions !== undefined) {
    if (isSelf) throw new AdminRuleError('You can’t change your own permissions. Ask another admin.', 403);
    const permissions = sanitizePermissions(input.permissions);
    if (existing.permissions.includes('admins') && !permissions.includes('admins')) {
      await assertAnotherAdminManagerRemains(id);
    }
    $set.permissions = permissions;
  }

  if (input.active !== undefined) {
    const active = Boolean(input.active);
    if (isSelf && !active) throw new AdminRuleError('You can’t disable your own account.', 403);
    if (!active && existing.permissions.includes('admins')) {
      await assertAnotherAdminManagerRemains(id);
    }
    $set.active = active;
    if (!active) revokeSessions = true;
  }

  if (input.password !== undefined) {
    if (isSelf) throw new AdminRuleError('Use “My Account” to change your own password.', 403);
    const password = typeof input.password === 'string' ? input.password : '';
    const passwordError = validateNewPassword(password);
    if (passwordError) throw new AdminRuleError(passwordError);
    $set.passwordHash = await hashPassword(password);
    $set.passwordChangedAt = $set.updatedAt;
    revokeSessions = true;
  }

  const admins = await getAdminsCollection();
  const updated = await admins.findOneAndUpdate(
    { id },
    { $set, ...(revokeSessions ? { $inc: { sessionVersion: 1 } } : {}) },
    { returnDocument: 'after', projection: { _id: 0 } },
  );
  if (!updated) throw new AdminRuleError('Admin not found.', 404);
  return toPublicAdmin(updated);
}

export async function deleteAdmin(id: string, actorId: string) {
  if (id === actorId) throw new AdminRuleError('You can’t delete your own account.', 403);
  const existing = await getAdminById(id);
  if (!existing) throw new AdminRuleError('Admin not found.', 404);
  if (existing.permissions.includes('admins')) {
    await assertAnotherAdminManagerRemains(id);
  }
  const admins = await getAdminsCollection();
  await admins.deleteOne({ id });
}

/**
 * Changes the signed-in admin's own password after verifying the current one.
 * Bumps sessionVersion (signs out their other sessions) and returns the new version
 * so the caller can re-issue the current session cookie.
 */
export async function changeOwnPassword(id: string, currentPassword: string, newPassword: string) {
  const existing = await getAdminById(id);
  if (!existing) throw new AdminRuleError('Admin not found.', 404);

  if (!(await verifyPasswordHash(currentPassword, existing.passwordHash))) {
    return { ok: false as const };
  }

  const now = new Date().toISOString();
  const admins = await getAdminsCollection();
  const updated = await admins.findOneAndUpdate(
    { id },
    {
      $set: { passwordHash: await hashPassword(newPassword), passwordChangedAt: now, updatedAt: now },
      $inc: { sessionVersion: 1 },
    },
    { returnDocument: 'after', projection: { _id: 0, sessionVersion: 1 } },
  );
  return { ok: true as const, sessionVersion: updated?.sessionVersion ?? existing.sessionVersion + 1, updatedAt: now };
}
