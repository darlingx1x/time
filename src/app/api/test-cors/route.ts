export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET() {
  return Response.json({ 
    success: true, 
    message: "CORS test endpoint работает!",
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return Response.json({ 
      success: true, 
      message: "POST запрос получен",
      data: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: "Ошибка парсинга JSON" 
    }, { status: 400 });
  }
} 