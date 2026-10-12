// Pruebas de la lógica pura del proyecto (impuestos, ARQ, suscripciones y exportación).
// Se ejecutan con `npm test` (Node 24 lee los .ts directamente, sin instalar nada).
import test from "node:test"
import assert from "node:assert/strict"

import {
  ARQ_RATE_PREMIUM,
  CARD_APPLIES,
  DEFAULT_TAX_SETTINGS,
  IVA_RATE,
  PERCEPCION_RATE,
  PROVINCES,
  calcArqTotal,
  calcTaxes,
  getProvince,
} from "../src/lib/taxes.ts"
import { defaultPlans, durationLabel, planBase, planDuration } from "../src/lib/services.ts"
import { exportCode, exportJson, parseSubscriptions } from "../src/lib/subscriptionsIO.ts"
import SERVICES from "../src/app/mocks/servicesMock.ts"
import { CHANGELOG, LATEST_CHANGE_DATE } from "../src/lib/changelog.ts"

const all = { iva: true, iibb: true, percepcion: true, province: "caba" }
const NO_PERCEPCION = { iva: true, iibb: true, percepcion: false }

test("alícuotas nacionales", () => {
  assert.equal(IVA_RATE, 0.21)
  assert.equal(PERCEPCION_RATE, 0.3)
  assert.equal(ARQ_RATE_PREMIUM, 0.023)
})

test("calcTaxes: tarjeta en CABA suma IVA 21%, IIBB 2% y percepción 30%", () => {
  const t = calcTaxes(10000, all, CARD_APPLIES)
  assert.deepEqual(t, { base: 10000, iva: 2100, iibb: 200, percepcion: 3000, total: 15300 })
})

test("calcTaxes: videojuegos no pagan percepción", () => {
  const t = calcTaxes(10000, all, NO_PERCEPCION)
  assert.equal(t.percepcion, 0)
  assert.equal(t.total, 12300)
})

test("calcTaxes: el usuario puede destildar impuestos que sí corresponden", () => {
  assert.equal(calcTaxes(10000, { ...all, percepcion: false }, CARD_APPLIES).total, 12300)
  assert.equal(calcTaxes(10000, { ...all, iva: false }, CARD_APPLIES).total, 13200)
  assert.equal(calcTaxes(10000, { ...all, iibb: false }, CARD_APPLIES).total, 15100)
})

test("calcTaxes: sin provincia no hay IIBB, y una provincia sin régimen da 0", () => {
  assert.equal(calcTaxes(10000, { ...all, province: "" }, CARD_APPLIES).iibb, 0)
  assert.equal(calcTaxes(10000, { ...all, province: "mendoza" }, CARD_APPLIES).iibb, 0)
})

test("calcTaxes: redondea cada impuesto al peso y el total es la suma de las partes", () => {
  const t = calcTaxes(1234.56, all, CARD_APPLIES)
  assert.equal(t.total, t.base + t.iva + t.iibb + t.percepcion)
  assert.ok(Number.isInteger(t.iva) && Number.isInteger(t.iibb) && Number.isInteger(t.percepcion) && Number.isInteger(t.total))
})

test("calcTaxes: monto cero", () => {
  assert.deepEqual(calcTaxes(0, all, CARD_APPLIES), { base: 0, iva: 0, iibb: 0, percepcion: 0, total: 0 })
})

test("ajustes por defecto: todo tildado y sin provincia", () => {
  assert.deepEqual(DEFAULT_TAX_SETTINGS, { iva: true, iibb: true, percepcion: true, province: "" })
})

test("provincias: 24 jurisdicciones, ids y nombres únicos, alícuotas razonables", () => {
  assert.equal(PROVINCES.length, 24)
  assert.equal(new Set(PROVINCES.map(p => p.id)).size, PROVINCES.length)
  assert.equal(new Set(PROVINCES.map(p => p.name)).size, PROVINCES.length)
  for (const p of PROVINCES) {
    assert.ok(p.iibb >= 0 && p.iibb <= 0.1, `${p.name}: IIBB fuera de rango (${p.iibb})`)
    if (p.iibb === 0) assert.ok(p.note, `${p.name} con 0% debería tener una nota`)
  }
  assert.equal(getProvince("caba")?.iibb, 0.02)
  assert.equal(getProvince("no-existe"), undefined)
})

test("calcArqTotal: siempre redondea hacia arriba", () => {
  // 10 USD * 1535 * 1,023 = 15703,05 -> 15704
  assert.equal(calcArqTotal(10, 1535), 15704)
})

