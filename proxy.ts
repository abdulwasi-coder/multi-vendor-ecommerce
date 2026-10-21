import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT Parsing crashed:", e);
    return null;
  }
}
interface TokenData {
  id: string;
  role: "admin" | "vendor" | "customer";
  vendorId?: string;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next();
  const shortTermToken = request.cookies.get("accessToken")?.value;
  const hasLongTermSession = request.cookies.has("refreshToken");

  const isAdminPath = pathname.startsWith("/admin");
  const isVendorPath = pathname.startsWith("/vendor");

  if ((isAdminPath || isVendorPath) && !hasLongTermSession && !shortTermToken) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  if (shortTermToken) {
    const userData = parseJwt(shortTermToken) as TokenData | null;

    if (userData) {
      response.cookies.set("debug_proxy_jwt", JSON.stringify(userData), {
        path: "/",
      });

      if (isAdminPath && userData.role !== "admin") {
        const fallback = userData.role === "vendor" ? "/vendor/dashboard" : "/";
        return NextResponse.redirect(new URL(fallback, request.url));
      }

      if (isVendorPath && userData.role !== "vendor") {
        const fallback = userData.role === "admin" ? "/admin/dashboard" : "/";
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    } else {
      response.cookies.set("debug_proxy_jwt", "Parsing Failed Null", {
        path: "/",
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*"],
};
