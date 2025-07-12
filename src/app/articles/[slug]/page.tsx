import { getNoteBySlug, getAllNotes } from "@/lib/notes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import ArticleRefreshButton from "@/components/ArticleRefreshButton";

// Принудительно отключаем кэширование для страниц статей
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNoteBySlug(params.slug);
  
  if (!note) {
    return {
      title: "Статья не найдена",
    };
  }

  return {
    title: note.title,
    description: note.frontmatter.description || note.content.substring(0, 160),
    keywords: note.frontmatter.tags?.join(", "),
  };
}

// Отключаем статическую генерацию для динамического обновления
// export async function generateStaticParams() {
//   const notes = await getAllNotes();
//   return notes
//     .filter(note => note.published)
//     .map((note) => ({
//       slug: note.slug,
//     }));
// }

export default async function ArticlePage({ params }: Props) {
  const note = await getNoteBySlug(params.slug);

  if (!note || !note.published) {
    notFound();
  }

  // Отладочная информация
  console.log('=== ARTICLE PAGE DEBUG ===');
  console.log('Slug:', params.slug);
  console.log('Note:', { 
    title: note.title, 
    updatedAt: note.updatedAt,
    contentLength: note.content?.length,
    frontmatter: note.frontmatter 
  });
  console.log('==========================');

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="neumorph-soft p-8">
          {/* Навигация */}
          <div className="mb-6">
            <Link 
              href="/articles"
              className="btn-neumorph inline-flex items-center gap-2"
            >
              ← Назад к статьям
            </Link>
          </div>

          {/* Заголовок */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-text mb-4">
              {note.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
              <span>
                Опубликовано: {new Date(note.createdAt).toLocaleDateString('ru-RU')}
              </span>
              <span>
                Обновлено: {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
              </span>
            </div>

            {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {note.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Описание */}
          {note.frontmatter.description && (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600 italic">
                {note.frontmatter.description}
              </p>
            </div>
          )}

          {/* Контент */}
          <article className="prose prose-lg max-w-none">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: note.html || '' }}
            />
          </article>

          {/* Отладочная информация */}
          <div className="mt-8 p-4 bg-yellow-100 rounded-lg text-sm">
            <p><strong>Отладка статьи:</strong></p>
            <p>Slug: {params.slug}</p>
            <p>Заголовок: {note.title}</p>
            <p>Обновлено: {new Date(note.updatedAt).toLocaleString('ru-RU')}</p>
            <p>Длина контента: {note.content?.length} символов</p>
            <p>Frontmatter: {JSON.stringify(note.frontmatter, null, 2)}</p>
            <p className="mt-2">
              <ArticleRefreshButton slug={params.slug} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 