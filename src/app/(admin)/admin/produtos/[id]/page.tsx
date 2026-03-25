/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { produtoSchema, validateImageFile } from "@/lib/validations/produto";
import type { Categoria, Produto } from "@/types/database";
import { EditorCaracteristicas } from "@/components/admin/EditorCaracteristicas";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarProdutoPage({ params }: PageProps) {
  const router = useRouter();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagensUrls, setImagensUrls] = useState<string[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<Record<string, string>>({});
  const [produtoId, setProdutoId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setProdutoId(id));
  }, [params]);

  useEffect(() => {
    if (!produtoId) return;

    const supabase = createClient();

    Promise.all([
      supabase.from("produtos").select("*").eq("id", produtoId).single(),
      supabase.from("categorias").select("*").eq("ativo", true).order("nome"),
    ]).then(([{ data: produtoData }, { data: categoriasData }]) => {
      if (produtoData) {
        const p = produtoData as unknown as Produto;
        setProduto(p);
        setImagensUrls(p.imagens ?? []);
        setCaracteristicas((p.caracteristicas as Record<string, string>) ?? {});
      }
      setCategorias((categoriasData ?? []) as unknown as Categoria[]);
      setLoadingData(false);
    });
  }, [produtoId]);

  async function handleImageUpload(files: FileList) {
    setUploadingImages(true);
    setError(null);

    const fileArray = Array.from(files);

    // Validate all files first before uploading any
    for (const file of fileArray) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        setUploadingImages(false);
        return;
      }
    }

    const supabase = createClient();

    for (const file of fileArray) {
      const ext = file.name.split(".").pop();
      const fileName = `produtos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("imagens")
        .upload(fileName, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) {
        setError(`Erro ao fazer upload de "${file.name}": ${uploadError.message}`);
        setUploadingImages(false);
        return;
      }

      const { data } = supabase.storage.from("imagens").getPublicUrl(fileName);
      setImagensUrls((prev) => [...prev, data.publicUrl]);
    }

    setUploadingImages(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = produtoSchema.safeParse({
      codigo: formData.get("codigo"),
      nome: formData.get("nome"),
      categoria_id: formData.get("categoria_id") || null,
      descricao: formData.get("descricao") || null,
      preco: formData.get("preco") || null,
      ativo: formData.get("ativo") === "on",
      destaque: formData.get("destaque") === "on",
      estoque: formData.get("estoque") || 0,
      caracteristicas,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const slug = slugify(result.data.nome);

    const { error: updateError } = await (supabase.from("produtos") as any)
      .update({
        ...result.data,
        slug,
        imagens: imagensUrls,
      })
      .eq("id", produtoId!);

    if (updateError) {
      if (updateError.code === "23505") {
        setError("Já existe um produto com este código ou nome.");
      } else {
        setError("Erro ao salvar produto. Tente novamente.");
      }
      setLoading(false);
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) {
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("produtos")
      .delete()
      .eq("id", produtoId!);

    if (deleteError) {
      setError("Erro ao excluir produto. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  if (loadingData) {
    return (
      <div className="max-w-2xl">
        <div className="text-gray-400 text-sm">Carregando produto...</div>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="max-w-2xl">
        <div className="text-gray-500 text-sm">Produto não encontrado.</div>
        <button onClick={() => router.back()} className="mt-4 text-[#6B2D8B] hover:underline text-sm">
          ← Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-sm">← Voltar</button>
          <h1 className="font-serif text-2xl text-gray-900 font-semibold">Editar Produto</h1>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-60 transition-colors"
        >
          Excluir produto
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Código */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Código *</label>
          <input
            name="codigo"
            type="text"
            required
            maxLength={50}
            defaultValue={produto.codigo}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
            placeholder="Ex: LUS-001"
          />
        </div>

        {/* Nome */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
          <input
            name="nome"
            type="text"
            required
            maxLength={200}
            defaultValue={produto.nome}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
            placeholder="Nome do produto"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
          <select
            name="categoria_id"
            defaultValue={produto.categoria_id ?? ""}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
          >
            <option value="">Sem categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        {/* Preço */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Preço (R$)</label>
          <input
            name="preco"
            type="number"
            step="0.01"
            min="0"
            defaultValue={produto.preco ?? ""}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
            placeholder="0,00"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
          <textarea
            name="descricao"
            rows={4}
            maxLength={5000}
            defaultValue={produto.descricao ?? ""}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors resize-none"
            placeholder="Descrição do produto..."
          />
        </div>

        {/* Estoque */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Estoque (unidades)</label>
          <input
            name="estoque"
            type="number"
            step="1"
            min="0"
            defaultValue={produto.estoque ?? 0}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2D8B] transition-colors"
            placeholder="0"
          />
          <p className="text-xs text-gray-400 mt-1">Deixe 0 para marcar como esgotado/indisponivel</p>
        </div>

        {/* Caracteristicas */}
        <EditorCaracteristicas valor={caracteristicas} onChange={setCaracteristicas} />

        {/* Images */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Imagens (JPG, PNG ou WebP — max. 5MB cada)
          </label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#6B2D8B] file:text-white hover:file:bg-[#9B2C8A] file:cursor-pointer"
          />
          {uploadingImages && <p className="text-xs text-gray-400 mt-1">Fazendo upload...</p>}
          {imagensUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagensUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded border border-gray-200 overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagensUrls((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs rounded-bl"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="ativo"
              defaultChecked={produto.ativo}
              className="w-4 h-4 accent-[#6B2D8B]"
            />
            Produto ativo
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="destaque"
              defaultChecked={produto.destaque}
              className="w-4 h-4 accent-[#6B2D8B]"
            />
            Destaque
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="bg-[#6B2D8B] hover:bg-[#9B2C8A] disabled:opacity-60 text-white font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-200 text-gray-600 hover:border-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
