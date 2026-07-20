import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { locales, defaultLocale, isLocale } from "./lib/i18n/config";

const intlMiddleware = createIntlMiddleware(routing);

const USER_PROTECTED_PREFIXES = ["/my-journeys", "/profile"];
const ADMIN_COOKIE = "admin_session";
const USER_COOKIE = "session";

const LOCALE_SET = new Set<string>(locales);
const LOCALE_COOKIE = "NEXT_LOCALE";

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
}

async function isValidSession(
  token: string | undefined,
  realm: "user" | "admin"
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.realm === realm;
  } catch {
    return false;
  }
}

/** Check if the pathname starts with a known locale prefix */
function hasLocalePrefix(pathname: string): boolean {
  const segments = pathname.split("/");
  return segments.length >= 2 && LOCALE_SET.has(segments[1]);
}

/** Strip the locale prefix (e.g. /en/about → /about) */
function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (segments.length >= 2 && LOCALE_SET.has(segments[1])) {
    return "/" + segments.slice(2).join("/") || "/";
  }
  return pathname;
}

/** Extract locale from the path (e.g. /en/about → en) */
function extractLocale(pathname: string): string | null {
  const segments = pathname.split("/");
  if (segments.length >= 2 && LOCALE_SET.has(segments[1])) {
    return segments[1];
  }
  return null;
}

/** Detect preferred locale from Accept-Language header */
function detectLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((part) => part.split(";")[0].trim().toLowerCase().slice(0, 2));
    for (const lang of preferred) {
      if (isLocale(lang)) return lang;
    }
  }

  // 3. Default
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes (no locale prefix) ──
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login") {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      const valid = await isValidSession(token, "admin");
      if (!valid) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
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

  // ── If no locale prefix, redirect to /{locale}/path ──
  if (!hasLocalePrefix(pathname)) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // ── Protected user routes (check auth) ──
  const bare = stripLocale(pathname);
  if (
    USER_PROTECTED_PREFIXES.some(
      (p) => bare === p || bare.startsWith(`${p}/`)
    )
  ) {
    const token = request.cookies.get(USER_COOKIE)?.value;
    const valid = await isValidSession(token, "user");
    if (!valid) {
      const locale = extractLocale(pathname) ?? defaultLocale;
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/auth`;
      return NextResponse.redirect(url);
    }
  }

  // ── Set locale cookie from URL for future visits ──
  const urlLocale = extractLocale(pathname);
  const response = intlMiddleware(request);
  if (urlLocale) {
    response.cookies.set(LOCALE_COOKIE, urlLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: [
    // Match everything except static files, _next, _vercel, and API routes
    "/((?!api|_next|_vercel|monitoring|.*\\..*).*)",
  ],
};
