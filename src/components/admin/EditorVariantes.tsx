/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface VarianteLocal {
  id?: string;
  nome: string;
  codigo: string;
  preco: string;
  estoque: number;
  ativo: boolean;
  ordem: number;
  imagem: string | null;
}

interface EditorVariantesProps {
  produtoId?: string; // se fornecido, salva no banco diretamente
  onChange?: (variantes: VarianteLocal[]) => void; // para novo produto (state only)
}

const vazia = (ordem: number): VarianteLocal => ({
  nome: "",
  codigo: "",
  preco: "",
  estoque: 0,
  ativo: true,
  ordem,
  imagem: null,
});

export function EditorVariantes({ produtoId, onChange }: EditorVariantesProps) {
  const [variantes, setVariantes] = useState<VarianteLocal[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carrega variantes do banco se estiver editando um produto existente
  useEffect(() => {
    if (!produtoId) return;
    const supabase = createClient();
    supabase
      .from("produto_variantes")
      .select("*")
      .eq("produto_id", produtoId)
      .order("ordem")
      .then(({ data }) => {
        if (data) {
          setVariantes(
            data.map((v: any) => ({
              id: v.id,
              nome: v.nome,
              codigo: v.codigo,
              preco: v.preco != null ? String(v.preco) : "",
              estoque: v.estoque,
              ativo: v.ativo,
              ordem: v.ordem,
              imagem: v.imagem ?? null,
            }))
          );
        }
      });
  }, [produtoId]);

  async function uploadImagem(index: number, file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Arquivo precisa ser uma imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem maior que 5MB.");
      return;
    }
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `variantes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("imagens")
      .upload(fileName, file, { cacheControl: "31536000", upsert: false });
    if (uploadError) {
      setError(`Erro ao fazer upload: ${uploadError.message}`);
      return;
    }
    const { data } = supabase.storage.from("imagens").getPublicUrl(fileName);
    update(index, "imagem", data.publicUrl);
  }

  function update(index: number, field: keyof VarianteLocal, value: string | number | boolean | null) {
    const updated = variantes.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    setVariantes(updated);
    onChange?.(updated);
  }

  function adicionar() {
    const updated = [...variantes, vazia(variantes.length)];
    setVariantes(updated);
    onChange?.(updated);
  }

  async function salvarVariante(index: number) {
    if (!produtoId) return;
    const v = variantes[index];
    if (!v.nome.trim() || !v.codigo.trim()) {
      setError("Nome e código são obrigatórios.");
      return;
    }
    setError(null);
    setSavingId(v.id ?? `new-${index}`);

    const supabase = createClient();
    const payload = {
      produto_id: produtoId,
      nome: v.nome.trim(),
      codigo: v.codigo.trim(),
      preco: v.preco ? parseFloat(v.preco) : null,
      estoque: v.estoque,
      ativo: v.ativo,
      ordem: index,
      imagem: v.imagem,
    };

    if (v.id) {
      await (supabase.from("produto_variantes") as any).update(payload).eq("id", v.id);
    } else {
      const { data } = await (supabase.from("produto_variantes") as any)
        .insert(payload)
        .select()
        .single();
      if (data) {
        const updated = variantes.map((item, i) =>
          i === index ? { ...item, id: data.id } : item
        );
        setVariantes(updated);
        onChange?.(updated);
      }
    }
    setSavingId(null);
  }

  async function excluirVariante(index: number) {
    const v = variantes[index];
    if (v.id && produtoId) {
      if (!window.confirm("Excluir esta variante?")) return;
      setLoading(true);
      const supabase = createClient();
      await supabase.from("produto_variantes").delete().eq("id", v.id);
      setLoading(false);
    }
    const updated = variantes.filter((_, i) => i !== index);
    setVariantes(updated);
    onChange?.(updated);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-600">
            Variantes (modelos/wattagens)
          </label>
          <p className="text-xs text-gray-400 mt-0.5">
            Ex: 50W, 100W, 200W — cada uma com código, preço e estoque próprios
          </p>
        </div>
        <button
          type="button"
          onClick={adicionar}
          className="text-xs bg-[#6B2D8B] text-white px-3 py-1.5 rounded-lg hover:bg-[#9B2C8A] transition-colors"
        >
          + Adicionar
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      {variantes.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-lg px-4 py-5 text-center text-xs text-gray-400">
          Nenhuma variante. Clique em "+ Adicionar" para criar modelos diferentes do mesmo produto.
        </div>
      ) : (
        <div className="space-y-3">
          {variantes.map((v, i) => (
            <div key={v.id ?? i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Nome da variante */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={v.nome}
                    onChange={(e) => update(i, "nome", e.target.value)}
                    placeholder="Ex: 50W"
                    maxLength={100}
                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#6B2D8B] bg-white"
                  />
                </div>
                {/* Código */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Código *</label>
                  <input
                    type="text"
                    value={v.codigo}
                    onChange={(e) => update(i, "codigo", e.target.value)}
                    placeholder="Ex: REF-50W"
                    maxLength={50}
                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#6B2D8B] bg-white"
                  />
                </div>
                {/* Preço */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={v.preco}
                    onChange={(e) => update(i, "preco", e.target.value)}
                    placeholder="0,00"
                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#6B2D8B] bg-white"
                  />
                </div>
                {/* Estoque */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">Estoque</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={v.estoque}
                    onChange={(e) => update(i, "estoque", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#6B2D8B] bg-white"
                  />
                </div>
              </div>

              {/* Imagem da variante */}
              <div className="mb-3">
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Imagem da variante</label>
                <div className="flex items-center gap-3">
                  {v.imagem ? (
                    <div className="relative w-16 h-16 rounded border border-gray-200 overflow-hidden bg-white flex-shrink-0">
                      <img src={v.imagem} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => update(i, "imagem", null)}
                        className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs rounded-bl"
                        aria-label="Remover imagem"
                      >×</button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded border border-dashed border-gray-300 bg-white flex items-center justify-center text-[10px] text-gray-400 flex-shrink-0">
                      Sem foto
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImagem(i, f);
                      e.target.value = "";
                    }}
                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-[#6B2D8B] file:text-white hover:file:bg-[#9B2C8A] file:cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={v.ativo}
                    onChange={(e) => update(i, "ativo", e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#6B2D8B]"
                  />
                  Ativa
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => excluirVariante(i)}
                    disabled={loading}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                  {produtoId && (
                    <button
                      type="button"
                      onClick={() => salvarVariante(i)}
                      disabled={savingId !== null}
                      className="text-xs bg-[#6B2D8B] text-white px-3 py-1 rounded hover:bg-[#9B2C8A] disabled:opacity-60 transition-colors"
                    >
                      {savingId === (v.id ?? `new-${i}`) ? "Salvando..." : "Salvar"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
