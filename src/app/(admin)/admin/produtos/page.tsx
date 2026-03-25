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
    query = query.or(`nome.ilike.%${params.busca}%,codigo.ilike.%${params.busca}%`);
  }

  const { data: produtosRaw, count } = await query;
  const produtos = (produtosRaw ?? []) as unknown as ProdutoRow[];
  const totalPaginas = Math.ceil((count ?? 0) / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-gray-900 font-semibold">Produtos</h1>
          <p className="text-gray-400 text-sm mt-0.5">{count ?? 0} produtos no total</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportarCSVButton />
          <Link
            href="/admin/produtos/novo"
            className="bg-[#6B2D8B] hover:bg-[#9B2C8A] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            + Novo Produto
          </Link>
        </div>
      </div>

      {/* Search */}
      <form className="mb-4 flex gap-3">
        <input
          name="busca"
          type="search"
          defaultValue={params.busca}
          placeholder="Buscar por nome ou código..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
        />
        <button
          type="submit"
          className="bg-[#6B2D8B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#9B2C8A] transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Código</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3"></th>
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
