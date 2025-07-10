import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Todo, UserData } from "@/types/userData";

const defaultTodos: Todo[] = [];

/**
 * Карточка задач с Neumorphism-стилем
 */
export default function TodoCard() {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const shaRef = useRef<string | undefined>(undefined);
  const telegramIdRef = useRef<string | null>(null);

  // Загрузка todos пользователя из GitHub при монтировании
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const tgUser = typeof window !== "undefined" ? localStorage.getItem("tgUser") : null;
        if (!tgUser) throw new Error("Пользователь не найден");
        const { id } = JSON.parse(tgUser);
        telegramIdRef.current = id;
        const res = await fetch(`/api/data?telegram_id=${id}`);
        const json = await res.json();
        let parsed: UserData = typeof json.data === "string" ? JSON.parse(json.data) : json.data;
        setTodos(parsed?.todos || []);
        shaRef.current = json.data?.sha || undefined;
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Автоматически сохранять todos пользователя в GitHub при каждом изменении
  useEffect(() => {
    if (loading || !telegramIdRef.current) return;
    const saveTodos = async () => {
      setSaving(true);
      setError(null);
      try {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegram_id: telegramIdRef.current, userData: { todos }, sha: shaRef.current }),
        });
      } catch (e: any) {
        setError(e.message || "Ошибка сохранения");
      } finally {
        setSaving(false);
      }
    };
    saveTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);

  // Добавить задачу
  const addTodo = () => {
    if (!title.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: `todo_${Date.now()}`, title, description: desc, deadline, status: "in_progress", tags: [] },
    ]);
    setTitle(""); setDesc(""); setDeadline("");
  };

  // Удалить задачу
  const removeTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  // Переключить статус задачи
  const toggleStatus = (id: string) => setTodos((prev) => prev.map((t) => t.id === id ? { ...t, status: t.status === "done" ? "in_progress" : "done" } : t));

  return (
    <motion.div
      className="card flex flex-col items-center w-full max-w-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Задачи</h3>
      <div className="w-full mb-4 flex flex-wrap gap-2 items-center justify-center">
        <input
          className="input-neumorph w-32"
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="input-neumorph w-40"
          placeholder="Описание"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <input
          className="input-neumorph w-28"
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
        <button
          className="btn-neumorph"
          onClick={addTodo}
        >
          Добавить
        </button>
      </div>
      {saving && <div className="text-xs text-gray-400 mb-2">Сохраняем...</div>}
      {error && <div className="text-xs text-danger mb-2">{error}</div>}
      <ul className="w-full max-h-40 overflow-y-auto text-sm">
        {todos.length === 0 && <li className="text-gray-400">Нет задач</li>}
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between mb-2 bg-card px-2 py-1 rounded-neumorph">
            <div>
              <span className={todo.status === "done" ? "line-through text-gray-400" : ""}>
                <b>{todo.title}</b> — {todo.description}
              </span>
              {todo.deadline && (
                <span className="ml-2 text-xs text-accent">до {todo.deadline}</span>
              )}
            </div>
            <div className="flex gap-1 items-center">
              <button
                className={`btn-neumorph text-xs px-2 py-1 ${todo.status === "done" ? "bg-primary text-accent" : "bg-accent text-white"}`}
                onClick={() => toggleStatus(todo.id)}
              >
                {todo.status === "done" ? "В работу" : "Готово"}
              </button>
              <button
                className="btn-neumorph text-xs px-2 py-1 bg-danger text-white"
                onClick={() => removeTodo(todo.id)}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

