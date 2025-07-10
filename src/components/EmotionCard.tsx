import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Emotion, UserData } from "@/types/userData";

const defaultEmotions: Emotion[] = [];
const MOODS = ["😃","🙂","😐","😔","😡","😭"];

/**
 * Карточка трекера настроения с Neumorphism-стилем
 */
export default function EmotionCard() {
  const [emotions, setEmotions] = useState<Emotion[]>(defaultEmotions);
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const shaRef = useRef<string | undefined>(undefined);
  const telegramIdRef = useRef<string | null>(null);

  // Загрузка эмоций пользователя из GitHub при монтировании
  useEffect(() => {
    const fetchEmotions = async () => {
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
        setEmotions(parsed?.emotions || []);
        shaRef.current = json.data?.sha || undefined;
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
        setEmotions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmotions();
  }, []);

  // Автоматически сохранять эмоции пользователя в GitHub при каждом изменении
  useEffect(() => {
    if (loading || !telegramIdRef.current) return;
    const saveEmotions = async () => {
      setSaving(true);
      setError(null);
      try {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegram_id: telegramIdRef.current, userData: { emotions }, sha: shaRef.current }),
        });
      } catch (e: any) {
        setError(e.message || "Ошибка сохранения");
      } finally {
        setSaving(false);
      }
    };
    saveEmotions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotions]);

  // Добавить эмоцию
  const addEmotion = () => {
    if (!date || !mood) return;
    setEmotions(prev => [
      { date, mood, note },
      ...prev
    ]);
    setDate(""); setMood(""); setNote("");
  };

  return (
    <motion.div
      className="card flex flex-col items-center w-full max-w-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Настроение</h3>
      <div className="flex gap-2 mb-4 w-full items-center justify-center flex-wrap">
        <input
          type="date"
          className="input-neumorph w-32"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <select
          className="input-neumorph w-20 text-xl"
          value={mood}
          onChange={e => setMood(e.target.value)}
        >
          <option value="">😊</option>
          {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input
          className="input-neumorph w-40"
          placeholder="Заметка"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button
          className="btn-neumorph"
          onClick={addEmotion}
        >Добавить</button>
      </div>
      {saving && <div className="text-xs text-gray-400 mb-2">Сохраняем...</div>}
      {error && <div className="text-xs text-danger mb-2">{error}</div>}
      <ul className="w-full max-h-32 overflow-y-auto text-sm">
        {emotions.length === 0 && <li className="text-gray-400">Нет записей</li>}
        {emotions.map((em, i) => (
          <li key={i} className="flex items-center gap-2 mb-1 bg-card px-2 py-1 rounded-neumorph">
            <span className="text-xl">{em.mood}</span>
            <span>{em.date}</span>
            <span className="text-xs text-gray-500">{em.note}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

