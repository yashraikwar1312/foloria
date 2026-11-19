"use client";

import { create } from "zustand";

export type PageData = {
  id: string;
  background: string;
  title: string;
  subtitle: string;
  image?: string;
};

export type Magazine = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  description: string;
  status: "draft" | "published";
  visibility: "public" | "unlisted" | "private";
  cover: string;
  pages: PageData[];
  updatedAt: string;
};

type Store = {
  magazines: Magazine[];
  hydrated: boolean;
  hydrate: () => void;
  saveMagazine: (magazine: Magazine) => void;
  deleteMagazine: (id: string) => void;
};

const demoMagazines: Magazine[] = [
  {
    id: "travel-issue",
    title: "Terra & Tide",
    subtitle: "A coastal journal",
    author: "Mara Ellis",
    category: "Travel",
    description: "Quiet roads, salt air, and stories gathered along the coast.",
    status: "published",
    visibility: "public",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
    updatedAt: "Today",
    pages: [
      { id: "p1", background: "#d7d0c3", title: "TERRA", subtitle: "A coastal journal", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85" },
      { id: "p2", background: "#eeeae1", title: "The edge of elsewhere", subtitle: "Along the road, everything slows." },
      { id: "p3", background: "#bec7bb", title: "Salt / Sky", subtitle: "Field notes from the western shore", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85" },
    ],
  },
];

export const useMagazineStore = create<Store>((set, get) => ({
  magazines: demoMagazines,
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    const raw = localStorage.getItem("foliora-magazines");
    set({ magazines: raw ? JSON.parse(raw) : demoMagazines, hydrated: true });
  },
  saveMagazine: (magazine) => set((state) => {
    const magazines = state.magazines.some((item) => item.id === magazine.id)
      ? state.magazines.map((item) => item.id === magazine.id ? magazine : item)
      : [magazine, ...state.magazines];
    if (typeof window !== "undefined") localStorage.setItem("foliora-magazines", JSON.stringify(magazines));
    return { magazines };
  }),
  deleteMagazine: (id) => set((state) => {
    const magazines = state.magazines.filter((item) => item.id !== id);
    if (typeof window !== "undefined") localStorage.setItem("foliora-magazines", JSON.stringify(magazines));
    return { magazines };
  }),
}));
