"use client";

import { useState } from "react";
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
          <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-[66px] mb-3">
            <rect x="38" y="0" width="4" height="12" rx="2" fill="#D4A017"/>
            <path d="M36 12 Q40 8 44 12" stroke="#D4A017" strokeWidth="2" fill="none"/>
            <path d="M22 14 Q40 10 58 14 L53 42 Q40 46 27 42 Z" fill="#D4A017"/>
            <path d="M27 42 Q40 46 53 42 L49 64 Q40 68 31 64 Z" fill="#D4A017" opacity="0.9"/>
            <path d="M31 64 Q40 68 49 64 L46 80 Q40 83 34 80 Z" fill="#D4A017" opacity="0.8"/>
            <line x1="32" y1="80" x2="30" y2="90" stroke="#D4A017" strokeWidth="1.5" opacity="0.9"/>
            <line x1="36" y1="82" x2="34" y2="94" stroke="#D4A017" strokeWidth="1.5" opacity="0.9"/>
            <line x1="40" y1="83" x2="40" y2="96" stroke="#D4A017" strokeWidth="1.5" opacity="0.9"/>
            <line x1="44" y1="82" x2="46" y2="94" stroke="#D4A017" strokeWidth="1.5" opacity="0.9"/>
            <line x1="48" y1="80" x2="50" y2="90" stroke="#D4A017" strokeWidth="1.5" opacity="0.9"/>
            <circle cx="30" cy="92" r="2" fill="#D4A017"/>
            <circle cx="34" cy="96" r="2" fill="#D4A017"/>
            <circle cx="40" cy="98" r="2" fill="#D4A017"/>
            <circle cx="46" cy="96" r="2" fill="#D4A017"/>
            <circle cx="50" cy="92" r="2" fill="#D4A017"/>
            <ellipse cx="40" cy="42" rx="13" ry="2" fill="#D4A017" opacity="0.6"/>
            <ellipse cx="40" cy="64" rx="9" ry="1.5" fill="#D4A017" opacity="0.6"/>
          </svg>
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
