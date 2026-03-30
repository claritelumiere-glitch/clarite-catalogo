import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/** GET /api/admin/usuarios — list all auth users */
export async function GET() {
  // Verify the requesting user is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) {
    return NextResponse.json({ error: "Acesso restrito a administradores" }, { status: 403 });
  }

  // Use admin client to list all users
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const usuarios = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    is_admin: u.app_metadata?.role === "admin",
  }));

  return NextResponse.json(usuarios);
}
