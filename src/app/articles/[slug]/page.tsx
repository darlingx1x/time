import { getNoteBySlug, getAllNotes } from "@/lib/notes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

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

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes
    .filter(note => note.published)
    .map((note) => ({
      slug: note.slug,
    }));
}

export default async function ArticlePage({ params }: Props) {
  const note = await getNoteBySlug(params.slug);

  if (!note || !note.published) {
    notFound();
  }

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
        </div>
      </div>
    </div>
  );
} 