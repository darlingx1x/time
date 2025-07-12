export const dynamic = 'force-dynamic';

import { getAllNotes } from "@/lib/notes";

// Простая функция для создания CORS-заголовков
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: Request) {
  try {
    const notes = await getAllNotes();
    return new Response(JSON.stringify({ success: true, notes }), {
      status: 200,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }
} 