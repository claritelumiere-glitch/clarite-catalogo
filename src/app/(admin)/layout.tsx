import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function AdminSidebar() {
  return (
    <aside className="w-64 bg-[#2A0D3E] min-h-screen flex flex-col relative overflow-hidden shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] opacity-20 z-0 mix-blend-screen pointer-events-none"></div>
      
      <div className="p-8 border-b border-white/5 relative z-10 flex flex-col items-center">
        <Link href="/" className="group mb-2 block">
           <p className="text-gradient-gold font-serif text-xl font-bold tracking-[0.2em] transform group-hover:scale-105 transition-transform duration-300">
            CLARITÉ
          </p>
        </Link>
        <div className="h-px w-10 bg-[#D4A017]/50 mb-2"></div>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest">Painel Admin</p>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
        {[
          { href: "/admin/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { href: "/admin/produtos", label: "Produtos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
          { href: "/admin/categorias", label: "Categorias", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
          { href: "/admin/usuarios", label: "Usuários", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-[#D4A017] text-sm transition-all duration-300 group"
          >
            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            <span className="font-medium tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/5 relative z-10">
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-red-400 text-sm transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium tracking-wide">Deslogar Seguramente</span>
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
    <div className="flex min-h-screen bg-[#F5F5F5] font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
