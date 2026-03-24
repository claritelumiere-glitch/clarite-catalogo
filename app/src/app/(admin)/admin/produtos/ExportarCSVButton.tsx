"use client";

import { useState } from "react";

export function ExportarCSVButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/exportar-csv");
      if (!response.ok) {
        alert("Erro ao exportar CSV. Verifique se você está autenticado.");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.download = match ? match[1] : "clarite-produtos.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="border border-gray-200 hover:border-[#6B2D8B] text-gray-600 hover:text-[#6B2D8B] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
    >
      {loading ? "Exportando..." : "Exportar CSV"}
    </button>
  );
}
