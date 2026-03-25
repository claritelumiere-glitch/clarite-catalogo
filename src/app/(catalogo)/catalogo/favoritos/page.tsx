"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useFavoritos } from "@/hooks/useFavoritos";
import { ProdutoCard } from "@/components/catalogo/ProdutoCard";
import type { Produto, Categoria } from "@/types/database";
import Link from "next/link";

type ProdutoComCategoria = Produto & { categorias: Categoria | null };

export default function FavoritosPage() {
  const { favoritos, carregado } = useFavoritos();
  const [produtos, setProdutos] = useState<ProdutoComCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!carregado) return;

    if (favoritos.length === 0) {
      setProdutos([]);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("produtos")
      .select("*, categorias(*)")
      .eq("ativo", true)
      .in("id", favoritos)
      .order("nome")
      .then(({ data }) => {
        setProdutos((data ?? []) as unknown as ProdutoComCategoria[]);
        setLoading(false);
      });
  }, [favoritos, carregado]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Link href="/catalogo" className="text-gray-400 hover:text-[#6B2D8B] text-sm">← Catalogo</Link>
        </div>
        <h1 className="font-serif text-3xl text-[#6B2D8B] font-semibold">Meus Favoritos</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? "Carregando..." : `${produtos.length} ${produtos.length === 1 ? "produto salvo" : "produtos salvos"}`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : produtos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {produtos.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              categoria={produto.categorias}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
          </svg>
          <p className="font-serif text-lg text-gray-400">Nenhum favorito ainda</p>
          <p className="text-sm text-gray-400 mt-1">Clique no coracao nos produtos para salvar seus favoritos</p>
          <Link
            href="/catalogo"
            className="inline-block mt-6 bg-[#6B2D8B] hover:bg-[#9B2C8A] text-white font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            Explorar Catalogo
          </Link>
        </div>
      )}
    </div>
  );
}
