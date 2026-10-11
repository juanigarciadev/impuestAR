import type { Metadata } from "next"
import { SOCIAL_IMAGE } from "@/lib/seo"
import JsonLd from "@/components/JsonLd"
import { absoluteUrl, breadcrumbLd } from "@/lib/seo"
import { DATA_REVIEWED_ISO } from "@/lib/site"

const TITLE = "Metodología y fuentes: cómo calculamos los impuestos"
const DESCRIPTION =
  "Cotizaciones, alícuotas de IVA, percepción de Ganancias e Ingresos Brutos por provincia y supuestos que usa impuestAR para calcular el precio final en pesos."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/metodologia" },
  openGraph: { type: "article", locale: "es_AR", images: [SOCIAL_IMAGE], url: "/metodologia", title: TITLE, description: DESCRIPTION, modifiedTime: DATA_REVIEWED_ISO },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE.url], title: TITLE, description: DESCRIPTION },
}

export default function MetodologiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([["Calculadora", "/"], ["Metodología", "/metodologia"]]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: TITLE,
            description: DESCRIPTION,
            url: absoluteUrl("/metodologia"),
            inLanguage: "es-AR",
            dateModified: DATA_REVIEWED_ISO,
          },
        ]}
      />
      {children}
    </>
  )
}
