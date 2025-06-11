import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/auth/config';

const ratelimitMap = new Map();

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Rate limiting
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowStart = now - rateLimit.windowMs;

  const requestTimestamps = ratelimitMap.get(ip) || [];
  const requestsInWindow = requestTimestamps.filter(timestamp => timestamp > windowStart);

  if (requestsInWindow.length >= rateLimit.max) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  requestTimestamps.push(now);
  ratelimitMap.set(ip, requestTimestamps);

  // Refresh session if exists
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
    await supabase.auth.refreshSession();
  }

  return res;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/products/manage/:path*',
  ],
};