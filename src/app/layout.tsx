import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clarité Lumière — Onde qualidade e sofisticação se encontram",
    template: "%s | Clarité Lumière",
  },
  description: "Iluminação premium para ambientes sofisticados. Lustres, pendentes e luminárias de alta qualidade para arquitetos, designers e clientes exigentes.",
  keywords: ["iluminação", "lustres", "pendentes", "luminárias", "decoração", "sofisticação"],
  authors: [{ name: "Clarité Lumière" }],
  creator: "Clarité Lumière",
  metadataBase: new URL("https://claritelumiere.com"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://claritelumiere.com",
    siteName: "Clarité Lumière",
    title: "Clarité Lumière — Onde qualidade e sofisticação se encontram",
    description: "Iluminação premium para ambientes sofisticados.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
