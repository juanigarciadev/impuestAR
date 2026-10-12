import type { Metadata } from "next"
import { SOCIAL_IMAGE } from "@/lib/seo"

const TITLE = "Aviso legal, términos y privacidad"
const DESCRIPTION =
  "Alcance de los cálculos de impuestAR, uso de marcas, enlaces de referido y política de privacidad: qué datos se usan, para qué y cómo ejercer tus derechos."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/legal" },
  openGraph: { type: "website", locale: "es_AR", images: [SOCIAL_IMAGE], url: "/legal", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE.url], title: TITLE, description: DESCRIPTION },
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
