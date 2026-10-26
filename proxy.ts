import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "accesstoken";
const REFRESH_TOKEN_COOKIE = "refreshtoken";

type AccessTokenClaims = {
  id?: string;
  vendorID?: string;
  role?: unknown;
};

function getAccessTokenClaims(token: string) {
  try {
    return JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    ) as AccessTokenClaims;
  } catch {
    return null;
  }
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

function getRequiredRole(pathname: string) {
  return pathname.startsWith("/admin/") || pathname === "/admin"
    ? "admin"
    : "vendor";
}

function getSetCookieValue(setCookieHeaders: string[], cookieName: string) {
  const prefix = `${cookieName}=`;
  const setCookie = setCookieHeaders.find((header) =>
    header.split(";", 1)[0].startsWith(prefix),
  );

  return setCookie?.split(";", 1)[0].slice(prefix.length) ?? null;
}

async function refreshAccessToken(request: NextRequest) {
  const backendUrl = process.env.Base_Url;
  if (!backendUrl) return null;

  const refreshResponse = await fetch(
    new URL("/api/refresh_token", backendUrl),
    {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    },
  );

  if (!refreshResponse.ok) return null;

  const setCookieHeaders = refreshResponse.headers.getSetCookie();
  const accessToken = getSetCookieValue(
    setCookieHeaders,
    ACCESS_TOKEN_COOKIE,
  );
  if (!accessToken) return null;

  const cookies = new Map(
    request.cookies.getAll().map(({ name, value }) => [name, value]),
  );
  for (const setCookie of setCookieHeaders) {
    const cookiePair = setCookie.split(";", 1)[0];
    const separatorIndex = cookiePair.indexOf("=");
    if (separatorIndex > 0) {
      cookies.set(
        cookiePair.slice(0, separatorIndex),
        cookiePair.slice(separatorIndex + 1),
      );
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "cookie",
    [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
  );

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  for (const setCookie of setCookieHeaders) {
    response.headers.append("set-cookie", setCookie);
  }

  return { accessToken, response, setCookieHeaders };
}

export async function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return redirectTo(request, "/login");
  }

  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  let claims = accessToken ? getAccessTokenClaims(accessToken) : null;
  let response: NextResponse | null = null;
  let refreshedCookies: string[] = [];

  if (!claims) {
    try {
      const refreshed = await refreshAccessToken(request);
      if (!refreshed) return redirectTo(request, "/login");

      accessToken = refreshed.accessToken;
      claims = getAccessTokenClaims(accessToken);
      response = refreshed.response;
      refreshedCookies = refreshed.setCookieHeaders;
    } catch {
      return redirectTo(request, "/login");
    }
  }

  const role = claims?.role;
  if (typeof role !== "string" || role.toLowerCase() !== getRequiredRole(request.nextUrl.pathname)) {
    const unauthorizedResponse = redirectTo(request, "/unauthorized");
    for (const setCookie of refreshedCookies) {
      unauthorizedResponse.headers.append("set-cookie", setCookie);
    }
    return unauthorizedResponse;
  }

  return response ?? NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*"],
};
