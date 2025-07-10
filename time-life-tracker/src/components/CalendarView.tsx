import { useState } from "react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "@/types/userData";

const defaultEvents: CalendarEvent[] = [
  {
    id: "event_001",
    title: "Дедлайн MVP",
    description: "Завершить основные фичи",
    date: "2025-07-15"
  }
];

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");

  const addEvent = () => {
    if (!title.trim() || !date) return;
    setEvents(prev => [
      ...prev,
      {
        id: `event_${Date.now()}`,
        title,
        description: desc,
        date
      }
    ]);
    setTitle("");
    setDesc("");
    setDate("");
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

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
              <b>{ev.title}</b> — {ev.description}
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
