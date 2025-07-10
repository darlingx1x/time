import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  // Protect /dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    const tgUser = request.cookies.get('tgUser');
    if (!tgUser) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
