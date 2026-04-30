"use client";

import { useState, type ReactNode } from "react";
import { GaleriaImagens } from "./GaleriaImagens";
import { ProdutoDetalhesClient } from "./ProdutoDetalhesClient";
import type { ProdutoVariante } from "@/types/database";

interface ProdutoViewProps {
  imagensProduto: string[];
  nomeAlt: string;
  variantes: ProdutoVariante[];
  mostrarPreco: boolean;
  produtoId: string;
  produtoNome: string;
  produtoCodigo: string;
  estoque: number;
  preco?: number | null;
  infoTopo: ReactNode;
}

export function ProdutoView({
  imagensProduto,
  nomeAlt,
  variantes,
  mostrarPreco,
  produtoId,
  produtoNome,
  produtoCodigo,
  estoque,
  preco,
  infoTopo,
}: ProdutoViewProps) {
  const temVariantes = variantes.length > 0;
  const varianteInicial = temVariantes
    ? (variantes.filter(v => v.estoque > 0 && v.preco != null).sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0))[0] ?? variantes[0])
    : null;
  const [varianteSelecionada, setVarianteSelecionada] = useState<ProdutoVariante | null>(varianteInicial);

  const imagensExibir = (() => {
    if (varianteSelecionada?.imagem) {
      const restantes = imagensProduto.filter(img => img !== varianteSelecionada.imagem);
      return [varianteSelecionada.imagem, ...restantes];
    }
    return imagensProduto;
  })();

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <GaleriaImagens
        key={varianteSelecionada?.imagem ?? "padrao"}
        imagens={imagensExibir}
        nomeAlt={nomeAlt}
      />
      <div className="flex flex-col">
        {infoTopo}
        {mostrarPreco && (
          <ProdutoDetalhesClient
            produtoId={produtoId}
            produtoNome={produtoNome}
            produtoCodigo={produtoCodigo}
            estoque={estoque}
            preco={preco}
            variantes={temVariantes ? variantes : undefined}
            varianteSelecionada={varianteSelecionada}
            onVarianteChange={setVarianteSelecionada}
          />
        )}
      </div>
    </div>
  );
}
