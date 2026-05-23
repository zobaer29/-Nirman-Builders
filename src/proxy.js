import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedPaths = ['/admin', '/user', '/contractor', '/worker'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
      );
      const { payload } = await jwtVerify(token, secret);

      // Role-based protection
      const roleId = Number(payload.roleId);

      if (pathname.startsWith('/admin') && roleId !== 1) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/user') && roleId !== 2) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/contractor') && roleId !== 3) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/worker') && roleId !== 4) {
        return NextResponse.redirect(new URL('/', request.url));
      }

    } catch (error) {
      console.error('Proxy auth error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login/register
  if (token && (pathname === '/login' || pathname === '/register')) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
      );
      const { payload } = await jwtVerify(token, secret);
      const roleId = Number(payload.roleId);

      let dashboard = '/';
      if (roleId === 1) dashboard = '/admin';
      else if (roleId === 2) dashboard = '/user';
      else if (roleId === 3) dashboard = '/contractor';
      else if (roleId === 4) dashboard = '/worker';

      return NextResponse.redirect(new URL(dashboard, request.url));
    } catch (e) {
      // Token invalid, allow access to login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/contractor/:path*',
    '/worker/:path*',
    '/login',
    '/register'
  ],
};
