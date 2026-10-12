// Suscripciones: cada servicio tiene uno o más planes. Los precios de `servicesMock.ts` son sin impuestos
// (IVA, IIBB y percepción se suman en la app). Los planes con `currency: "USD"` se convierten con el dólar oficial.
export type Plan = {
  name: string
  price: number
  /** "USD" se convierte al dólar oficial; si falta, el precio está en pesos. */
  currency?: string
  /** Período del plan; si falta, el del servicio. */
  duration?: string
  note?: string
  /** Plan con requisitos (por ejemplo estudiantes): se lista, pero no se usa para el "desde" ni como plan inicial. */
  restricted?: boolean
  /** Precio tomado de un tercero y todavía no contrastado con la página oficial del servicio. */
  unverified?: boolean
  /** El precio publicado ya incluye el IVA (el comercio lo cobra adentro): no se suma de nuevo. */
  ivaIncluded?: boolean
}

export type Service = {
  name: string
  logo: string
  /** Período por defecto de los planes ("/m" = mensual). */
  duration: string
  /** Fecha (AAAA-MM-DD) en que se contrastaron los precios con la página oficial. Si falta, se muestra como sin verificar. */
  verifiedAt?: string
  plans: Plan[]
}

export const planDuration = (plan: Plan, service: Service) => plan.duration ?? service.duration

export const durationLabel = (duration: string) => (duration === "/m" ? "mensual" : duration === "/año" ? "anual" : duration)

/** Precio base en pesos (sin impuestos) del plan. Null si es en dólares y todavía no hay cotización. */
export function planBase(plan: Plan, usdRate: number | null): number | null {
  if (plan.currency === "USD") return usdRate ? Math.round(plan.price * usdRate) : null
  return plan.price
}

/** Planes que se cobran con el período por defecto del servicio y sin requisitos (para el "desde" de la tarjeta). */
export function defaultPlans(service: Service): Plan[] {
  const monthly = service.plans.filter(plan => planDuration(plan, service) === service.duration)
  const open = monthly.filter(plan => !plan.restricted)
  return open.length ? open : monthly.length ? monthly : service.plans
}

export const hasUsdPlans = (service: Service) => service.plans.some(plan => plan.currency === "USD")

/** Fecha de verificación en formato legible ("12 de octubre de 2026"). */
export function formatVerifiedAt(iso: string): string {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" })
}
