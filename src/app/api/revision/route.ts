import { NextResponse } from "next/server"

// Recibe el pedido de revisión escrito en la app y lo manda por mail con Resend (sin dependencias extra).
// Variables de entorno:
//   RESEND_API_KEY      (obligatoria) clave de Resend
//   REVIEW_TO_EMAIL     (opcional)    destino, por defecto el mail del autor
//   REVIEW_FROM_EMAIL   (opcional)    remitente; por defecto el de pruebas de Resend, que solo envía
//                                     al mail con el que se creó la cuenta
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (opcionales) contador compartido para el límite
//                                     por IP. Sin ellas el límite es en memoria (por instancia serverless).
const TO = process.env.REVIEW_TO_EMAIL ?? "juanigarciadev@gmail.com"
const FROM = process.env.REVIEW_FROM_EMAIL ?? "impuestAR <onboarding@resend.dev>"

const MIN_LENGTH = 10
const MAX_LENGTH = 1500
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Límites: por IP en una ventana corta y por día, y un tope global diario para proteger la casilla y
// la cuota de Resend aunque el ataque venga de muchas IPs.
const LIMITS = [
    { scope: "ip-10min", ttl: 10 * 60, max: 3, perIp: true },
    { scope: "ip-dia", ttl: 24 * 60 * 60, max: 10, perIp: true },
    { scope: "global-dia", ttl: 24 * 60 * 60, max: 100, perIp: false },
]

const memory = new Map<string, { count: number; expires: number }>()

function hitMemory(key: string, ttl: number): number {
    const now = Date.now()
    if (memory.size > 5000) for (const [k, v] of memory) if (v.expires < now) memory.delete(k)
    const entry = memory.get(key)
    if (!entry || entry.expires < now) {
        memory.set(key, { count: 1, expires: now + ttl * 1000 })
        return 1
    }
    entry.count += 1
    return entry.count
}

// Contador compartido entre instancias con Upstash Redis (REST, sin dependencias)
async function hitUpstash(key: string, ttl: number): Promise<number | null> {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    try {
        const response = await fetch(`${url}/pipeline`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify([["INCR", key], ["EXPIRE", key, ttl, "NX"]]),
        })
        if (!response.ok) return null
        const [incr] = (await response.json()) as { result?: number }[]
        return typeof incr?.result === "number" ? incr.result : null
    } catch {
        return null
    }
}

async function isRateLimited(ip: string): Promise<boolean> {
    for (const { scope, ttl, max, perIp } of LIMITS) {
        const key = `revision:${scope}${perIp ? `:${ip}` : ""}`
        const count = (await hitUpstash(key, ttl)) ?? hitMemory(key, ttl)
        if (count > max) return true
    }
    return false
}

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status })

export async function POST(request: Request) {
    let body: Record<string, unknown>
    try {
        body = await request.json()
    } catch {
        return fail("Pedido inválido.", 400)
    }

    // Campo trampa: los bots lo completan, las personas no lo ven. Se responde OK sin enviar nada.
    if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true })

    const message = typeof body.message === "string" ? body.message.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const page = typeof body.page === "string" ? body.page.slice(0, 200) : ""

    if (message.length < MIN_LENGTH) return fail(`Escribí al menos ${MIN_LENGTH} caracteres.`, 400)
    if (message.length > MAX_LENGTH) return fail(`El mensaje no puede superar los ${MAX_LENGTH} caracteres.`, 400)
    if (email && (email.length > 200 || !EMAIL_RE.test(email))) return fail("El mail no parece válido.", 400)

    // En Vercel x-forwarded-for lo completa la plataforma; x-real-ip como respaldo
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown"
    if (await isRateLimited(ip)) return fail("Enviaste varios mensajes seguidos. Probá de nuevo en unos minutos.", 429)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return fail("El envío no está configurado todavía.", 503)

    const text = [
        message,
        "",
        "—",
        `Mail de contacto: ${email || "no dejó"}`,
        `Página: ${page || "desconocida"}`,
    ].join("\n")

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from: FROM,
                to: [TO],
                subject: "Revisión solicitada en impuestAR",
                text,
                ...(email ? { reply_to: email } : {}),
            }),
        })
        if (!response.ok) return fail("No pudimos enviar el mensaje. Probá de nuevo más tarde.", 502)
    } catch {
        return fail("No pudimos enviar el mensaje. Probá de nuevo más tarde.", 502)
    }

    return NextResponse.json({ ok: true })
}
