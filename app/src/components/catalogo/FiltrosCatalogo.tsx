"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Categoria } from "@/types/database";

interface FiltrosProps {
  categorias: Categoria[];
  isMobile?: boolean;
}

function FiltrosForm({
  categorias,
}: {
  categorias: Categoria[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("pagina"); // reset to page 1 on filter change
      router.push(`/catalogo?${params.toString()}`);
    },
    [router, searchParams]
  );

  const resetFiltros = () => router.push("/catalogo");

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Buscar</label>
        <input
          type="search"
          placeholder="Nome ou código..."
          defaultValue={searchParams.get("busca") === "undefined" ? "" : (searchParams.get("busca") ?? "")}
          onChange={(e) => updateParam("busca", e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Categoria</label>
        <select
          defaultValue={searchParams.get("categoria") ?? ""}
          onChange={(e) => updateParam("categoria", e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={resetFiltros}
        className="w-full text-xs text-[#9B2C8A] hover:underline text-left"
      >
        Limpar filtros
      </button>
    </div>
  );
}

export function FiltrosCatalogo({ categorias, isMobile = false }: FiltrosProps) {
  if (isMobile) {
    return (
      <details className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-gray-700 flex items-center justify-between list-none select-none">
          <span className="font-serif text-gray-900 font-medium text-sm uppercase tracking-widest">
            Filtrar
          </span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </summary>
        <div className="px-5 pb-5 pt-3 border-t border-gray-100">
          <FiltrosForm categorias={categorias} />
        </div>
      </details>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="font-serif text-gray-900 font-medium text-sm uppercase tracking-widest mb-4">
        Filtrar
      </h2>
      <FiltrosForm categorias={categorias} />
    </div>
  );
}
