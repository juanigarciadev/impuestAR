import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Precios de suscripciones con impuestos",
  description:
    "Precio final en pesos argentinos de Netflix, Spotify, YouTube Premium y más suscripciones, con IVA 21% incluido.",
  alternates: { canonical: "/servicios" },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return children
}
