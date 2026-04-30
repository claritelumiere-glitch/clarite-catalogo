"use client";

import { useState } from "react";
import { SeletorQuantidade } from "./SeletorQuantidade";
import { BotaoFavorito } from "./BotaoFavorito";
import { formatCurrency } from "@/lib/utils";
import type { ProdutoVariante } from "@/types/database";

interface ProdutoDetalhesClientProps {
  produtoId: string;
  produtoNome: string;
  produtoCodigo: string;
  estoque: number;
  preco?: number | null;
  variantes?: ProdutoVariante[];
  varianteSelecionada?: ProdutoVariante | null;
  onVarianteChange?: (v: ProdutoVariante) => void;
}

export function ProdutoDetalhesClient({
  produtoId,
  produtoNome,
  produtoCodigo,
  estoque,
  preco,
  variantes = [],
  varianteSelecionada: varianteControlada,
  onVarianteChange,
}: ProdutoDetalhesClientProps) {
  const temVariantes = variantes.length > 0;
  const varianteInicial = temVariantes
    ? (variantes.filter(v => v.estoque > 0 && v.preco != null).sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0))[0] ?? variantes[0])
    : null;
  const [varianteInternaState, setVarianteInternaState] = useState<ProdutoVariante | null>(varianteInicial);
  const varianteSelecionada = varianteControlada !== undefined ? varianteControlada : varianteInternaState;
  const setVarianteSelecionada = (v: ProdutoVariante) => {
    if (onVarianteChange) onVarianteChange(v);
    else setVarianteInternaState(v);
  };
  const [quantidade, setQuantidade] = useState(1);

  const estoqueAtivo = temVariantes ? (varianteSelecionada?.estoque ?? 0) : estoque;
  const precoAtivo = temVariantes ? varianteSelecionada?.preco : preco;
  const codigoAtivo = temVariantes ? (varianteSelecionada?.codigo ?? produtoCodigo) : produtoCodigo;
  const semEstoque = estoqueAtivo <= 0;

  const nomeVariante = varianteSelecionada ? ` — ${varianteSelecionada.nome}` : "";
  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${produtoNome}${nomeVariante} (Cód: ${codigoAtivo})${
      !semEstoque ? ` — Quantidade: ${quantidade} unidade${quantidade > 1 ? "s" : ""}` : ""
    }`
  );

  return (
    <div>
      {/* Seletor de variantes */}
      {temVariantes && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Modelo
          </p>
          <div className="flex flex-wrap gap-2">
            {variantes.map((v) => {
              const selecionada = varianteSelecionada?.id === v.id;
              const esgotada = v.estoque <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVarianteSelecionada(v);
                    setQuantidade(1);
                  }}
                  disabled={esgotada}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    selecionada
                      ? "border-[#6B2D8B] bg-[#6B2D8B] text-white shadow-md"
                      : esgotada
                      ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                      : "border-gray-200 text-gray-700 hover:border-[#6B2D8B] hover:text-[#6B2D8B]"
                  }`}
                >
                  {v.nome}
                  {esgotada && <span className="ml-1 text-[10px] font-normal">(esgotado)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preço da variante selecionada */}
      {temVariantes && (
        <div className="mb-5">
          {precoAtivo ? (
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-[#6B2D8B]">{formatCurrency(precoAtivo)}</p>
              <p className="text-sm text-gray-500 font-medium">à vista</p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-[#D4A017] uppercase tracking-widest">
              Sob Consulta
            </p>
          )}
        </div>
      )}

      {/* Favorito */}
      <div className="flex justify-end mb-2">
        <BotaoFavorito produtoId={produtoId} size="md" />
      </div>

      {/* Seletor de quantidade */}
      <SeletorQuantidade estoque={estoqueAtivo} onQuantidadeChange={setQuantidade} />

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-4">
        {semEstoque ? (
          <button
            disabled
            className="w-full text-center font-bold uppercase tracking-[0.2em] py-4 px-6 rounded bg-gray-200 text-gray-400 cursor-not-allowed"
          >
            Indisponível no Momento
          </button>
        ) : (
          <a
            href={`https://wa.me/5511999999999?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden w-full text-center font-bold uppercase tracking-[0.15em] py-4 px-6 rounded bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] text-white shadow-lg hover:shadow-[#6B2D8B]/40 animate-pulse-gold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.06-.301-.15-1.265-.462-2.406-1.472-.887-.788-1.488-1.761-1.659-2.061-.175-.301-.018-.461.132-.614.135-.136.301-.345.451-.523.146-.176.196-.301.296-.5s.049-.379-.026-.528c-.075-.15-.673-1.62-.922-2.216-.241-.58-.485-.503-.668-.511-.176-.008-.376-.008-.576-.008-.2 0-.523.076-.798.375-.274.3-1.045 1.018-1.045 2.484 0 1.467 1.07 2.883 1.22 3.082.146.197 2.103 3.197 5.093 4.484.713.308 1.269.493 1.704.63.714.227 1.365.195 1.88.118.574-.085 1.767-.714 2.016-1.406.249-.694.249-1.282.175-1.406-.075-.124-.275-.197-.576-.347zm4.5 7.618H2v-22h20v22zm-10-20c-4.971 0-9 4.029-9 9 0 1.948.625 3.754 1.684 5.216l-1.184 4.318 4.417-1.159c1.407.973 3.111 1.541 4.945 1.541 4.972 0 9-4.029 9-9s-4.028-9-9-9z"/>
              </svg>
              Solicitar Orçamento
            </span>
            <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
          </a>
        )}
      </div>
    </div>
  );
}
