import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Produto, Categoria } from "@/types/database";

interface ProdutoCardProps {
  produto: Produto;
  categoria?: Categoria | null;
}

export function ProdutoCard({ produto, categoria }: ProdutoCardProps) {
  const primeiraImagem = produto.imagens?.[0];

  return (
    <Link
      href={`/catalogo/${produto.slug}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#D4A017] hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {primeiraImagem ? (
          <Image
            src={primeiraImagem}
            alt={produto.nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 100 130" className="w-16 h-16 text-[#D4A017] opacity-30" fill="currentColor">
              <rect x="48" y="0" width="4" height="15" rx="2"/>
              <path d="M30 15 Q50 10 70 15 L65 55 Q50 60 35 55 Z"/>
              <path d="M35 55 Q50 60 65 55 L60 85 Q50 90 40 85 Z"/>
              <path d="M40 85 Q50 90 60 85 L55 105 Q50 108 45 105 Z"/>
              {[35,40,45,50,55,60,65].map((x, i) => (
                <circle key={i} cx={x} cy={112 + (i % 2) * 5} r="2"/>
              ))}
            </svg>
          </div>
        )}
        {produto.destaque && (
          <div className="absolute top-2 left-2 bg-[#D4A017] text-white text-xs font-medium px-2 py-1 rounded">
            Destaque
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {categoria && (
          <p className="text-xs text-[#9B2C8A] font-medium uppercase tracking-wider mb-1">
            {categoria.nome}
          </p>
        )}
        <h3 className="font-serif text-gray-900 text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#6B2D8B] transition-colors">
          {produto.nome}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Cód: {produto.codigo}</p>
        {produto.preco && (
          <p className="mt-2 text-[#6B2D8B] font-semibold text-sm">
            {formatCurrency(produto.preco)}
          </p>
        )}
      </div>
    </Link>
  );
}
