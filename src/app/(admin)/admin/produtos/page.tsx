/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
import { ExportarCSVButton } from "./ExportarCSVButton";
import type { Produto } from "@/types/database";

type ProdutoRow = Pick<Produto, "id" | "codigo" | "nome" | "preco" | "ativo" | "destaque" | "categoria_id" | "imagens"> & {
  categorias: { nome: string } | null;
};

export const metadata: Metadata = { title: "Produtos | Admin" };

const PER_PAGE = 30;

interface PageProps {
  searchParams: Promise<{ busca?: string; pagina?: string; status?: string }>;
}

export default async function ProdutosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pagina = Number(params.pagina ?? 1);
  const offset = (pagina - 1) * PER_PAGE;

  const supabase = await createClient();

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nome")
    .eq("ativo", true)
    .order("nome");

  let query = supabase
    .from("produtos")
    .select("id, codigo, nome, preco, ativo, destaque, categoria_id, imagens, categorias(nome)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

  if (params.status === "ativo") query = query.eq("ativo", true);
  if (params.status === "inativo") query = query.eq("ativo", false);
  if (params.busca) {
    const buscaEscapada = params.busca.slice(0, 100).replace(/[%_\\]/g, "\\$&");
    query = query.or(`nome.ilike.%${buscaEscapada}%,codigo.ilike.%${buscaEscapada}%`);
  }

  const { data: produtosRaw, count } = await query;
  const produtos = (produtosRaw ?? []) as unknown as ProdutoRow[];
  const totalPaginas = Math.ceil((count ?? 0) / PER_PAGE);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 font-bold tracking-tight">Produtos</h1>
          <p className="text-gray-500 text-sm mt-1">{count ?? 0} peças cadastradas na coleção.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportarCSVButton />
          <Link
            href="/admin/produtos/novo"
            className="group relative overflow-hidden bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all shadow-lg hover:shadow-[#6B2D8B]/40 flex items-center gap-2 transform hover:-translate-y-0.5 border border-white/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Produto
            </span>
            <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
          </Link>
        </div>
      </div>

      {/* Search */}
      <form className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            name="busca"
            type="search"
            defaultValue={params.busca}
            placeholder="Buscar peça por nome ou código..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-gray-900 text-white font-medium tracking-wide uppercase text-xs px-6 py-2.5 rounded-lg hover:bg-[#6B2D8B] transition-colors shadow-sm"
        >
          Filtrar
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FAFAFA]">
              <th className="text-left px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Peça</th>
              <th className="text-left px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:table-cell">Coleção (Cat)</th>
              <th className="text-left px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:table-cell">REF</th>
              <th className="text-left px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valor</th>
              <th className="text-left px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtos?.map((produto) => (
              <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 line-clamp-1">{produto.nome}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {produto.categorias?.nome ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden sm:table-cell">
                  {produto.codigo}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {produto.preco ? formatCurrency(produto.preco) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    produto.ativo
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/produtos/${produto.id}`}
                    className="text-[#6B2D8B] hover:underline text-xs font-medium"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!produtos || produtos.length === 0) && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Nenhum produto encontrado
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/produtos?${new URLSearchParams({ ...params, pagina: String(p) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded text-sm border transition-colors ${
                p === pagina
                  ? "bg-[#6B2D8B] text-white border-[#6B2D8B]"
                  : "border-gray-200 text-gray-600 hover:border-[#6B2D8B]"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
