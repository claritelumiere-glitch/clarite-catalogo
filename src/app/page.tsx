import Link from "next/link";
import Image from "next/image";


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Absolute Header distinct from Catalogo Layout if needed, but we can reuse the global one or build a transparent one here since it's the root page. Wait, RootLayout doesn't have the header, CatalogoLayout has the header. So we need to build the header/footer here OR use a shared layout. 
      Looking at the app structure, RootLayout is just the HTML body. CatalogoLayout is in (catalogo).
      So the Home Page must include its own Header and Footer, or we should move CatalogoLayout to RootLayout.
      Let's just build it completely custom for maximum impact, treating it as a landing page. */}
      
      {/* Header Premium Transparent */}
      <header className="absolute top-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-16 overflow-hidden drop-shadow-lg">
              <Image src="/logo.png" alt="Clarité Lumière" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col text-white drop-shadow-md">
              <span className="font-serif font-bold text-2xl tracking-widest leading-none">
                CLARITÉ LUMIÈRE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/catalogo" className="text-white hover:text-[#D4A017] transition-colors font-medium tracking-wider text-sm">
              CATÁLOGO
            </Link>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D4A017] text-white text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-none transition-all duration-300 hover:bg-[#E8C547] shadow-lg hover:shadow-[#D4A017]/50"
            >
              Falar com Especialista
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full bg-[#FAFAFA]">
        {/* Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Gradient / Image placeholder */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A1A6B] via-[#6B2D8B] to-[#2A0D3E] z-0"></div>
          
          {/* Subtle gold particles effect using absolute divs */}
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(1px_1px_at_20px_30px,rgba(212,160,23,0.4)_1px,transparent_0),radial-gradient(1px_1px_at_40px_70px,rgba(232,197,71,0.3)_1px,transparent_0),radial-gradient(1px_1px_at_80px_10px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[size:100px_100px] pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg opacity-0 animate-[fade-in-up_1s_ease-out_forwards]">
              Elegância que <br/> Transforma Ambientes
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light mb-12 tracking-wider max-w-2xl mx-auto opacity-0 animate-[fade-in-up_1s_ease-out_0.5s_forwards]">
              Onde qualidade e sofisticação se encontram. Exclusividade em lustres e pendentes premium para arquitetos e pessoas exigentes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-[fade-in-up_1s_ease-out_1s_forwards]">
              <Link 
                href="/catalogo"
                className="group relative overflow-hidden bg-gradient-to-r from-[#D4A017] to-[#E8C547] text-[#2A0D3E] font-bold uppercase tracking-[0.2em] px-10 py-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,160,23,0.6)] animate-pulse-gold flex items-center gap-3"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">Conhecer a Coleção</span>
                <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 h-full w-full bg-white/30 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
              </Link>
            </div>
            
            {/* Social Proof snippet */}
            <div className="mt-16 flex items-center justify-center gap-4 text-white/80 opacity-0 animate-[fade-in_2s_ease-out_2s_forwards]">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#4A1A6B] bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#4A1A6B] bg-gray-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#4A1A6B] bg-gray-500"></div>
              </div>
              <p className="text-sm font-light tracking-wide">
                Aprovado por mais de <span className="font-bold text-[#D4A017]">300+</span> arquitetos.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#6B2D8B] mb-6">Porque a Clarité?</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="p-8 hover-glow transition-all duration-500 rounded-lg group border border-transparent hover:border-[#D4A017]/30">
                <div className="w-16 h-16 mx-auto bg-[#FAFAFA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6B2D8B] transition-colors duration-500">
                  <svg className="w-8 h-8 text-[#D4A017] group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Design Exclusivo</h3>
                <p className="text-gray-500 font-light leading-relaxed">Peças selecionadas a dedo para garantir que seu ambiente tenha uma assinatura visual única e impactante.</p>
              </div>

              <div className="p-8 hover-glow transition-all duration-500 rounded-lg group border border-transparent hover:border-[#D4A017]/30">
                <div className="w-16 h-16 mx-auto bg-[#FAFAFA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6B2D8B] transition-colors duration-500">
                  <svg className="w-8 h-8 text-[#D4A017] group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Qualidade Premium</h3>
                <p className="text-gray-500 font-light leading-relaxed">Materiais nobres, acabamento impecável e testes rigorosos para assegurar durabilidade e brilho eterno.</p>
              </div>

              <div className="p-8 hover-glow transition-all duration-500 rounded-lg group border border-transparent hover:border-[#D4A017]/30">
                <div className="w-16 h-16 mx-auto bg-[#FAFAFA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6B2D8B] transition-colors duration-500">
                  <svg className="w-8 h-8 text-[#D4A017] group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">Atendimento VIP</h3>
                <p className="text-gray-500 font-light leading-relaxed">Especialistas prontos para te ajudar na escolha da peça perfeita. Atendimento humanizado e rápido.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-[#fafafa]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl font-bold text-[#6B2D8B] mb-8">
              Pronto para transformar seu ambiente?
            </h2>
            <p className="text-lg text-gray-600 font-light mb-12">
              Descubra por que a Clarité Lumière é a escolha número um dos projetos mais sofisticados do país.
            </p>
            <Link 
              href="/catalogo"
              className="inline-block bg-[#6B2D8B] text-white font-bold uppercase tracking-[0.15em] px-12 py-5 hover:bg-[#4A1A6B] transition-colors shadow-xl"
            >
              Explorar Catálogo de Luxo
            </Link>
          </div>
        </section>

      </main>

      {/* Footer Premium */}
      <footer className="relative overflow-hidden text-center text-white pb-6 pt-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B2D8B] to-[#C2185B] z-0 opacity-95"></div>
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
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Clarité Lumière. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
