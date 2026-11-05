/**
 * Small in-memory attempt limiter for auth endpoints. It is per server instance
 * (not shared across serverless instances), but it still blunts brute-force
 * attempts against the admin password.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function createAttemptLimiter({ maxAttempts, windowMs }: { maxAttempts: number; windowMs: number }) {
  function prune(now: number) {
    if (buckets.size < 500) return;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return {
    /** Returns seconds until retry is allowed, or 0 if not blocked. */
    blockedFor(key: string) {
      const now = Date.now();
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) return 0;
      return bucket.count >= maxAttempts ? Math.ceil((bucket.resetAt - now) / 1000) : 0;
    },
    recordFailure(key: string) {
      const now = Date.now();
      prune(now);
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
      } else {
        bucket.count += 1;
      }
    },
    reset(key: string) {
      buckets.delete(key);
    },
  };
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
