import { motion } from "framer-motion";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function TimerCard() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessions, setSessions] = useState<{start: number; end: number; duration: number}[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    setStartTime(Date.now() - elapsed);
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - (startTime ?? Date.now()));
    }, 1000);
  };

  const stopTimer = () => {
    if (!running) return;
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const end = Date.now();
    const start = startTime ?? end;
    const duration = end - start;
    setElapsed(duration);
    setSessions((prev) => [...prev, { start, end, duration }]);
    setStartTime(null);
  };

  const resetTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(0);
    setStartTime(null);
  };

  const format = (ms: number) => {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 60;
    const hr = Math.floor(ms / 3600000);
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="neumorph p-6 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Трекер времени</h3>
      <div className="mb-2 text-3xl font-mono">{format(elapsed)}</div>
      <div className="flex gap-2">
        {!running ? (
          <button className="px-4 py-2 bg-accent text-white rounded-neumorph mt-2" onClick={startTimer}>Старт</button>
        ) : (
          <button className="px-4 py-2 bg-accent text-white rounded-neumorph mt-2" onClick={stopTimer}>Стоп</button>
        )}
        <button className="px-4 py-2 bg-card text-text rounded-neumorph mt-2 border border-accent" onClick={resetTimer}>Сброс</button>
      </div>
      <div className="mt-4 w-full">
        <h4 className="font-semibold mb-2">Сессии:</h4>
        <ul className="text-xs max-h-32 overflow-y-auto">
          {sessions.map((s, i) => (
            <li key={i}>
              {new Date(s.start).toLocaleTimeString()} — {new Date(s.end).toLocaleTimeString()} | {format(s.duration)}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

