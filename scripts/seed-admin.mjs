/**
 * Seeds admin users (ADMIN_USERNAME / ADMIN_PASSWORD from .env) into the `admins`
 * collection with full access. ADMIN_USERNAME may be a comma-separated list.
 *
 * Safe to re-run: existing admins are left untouched.
 * Pass --force to reset those usernames' passwords to ADMIN_PASSWORD, re-enable them,
 * grant full access and sign them out everywhere — use this if you're locked out.
 *
 * Usage: npm run seed:admin [-- --force]
 */
import { randomBytes, scryptSync } from 'crypto';
import { MongoClient } from 'mongodb';

const ALL_PERMISSIONS = ['jobs', 'applications', 'investors', 'contacts', 'settings', 'admins'];

const force = process.argv.includes('--force');
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'pfundit';
const usernames = [
  ...new Set(
    (process.env.ADMIN_USERNAME || '')
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean),
  ),
];
const password = process.env.ADMIN_PASSWORD;

if (!uri || usernames.length === 0 || !password) {
  console.error('MONGODB_URI, ADMIN_USERNAME and ADMIN_PASSWORD must be set.');
  process.exit(1);
}

function hashPassword(value) {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString('base64')}$${scryptSync(value, salt, 64).toString('base64')}`;
}

function createId() {
  return `adm-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
}

const client = await new MongoClient(uri).connect();
try {
  const admins = client.db(dbName).collection('admins');
  await admins.createIndex({ id: 1 }, { unique: true });
  await admins.createIndex({ username: 1 }, { unique: true });

  for (const username of usernames) {
    const now = new Date().toISOString();
    const existing = await admins.findOne({ username });

    if (existing && !force) {
      console.log(`• ${username}: already exists, unchanged.`);
      continue;
    }

    if (existing) {
      await admins.updateOne(
        { username },
        {
          $set: {
            passwordHash: hashPassword(password),
            permissions: ALL_PERMISSIONS,
            active: true,
            updatedAt: now,
            passwordChangedAt: now,
          },
          $inc: { sessionVersion: 1 },
        },
      );
      console.log(`• ${username}: password reset, full access granted.`);
    } else {
      await admins.insertOne({
        id: createId(),
        username,
        name: '',
        passwordHash: hashPassword(password),
        permissions: ALL_PERMISSIONS,
        active: true,
        sessionVersion: 1,
        createdAt: now,
        updatedAt: now,
        createdBy: 'seed-script',
        passwordChangedAt: now,
      });
      console.log(`• ${username}: created with full access.`);
    }
  }
} finally {
  await client.close();
}
