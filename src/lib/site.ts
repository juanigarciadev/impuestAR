// Dominio público. Se puede sobreescribir con NEXT_PUBLIC_SITE_URL en Vercel.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impuestar.vercel.app"
export const SITE_NAME = "impuestAR"
export const SITE_DESCRIPTION =
  "Calculá el precio final en pesos de tus compras en dólares: dólar tarjeta, MEP y cripto con IVA 21%, y precios de suscripciones como Netflix, Spotify y YouTube Premium con impuestos."

// Link de registro en ARQ (con código de referido). Mientras esté vacío no se muestra el botón.
export const ARQ_REFERRAL_URL = "https://www.arqfinance.com/referrals/arr?referralCode=juanigarciadev_su4&pid=referral&c=arr&is_retargeting=true"

// Beneficio de bienvenida de ARQ que se promociona en el cartel de Videojuegos y en /arq. Con `null` no se muestra.
// Verificado el 12/10/2026: los "3 USD por gastar 30 USD en 30 días" son una promoción específica de Steamcito x ARQ
// (https://www.arqfinance.com/es-AR/help/articles/steamcito-x-arq) y solo aplican a quienes se registran con el
// link de Steamcito. La recompensa de un link de referido propio depende de la campaña que ARQ le asigne, así que no
// se promete ningún monto. Cargá acá el beneficio solo si ARQ confirma las condiciones de tu campaña.
export const ARQ_REWARD: { usd: number; minSpendUsd: number; creditDays: number; validDays: number } | null = null

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
