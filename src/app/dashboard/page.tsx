import { useState } from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedTabs from "@/components/AnimatedTabs";

const TimerCard = dynamic(() => import("@/components/TimerCard"), { ssr: false });
const TodoCard = dynamic(() => import("@/components/TodoCard"), { ssr: false });
const EmotionCard = dynamic(() => import("@/components/EmotionCard"), { ssr: false });
const StatsGraphCard = dynamic(() => import("@/components/StatsGraphCard"), { ssr: false });
const CalendarView = dynamic(() => import("@/components/CalendarView"), { ssr: false });

const CARD_MAP: Record<string, JSX.Element> = {
  timer: <Suspense fallback={<div>Загрузка...</div>}><TimerCard /></Suspense>,
  todo: <Suspense fallback={<div>Загрузка...</div>}><TodoCard /></Suspense>,
  emotion: <Suspense fallback={<div>Загрузка...</div>}><EmotionCard /></Suspense>,
  stats: <Suspense fallback={<div>Загрузка...</div>}><StatsGraphCard /></Suspense>,
  calendar: <Suspense fallback={<div>Загрузка...</div>}><CalendarView /></Suspense>,
};

export default function DashboardPage() {
  const [tab, setTab] = useState("timer");
  return (
    <main className="p-4 flex flex-col gap-6 items-center min-h-screen">
      <motion.h2 initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl font-bold neumorph p-4">Личный Дашборд</motion.h2>
      <AnimatedTabs onTabChange={setTab} />
      <div className="w-full max-w-2xl min-h-[320px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {CARD_MAP[tab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

