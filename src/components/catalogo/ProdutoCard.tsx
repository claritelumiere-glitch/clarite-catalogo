import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Produto, Categoria } from "@/types/database";
import { BotaoFavorito } from "./BotaoFavorito";

interface ProdutoCardProps {
  produto: Produto;
  categoria?: Categoria | null;
}

export function ProdutoCard({ produto, categoria }: ProdutoCardProps) {
  const primeiraImagem = produto.imagens?.[0];
  const semEstoque = (produto.estoque ?? 0) <= 0;
  
  // Fake scarcity logic based on ID string characters sum to be consistent per product
  const idHash = (produto.id || "123").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isScarce = idHash % 7 === 0; // ~14% of products
  const starsCount = 4 + (idHash % 2 === 0 ? 1 : 0); // 4 or 5 stars

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-[#D4A017] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
      {/* Favorite button overlay */}
      <div className="absolute top-3 right-3 z-20">
        <BotaoFavorito produtoId={produto.id} size="sm" />
      </div>

      <Link href={`/catalogo/${produto.slug}`} className="block h-full flex flex-col">
        {/* Image Container with Dark Hover Overlay */}
        <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
          {primeiraImagem ? (
            <Image
              src={primeiraImagem}
              alt={produto.nome}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <span className="font-serif text-gray-300 transform -rotate-12 text-2xl">CLARITÉ</span>
            </div>
          )}
          
          {/* Subtle dark overlay on hover */}
          <div className="absolute inset-0 bg-[#2A0D3E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {/* Destaque / Scarcity Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
            {produto.destaque && (
              <div className="bg-gradient-to-r from-[#D4A017] to-[#E8C547] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-md">
                Mais Vendido
              </div>
            )}
            {isScarce && !semEstoque && (
              <div className="bg-[#C2185B] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-md animate-pulse">
                Últimas Peças
              </div>
            )}
          </div>
          
          {semEstoque && (
            <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold py-2 text-center z-20">
              Indisponível no Momento
            </div>
          )}
          
          {/* Quick View Button on Hover */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 w-3/4">
            <div className="glassmorphism text-[#6B2D8B] text-xs font-bold uppercase tracking-widest py-2 rounded-full text-center border-[#D4A017]/30 shadow-lg">
              Ver Detalhes
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Social Proof Stars */}
          <div className="flex gap-0.5 mb-2">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`w-3.5 h-3.5 ${i <= starsCount ? "text-[#D4A017]" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {categoria && (
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1.5 line-clamp-1">
              {categoria.nome}
            </p>
          )}
          
          <h3 className="font-serif text-gray-900 text-sm md:text-base font-semibold leading-relaxed line-clamp-2 group-hover:text-[#6B2D8B] transition-colors mb-auto">
            {produto.nome}
          </h3>
          
          <div className="mt-4 flex items-end justify-between border-t border-gray-50 pt-3">
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider mb-1">REF: {produto.codigo.slice(0, 8)}</p>
              {produto.preco ? (
                <p className="text-[#6B2D8B] font-bold text-base md:text-lg">
                  {formatCurrency(produto.preco)}
                </p>
              ) : (
                <p className="text-[#D4A017] text-xs font-semibold uppercase tracking-wider">
                  Sob Consulta
                </p>
              )}
            </div>
            
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#D4A017] group-hover:bg-[#D4A017] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
