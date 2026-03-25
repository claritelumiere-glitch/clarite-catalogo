"use client";

import { useState } from "react";

interface EditorCaracteristicasProps {
  valor: Record<string, string>;
  onChange: (valor: Record<string, string>) => void;
}

export function EditorCaracteristicas({ valor, onChange }: EditorCaracteristicasProps) {
  const [novaChave, setNovaChave] = useState("");
  const [novoValor, setNovoValor] = useState("");

  const entries = Object.entries(valor);

  function adicionar() {
    const chave = novaChave.trim();
    const val = novoValor.trim();
    if (!chave || !val) return;
    onChange({ ...valor, [chave]: val });
    setNovaChave("");
    setNovoValor("");
  }

  function remover(chave: string) {
    const next = { ...valor };
    delete next[chave];
    onChange(next);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Caracteristicas do Produto
      </label>
      <p className="text-xs text-gray-400 mb-3">Ex: Material → Cristal, Voltagem → Bivolt, Dimensoes → 60x40cm</p>

      {/* Existing entries */}
      {entries.length > 0 && (
        <div className="space-y-1 mb-3">
          {entries.map(([chave, val]) => (
            <div key={chave} className="flex items-center gap-2 bg-gray-50 rounded px-3 py-1.5 text-sm">
              <span className="font-medium text-gray-700">{chave}:</span>
              <span className="text-gray-600 flex-1">{val}</span>
              <button
                type="button"
                onClick={() => remover(chave)}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                remover
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      <div className="flex gap-2">
        <input
          type="text"
          value={novaChave}
          onChange={(e) => setNovaChave(e.target.value)}
          placeholder="Nome (ex: Material)"
          maxLength={100}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
        />
        <input
          type="text"
          value={novoValor}
          onChange={(e) => setNovoValor(e.target.value)}
          placeholder="Valor (ex: Cristal)"
          maxLength={200}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionar(); } }}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
        />
        <button
          type="button"
          onClick={adicionar}
          disabled={!novaChave.trim() || !novoValor.trim()}
          className="bg-[#6B2D8B] hover:bg-[#9B2C8A] disabled:opacity-40 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
