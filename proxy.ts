import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const USER_PROTECTED_PREFIXES = ["/my-journeys", "/book", "/profile"];
const ADMIN_COOKIE = "admin_session";
const USER_COOKIE = "session";

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
}

async function isValidSession(token: string | undefined, realm: "user" | "admin"): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.realm === realm;
  } catch {
    return false;
  }
}

/** Strip the locale prefix (e.g. /en/about → /about) */
function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  return match ? match[2] || "/" : pathname;
}

/** Extract locale from the path (e.g. /en/about → en) */
function extractLocale(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match ? match[1] : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes (no locale prefix) ──
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const valid = await isValidSession(token, "admin");
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── API / static / internal routes — skip locale handling ──
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Protected user routes (check auth BEFORE intl redirect) ──
  const bare = stripLocale(pathname);
  if (USER_PROTECTED_PREFIXES.some((p) => bare === p || bare.startsWith(`${p}/`))) {
    const token = request.cookies.get(USER_COOKIE)?.value;
    const valid = await isValidSession(token, "user");
    if (!valid) {
      const locale = extractLocale(pathname) ?? routing.defaultLocale;
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/auth`;
      return NextResponse.redirect(url);
    }
  }

  // ── Locale routing (redirect bare paths, rewrite locale-prefixed paths) ──
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match everything except static files, _next, _vercel, and API routes
    "/((?!api|_next|_vercel|monitoring|.*\\..*).*)",
  ],
};
