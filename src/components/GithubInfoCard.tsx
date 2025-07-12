import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Repo {
  name: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
}

interface ImageMeta {
  file: string;
  description: string;
  date: string;
}

const DEFAULT_USER = {
  username: "github-user",
  avatar_url: "https://avatars.githubusercontent.com/u/00000000?v=4",
};

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/" + (process.env.NEXT_PUBLIC_GITHUB_REPO_PATH || "") + "/main/githubdb/images/";

const GithubInfoCard: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevRepos = useRef<Repo[]>([]);
  const prevImages = useRef<ImageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    stars: 0,
    forks: 0,
    language: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Состояния для изображений
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState<string | null>(null);
  const [imgSubmitting, setImgSubmitting] = useState(false);
  const imgDescRef = useRef<HTMLInputElement>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);

  // Загрузка изображений
  const fetchImages = async () => {
    setImgLoading(true);
    setImgError(null);
    try {
      const res = await fetch("/api/githubdb-image");
      const data = await res.json();
      const newImages = Array.isArray(data.data) ? data.data.reverse() : [];
      if (prevImages.current.length && JSON.stringify(prevImages.current) !== JSON.stringify(newImages)) {
        setShowUpdate(true);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        setTimeout(() => setShowUpdate(false), 2000);
      }
      setImages(newImages);
      prevImages.current = newImages;
    } catch (e: any) {
      setImgError("Ошибка загрузки изображений");
    } finally {
      setImgLoading(false);
    }
  };

  // Загрузка данных
  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/githubdb");
      const data = await res.json();
      const newRepos = Array.isArray(data.data) ? data.data : [];
      if (prevRepos.current.length && JSON.stringify(prevRepos.current) !== JSON.stringify(newRepos)) {
        setShowUpdate(true);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        setTimeout(() => setShowUpdate(false), 2000);
      }
      setRepos(newRepos);
      prevRepos.current = newRepos;
    } catch (e: any) {
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRepos();
    fetchImages();
    const interval = setInterval(() => {
      fetchRepos();
      fetchImages();
    }, 5000); // каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  // Обработка формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "stars" || name === "forks" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/githubdb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newItem: form }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setForm({ name: "", url: "", description: "", stars: 0, forks: 0, language: "" });
      await fetchRepos();
    } catch (e: any) {
      setError(e.message || "Ошибка сохранения");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl neumorph">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <AnimatePresence>
        {showUpdate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -30, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: -30, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 px-8 py-4 z-50"
            style={{
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#fff",
              borderRadius: "1.5rem",
              boxShadow: "0 8px 32px 0 rgba(99,102,241,0.25), 0 0 0 4px #a78bfa55",
              border: "2px solid #fff",
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "0.03em",
              textShadow: "0 2px 8px #312e8199",
              filter: "drop-shadow(0 0 12px #a78bfa)",
              backdropFilter: "blur(6px)"
            }}
          >
            <span role="img" aria-label="spark">✨</span> Появились новые данные! <span role="img" aria-label="bell">🔔</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center mb-4">
        <img
          src={DEFAULT_USER.avatar_url}
          alt="avatar"
          className="w-16 h-16 rounded-full mr-4 border"
        />
        <div>
          <div className="text-xl font-bold">{DEFAULT_USER.username}</div>
          <div className="text-gray-500">GitHub User</div>
        </div>
      </div>
      {/* Фото-блок */}
      <div className="mb-8">
        <div className="text-lg font-semibold mb-2">Фото и описания:</div>
        {imgLoading ? (
          <div>Загрузка...</div>
        ) : imgError ? (
          <div className="text-red-500">{imgError}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div key={img.file + idx} className="bg-gray-50 rounded-lg shadow p-2 flex flex-col items-center">
                <img
                  src={
                    process.env.NEXT_PUBLIC_GITHUB_REPO_PATH
                      ? `https://raw.githubusercontent.com/${process.env.NEXT_PUBLIC_GITHUB_REPO_PATH}/main/githubdb/images/${img.file}`
                      : `/githubdb/images/${img.file}`
                  }
                  alt={img.description}
                  className="w-full h-48 object-cover rounded mb-2 border"
                  style={{ maxWidth: 320 }}
                />
                <div className="text-sm text-gray-700 mb-1">{img.description}</div>
                <div className="text-xs text-gray-400">{new Date(img.date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
        {/* Форма загрузки фото */}
        <form
          className="mt-4 flex flex-col gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setImgSubmitting(true);
            setImgError(null);
            const fileInput = imgFileRef.current;
            const descInput = imgDescRef.current;
            if (!fileInput?.files?.[0] || !descInput?.value) {
              setImgError("Выберите файл и введите описание");
              setImgSubmitting(false);
              return;
            }
            const formData = new FormData();
            formData.append("image", fileInput.files[0]);
            formData.append("description", descInput.value);
            try {
              const res = await fetch("/api/githubdb-image", {
                method: "POST",
                body: formData,
              });
              if (!res.ok) throw new Error("Ошибка загрузки");
              fileInput.value = "";
              descInput.value = "";
              await fetchImages();
            } catch (e: any) {
              setImgError(e.message || "Ошибка загрузки");
            } finally {
              setImgSubmitting(false);
            }
          }}
        >
          <div className="font-semibold">Загрузить фото:</div>
          <input type="file" accept="image/*" ref={imgFileRef} className="border rounded p-2" required />
          <input type="text" placeholder="Описание" ref={imgDescRef} className="border rounded p-2" required />
          <button type="submit" className="bg-accent text-white px-4 py-2 rounded" disabled={imgSubmitting}>
            {imgSubmitting ? "Загружаем..." : "Загрузить"}
          </button>
        </form>
      </div>
      {/* Репозитории */}
      <div>
        <div className="text-lg font-semibold mb-2">Репозитории:</div>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ul>
            {repos.map((repo, idx) => (
              <li key={repo.name + idx} className="mb-3 border-b pb-2 last:border-b-0">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {repo.name}
                </a>
                <div className="text-gray-700 text-sm">{repo.description}</div>
                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                  <span>⭐ {repo.stars}</span>
                  <span>🍴 {repo.forks}</span>
                  <span>💻 {repo.language}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Форма репозитория */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <div className="font-semibold mb-1">Добавить репозиторий:</div>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Название" className="w-full border rounded p-2" required />
        <input name="url" value={form.url} onChange={handleChange} placeholder="Ссылка" className="w-full border rounded p-2" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" className="w-full border rounded p-2" required />
        <div className="flex gap-2">
          <input name="stars" type="number" value={form.stars} onChange={handleChange} placeholder="Звезды" className="w-1/3 border rounded p-2" min={0} />
          <input name="forks" type="number" value={form.forks} onChange={handleChange} placeholder="Форки" className="w-1/3 border rounded p-2" min={0} />
          <input name="language" value={form.language} onChange={handleChange} placeholder="Язык" className="w-1/3 border rounded p-2" />
        </div>
        <button type="submit" className="bg-accent text-white px-4 py-2 rounded" disabled={submitting}>
          {submitting ? "Сохраняем..." : "Добавить"}
        </button>
      </form>
    </div>
  );
};

export default GithubInfoCard;
