"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "clarite_favoritos";

function getLocalFavoritos(): string[] {
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

function saveLocalFavoritos(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Load initial state
  useEffect(() => {
    async function load() {
      const localFavs = getLocalFavoritos();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        const metaFavs = session.user.user_metadata?.favoritos;
        const cloudFavs = Array.isArray(metaFavs) ? metaFavs : [];
        
        // Merge local and cloud favorites
        const merged = Array.from(new Set([...localFavs, ...cloudFavs]));
        setFavoritos(merged);
        
        // Update both if they differ
        if (merged.length !== cloudFavs.length) {
          await supabase.auth.updateUser({ data: { favoritos: merged } });
        }
        if (merged.length !== localFavs.length) {
          saveLocalFavoritos(merged);
        }
      } else {
        setFavoritos(localFavs);
      }
      setCarregado(true);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFavorito = useCallback((produtoId: string) => {
    setFavoritos((prev) => {
      const next = prev.includes(produtoId)
        ? prev.filter((id) => id !== produtoId)
        : [...prev, produtoId];

      saveLocalFavoritos(next);

      // Sync to cloud outside the state updater to avoid side effects
      if (userId) {
        queueMicrotask(() => {
          supabase.auth.updateUser({ data: { favoritos: next } });
        });
      }

      return next;
    });
  }, [userId, supabase.auth]);

  const isFavorito = useCallback(
    (produtoId: string) => favoritos.includes(produtoId),
    [favoritos]
  );

  return { favoritos, toggleFavorito, isFavorito, carregado, total: favoritos.length };
}
