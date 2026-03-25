"use client";

import { useState } from "react";
import { SeletorQuantidade } from "./SeletorQuantidade";
import { BotaoFavorito } from "./BotaoFavorito";

interface ProdutoDetalhesClientProps {
  produtoId: string;
  produtoNome: string;
  produtoCodigo: string;
  estoque: number;
}

export function ProdutoDetalhesClient({ produtoId, produtoNome, produtoCodigo, estoque }: ProdutoDetalhesClientProps) {
  const [quantidade, setQuantidade] = useState(1);
  const semEstoque = estoque <= 0;

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${produtoNome} (Cód: ${produtoCodigo})${
      !semEstoque ? ` — Quantidade: ${quantidade} unidade${quantidade > 1 ? "s" : ""}` : ""
    }`
  );

  return (
    <div>
      {/* Favorite button */}
      <div className="flex justify-end mb-2">
        <BotaoFavorito produtoId={produtoId} size="md" />
      </div>

      {/* Quantity selector */}
      <SeletorQuantidade estoque={estoque} onQuantidadeChange={setQuantidade} />

      {/* High Converting CTA */}
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
            className="group relative overflow-hidden w-full text-center font-bold uppercase tracking-[0.15em] py-4 px-6 rounded bg-gradient-brand text-white shadow-lg hover:shadow-[#6B2D8B]/40 animate-pulse-gold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
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
        
        {/* Trust Badges */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5">
          <div className="flex flex-col items-center text-center">
            <svg className="w-6 h-6 text-[#D4A017] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Garantia 1 Ano</span>
          </div>
          <div className="flex flex-col items-center text-center border-l border-r border-gray-100">
            <svg className="w-6 h-6 text-[#D4A017] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Compra Segura</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg className="w-6 h-6 text-[#D4A017] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Envio Rápido</span>
          </div>
        </div>
      </div>
    </div>
  );
}
