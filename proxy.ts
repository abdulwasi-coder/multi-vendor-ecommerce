import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(paddedBase64), (character) =>
      character.charCodeAt(0),
    );
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (e) {
    return null;
  }
}

interface TokenData {
  id: string;
  role: "admin" | "vendor" | "user";
  vendorId?: string;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // FIX 1: Match the exact casing you used in res.cookie ("accesstoken")
  const shortTermToken =
    request.cookies.get("accesstoken")?.value ||
    request.cookies.get("accessToken")?.value;
  const hasLongTermSession = request.cookies.has("refreshToken");

  const isAdminPath = pathname.startsWith("/admin");
  const isVendorPath = pathname.startsWith("/vendor");

  // Prevent routing evaluation if the user is already on the exact fallback dashboard
  // to eliminate infinite redirect loops
  if (pathname === "/vendor/dashboard" || pathname === "/admin/dashboard") {
    return NextResponse.next();
  }

  if ((isAdminPath || isVendorPath) && !hasLongTermSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (shortTermToken) {
    const userData = parseJwt(shortTermToken) as TokenData | null;

    // TEMPORARY DEBUG: Check Vercel logs to see exactly what role your token holds
    console.log(
      "Decoded User Data Role:",
      userData?.role,
      "Pathname:",
      pathname,
    );

    if (userData) {
      if (isAdminPath && userData.role !== "admin") {
        const fallback = userData.role === "vendor" ? "/vendor/dashboard" : "/";
        return NextResponse.redirect(new URL(fallback, request.url));
      }

      if (isVendorPath && userData.role !== "vendor") {
        const fallback = userData.role === "admin" ? "/admin/dashboard" : "/";
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    }
  } else {
    // If there is a long term session but no short term token, they shouldn't just pass freely.
    // They likely need to run a token refresh script.
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Catching nested routes correctly
  matcher: ["/admin/:path*", "/vendor/:path*"],
};
