"use client";
import React from "react";
import MagicBento from "@/components/MagicBento";
import RefreshButton from "@/components/RefreshButton";
import { getAllNotes } from "@/lib/notes";

const cardData = [
  {
    color: "#060010",
    title: "Analytics",
    description: "Track user behavior",
    label: "Insights",
  },
  {
    color: "#060010",
    title: "Dashboard",
    description: "Centralized data view",
    label: "Overview",
  },
  {
    color: "#060010",
    title: "Collaboration",
    description: "Work together seamlessly",
    label: "Teamwork",
  },
  {
    color: "#060010",
    title: "Automation",
    description: "Streamline workflows",
    label: "Efficiency",
  },
  {
    color: "#060010",
    title: "Integration",
    description: "Connect favorite tools",
    label: "Connectivity",
  },
  {
    color: "#060010",
    title: "Security",
    description: "Enterprise-grade protection",
    label: "Protection",
  },
];

export default async function ArticlesPage() {
  const notes = await getAllNotes();
  const publishedNotes = notes.filter(note => note.published);

  // Если есть статьи из Obsidian — показываем их через MagicBento
  // Если нет — показываем MagicBento с cardData (заглушка)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e8ebf0] py-20 px-10">
      <div className="max-w-7xl mx-auto">
        <MagicBento
          notes={publishedNotes.length > 0 ? publishedNotes : cardData}
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        />
        <div className="mt-8">
          <div className="p-4 bg-yellow-100 rounded-lg text-sm">
            <p><strong>Отладка:</strong></p>
            <p>Всего заметок: {notes.length}</p>
            <p>Опубликованных: {publishedNotes.length}</p>
            <p>Заметки: {notes.map(n => `${n.slug} (${n.published ? 'опубликована' : 'черновик'})`).join(', ')}</p>
            <p className="mt-2">
              <RefreshButton />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 