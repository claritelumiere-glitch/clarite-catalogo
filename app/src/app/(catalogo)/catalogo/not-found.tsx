import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="font-serif text-4xl text-[#D4A017]">404</p>
      <h1 className="font-serif text-2xl text-[#6B2D8B] mt-2">Produto não encontrado</h1>
      <p className="text-gray-500 text-sm mt-3">
        O produto que você procura não existe ou foi removido.
      </p>
      <Link
        href="/catalogo"
        className="mt-6 inline-block bg-[#6B2D8B] text-white px-6 py-3 rounded-lg text-sm hover:bg-[#9B2C8A] transition-colors"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
