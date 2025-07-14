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

  return (
    <div className="min-h-screen bg-ross-gradient section-padding font-inter">
      {/* Header */}
      <header className="header-main max-w-7xl mx-auto mb-8">
        <div className="header-logo">
          <span>🖌️</span>
          Pallet Ross
        </div>
        <nav className="header-nav">
          <Link href="/">Главная</Link>
          <Link href="/articles">Статьи</Link>
          <a href="#create">Create strategy</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="#solution">Solution</a>
          <a href="#ecommerce">E-Commerce</a>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto w-full">
        <div className="bento-card mb-8">
          {/* Навигация и кнопки */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link href="/articles" className="btn-neumorph inline-flex items-center gap-2">
              ← Назад к статьям
            </Link>
            <div className="ml-auto"><ArticleRefreshButton slug={params.slug} /></div>
          </div>

          {/* Заголовок и мета */}
          <header className="mb-8">
            <h1 className="font-bold text-4xl mb-4" style={{fontFamily:'Inter,sans-serif'}}>{note.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-secondary text-sm mb-2">
              <span>Опубликовано: {new Date(note.createdAt).toLocaleDateString('ru-RU')}</span>
              <span>Обновлено: {new Date(note.updatedAt).toLocaleDateString('ru-RU')}</span>
            </div>
            {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {note.frontmatter.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            )}
          </header>

          {/* Описание */}
          {note.frontmatter.description && (
            <div className="mb-8 p-4 bg-gray-100 rounded-xl">
              <p className="text-gray-600 italic">{note.frontmatter.description}</p>
            </div>
          )}

          {/* Контент */}
          <article className="markdown-content prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: note.html || '' }} />
          </article>
        </div>

        {/* Debug info */}
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
      </main>
    </div>
  );
} 