"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export default function ClientLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    if (isLogin) {
      const { error: authError } = await supabase.auth.signInWithPassword(result.data);
      if (authError) {
        setError("Email ou senha incorretos.");
        setLoading(false);
        return;
      }
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/catalogo");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] z-0 opacity-95"></div>
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Subtle gold particles effect */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(1px_1px_at_20px_30px,rgba(212,160,23,0.4)_1px,transparent_0),radial-gradient(1px_1px_at_40px_70px,rgba(232,197,71,0.3)_1px,transparent_0),radial-gradient(1px_1px_at_80px_10px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[size:100px_100px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 glassmorphism bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-sm p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <div className="w-16 h-20 relative mb-4 hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="Clarité Lumière" fill className="object-contain" priority />
            </div>
          </Link>
          <p className="font-serif font-bold text-2xl text-center text-gradient-gold tracking-widest drop-shadow-md">
            CLARITÉ LUMIÈRE
          </p>
          <p className="text-gray-300 text-xs tracking-[0.2em] uppercase text-center mt-2 font-light">
            Acesso Exclusivo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-300 uppercase tracking-widest mb-1.5 ml-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all placeholder-gray-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-300 uppercase tracking-widest mb-1.5 ml-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-200 text-xs text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative overflow-hidden w-full text-center font-bold uppercase tracking-[0.15em] py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] text-white shadow-lg hover:shadow-purple-dark/50 transition-all duration-300 transform hover:-translate-y-1 mt-6 border border-white/10"
          >
            <span className="relative z-10">{loading ? "Aguarde..." : (isLogin ? "Entrar" : "Criar Conta")}</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-xs text-gray-300 hover:text-[#D4A017] transition-colors font-medium border-b border-transparent hover:border-[#D4A017]"
          >
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Fazer login"}
          </button>
        </div>
      </div>
    </div>
  );
}
