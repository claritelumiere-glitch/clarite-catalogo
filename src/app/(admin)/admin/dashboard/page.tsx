import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | Admin" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: totalProdutos }, { count: produtosAtivos }, { count: totalCategorias }] =
    await Promise.all([
      supabase.from("produtos").select("*", { count: "exact", head: true }),
      supabase.from("produtos").select("*", { count: "exact", head: true }).eq("ativo", true),
      supabase.from("categorias").select("*", { count: "exact", head: true }).eq("ativo", true),
    ]);

  const cards = [
    { label: "Total de Produtos", value: totalProdutos ?? 0, href: "/admin/produtos" },
    { label: "Produtos Ativos", value: produtosAtivos ?? 0, href: "/admin/produtos?status=ativo" },
    { label: "Categorias", value: totalCategorias ?? 0, href: "/admin/categorias" },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 font-bold tracking-tight">Visão Geral</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe as métricas do seu catálogo.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/catalogo"
            target="_blank"
            className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 hover:border-[#D4A017] hover:text-[#D4A017] text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm"
          >
            <span>Ver Catálogo</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="group relative overflow-hidden bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-[#6B2D8B]/40 flex items-center gap-2 transform hover:-translate-y-0.5 border border-white/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Produto
            </span>
            <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {cards.map((card, i) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#D4A017] transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-16 h-16 text-[#6B2D8B]" fill="currentColor" viewBox="0 0 24 24">
                <path d={i === 0 ? "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" : i === 1 ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"} />
              </svg>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-5xl font-serif text-[#6B2D8B] group-hover:text-gradient-gold transition-all duration-300">
                {card.value.toLocaleString("pt-BR")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
