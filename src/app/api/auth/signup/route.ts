import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: result.data.email,
    password: result.data.password,
    email_confirm: true, // confirma o email automaticamente, sem enviar email
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return NextResponse.json({ error: "Este email já está cadastrado." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro ao criar conta. Tente novamente." }, { status: 500 });
  }

  return NextResponse.json({ id: data.user?.id }, { status: 201 });
}
