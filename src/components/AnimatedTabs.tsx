import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

const TABS = [
  { key: "timer", label: "Время" },
  { key: "todo", label: "Задачи" },
  { key: "emotion", label: "Настроение" },
  { key: "stats", label: "Аналитика" },
  { key: "calendar", label: "Календарь" },
];

export default function AnimatedTabs({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [active, setActive] = useState("timer");
  return (
    <div className="flex gap-2 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => { setActive(tab.key); onTabChange(tab.key); }}
          className={`relative px-4 py-2 rounded-neumorph font-medium transition-colors ${active === tab.key ? "bg-accent text-white" : "bg-card text-text"}`}
        >
          {active === tab.key && (
            <motion.span
              layoutId="tab-underline"
              className="absolute left-0 right-0 bottom-0 h-1 rounded-b bg-accent"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
