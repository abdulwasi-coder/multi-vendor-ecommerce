import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "accesstoken";
const REFRESH_TOKEN_COOKIE = "refreshtoken";
const REFRESH_EARLY_SECONDS = 60;

function isAccessTokenExpiring(token?: string) {
  if (!token) return true;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    ) as { exp?: unknown };

    return (
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000) + REFRESH_EARLY_SECONDS
    );
  } catch {
    return true;
  }
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!isAccessTokenExpiring(accessToken)) {
    return NextResponse.next();
  }

  const backendUrl = process.env.Base_Url;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return redirectToLogin(request);
  }
  if (!backendUrl) {
    return NextResponse.next();
  }

  try {
    const refreshResponse = await fetch(
      new URL("/api/refresh_token", backendUrl),
      {
        headers: { cookie: request.headers.get("cookie") ?? "" },
        cache: "no-store",
      },
    );

    if (refreshResponse.status === 401 || refreshResponse.status === 403) {
      return redirectToLogin(request);
    }
    if (!refreshResponse.ok) {
      return NextResponse.next();
    }

    const setCookieHeader = refreshResponse.headers.get("set-cookie");
    const newAccessToken = setCookieHeader
      ?.match(/^accesstoken=([^;]+)/i)?.[1];
    if (!setCookieHeader || !newAccessToken) {
      return redirectToLogin(request);
    }

    const requestCookies = request.cookies
      .getAll()
      .filter((cookie) => cookie.name !== ACCESS_TOKEN_COOKIE)
      .map((cookie) => `${cookie.name}=${cookie.value}`);
    requestCookies.push(`${ACCESS_TOKEN_COOKIE}=${newAccessToken}`);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("cookie", requestCookies.join("; "));

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.append("set-cookie", setCookieHeader);
    return response;
  } catch {
    return NextResponse.next();
  }

}

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*"],
};
