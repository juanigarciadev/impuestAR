import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cómo pagar Steam con la tarjeta de ARQ",
  description:
    "Qué es la tarjeta local de ARQ, cómo activarla y cómo pagar en Steam sin el 21% extra de IVA que suman las tarjetas locales.",
  alternates: { canonical: "/arq" },
}

export default function ArqLayout({ children }: { children: React.ReactNode }) {
  return children
}
