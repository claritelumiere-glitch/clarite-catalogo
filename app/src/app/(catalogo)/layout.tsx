import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Catálogo", template: "%s | Clarité Lumière" },
  description: "Catálogo completo de iluminação premium — lustres, pendentes, arandelas e muito mais.",
};

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{ background: "linear-gradient(135deg, #4A1A6B 0%, #6B2D8B 35%, #9B2C8A 65%, #C2185B 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Clarité Lumière" width={36} height={48} className="object-contain" />
            <span
              className="font-serif font-bold text-white text-lg tracking-wide"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              CLARITÉ LUMIÈRE
            </span>
          </Link>

          <a
            href="https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20em%20solicitar%20um%20orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors border border-[#D4A017] hover:bg-[#D4A017]"
            style={{ color: "#D4A017" }}
          >
            Solicitar Orçamento
          </a>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="py-8 text-center"
        style={{ background: "linear-gradient(135deg, #2A0D3E 0%, #3D1A5A 100%)" }}
      >
        <p
          className="font-serif font-bold text-white text-base tracking-widest"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          CLARITÉ LUMIÈRE
        </p>
        <p
          className="text-xs mt-1 tracking-widest uppercase"
          style={{ color: "#D4A017" }}
        >
          Onde Qualidade e Sofisticação se Encontram
        </p>
      </footer>
    </div>
  );
}
