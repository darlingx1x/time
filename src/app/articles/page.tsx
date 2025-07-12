import { getAllNotes } from "@/lib/notes";
import Link from "next/link";
import { Note } from "@/types/note";

export default async function ArticlesPage() {
  const notes = await getAllNotes();
  const publishedNotes = notes.filter(note => note.published);

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="neumorph-soft p-8 mb-8">
          <h1 className="text-3xl font-bold text-text mb-4">Статьи</h1>
          <p className="text-gray-500">
            Всего статей: {publishedNotes.length}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedNotes.map((note) => (
            <ArticleCard key={note.slug} note={note} />
          ))}
        </div>

        {publishedNotes.length === 0 && (
          <div className="neumorph-soft p-8 text-center">
            <p className="text-gray-500 text-lg">
              Пока нет опубликованных статей
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ note }: { note: Note }) {
  const excerpt = note.content
    .replace(/[#*`]/g, '')
    .substring(0, 150)
    .trim() + '...';

  return (
    <Link href={`/articles/${note.slug}`}>
      <div className="card hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-text mb-2 line-clamp-2">
            {note.title}
          </h2>
          <p className="text-gray-500 text-sm">
            {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {excerpt}
        </p>

        {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.frontmatter.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
} 