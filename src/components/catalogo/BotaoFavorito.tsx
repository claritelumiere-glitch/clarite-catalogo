"use client";

import { useFavoritos } from "@/hooks/useFavoritos";

interface BotaoFavoritoProps {
  produtoId: string;
  size?: "sm" | "md";
  className?: string;
}

export function BotaoFavorito({ produtoId, size = "sm", className = "" }: BotaoFavoritoProps) {
  const { isFavorito, toggleFavorito, carregado } = useFavoritos();
  const ativo = isFavorito(produtoId);

  const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  if (!carregado) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorito(produtoId);
      }}
      className={`${btnSize} flex items-center justify-center rounded-full transition-all ${
        ativo
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white"
      } shadow-sm ${className}`}
      aria-label={ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <svg viewBox="0 0 24 24" className={iconSize} fill={ativo ? "currentColor" : "none"} stroke="currentColor" strokeWidth={ativo ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
      </svg>
    </button>
  );
}
