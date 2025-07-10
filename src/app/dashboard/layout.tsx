"use client";

import type { ReactNode } from "react";
import SidebarNav from "@/components/SidebarNav";
import TopbarProfile from "@/components/TopbarProfile";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-primary flex flex-row">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <header className="topbar mb-4">
          <span className="font-bold text-xl text-accent">Time Life Tracker</span>
          <TopbarProfile />
          <a href="/" className="text-accent hover:underline ml-4">Выйти</a>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          {children}
        </main>
      </div>
    </div>
  );
}
