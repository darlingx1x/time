import { getAllNotes } from "@/lib/notes";
import Link from "next/link";
import { Note } from "@/types/note";
import RefreshButton from "@/components/RefreshButton";

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

      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-bold text-[2.8rem] leading-tight mb-4" style={{fontFamily:'Inter,sans-serif'}}>Вдохновляющие статьи</h1>
        <p className="text-secondary text-lg mb-6">Коллекция заметок, импортированных из Obsidian, оформленных в стиле бенто-карточек. Кликните на любую — и читайте полный текст!</p>
        <div className="flex justify-center gap-4 mb-2">
          <Link href="#get-started">
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 font-medium transition">Присоединиться за $9.99/мес</button>
          </Link>
          <Link href="#read-more">
            <button className="border border-black text-black px-6 py-2 rounded-full hover:bg-gray-100 font-medium transition">Подробнее</button>
          </Link>
        </div>
        <p className="text-gray-400 text-sm">Всего статей: {publishedNotes.length} (из {notes.length})</p>
      </section>

      {/* Debug info */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg text-sm">
          <p><strong>Отладка:</strong></p>
          <p>Всего заметок: {notes.length}</p>
          <p>Опубликованных: {publishedNotes.length}</p>
          <p>Заметки: {notes.map(n => `${n.slug} (${n.published ? 'опубликована' : 'черновик'})`).join(', ')}</p>
          <p className="mt-2">
            <RefreshButton />
          </p>
        </div>
      </div>

      {/* Cards scroller/grid */}
      <section className="max-w-7xl mx-auto w-full">
        {/* Мобильный горизонтальный скролл */}
        <div className="bento-scroller md:hidden">
          {publishedNotes.map((note) => (
            <ArticleBentoCard key={note.slug} note={note} />
          ))}
        </div>
        {/* Сетка на десктопе */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedNotes.map((note) => (
            <ArticleBentoCard key={note.slug} note={note} />
          ))}
        </div>
        {publishedNotes.length === 0 && (
          <div className="bento-card text-center mx-auto mt-8">
            <p className="text-secondary text-lg mb-2">Пока нет опубликованных статей</p>
            {notes.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">Есть {notes.length} неопубликованных заметок</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ArticleBentoCard({ note }: { note: Note }) {
  const excerpt = note.content
    .replace(/[#*`]/g, '')
    .substring(0, 150)
    .trim() + '...';

  return (
    <Link href={`/articles/${note.slug}`} className="bento-card group">
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-accent transition-colors" style={{fontFamily:'Inter,sans-serif'}}>{note.title}</h2>
        <p className="text-secondary text-sm mb-1">{new Date(note.updatedAt).toLocaleDateString('ru-RU')}</p>
      </div>
      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{excerpt}</p>
      {note.frontmatter.tags && note.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {note.frontmatter.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
} 