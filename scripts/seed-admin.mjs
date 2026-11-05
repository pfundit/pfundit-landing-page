/**
 * Seeds the admin credentials (ADMIN_USERNAME / ADMIN_PASSWORD from .env) into MongoDB.
 * Safe to re-run: existing credentials in the database are never overwritten.
 * Pass --force to overwrite the stored credentials with the current .env values.
 *
 * Usage: npm run seed:admin [-- --force]
 */
import { randomBytes, scryptSync } from 'crypto';
import { MongoClient } from 'mongodb';

const force = process.argv.includes('--force');
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'pfundit';
const usernames = (process.env.ADMIN_USERNAME || '')
  .split(',')
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);
const password = process.env.ADMIN_PASSWORD;

if (!uri || usernames.length === 0 || !password) {
  console.error('MONGODB_URI, ADMIN_USERNAME and ADMIN_PASSWORD must be set.');
  process.exit(1);
}

const salt = randomBytes(16);
const passwordHash = `scrypt$${salt.toString('base64')}$${scryptSync(password, salt, 64).toString('base64')}`;
const now = new Date().toISOString();

const client = await new MongoClient(uri).connect();
try {
  const collection = client.db(dbName).collection('adminAuth');
  const filter = { key: 'admin_credentials' };
  const existing = await collection.findOne(filter);

  if (existing && !force) {
    console.log(`Admin credentials already exist in "${dbName}" (updated ${existing.updatedAt}). Nothing changed.`);
  } else {
    await collection.updateOne(
      filter,
      {
        $set: { key: 'admin_credentials', usernames, passwordHash, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
    console.log(`${existing ? 'Overwrote' : 'Seeded'} admin credentials in "${dbName}" for ${usernames.length} username(s).`);
  }
} finally {
  await client.close();
}
