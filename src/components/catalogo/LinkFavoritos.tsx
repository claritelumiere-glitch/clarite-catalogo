"use client";

import Link from "next/link";
import { useFavoritos } from "@/hooks/useFavoritos";

export function LinkFavoritos() {
  const { total, carregado } = useFavoritos();

  if (!carregado) return null;

  return (
    <Link
      href="/catalogo/favoritos"
      className="relative flex items-center gap-1 text-white/80 hover:text-white transition-colors"
      title="Meus Favoritos"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
      </svg>
      {total > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-[#D4A017] text-white text-xs w-4.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full font-medium text-[10px]">
          {total > 99 ? "99+" : total}
        </span>
      )}
    </Link>
  );
}
