import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function AdminSidebar() {
  return (
    <aside className="w-56 bg-[#6B2D8B] min-h-screen flex flex-col">
      <div className="p-5 border-b border-white/10">
        <p className="text-white font-serif text-base font-semibold">Clarité Lumière</p>
        <p className="text-white/50 text-xs mt-0.5">Painel Admin</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/produtos", label: "Produtos" },
          { href: "/admin/categorias", label: "Categorias" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-3 py-2 rounded text-white/80 hover:bg-white/10 hover:text-white text-sm transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
