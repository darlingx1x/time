import { useState } from "react";
import { motion } from "framer-motion";
import type { Emotion } from "@/types/userData";

const defaultEmotions: Emotion[] = [
  {
    date: "2025-07-10",
    mood: "🙂",
    note: "Неплохой день, много успел."
  }
];

const MOODS = ["😃","🙂","😐","😔","😡","😭"];

export default function EmotionCard() {
  const [emotions, setEmotions] = useState<Emotion[]>(defaultEmotions);
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");

  const addEmotion = () => {
    if (!date || !mood) return;
    setEmotions(prev => [
      { date, mood, note },
      ...prev
    ]);
    setDate("");
    setMood("");
    setNote("");
  };

  return (
    <motion.div
      className="neumorph p-6 flex flex-col items-center w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Настроение</h3>
      <div className="flex gap-2 mb-4 w-full items-center">
        <input
          type="date"
          className="border rounded-neumorph px-2 py-1 w-32"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <select
          className="border rounded-neumorph px-2 py-1 w-20 text-xl"
          value={mood}
          onChange={e => setMood(e.target.value)}
        >
          <option value="">😊</option>
          {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input
          className="border rounded-neumorph px-2 py-1 w-40"
          placeholder="Заметка"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-accent text-white rounded-neumorph"
          onClick={addEmotion}
        >Добавить</button>
      </div>
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

