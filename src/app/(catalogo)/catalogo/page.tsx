import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProdutoCard } from "@/components/catalogo/ProdutoCard";
import { FiltrosCatalogo } from "@/components/catalogo/FiltrosCatalogo";
import type { Metadata } from "next";
import type { Categoria, Produto } from "@/types/database";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
};

interface PageProps {
  searchParams: Promise<{ busca?: string; categoria?: string }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const buscaRaw = (params.busca ?? "").trim();
  const buscaSanitizada = (buscaRaw === "undefined" ? "" : buscaRaw)
    .slice(0, 100)
    .replace(/[%_\\]/g, "\\$&");

  const supabase = await createClient();

  // Fetch categories
  const { data: categoriasRaw } = await supabase
    .from("categorias")
    .select("*")
    .eq("ativo", true)
    .order("ordem");
  const categorias = (categoriasRaw ?? []) as Categoria[];

  // Build product query
  let query = supabase
    .from("produtos")
    .select("*, categorias(*)", { count: "exact" })
    .eq("ativo", true)
    .order("destaque", { ascending: false })
    .order("nome");

  if (params.categoria) {
    const cat = categorias.find((c) => c.slug === params.categoria);
    if (cat) query = query.eq("categoria_id", cat.id);
  }

  if (buscaSanitizada) {
    query = query.or(
      `nome.ilike.%${buscaSanitizada}%,codigo.ilike.%${buscaSanitizada}%,descricao.ilike.%${buscaSanitizada}%`
    );
  }

  const { data: produtosRaw, count } = await query;
  const produtos = (produtosRaw ?? []) as unknown as (Produto & { categorias: Categoria | null })[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Persuasive Banner */}
      <div className="mb-10 w-full bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,rgba(212,160,23,0.4)_1px,transparent_0),radial-gradient(1px_1px_at_40px_70px,rgba(232,197,71,0.3)_1px,transparent_0),radial-gradient(1px_1px_at_80px_10px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[size:100px_100px] opacity-20 pointer-events-none mix-blend-screen"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2 tracking-wide text-gradient-gold">Coleção Exclusiva</h2>
            <p className="text-white/90 font-light">Peças únicas para transformar seu ambiente. <span className="font-semibold text-[#D4A017] animate-pulse">Estoque limitado.</span></p>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <div className="text-right">
              <p className="text-xs text-white/70 uppercase tracking-widest mb-1">Qualidade Garantida</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 text-[#D4A017]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 font-bold tracking-tight">Catálogo de Produtos</h1>
          <p className="text-gray-500 text-sm mt-2">
            Mostrando <span className="font-semibold text-[#6B2D8B]">{count ?? 0}</span> {(count ?? 0) === 1 ? "peça exclusiva" : "peças exclusivas"}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <Suspense fallback={<div className="h-40 bg-white border border-gray-200 rounded-lg animate-pulse" />}>
            <FiltrosCatalogo categorias={categorias} />
          </Suspense>
        </aside>

        {/* Mobile filters */}
        <div className="lg:hidden w-full mb-4">
          <Suspense fallback={null}>
            <FiltrosCatalogo categorias={categorias} isMobile />
          </Suspense>
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {produtos && produtos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {produtos.map((produto) => (
                  <ProdutoCard
                    key={produto.id}
                    produto={produto}
                    categoria={produto.categorias}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="font-serif text-lg">Nenhum produto encontrado</p>
              <p className="text-sm mt-2">Tente ajustar os filtros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
