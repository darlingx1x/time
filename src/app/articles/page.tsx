"use client";
import React from "react";
import MagicBento from "@/components/MagicBento";
import RefreshButton from "@/components/RefreshButton";
import { getAllNotes } from "@/lib/notes";

const demoNotes = [
  {
    slug: "demo-analytics",
    title: "Analytics",
    content: "",
    frontmatter: {
      title: "Analytics",
      description: "Track user behavior",
      tags: ["Insights"],
      published: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  },
  {
    slug: "demo-dashboard",
    title: "Dashboard",
    content: "",
    frontmatter: {
      title: "Dashboard",
      description: "Centralized data view",
      tags: ["Overview"],
      published: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  },
  {
    slug: "demo-collaboration",
    title: "Collaboration",
    content: "",
    frontmatter: {
      title: "Collaboration",
      description: "Work together seamlessly",
      tags: ["Teamwork"],
      published: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  },
  {
    slug: "demo-automation",
    title: "Automation",
    content: "",
    frontmatter: {
      title: "Automation",
      description: "Streamline workflows",
      tags: ["Efficiency"],
      published: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  },
  {
    slug: "demo-integration",
    title: "Integration",
    content: "",
    frontmatter: {
      title: "Integration",
      description: "Connect favorite tools",
      tags: ["Connectivity"],
      published: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  },
  {
    slug: "demo-security",
    title: "Security",
    content: "",
    frontmatter: {
      title: "Security",
      description: "Enterprise-grade protection",
      tags: ["Protection"],
      published: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  },
];

export default async function ArticlesPage() {
  const notes = await getAllNotes();
  const publishedNotes = notes.filter(note => note.published);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e8ebf0] py-20 px-10">
      <div className="max-w-7xl mx-auto">
        <MagicBento
          notes={publishedNotes.length > 0 ? publishedNotes : demoNotes}
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