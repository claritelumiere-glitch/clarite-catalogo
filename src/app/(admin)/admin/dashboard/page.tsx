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
      <h1 className="font-serif text-2xl text-gray-900 font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#6B2D8B] transition-colors group"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</p>
            <p className="text-4xl font-bold text-[#6B2D8B] mt-2 group-hover:text-[#9B2C8A] transition-colors">
              {card.value.toLocaleString("pt-BR")}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/produtos/novo"
          className="bg-[#6B2D8B] hover:bg-[#9B2C8A] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          + Novo Produto
        </Link>
        <Link
          href="/catalogo"
          target="_blank"
          className="border border-gray-200 text-gray-600 hover:border-[#6B2D8B] hover:text-[#6B2D8B] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Ver Catálogo ↗
        </Link>
      </div>
    </div>
  );
}
