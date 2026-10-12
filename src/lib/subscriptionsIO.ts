// Exportación e importación de "Mis suscripciones": un JSON chico, o el mismo JSON en base64 con prefijo
// (el "código", pensado para copiar y pegar por WhatsApp o mail).
export type SavedSubscription = { service: string; plan: string }
export type SubscriptionsData = { items: SavedSubscription[]; people: number }

const CODE_PREFIX = "iAR1:"
const FORMAT = "impuestar-mis-suscripciones"
const MAX_ITEMS = 60
const MAX_PEOPLE = 20
const MAX_TEXT = 80
const MAX_INPUT = 20000

const toBase64 = (text: string) => {
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  bytes.forEach(byte => (binary += String.fromCharCode(byte)))
  return btoa(binary)
}

const fromBase64 = (code: string) => {
  const binary = atob(code)
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function exportJson(data: SubscriptionsData): string {
  return JSON.stringify({ format: FORMAT, version: 1, exportedAt: new Date().toISOString(), items: data.items, people: data.people }, null, 2)
}

export function exportCode(data: SubscriptionsData): string {
  const compact = JSON.stringify({ format: FORMAT, version: 1, items: data.items, people: data.people })
  return CODE_PREFIX + toBase64(compact)
}

/** Lee un código o un JSON exportado. Devuelve null si no tiene el formato esperado. */
export function parseSubscriptions(input: string): SubscriptionsData | null {
  const text = input.trim()
  if (!text || text.length > MAX_INPUT) return null
  try {
    const json = text.startsWith(CODE_PREFIX) ? fromBase64(text.slice(CODE_PREFIX.length)) : text
    const parsed = JSON.parse(json)
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) return null
    const seen = new Set<string>()
    const items: SavedSubscription[] = []
    for (const raw of parsed.items) {
      const service = typeof raw?.service === "string" ? raw.service.trim().slice(0, MAX_TEXT) : ""
      const plan = typeof raw?.plan === "string" ? raw.plan.trim().slice(0, MAX_TEXT) : ""
      if (!service || !plan || seen.has(service)) continue
      seen.add(service)
      items.push({ service, plan })
      if (items.length >= MAX_ITEMS) break
    }
    const people = Number.isInteger(parsed.people) ? Math.min(Math.max(parsed.people, 1), MAX_PEOPLE) : 1
    return { items, people }
  } catch {
    return null
  }
}
