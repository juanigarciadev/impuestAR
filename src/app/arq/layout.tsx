import type { Metadata } from "next"
import { SOCIAL_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Cómo pagar Steam con la tarjeta de ARQ",
  description:
    "Qué es la tarjeta local de ARQ, cómo activarla y cómo pagar en Steam sin el 21% extra de IVA que suman las tarjetas locales.",
  alternates: { canonical: "/arq" },
  openGraph: { type: "website", locale: "es_AR", images: [SOCIAL_IMAGE], url: "/arq", title: "Cómo pagar Steam con la tarjeta de ARQ", description: "Qué es la tarjeta local de ARQ, cómo activarla y cómo pagar en Steam sin el 21% extra de IVA que suman las tarjetas locales." },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE.url], title: "Cómo pagar Steam con la tarjeta de ARQ", description: "Qué es la tarjeta local de ARQ, cómo activarla y cómo pagar en Steam sin el 21% extra de IVA que suman las tarjetas locales." },
}

export default function ArqLayout({ children }: { children: React.ReactNode }) {
  return children
}
