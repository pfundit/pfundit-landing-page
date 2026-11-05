const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SESSION_TTL_SECONDS = 60 * 60 * 24;

export type SessionPayload = {
  /** Admin user id. */
  sub: string;
  /** Admin sessionVersion at sign-in; a mismatch means the session was revoked. */
  v: number;
  exp: number;
};

function toBase64Url(input: Uint8Array) {
  let binary = '';
  for (let i = 0; i < input.length; i += 1) {
    binary += String.fromCharCode(input[i]);
  }

  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string) {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  const binary = atob(base64);
  const output = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    output[i] = binary.charCodeAt(i);
  }

  return output;
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set. Add it to your .env file.');
  }
  return secret;
}

let cachedKey: { secret: string; key: Promise<CryptoKey> } | null = null;

function getSigningKey() {
  const secret = getSessionSecret();
  if (!cachedKey || cachedKey.secret !== secret) {
    cachedKey = {
      secret,
      key: crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
      ),
    };
  }
  return cachedKey.key;
}

async function signMessage(message: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return toBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(adminId: string, sessionVersion: number) {
  const payload: SessionPayload = {
    sub: adminId,
    v: sessionVersion,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const payloadPart = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signaturePart = await signMessage(payloadPart);
  return `${payloadPart}.${signaturePart}`;
}

/**
 * Verifies the token signature and expiry only (cheap, no DB). Returns the payload,
 * or null if invalid. Callers that authorize actions must also check the admin in
 * the database (see getCurrentAdmin in require-admin.ts).
 */
export async function verifyAdminSessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadPart, signaturePart] = parts;

  try {
    // Constant-time HMAC verification (avoids timing leaks from string comparison)
    const key = await getSigningKey();
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signaturePart),
      encoder.encode(payloadPart),
    );
    if (!isValid) return null;

    const payloadBytes = fromBase64Url(payloadPart);
    const payload = JSON.parse(decoder.decode(payloadBytes)) as Partial<SessionPayload>;
    if (typeof payload.sub !== 'string' || typeof payload.v !== 'number' || typeof payload.exp !== 'number') {
      return null;
    }
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_MAX_AGE = SESSION_TTL_SECONDS;
