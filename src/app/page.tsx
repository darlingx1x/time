'use client';
import Script from "next/script";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Главная страница (Landing Page) с Neumorphism-стилем
 */
export default function Home() {
  const widgetRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.dataset.telegramLogin = "darlinxloginbot";
    script.dataset.size = "large";
    script.dataset.userpic = "false";
    script.dataset.requestAccess = "write";
    script.dataset.onauth = "onTelegramAuth(user)";
    script.dataset.authUrl = "https://time-36a7.onrender.com/dashboard";
    widgetRef.current.appendChild(script);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-primary p-4">
      <motion.div
        className="card flex flex-col items-center max-w-lg w-full mb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-accent select-none">Time Life Tracker</h1>
        <p className="mb-4 text-lg text-text text-center">
          Твой минималистичный трекер времени, задач и настроения с авторизацией через Telegram.<br/>
          <span className="text-accent font-semibold">Neumorphism-дизайн</span>, плавные анимации, удобный дашборд и аналитика.
        </p>
        <div className="w-full flex flex-col items-center">
          <div ref={widgetRef} id="telegram-login-widget" className="mb-2" />
          <span className="text-xs text-gray-400">Вход через Telegram — быстро и безопасно</span>
        </div>
      </motion.div>

      {/* Навигационные ссылки */}
      <motion.div
        className="flex gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link href="/articles">
          <motion.button
            className="btn-neumorph"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📚 Статьи
          </motion.button>
        </Link>
      </motion.div>

      <motion.ul
        className="flex flex-wrap gap-4 justify-center"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {[
          { icon: '⏱️', text: 'Трекер времени с автосохранением' },
          { icon: '📝', text: 'ToDo-лист с дедлайнами' },
          { icon: '😊', text: 'Трекер настроения' },
          { icon: '📊', text: 'Аналитика продуктивности' },
          { icon: '📅', text: 'Интерактивный календарь' },
          { icon: '📚', text: 'Синхронизация с Obsidian' },
        ].map((f, i) => (
          <motion.li
            key={i}
            className="card flex items-center gap-2 px-4 py-2 text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
          >
            <span className="text-2xl select-none">{f.icon}</span>
            <span>{f.text}</span>
          </motion.li>
        ))}
      </motion.ul>
      <Script src="/telegram-auth.js" strategy="beforeInteractive" />
    </main>
  );
}
