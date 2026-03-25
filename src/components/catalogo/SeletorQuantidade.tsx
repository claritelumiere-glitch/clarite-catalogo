"use client";

import { useState } from "react";

interface SeletorQuantidadeProps {
  estoque: number;
  onQuantidadeChange: (qtd: number) => void;
}

export function SeletorQuantidade({ estoque, onQuantidadeChange }: SeletorQuantidadeProps) {
  const [quantidade, setQuantidade] = useState(1);
  const semEstoque = estoque <= 0;

  function alterar(novaQtd: number) {
    const qtd = Math.max(1, Math.min(novaQtd, estoque));
    setQuantidade(qtd);
    onQuantidadeChange(qtd);
  }

  if (semEstoque) {
    return (
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">Quantidade</p>
        <div className="inline-flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
          <span className="text-sm text-red-500 font-medium">Produto indisponivel no momento</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">Quantidade</p>
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => alterar(quantidade - 1)}
            disabled={quantidade <= 1}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Diminuir quantidade"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd"/>
            </svg>
          </button>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) alterar(val);
            }}
            min={1}
            max={estoque}
            className="w-14 h-10 text-center text-sm font-medium border-x border-gray-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => alterar(quantidade + 1)}
            disabled={quantidade >= estoque}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Aumentar quantidade"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
            </svg>
          </button>
        </div>
        <span className="text-xs text-gray-400">
          {estoque} {estoque === 1 ? "disponivel" : "disponiveis"} em estoque
        </span>
      </div>
    </div>
  );
}
