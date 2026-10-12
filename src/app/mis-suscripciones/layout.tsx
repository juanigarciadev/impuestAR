import type { Metadata } from "next"

// Página personal: la lista vive en el navegador de cada persona, no tiene sentido indexarla
export const metadata: Metadata = {
  title: "Mis suscripciones",
  description: "Armá tu lista de suscripciones y mirá cuánto pagás por mes y por año con impuestos, y cuánto le toca a cada uno si las compartís.",
  alternates: { canonical: "/mis-suscripciones" },
  robots: { index: false, follow: true },
}

export default function MisSuscripcionesLayout({ children }: { children: React.ReactNode }) {
  return children
}
