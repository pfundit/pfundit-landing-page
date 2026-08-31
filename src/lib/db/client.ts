import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var __pfunditMongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to your .env file.');
  }
  return uri;
}

function getMongoDbName() {
  return process.env.MONGODB_DB_NAME || 'pfundit';
}

export function getMongoClient() {
  if (!global.__pfunditMongoClientPromise) {
    const client = new MongoClient(getMongoUri());
    global.__pfunditMongoClientPromise = client.connect();
  }

  return global.__pfunditMongoClientPromise;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(getMongoDbName());
}
