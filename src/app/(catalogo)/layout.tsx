import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { LinkFavoritos } from "@/components/catalogo/LinkFavoritos";

export const metadata: Metadata = {
  title: { default: "Catálogo", template: "%s | Clarité Lumière" },
  description: "Catálogo completo de iluminação premium — lustres, pendentes, arandelas e muito mais.",
};

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Header Premium Glassmorphism */}
      <header className="sticky top-0 z-50 glassmorphism transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-12 overflow-hidden">
              <Image src="/logo.png" alt="Clarité Lumière" fill className="object-contain transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-[#6B2D8B] text-xl tracking-widest leading-none group-hover:text-gradient-gold transition-all duration-300">
                CLARITÉ LUMIÈRE
              </span>
              <span className="text-[10px] tracking-[0.2em] font-medium text-gray-500 uppercase mt-1 hidden sm:block">
                Iluminação Premium
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <LinkFavoritos />
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista%20sobre%20iluminação."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-brand text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-dark/30 animate-pulse-gold flex items-center gap-2"
            >
              <span className="relative z-10">Falar com Especialista</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-[#FAFAFA]">
        {children}
      </main>

      {/* Footer Premium */}
      <footer className="relative overflow-hidden text-center text-white pb-6 pt-12 mt-12">
        <div className="absolute inset-0 bg-gradient-brand z-0 opacity-95"></div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-block mb-6">
            <p className="font-serif font-bold text-2xl tracking-[0.3em] text-gradient-gold">
              CLARITÉ LUMIÈRE
            </p>
          </Link>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent mx-auto mb-6 opacity-60"></div>
          <p className="text-sm tracking-[0.15em] font-light text-gray-300 uppercase mb-8">
            Onde Qualidade e Sofisticação se Encontram
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-300 mb-8">
            <a href="#" className="hover:text-[#D4A017] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#D4A017] transition-colors">WhatsApp</a>
            <a href="#" className="hover:text-[#D4A017] transition-colors">Pinterest</a>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Clarité Lumière. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
