export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Принудительно обновляем кэш
    console.log('=== REFRESH CACHE ===');
    console.log('Cache refresh requested at:', new Date().toISOString());
    
    // Здесь можно добавить логику для очистки кэша
    // Например, перезапрос данных из GitHub
    
    return Response.json({ 
      success: true, 
      message: "Кэш обновлен",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Cache refresh error:', error);
    return Response.json(
      { success: false, error: error?.message || 'Ошибка обновления кэша' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ 
    success: true, 
    message: "Refresh cache endpoint ready",
    timestamp: new Date().toISOString()
  });
} 