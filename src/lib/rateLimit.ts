import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private cache = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(options: { windowMs: number; maxRequests: number }) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
  }

  public check(key: string): {
    success: boolean;
    limit: number;
    remaining: number;
    resetInSeconds: number;
  } {
    const now = Date.now();
    const record = this.cache.get(key);

    // If no record or expired, create fresh window
    if (!record || now > record.resetAt) {
      this.cache.set(key, { count: 1, resetAt: now + this.windowMs });
      this.cleanExpired(now);
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        resetInSeconds: Math.ceil(this.windowMs / 1000),
      };
    }

    // Window still active: check limit
    if (record.count >= this.maxRequests) {
      const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        resetInSeconds,
      };
    }

    record.count += 1;
    const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      resetInSeconds,
    };
  }

  public reset(key: string): void {
    this.cache.delete(key);
  }

  private cleanExpired(now: number): void {
    if (this.cache.size > 1000) {
      for (const [k, v] of this.cache.entries()) {
        if (now > v.resetAt) {
          this.cache.delete(k);
        }
      }
    }
  }
}

/**
 * Extract client IP from proxy headers or fallback
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

// 1. Enquiries: max 5 submissions per 10 minutes per IP
export const enquiryRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 5,
});

// 2. Admin Auth: max 5 login checks per 15 minutes per IP
export const adminAuthRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});
