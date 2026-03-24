import Link from "next/link";
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
            {/* Chandelier icon */}
            <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-11">
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
