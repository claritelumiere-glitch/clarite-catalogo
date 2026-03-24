import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProdutoCard } from "@/components/catalogo/ProdutoCard";
import { FiltrosCatalogo } from "@/components/catalogo/FiltrosCatalogo";
import type { Metadata } from "next";
import type { Categoria, Produto } from "@/types/database";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
};

const PER_PAGE = 24;

interface PageProps {
  searchParams: Promise<{ busca?: string; categoria?: string; pagina?: string }>;
}

function buildPaginationItems(pagina: number, totalPaginas: number): (number | "...")[] {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  const items: (number | "...")[] = [];
  const delta = 2;
  const left = pagina - delta;
  const right = pagina + delta;

  // Always show first page
  items.push(1);

  if (left > 2) {
    items.push("...");
  }

  for (let i = Math.max(2, left); i <= Math.min(totalPaginas - 1, right); i++) {
    items.push(i);
  }

  if (right < totalPaginas - 1) {
    items.push("...");
  }

  // Always show last page
  items.push(totalPaginas);

  return items;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const buscaSanitizada = (params.busca ?? "").slice(0, 100).trim();
  const pagina = Math.max(1, Number(params.pagina ?? 1));
  const offset = (pagina - 1) * PER_PAGE;

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
    .order("nome")
    .range(offset, offset + PER_PAGE - 1);

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
  const totalPaginas = Math.ceil((count ?? 0) / PER_PAGE);
  const paginationItems = buildPaginationItems(pagina, totalPaginas);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#6B2D8B] font-semibold">Catálogo de Produtos</h1>
        <p className="text-gray-500 text-sm mt-1">
          {count ?? 0} {(count ?? 0) === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      <div className="flex gap-6">
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

              {/* Pagination with ellipsis */}
              {totalPaginas > 1 && (
                <div className="mt-10 flex justify-center gap-1 flex-wrap">
                  {paginationItems.map((item, idx) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none"
                      >
                        ...
                      </span>
                    ) : (
                      <a
                        key={item}
                        href={`/catalogo?${new URLSearchParams({ ...params, busca: buscaSanitizada || undefined as any, pagina: String(item) })}`}
                        className={`w-9 h-9 flex items-center justify-center rounded text-sm border transition-colors ${
                          item === pagina
                            ? "bg-[#6B2D8B] text-white border-[#6B2D8B]"
                            : "border-gray-200 text-gray-600 hover:border-[#6B2D8B]"
                        }`}
                      >
                        {item}
                      </a>
                    )
                  )}
                </div>
              )}
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
