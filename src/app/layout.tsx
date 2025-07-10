import "../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Time Life Tracker",
  description: "Premium Telegram-based time & mood tracker with Neumorphism UI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-primary text-text min-h-screen">{children}</body>
    </html>
  );
}
