"use client";

import { useState, useEffect } from "react";

interface Usuario {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function loadUsuarios() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/usuarios");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao carregar usuários");
      }
      const data: Usuario[] = await res.json();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  async function toggleAdmin(id: string, currentlyAdmin: boolean) {
    setToggling(id);
    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_admin: !currentlyAdmin }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar");
      }

      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_admin: !currentlyAdmin } : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setToggling(null);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "Nunca";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Gerenciar Usuários</h1>
          <p className="text-gray-500 text-sm mt-1">
            Controle de acesso ao painel administrativo
          </p>
        </div>
        <button
          onClick={loadUsuarios}
          disabled={loading}
          className="text-sm text-gray-500 hover:text-[#6B2D8B] transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#6B2D8B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Usuário
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Criado em
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Último acesso
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Acesso Admin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                    Nenhum usuário cadastrado
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B2D8B] to-[#C2185B] flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{u.email}</p>
                          <p className="text-xs text-gray-400 font-mono">{u.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(u.last_sign_in_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAdmin(u.id, u.is_admin)}
                        disabled={toggling === u.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B2D8B]/30 focus:ring-offset-2 ${
                          u.is_admin ? "bg-[#6B2D8B]" : "bg-gray-300"
                        } ${toggling === u.id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            u.is_admin ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <p className={`text-xs mt-1 font-medium ${u.is_admin ? "text-[#6B2D8B]" : "text-gray-400"}`}>
                        {u.is_admin ? "Admin" : "Usuário"}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Nota:</strong> Apenas administradores podem acessar o painel admin.
        Você não pode remover seu próprio acesso.
      </div>
    </div>
  );
}
