import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { Produto, Categoria } from "@/types/database";

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
  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${produto.nome} (Cód: ${produto.codigo})`
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link href="/catalogo" className="hover:text-[#6B2D8B]">Catálogo</Link>
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
        {/* Images */}
        <div>
          {produto.imagens && produto.imagens.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                <Image
                  src={produto.imagens[0]}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {produto.imagens.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {produto.imagens.slice(1).map((img: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded border border-gray-200 overflow-hidden bg-gray-50">
                      <Image src={img} alt={`${produto.nome} ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <svg viewBox="0 0 100 130" className="w-24 h-24 text-[#D4A017] opacity-20" fill="currentColor">
                <rect x="48" y="0" width="4" height="15" rx="2"/>
                <path d="M30 15 Q50 10 70 15 L65 55 Q50 60 35 55 Z"/>
                <path d="M35 55 Q50 60 65 55 L60 85 Q50 90 40 85 Z"/>
                <path d="M40 85 Q50 90 60 85 L55 105 Q50 108 45 105 Z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {categoria && (
            <Link
              href={`/catalogo?categoria=${categoria.slug}`}
              className="text-xs text-[#9B2C8A] font-medium uppercase tracking-widest hover:underline"
            >
              {categoria.nome}
            </Link>
          )}
          <h1 className="font-serif text-2xl text-gray-900 font-semibold mt-2 leading-snug">
            {produto.nome}
          </h1>
          <p className="text-xs text-gray-400 mt-1">Código: {produto.codigo}</p>

          {produto.preco && (
            <div className="mt-4 inline-block bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500">Preço</p>
              <p className="text-2xl font-semibold text-[#6B2D8B]">
                {formatCurrency(produto.preco)}
              </p>
            </div>
          )}

          {produto.descricao && (
            <div className="mt-6">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">Descrição</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{produto.descricao}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`https://wa.me/5511999999999?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#6B2D8B] hover:bg-[#9B2C8A] text-white text-center font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Solicitar Orçamento via WhatsApp
            </a>
            <Link
              href="/catalogo"
              className="text-center text-sm text-gray-500 hover:text-[#6B2D8B] transition-colors"
            >
              ← Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
