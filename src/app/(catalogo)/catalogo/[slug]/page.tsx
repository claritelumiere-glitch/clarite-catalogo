import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Produto, Categoria } from "@/types/database";
import { GaleriaImagens } from "@/components/catalogo/GaleriaImagens";
import { ProdutoDetalhesClient } from "@/components/catalogo/ProdutoDetalhesClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

type ProdutoComCategoria = Produto & { categorias: Categoria | null };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("produtos")
    .select("nome, descricao")
    .eq("slug", slug)
    .single();
  const produto = data as Pick<Produto, "nome" | "descricao"> | null;
  if (!produto) return { title: "Produto não encontrado" };
  return { title: produto.nome, description: produto.descricao ?? undefined };
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("produtos")
    .select("*, categorias(*)")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (!data) notFound();

  const produto = data as unknown as ProdutoComCategoria;
  const categoria = produto.categorias;
  const { data: { session } } = await supabase.auth.getSession();
  const mostrarPreco = !!session;
  const caracteristicas = (produto.caracteristicas ?? {}) as Record<string, string>;
  const temCaracteristicas = Object.keys(caracteristicas).length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/catalogo" className="hover:text-[#6B2D8B]">Catalogo</Link>
        {categoria && (
          <>
            <span>/</span>
            <Link href={`/catalogo?categoria=${categoria.slug}`} className="hover:text-[#6B2D8B]">
              {categoria.nome}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-600">{produto.nome}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images — interactive gallery */}
        <GaleriaImagens imagens={produto.imagens ?? []} nomeAlt={produto.nome} />

        {/* Info */}
        <div className="flex flex-col">
          {categoria && (
            <Link
              href={`/catalogo?categoria=${categoria.slug}`}
              className="text-xs text-[#9B2C8A] font-bold uppercase tracking-[0.2em] hover:text-[#D4A017] transition-colors"
            >
              {categoria.nome}
            </Link>
          )}
          
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 font-bold mt-3 leading-tight">
            {produto.nome}
          </h1>
          
          {/* Social Proof & Scarcity */}
          <div className="flex items-center gap-4 mt-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-mono tracking-wider">REF: {produto.codigo.slice(0, 8)}</p>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D4A017] bg-[#D4A017]/10 px-2 py-1 rounded">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {20 + (produto.nome.length % 30)} pessoas visualizaram hoje
            </div>
          </div>

          {mostrarPreco ? (
            produto.preco ? (
              <div className="mt-6 mb-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">Investimento</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-[#6B2D8B]">
                    {formatCurrency(produto.preco)}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">à vista</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 mb-2">
                <p className="text-2xl font-bold text-[#D4A017] uppercase tracking-widest">
                  Sob Consulta
                </p>
              </div>
            )
          ) : (
            <div className="mt-6 mb-4 p-5 border border-dashed border-[#6B2D8B]/30 rounded-xl bg-purple-50/50 text-center">
              <div className="flex justify-center mb-2">
                <svg className="w-7 h-7 text-[#9B2C8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Preço exclusivo para clientes cadastrados</p>
              <p className="text-xs text-gray-500 mb-4">Crie sua conta gratuitamente para ver os preços e solicitar orçamento.</p>
              <div className="flex gap-2 justify-center">
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-[#6B2D8B]/30 transition-all"
                >
                  Criar conta grátis
                </Link>
                <Link
                  href="/login"
                  className="border border-[#6B2D8B]/40 text-[#6B2D8B] text-xs font-semibold px-4 py-2.5 rounded-lg hover:border-[#6B2D8B] transition-colors"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>
          )}

          {/* Client-side interactive features: favorites, quantity, CTA */}
          {mostrarPreco && (
            <ProdutoDetalhesClient
              produtoId={produto.id}
              produtoNome={produto.nome}
              produtoCodigo={produto.codigo}
              estoque={produto.estoque ?? 0}
            />
          )}

          {/* Back link */}
          <div className="mt-4">
            <Link
              href="/catalogo"
              className="text-sm text-gray-500 hover:text-[#6B2D8B] transition-colors"
            >
              ← Voltar ao catalogo
            </Link>
          </div>
        </div>
      </div>

      {/* Description section */}
      {produto.descricao && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Descricao</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line max-w-3xl">
            {produto.descricao}
          </p>
        </div>
      )}

      {/* Characteristics section */}
      {temCaracteristicas && (
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Caracteristicas</h2>
          <div className="max-w-2xl">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(caracteristicas).map(([chave, valor], i) => (
                  <tr key={chave} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2.5 font-medium text-gray-700 w-1/3">{chave}</td>
                    <td className="px-4 py-2.5 text-gray-600">{valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
