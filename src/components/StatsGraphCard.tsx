import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Todo, Emotion, TimeSession, UserData } from "@/types/userData";

function countDone(todos: Todo[]) {
  return todos.filter(t => t.status === "done").length;
}
function totalTime(sessions: TimeSession[]) {
  return sessions.reduce((sum, s) => {
    if (!s.end_time) return sum;
    const start = new Date(s.start_time).getTime();
    const end = new Date(s.end_time).getTime();
    return sum + Math.max(0, end - start);
  }, 0);
}

/**
 * Карточка аналитики с Neumorphism-стилем
 */
export default function StatsGraphCard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const telegramIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tgUser = typeof window !== "undefined" ? localStorage.getItem("tgUser") : null;
        if (!tgUser) throw new Error("Пользователь не найден");
        const { id } = JSON.parse(tgUser);
        telegramIdRef.current = id;
        const res = await fetch(`/api/data?telegram_id=${id}`);
        const json = await res.json();
        let parsed: UserData;
        if (json.data) {
          if (typeof json.data === "string") {
            parsed = JSON.parse(json.data);
          } else {
            parsed = json.data;
          }
          setTodos(parsed.todos || []);
          setEmotions(parsed.emotions || []);
          setSessions(parsed.time_sessions || []);
        } else {
          setTodos([]);
          setEmotions([]);
          setSessions([]);
        }
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const doneCount = countDone(todos);
  const timeMs = totalTime(sessions);
  const moodStats = emotions.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      className="card flex flex-col items-center w-full max-w-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
      {error && <div className="text-xs text-danger mb-2">{error}</div>}
      <div className="w-full flex flex-col gap-2">
        <div className="bg-card rounded-neumorph px-3 py-2 flex justify-between">
          <span>Выполнено задач:</span>
          <b>{doneCount}</b>
        </div>
        <div className="bg-card rounded-neumorph px-3 py-2 flex justify-between">
          <span>Время за сегодня:</span>
          <b>{(timeMs/3600000).toFixed(2)} ч</b>
        </div>
        <div className="bg-card rounded-neumorph px-3 py-2 flex justify-between">
          <span>Статистика настроения:</span>
          <span>
            {Object.entries(moodStats).map(([m, c]) => (
              <span key={m} className="mr-2">{m} {c}</span>
            ))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
