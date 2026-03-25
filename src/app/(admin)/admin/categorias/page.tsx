/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Categoria } from "@/types/database";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renameSaving, setRenameSaving] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("categorias").select("*").order("ordem").order("nome");
    setCategorias((data ?? []) as Categoria[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!novaCategoria.trim()) return;
    setSaving(true);
    setError(null);

    const { error } = await (supabase.from("categorias") as any).insert({
      nome: novaCategoria.trim(),
      slug: slugify(novaCategoria.trim()),
    });

    if (error) {
      setError(
        error.code === "23505"
          ? "Já existe uma categoria com este nome."
          : "Erro ao criar categoria."
      );
    } else {
      setNovaCategoria("");
      await load();
    }
    setSaving(false);
  }

  async function toggleAtivo(cat: Categoria) {
    await (supabase.from("categorias") as any).update({ ativo: !cat.ativo }).eq("id", cat.id);
    await load();
  }

  function startRename(cat: Categoria) {
    setRenamingId(cat.id);
    setRenameValue(cat.nome);
    setRenameError(null);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameValue("");
    setRenameError(null);
  }

  async function saveRename(cat: Categoria) {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === cat.nome) {
      cancelRename();
      return;
    }

    setRenameSaving(true);
    setRenameError(null);

    const newSlug = slugify(trimmed);
    const { error } = await (supabase.from("categorias") as any)
      .update({ nome: trimmed, slug: newSlug })
      .eq("id", cat.id);

    if (error) {
      setRenameError(
        error.code === "23505"
          ? "Já existe uma categoria com este nome."
          : "Erro ao renomear categoria."
      );
      setRenameSaving(false);
      return;
    }

    setRenamingId(null);
    setRenameValue("");
    setRenameSaving(false);
    await load();
  }

  function handleRenameKeyDown(e: React.KeyboardEvent, cat: Categoria) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRename(cat);
    } else if (e.key === "Escape") {
      cancelRename();
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-gray-900 font-semibold mb-6">Categorias</h1>

      {/* Create */}
      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nome da nova categoria..."
          maxLength={100}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
        />
        <button
          type="submit"
          disabled={saving || !novaCategoria.trim()}
          className="bg-[#6B2D8B] hover:bg-[#9B2C8A] disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {saving ? "..." : "+ Criar"}
        </button>
      </form>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      {loading ? (
        <div className="text-gray-400 text-sm">Carregando...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {categorias.map((cat, i) => (
            <div
              key={cat.id}
              className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}
            >
              <div className="flex-1 min-w-0 mr-3">
                {renamingId === cat.id ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, cat)}
                        maxLength={100}
                        disabled={renameSaving}
                        className="border border-[#6B2D8B] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#6B2D8B] w-48"
                      />
                      <button
                        onClick={() => saveRename(cat)}
                        disabled={renameSaving || !renameValue.trim()}
                        className="text-xs bg-[#6B2D8B] text-white px-2 py-1 rounded hover:bg-[#9B2C8A] disabled:opacity-60 transition-colors"
                      >
                        {renameSaving ? "..." : "OK"}
                      </button>
                      <button
                        onClick={cancelRename}
                        disabled={renameSaving}
                        className="text-xs text-gray-500 hover:text-gray-800 px-1"
                      >
                        ✕
                      </button>
                    </div>
                    {renameError && (
                      <p className="text-red-500 text-xs mt-1">{renameError}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Novo slug: {slugify(renameValue.trim() || cat.nome)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{cat.nome}</p>
                    <p className="text-xs text-gray-400">{cat.slug}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {renamingId !== cat.id && (
                  <button
                    onClick={() => startRename(cat)}
                    className="text-xs text-gray-400 hover:text-[#6B2D8B] transition-colors px-2 py-1 rounded border border-gray-200 hover:border-[#6B2D8B]"
                    title="Renomear"
                  >
                    ✏️ Renomear
                  </button>
                )}
                <button
                  onClick={() => toggleAtivo(cat)}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    cat.ativo
                      ? "bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600"
                      : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {cat.ativo ? "Ativa" : "Inativa"}
                </button>
              </div>
            </div>
          ))}
          {categorias.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              Nenhuma categoria cadastrada
            </div>
          )}
        </div>
      )}
    </div>
  );
}
