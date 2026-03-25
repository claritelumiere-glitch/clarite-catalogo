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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#FAFAFA]">
      <div className="absolute inset-0 bg-gradient-brand z-0 opacity-5 mask-image-b group-hover:opacity-10 transition-opacity"></div>
      
      <div className="relative z-10 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-sm p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <div className="w-16 h-20 relative mb-4 hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="Clarité Lumière" fill className="object-contain" priority />
            </div>
          </Link>
          <p className="font-serif font-bold text-2xl text-center text-[#6B2D8B] tracking-widest drop-shadow-sm">
            CLARITÉ
          </p>
          <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase text-center mt-2 font-medium">
            Acesso Exclusivo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all placeholder-gray-400"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <p className="text-red-500 text-xs text-center font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative overflow-hidden w-full text-center font-bold uppercase tracking-[0.15em] py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] text-white shadow-lg hover:shadow-[#6B2D8B]/40 transition-all duration-300 transform hover:-translate-y-0.5 mt-6"
          >
            <span className="relative z-10">{loading ? "Aguarde..." : (isLogin ? "Entrar" : "Criar Conta")}</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-xs text-gray-500 hover:text-[#D4A017] transition-colors font-medium border-b border-transparent hover:border-[#D4A017]"
          >
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Fazer login"}
          </button>
        </div>
      </div>
    </div>
  );
}
