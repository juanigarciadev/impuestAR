// Verificación semanal automática de impuestAR (ver docs/VERIFICACION.md).
// Uso: npm run verificar
// No modifica archivos: solo informa. Lo que no se puede automatizar (normativa, IIBB, precios) está en la guía.
import { readFileSync } from "node:fs"

const API = "https://dolarapi.com/v1"
const TIMEOUT_MS = 10_000
const results = { ok: 0, warn: 0, fail: 0 }
const log = (level, msg) => {
  results[level]++
  const icon = { ok: "OK   ", warn: "AVISO", fail: "FALLA" }[level]
  console.log(`[${icon}] ${msg}`)
}

async function getJson(path) {
  const res = await fetch(`${API}/${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// 1) DolarApi: endpoints y campos que usa la calculadora
async function checkRates() {
  console.log("\n== Cotizaciones (DolarApi) ==")
  let dolares, cotizaciones
  try {
    dolares = await getJson("dolares")
    cotizaciones = await getJson("cotizaciones")
  } catch (e) {
    return log("fail", `DolarApi no responde: ${e.message}`)
  }

  for (const casa of ["oficial", "bolsa", "cripto", "tarjeta"]) {
    const d = dolares.find(x => x.casa === casa)
    if (!d || typeof d.venta !== "number") log("fail", `Falta la cotización '${casa}' en /dolares`)
    else {
      const edadHs = (Date.now() - new Date(d.fechaActualizacion).getTime()) / 36e5
      log(edadHs > 72 ? "warn" : "ok", `${casa}: venta $${d.venta} (actualizada hace ${edadHs.toFixed(1)} h)`)
    }
  }
  for (const code of ["EUR", "BRL", "CLP", "UYU"]) {
    const c = cotizaciones.find(x => x.moneda === code)
    log(c && typeof c.venta === "number" ? "ok" : "fail", `${code}: ${c ? "$" + c.venta : "no aparece en /cotizaciones"}`)
  }

  // Señal de cambios impositivos: DolarApi calcula tarjeta = oficial + percepción
  const oficial = dolares.find(x => x.casa === "oficial")?.venta
  const tarjeta = dolares.find(x => x.casa === "tarjeta")?.venta
  if (oficial && tarjeta) {
    const ratio = tarjeta / oficial
    const msg = `tarjeta / oficial = ${ratio.toFixed(3)} (esperado 1.300 mientras rija la percepción del 30%)`
    log(Math.abs(ratio - 1.3) < 0.005 ? "ok" : "warn", msg + (Math.abs(ratio - 1.3) < 0.005 ? "" : " -> REVISAR la percepción de Ganancias/BP o el cálculo de DolarApi"))
  }
}

// 2) Servicios: logos accesibles y tabla de precios para contrastar a mano
async function checkServices() {
  console.log("\n== Suscripciones (src/app/mocks/servicesMock.ts) ==")
  const src = readFileSync(new URL("../src/app/mocks/servicesMock.ts", import.meta.url), "utf8")
  const services = [...src.matchAll(/name:\s*"([^"]+)",\s*price:\s*(\d+),\s*logo:\s*"([^"]+)",\s*duration:\s*"([^"]+)"/g)]
    .map(m => ({ name: m[1], price: Number(m[2]), logo: m[3], duration: m[4] }))
  if (!services.length) return log("fail", "No se pudo leer ningún servicio del mock (¿cambió el formato?)")

  for (const s of services) {
    try {
      const res = await fetch(s.logo, { headers: { "user-agent": "Mozilla/5.0 impuestAR-verificar" }, signal: AbortSignal.timeout(TIMEOUT_MS) })
      const type = res.headers.get("content-type") ?? ""
      log(res.ok && type.startsWith("image/") ? "ok" : "fail", `logo ${s.name}: HTTP ${res.status} ${type}`)
    } catch (e) {
      log("fail", `logo ${s.name}: ${e.message}`)
    }
  }

  console.log("\nPrecios actuales en el mock (sin impuestos). Contrastar con la página oficial de cada servicio en Argentina:")
  console.table(services.map(({ name, price, duration }) => ({ servicio: name, "precio ARS": price, periodo: duration })))
}

// 3) Constantes impositivas vigentes en el código (para tenerlas a la vista al revisar normativa)
function showTaxConstants() {
  console.log("\n== Constantes impositivas en src/lib/taxes.ts ==")
  const src = readFileSync(new URL("../src/lib/taxes.ts", import.meta.url), "utf8")
  const ivaRate = src.match(/IVA_RATE\s*=\s*([\d.]+)/)?.[1]
  const percRate = src.match(/PERCEPCION_RATE\s*=\s*([\d.]+)/)?.[1]
  console.log(`IVA ${ivaRate}  |  Percepción Ganancias/BP ${percRate}`)
  const rates = [...src.matchAll(/name:\s*"([^"]+)",\s*iibb:\s*([\d.]+)/g)].filter(m => Number(m[2]) > 0)
  console.table(rates.map(m => ({ provincia: m[1], "IIBB %": +(Number(m[2]) * 100).toFixed(2) })))
}

await checkRates()
await checkServices()
showTaxConstants()

console.log(`\nResumen: ${results.ok} OK, ${results.warn} avisos, ${results.fail} fallas`)
console.log("Siguiente paso: completar los pasos manuales de docs/VERIFICACION.md (normativa, IIBB y precios).")
process.exitCode = results.fail ? 1 : 0
