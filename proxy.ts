import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

interface TokenData {
  id: string;
  role: 'admin' | 'vendor' | 'customer';
  vendorId?: string; 
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let shortTermToken = request.cookies.get('accessToken')?.value;
  if (!shortTermToken) {
    const rawCookieHeader = request.headers.get('cookie');
    if (rawCookieHeader) {
      const match = rawCookieHeader.match(/(?:^|; )access[t]oken=([^;]*)/);
      if (match) {
        shortTermToken = decodeURIComponent(match[1]);
      }
    }
  }
  const hasLongTermSession = request.cookies.has('refreshToken');

  const isAdminPath = pathname.startsWith('/admin');
  const isVendorPath = pathname.startsWith('/vendor');

  if ((isAdminPath || isVendorPath) && !hasLongTermSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }


  if (shortTermToken) {
    const userData = parseJwt(shortTermToken) as TokenData | null;

    if (userData) {
      if (isAdminPath && userData.role !== 'admin') {
        const fallback = userData.role === 'vendor' ? '/vendor/dashboard' : '/';
        return NextResponse.redirect(new URL(fallback, request.url));
      }

      if (isVendorPath && userData.role !== 'vendor') {
        const fallback = userData.role === 'admin' ? '/admin/dashboard' : '/';
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*'],
};