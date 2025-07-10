"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Пример простых SVG-иконок (можно заменить на кастомные)
const navItems = [
  { href: "/dashboard", icon: <svg width="24" height="24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="6"/></svg>, label: "Главная" },
  { href: "/dashboard?tab=todo", icon: <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M6 12h12M6 8h12M6 16h12"/></svg>, label: "Задачи" },
  { href: "/dashboard?tab=emotion", icon: <svg width="24" height="24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2"/></svg>, label: "Настроение" },
  { href: "/dashboard?tab=stats", icon: <svg width="24" height="24" fill="none" stroke="currentColor"><rect x="4" y="12" width="4" height="8"/><rect x="10" y="8" width="4" height="12"/><rect x="16" y="4" width="4" height="16"/></svg>, label: "Статистика" },
  { href: "/calendar", icon: <svg width="24" height="24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 9h18"/></svg>, label: "Календарь" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={`flex flex-col items-center group ${pathname === item.href ? 'text-accent' : 'text-gray-400'} transition-colors`}>
          <span className="w-10 h-10 flex items-center justify-center mb-1 neumorph-soft group-hover:text-accent transition-colors">
            {item.icon}
          </span>
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}
    </aside>
  );
} 