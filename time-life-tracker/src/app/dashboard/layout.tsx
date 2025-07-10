import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <nav className="w-full flex justify-between items-center p-4 neumorph mb-4">
        <span className="font-bold text-xl">Time Life Tracker</span>
        <a href="/" className="text-accent hover:underline">Выйти</a>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
