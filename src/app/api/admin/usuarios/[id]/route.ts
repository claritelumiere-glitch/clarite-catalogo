import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

/** PATCH /api/admin/usuarios/[id] — toggle admin role */
export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

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

  // Prevent removing own admin access
  if (id === user.id) {
    return NextResponse.json(
      { error: "Você não pode remover seu próprio acesso admin" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const newRole = body.is_admin ? "admin" : "user";

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(id, {
    app_metadata: { role: newRole },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, role: newRole });
}
