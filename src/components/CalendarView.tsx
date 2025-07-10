import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { CalendarEvent, UserData } from "@/types/userData";

const defaultEvents: CalendarEvent[] = [];

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const shaRef = useRef<string | undefined>(undefined);
  const telegramIdRef = useRef<string | null>(null);

  // Загрузка событий пользователя из GitHub при монтировании
  useEffect(() => {
    const fetchEvents = async () => {
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
        setEvents(parsed?.calendar_events || []);
        shaRef.current = json.data?.sha || undefined;
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Автоматически сохранять события пользователя в GitHub при каждом изменении
  useEffect(() => {
    if (loading || !telegramIdRef.current) return;
    const saveEvents = async () => {
      setSaving(true);
      setError(null);
      try {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegram_id: telegramIdRef.current, userData: { calendar_events: events }, sha: shaRef.current }),
        });
      } catch (e: any) {
        setError(e.message || "Ошибка сохранения");
      } finally {
        setSaving(false);
      }
    };
    saveEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Добавить новое событие
  const addEvent = () => {
    if (!title.trim() || !date) return;
    setEvents(prev => [
      ...prev,
      {
        id: `event_${Date.now()}`,
        title,
        description: desc,
        date,
        time: '', // TODO: set actual time if available
        duration_minutes: 0 // TODO: set actual duration if available
      }
    ]);
    setTitle(""); setDesc(""); setDate("");
  };

  // Удалить событие
  const removeEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  return (
    <motion.div
      className="neumorph p-6 flex flex-col items-center w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Календарь</h3>
      <div className="flex gap-2 mb-4 w-full items-center">
        <input
          className="border rounded-neumorph px-2 py-1 w-32"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          className="border rounded-neumorph px-2 py-1 w-32"
          placeholder="Заголовок"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="border rounded-neumorph px-2 py-1 w-40"
          placeholder="Описание"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-accent text-white rounded-neumorph"
          onClick={addEvent}
        >Добавить</button>
      </div>
      <ul className="w-full max-h-32 overflow-y-auto text-sm">
        {events.length === 0 && <li className="text-gray-400">Нет событий</li>}
        {events.map(ev => (
          <li key={ev.id} className="flex items-center justify-between mb-1 bg-card px-2 py-1 rounded-neumorph">
            <div>
              <b>{ev.title}</b>
              <span className="ml-2 text-xs text-accent">{ev.date}</span>
            </div>
            <button
              className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded"
              onClick={() => removeEvent(ev.id)}
            >✕</button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
