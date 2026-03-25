/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // Verify authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: produtos } = await supabase
    .from("produtos")
    .select("codigo, nome, categorias(nome), preco, descricao, ativo, destaque, created_at")
    .order("nome");

  if (!produtos) return NextResponse.json({ error: "Error fetching" }, { status: 500 });

  const headers = [
    "Código",
    "Nome",
    "Categoria",
    "Preço",
    "Descrição",
    "Ativo",
    "Destaque",
    "Criado em",
  ];

  const rows = produtos.map((p: any) => [
    p.codigo,
    p.nome,
    p.categorias?.nome ?? "",
    p.preco ?? "",
    (p.descricao ?? "").replace(/\n/g, " "),
    p.ativo ? "Sim" : "Não",
    p.destaque ? "Sim" : "Não",
    new Date(p.created_at).toLocaleDateString("pt-BR"),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clarite-produtos-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
