import type { Metadata } from "next"
import { SOCIAL_IMAGE } from "@/lib/seo"
import JsonLd from "@/components/JsonLd"
import { breadcrumbLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Precios de suscripciones con impuestos",
  description:
    "Precio final en pesos argentinos de Netflix, Spotify, YouTube Premium y más suscripciones, con IVA 21% incluido.",
  alternates: { canonical: "/servicios" },
  openGraph: { type: "website", locale: "es_AR", images: [SOCIAL_IMAGE], url: "/servicios", title: "Precios de suscripciones con impuestos", description: "Precio final en pesos argentinos de Netflix, Spotify, YouTube Premium y más suscripciones, con IVA 21% incluido." },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE.url], title: "Precios de suscripciones con impuestos", description: "Precio final en pesos argentinos de Netflix, Spotify, YouTube Premium y más suscripciones, con IVA 21% incluido." },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbLd([["Calculadora", "/"], ["Suscripciones", "/servicios"]])} />
      {children}
    </>
  )
}
