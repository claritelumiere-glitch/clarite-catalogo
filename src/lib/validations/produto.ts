import { z } from "zod";

export const produtoSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório").max(50).trim(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(200).trim(),
  categoria_id: z.string().uuid("Categoria inválida").nullable().optional(),
  descricao: z.string().max(5000).nullable().optional(),
  preco: z.coerce
    .number({ error: "Preço deve ser um número" })
    .positive("Preço deve ser positivo")
    .nullable()
    .optional(),
  ativo: z.boolean().default(true),
  destaque: z.boolean().default(false),
  estoque: z.coerce
    .number({ error: "Estoque deve ser um número" })
    .int("Estoque deve ser um número inteiro")
    .min(0, "Estoque não pode ser negativo")
    .default(0),
  caracteristicas: z.record(z.string(), z.string()).default({}),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;

// Validate image file
export function validateImageFile(file: File): string | null {
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Tipo de arquivo não permitido. Use JPG, PNG ou WebP.";
  }
  if (file.size > MAX_SIZE) {
    return "Arquivo muito grande. Tamanho máximo: 5MB.";
  }
  return null;
}
