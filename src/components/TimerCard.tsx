import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { TimeSession, UserData } from "@/types/userData";

/**
 * Карточка трекера времени с Neumorphism-стилем
 */
export default function TimerCard() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const shaRef = useRef<string | undefined>(undefined);
  const telegramIdRef = useRef<string | null>(null);

  // Загрузка сессий из GitHub
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        const tgUser = typeof window !== "undefined" ? localStorage.getItem("tgUser") : null;
        if (!tgUser) throw new Error("Пользователь не найден");
        const { id } = JSON.parse(tgUser);
        telegramIdRef.current = id;
        const res = await fetch(`/api/data?telegram_id=${id}`);
        const json = await res.json();
        if (json.data) {
          let parsed: UserData;
          if (typeof json.data === "string") {
            parsed = JSON.parse(json.data);
          } else {
            parsed = json.data;
          }
          setSessions(parsed.time_sessions || []);
          shaRef.current = json.data?.sha || undefined;
        } else {
          setSessions([]);
        }
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Автосохранение сессий в GitHub при изменении
  useEffect(() => {
    if (loading) return;
    if (!telegramIdRef.current) return;
    const saveSessions = async () => {
      setSaving(true);
      setError(null);
      try {
        const userData: Partial<UserData> = { time_sessions: sessions };
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegram_id: telegramIdRef.current, userData, sha: shaRef.current }),
        });
      } catch (e: any) {
        setError(e.message || "Ошибка сохранения");
      } finally {
        setSaving(false);
      }
    };
    saveSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  // Запуск таймера
  const startTimer = () => {
    if (running) return;
    setRunning(true);
    setStartTime(Date.now() - elapsed);
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - (startTime ?? Date.now()));
    }, 1000);
  };

  // Остановка таймера
  const stopTimer = () => {
    if (!running) return;
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const end = Date.now();
    const start = startTime ?? end;
    const duration = end - start;
    setElapsed(duration);
    setSessions((prev) => [
      ...prev,
      {
        id: `session_${Date.now()}`,
        category: "default", // TODO: set actual category if available
        description: "", // TODO: set actual description if available
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        duration_minutes: Math.round(duration / 60000)
      }
    ]);
    setStartTime(null);
  };

  // Сброс таймера
  const resetTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(0);
    setStartTime(null);
  };

  // Форматирование времени
  const format = (ms: number) => {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 60;
    const hr = Math.floor(ms / 3600000);
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="card flex flex-col items-center w-full max-w-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Трекер времени</h3>
      <div className="mb-2 text-3xl font-mono select-none">{format(elapsed)}</div>
      <div className="flex gap-2 mb-2">
        {!running ? (
          <button className="btn-neumorph" onClick={startTimer}>Старт</button>
        ) : (
          <button className="btn-neumorph" onClick={stopTimer}>Стоп</button>
        )}
        <button className="btn-neumorph" onClick={resetTimer}>Сброс</button>
      </div>
      {saving && <div className="text-xs text-gray-400 mb-2">Сохраняем...</div>}
      {error && <div className="text-xs text-danger mb-2">{error}</div>}
      <div className="mt-4 w-full">
        <h4 className="font-semibold mb-2">Сессии:</h4>
        <ul className="text-xs max-h-32 overflow-y-auto">
          {sessions.map((s, i) => (
            <li key={i} className="mb-1">
              {new Date(s.start_time).toLocaleTimeString()} — {new Date(s.end_time).toLocaleTimeString()} | {format(s.duration_minutes * 60000)}
            </li>
          ))}
          {sessions.length === 0 && <li className="text-gray-400">Нет сессий</li>}
        </ul>
      </div>
    </motion.div>
  );
}

