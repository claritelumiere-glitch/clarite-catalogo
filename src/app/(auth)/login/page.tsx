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
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      // Usa rota de API com service role para criar usuário já confirmado (sem email)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.data.email, password: result.data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Erro ao criar conta.");
        setLoading(false);
        return;
      }
      // Faz login automaticamente após cadastro
      const { error: loginError } = await supabase.auth.signInWithPassword(result.data);
      if (loginError) {
        setError("Conta criada! Agora faça login.");
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

      <div className="relative z-10 bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-10">
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
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 pr-11 text-sm text-white focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4A017] transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
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
            <span className="relative z-10">{loading ? "Aguarde..." : (isLogin ? "Entrar" : "Criar Conta Grátis")}</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-xs text-gray-300 hover:text-[#D4A017] transition-colors font-medium border-b border-transparent hover:border-[#D4A017]"
          >
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Fazer Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
