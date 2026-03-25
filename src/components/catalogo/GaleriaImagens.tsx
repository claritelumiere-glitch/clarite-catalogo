"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface GaleriaImagensProps {
  imagens: string[];
  nomeAlt: string;
}

export function GaleriaImagens({ imagens, nomeAlt }: GaleriaImagensProps) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const anterior = useCallback(() => {
    setIndiceAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  }, [imagens.length]);

  const proximo = useCallback(() => {
    setIndiceAtual((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  }, [imagens.length]);

  if (imagens.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
        <svg viewBox="0 0 100 130" className="w-24 h-24 text-[#D4A017] opacity-20" fill="currentColor">
          <rect x="48" y="0" width="4" height="15" rx="2"/>
          <path d="M30 15 Q50 10 70 15 L65 55 Q50 60 35 55 Z"/>
          <path d="M35 55 Q50 60 65 55 L60 85 Q50 90 40 85 Z"/>
          <path d="M40 85 Q50 90 60 85 L55 105 Q50 108 45 105 Z"/>
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200 cursor-zoom-in group"
          onClick={() => setFullscreen(true)}
        >
          <Image
            src={imagens[indiceAtual]}
            alt={`${nomeAlt} - Foto ${indiceAtual + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={indiceAtual === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Navigation arrows */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); anterior(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                aria-label="Foto anterior"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-700">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); proximo(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                aria-label="Próxima foto"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-700">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
                </svg>
              </button>

              {/* Counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {indiceAtual + 1} / {imagens.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {imagens.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imagens.map((img, i) => (
              <button
                key={i}
                onClick={() => setIndiceAtual(i)}
                className={`relative w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden bg-gray-50 transition-all ${
                  i === indiceAtual
                    ? "border-[#6B2D8B] shadow-md"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${nomeAlt} - Miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Fechar"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          </button>

          {/* Fullscreen image */}
          <div
            className="relative w-full h-full max-w-4xl max-h-[90vh] m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imagens[indiceAtual]}
              alt={`${nomeAlt} - Foto ${indiceAtual + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Fullscreen navigation */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); anterior(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                aria-label="Foto anterior"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-white">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); proximo(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
                aria-label="Próxima foto"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-white">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
                </svg>
              </button>

              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
                {indiceAtual + 1} / {imagens.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
