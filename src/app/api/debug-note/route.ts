export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Логируем все данные для отладки
    console.log('=== DEBUG NOTE DATA ===');
    console.log('Full body:', JSON.stringify(body, null, 2));
    console.log('Content length:', body.content?.length);
    console.log('Frontmatter:', body.frontmatter);
    console.log('Title:', body.title);
    console.log('Slug:', body.slug);
    console.log('=======================');
    
    return Response.json({ 
      success: true, 
      received: body,
      contentLength: body.content?.length,
      frontmatterKeys: Object.keys(body.frontmatter || {}),
      message: "Данные получены и залогированы"
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    return Response.json(
      { success: false, error: error?.message || 'Ошибка отладки' },
      { status: 500 }
    );
  }
} 