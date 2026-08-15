import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimiter";

export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/api/auth/register") ||
    req.nextUrl.pathname.startsWith("/api/auth/callback/credentials")
  ) {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { ok } = rateLimit(`auth-${ip}`, 5, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};