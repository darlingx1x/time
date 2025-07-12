import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Добавляем CORS-заголовки для API-роутов
  if (url.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Разрешаем запросы с Obsidian (Electron app)
    response.headers.set('Access-Control-Allow-Origin', 'app://obsidian.md');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Обрабатываем preflight запросы
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204 });
    }
    
    return response;
  }
  
  // Protect /dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    const telegramId = request.cookies.get('telegram_id');
    if (!telegramId) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
