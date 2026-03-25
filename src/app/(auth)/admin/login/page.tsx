"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    const { error: authError } = await supabase.auth.signInWithPassword(result.data);

    if (authError) {
      // Generic error message — don't reveal if email exists
      setError("Email ou senha incorretos. Verifique suas credenciais.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #4A1A6B 0%, #6B2D8B 35%, #9B2C8A 65%, #C2185B 100%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Clarité Lumière" width={60} height={80} className="object-contain mb-3" />
          <p
            className="font-serif font-bold text-2xl text-center"
            style={{ color: "#6B2D8B", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Clarité Lumière
          </p>
          <p className="text-gray-400 text-sm text-center mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2D8B] focus:ring-1 focus:ring-[#6B2D8B] transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2D8B] focus:ring-1 focus:ring-[#6B2D8B] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full disabled:opacity-60 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm mt-2"
            style={{ backgroundColor: "#6B2D8B" }}
            onMouseEnter={(e) => { (e.currentTarget.style.backgroundColor = "#9B2C8A"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.backgroundColor = "#6B2D8B"); }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
