import { getAllNotes } from "@/lib/notes";
import Link from "next/link";
import { Note } from "@/types/note";
import RefreshButton from "@/components/RefreshButton";
import MagicBento from "@/components/MagicBento";

// Принудительно отключаем кэширование для этой страницы
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticlesPage() {
  const notes = await getAllNotes();
  const publishedNotes = notes.filter(note => note.published);

  // Отладочная информация
  console.log('=== ARTICLES PAGE DEBUG ===');
  console.log('Total notes:', notes.length);
  console.log('Published notes:', publishedNotes.length);
  console.log('All notes:', notes.map(n => ({ slug: n.slug, title: n.title, published: n.published, frontmatter: n.frontmatter })));
  console.log('===========================');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e8ebf0] py-20 px-10">
      <div className="max-w-7xl mx-auto">
        <MagicBento notes={publishedNotes} />
        {/* Отладка и кнопки обновления, если нужно */}
        <div className="mt-8">
          <div className="p-4 bg-yellow-100 rounded-lg text-sm">
            <p><strong>Отладка:</strong></p>
            <p>Всего заметок: {notes.length}</p>
            <p>Опубликованных: {publishedNotes.length}</p>
            <p>Заметки: {notes.map(n => `${n.slug} (${n.published ? 'опубликована' : 'черновик'})`).join(', ')}</p>
            <p className="mt-2">
              <RefreshButton />
            </p>
          </div>
        </div>
        {publishedNotes.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              Пока нет опубликованных статей
            </p>
            {notes.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                Есть {notes.length} неопубликованных заметок
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 