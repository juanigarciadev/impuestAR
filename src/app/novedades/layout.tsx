import type { Metadata } from "next"
import JsonLd from "@/components/JsonLd"
import { SOCIAL_IMAGE, breadcrumbLd } from "@/lib/seo"

const TITLE = "Novedades de impuestAR"
const DESCRIPTION = "Qué cambió en impuestAR: precios y planes de suscripciones, nuevas funciones, ajustes de impuestos y mejoras."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/novedades" },
  openGraph: { type: "website", locale: "es_AR", images: [SOCIAL_IMAGE], url: "/novedades", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE.url], title: TITLE, description: DESCRIPTION },
}

export default function NovedadesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbLd([["Calculadora", "/"], ["Novedades", "/novedades"]])} />
      {children}
    </>
  )
}
