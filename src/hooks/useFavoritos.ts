"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "clarite_favoritos";

function getFavoritos(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function salvarFavoritos(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setFavoritos(getFavoritos());
    setCarregado(true);
  }, []);

  const toggleFavorito = useCallback((produtoId: string) => {
    setFavoritos((prev) => {
      const next = prev.includes(produtoId)
        ? prev.filter((id) => id !== produtoId)
        : [...prev, produtoId];
      salvarFavoritos(next);
      return next;
    });
  }, []);

  const isFavorito = useCallback(
    (produtoId: string) => favoritos.includes(produtoId),
    [favoritos]
  );

  return { favoritos, toggleFavorito, isFavorito, carregado, total: favoritos.length };
}
