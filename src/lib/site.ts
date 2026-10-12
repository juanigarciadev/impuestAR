// Dominio público. Se puede sobreescribir con NEXT_PUBLIC_SITE_URL en Vercel.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impuestar.vercel.app"
export const SITE_NAME = "impuestAR"
export const SITE_DESCRIPTION =
  "Calculá el precio final en pesos de tus compras en dólares: dólar tarjeta, MEP y cripto con IVA 21%, y precios de suscripciones como Netflix, Spotify y YouTube Premium con impuestos."

// Link de registro en ARQ (con código de referido). Mientras esté vacío no se muestra el botón.
export const ARQ_REFERRAL_URL = "https://www.arqfinance.com/referrals/arr?referralCode=juanigarciadev_su4&pid=referral&c=arr&is_retargeting=true"

// Beneficio de bienvenida que se promociona en el banner de Videojuegos. Poné `null` para ocultar el banner.
// Confirmá estos datos en la app de ARQ antes de publicarlos: son condiciones de ARQ y pueden cambiar.
export const ARQ_REWARD: { usd: number; minSpendUsd: number; creditDays: number; validDays: number } | null = {
    usd: 3,
    minSpendUsd: 30,
    creditDays: 3,
    validDays: 30,
}

// Fecha de la última verificación de alícuotas y reglas (ver docs/VERIFICACION.md). Actualizala en cada
// verificación: se muestra en las páginas y en llms.txt como señal de frescura.
export const DATA_REVIEWED_ISO = "2026-10-09"

export function formatReviewedDate(): string {
  return new Date(`${DATA_REVIEWED_ISO}T12:00:00-03:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" })
}

export const AUTHOR_NAME = "juanigarciadev"
export const CONTACT_EMAIL = "juanigarciadev@gmail.com"
export const AUTHOR_URL = "https://github.com/juanigarciadev"
export const REPO_URL = "https://github.com/juanigarciadev/impuestAR"