test("calcArqTotal: el error de punto flotante no suma un peso de más", () => {
  // 100 * 1000 * 1,023 da 102299.99999999999 en punto flotante: debe quedar en 102300
  assert.equal(calcArqTotal(100, 1000), 102300)
  assert.equal(calcArqTotal(1, 0), 0)
})

test("calcArqTotal: es más barato que la tarjeta local en Videojuegos", () => {
  const card = calcTaxes(10 * 1535, { ...all, province: "caba" }, NO_PERCEPCION).total
  assert.ok(calcArqTotal(10, 1535) < card)
})

test("servicios: planBase convierte USD con el dólar oficial", () => {
  assert.equal(planBase({ name: "x", price: 10, currency: "USD" }, 1500), 15000)
  assert.equal(planBase({ name: "x", price: 10, currency: "USD" }, null), null)
  assert.equal(planBase({ name: "x", price: 5578.51 }, null), 5578.51)
})

test("servicios: defaultPlans excluye anuales y planes con requisitos", () => {
  const spotify = SERVICES.find(s => s.name === "Spotify")
  assert.ok(!defaultPlans(spotify).some(p => p.restricted))
  const disney = SERVICES.find(s => s.name === "Disney+")
  assert.ok(defaultPlans(disney).every(p => planDuration(p, disney) === "/m"))
  assert.equal(durationLabel("/m"), "mensual")
  assert.equal(durationLabel("/año"), "anual")
})

test("catálogo: estructura válida", () => {
  const names = new Set()
  for (const s of SERVICES) {
    assert.ok(!names.has(s.name), `servicio repetido: ${s.name}`)
    names.add(s.name)
    assert.ok(s.logo.startsWith("https://"), `${s.name}: logo`)
    assert.ok(s.plans.length >= 1, `${s.name}: sin planes`)
    if (s.verifiedAt) assert.match(s.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, `${s.name}: verifiedAt`)
    const planNames = new Set()
    for (const p of s.plans) {
      assert.ok(!planNames.has(p.name), `${s.name}: plan repetido ${p.name}`)
      planNames.add(p.name)
      assert.ok(p.price > 0, `${s.name}/${p.name}: precio`)
      assert.ok(!p.currency || p.currency === "USD", `${s.name}/${p.name}: moneda`)
      assert.ok(!p.duration || p.duration === "/año", `${s.name}/${p.name}: período`)
    }
  }
})

test("catálogo: los planes mensuales van de menor a mayor precio dentro de cada servicio", () => {
  for (const s of SERVICES) {
    const prices = s.plans.filter(p => planDuration(p, s) === "/m" && !p.restricted).map(p => p.price)
    assert.deepEqual(prices, [...prices].sort((a, b) => a - b), `${s.name}: planes desordenados`)
  }
})

test("mis suscripciones: exportar e importar por código y por archivo", () => {
  const data = { items: [{ service: "Spotify", plan: "Familiar" }, { service: "Netflix", plan: "Estándar" }], people: 3 }
  assert.deepEqual(parseSubscriptions(exportCode(data)), data)
  assert.deepEqual(parseSubscriptions(exportJson(data)), data)
})

test("mis suscripciones: entradas inválidas y saneamiento", () => {
  assert.equal(parseSubscriptions(""), null)
  assert.equal(parseSubscriptions("hola"), null)
  assert.equal(parseSubscriptions("iAR1:%%%"), null)
  const sanitized = parseSubscriptions(
    JSON.stringify({ items: [{ service: "A", plan: "B" }, { service: "A", plan: "C" }, { service: "", plan: "x" }, { service: 1 }], people: 999 }),
  )
  assert.deepEqual(sanitized, { items: [{ service: "A", plan: "B" }], people: 20 })
  assert.equal(parseSubscriptions("x".repeat(30000)), null)
})

test("novedades: fechas válidas, de más nueva a más vieja, sin entradas vacías", () => {
  assert.ok(CHANGELOG.length >= 1)
  const dates = CHANGELOG.map(e => e.date)
  for (const date of dates) assert.match(date, /^\d{4}-\d{2}-\d{2}$/)
  assert.deepEqual(dates, [...dates].sort().reverse())
  assert.equal(new Set(dates).size, dates.length)
  assert.equal(LATEST_CHANGE_DATE, dates[0])
  for (const entry of CHANGELOG) {
    assert.ok(entry.title.length > 0)
    assert.ok(entry.changes.length > 0 && entry.changes.every(c => c.trim().length > 0))
  }
})
