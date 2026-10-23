// Sliding-window in-memory rate limiter.
// Keyed by an arbitrary string (hashed IP, email hash, etc.).
// PRODUCTION: swap backing store for Upstash Redis to persist across
// serverless instances — set UPSTASH_REDIS_REST_URL + _TOKEN in env.

const store = new Map<string, number[]>()

export function createRateLimiter(windowMs: number, max: number) {
  return function isAllowed(key: string): boolean {
    const now = Date.now()
    const cutoff = now - windowMs
    const timestamps = (store.get(key) ?? []).filter(t => t > cutoff)

    if (timestamps.length >= max) {
      store.set(key, timestamps)
      return false
    }

    timestamps.push(now)
    store.set(key, timestamps)

    // Prune stale keys to prevent unbounded memory growth
    if (store.size > 5_000) {
      for (const [k, ts] of store) {
        if (ts.every(t => t <= cutoff)) store.delete(k)
      }
    }

    return true
  }
}

// One submission per IP per 10 minutes (anti-spam on public survey)
export const feedbackLimiter = createRateLimiter(10 * 60_000, 5)

// At most 5 failed login attempts before a 10-minute lockout
export const loginLimiter = createRateLimiter(10 * 60_000, 5)
