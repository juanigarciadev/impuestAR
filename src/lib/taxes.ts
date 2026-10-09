// IVA sobre servicios digitales del exterior (Ley 27.430 / RG AFIP-ARCA 4240).
// El impuesto PAIS ya no existe (derogado el 23/12/2024). La percepción del 30% a cuenta de
// Ganancias/Bienes Personales (RG 5617) sigue vigente en compras con tarjeta en pesos; quedó en 0%
// para plataformas de videojuegos desde abril de 2025 y no se genera al pagar con dólares propios.
export const IVA_RATE = 0.21
export const PERCEPCION_RATE = 0.30

export type Province = {
  id: string
  name: string
  /** Alícuota de percepción de Ingresos Brutos sobre servicios digitales del exterior (0 = sin régimen confirmado) */
  iibb: number
  note?: string
}

// Alícuotas según los regímenes provinciales de percepción sobre servicios digitales prestados
// por sujetos del exterior (base: monto neto de IVA, pago único y definitivo).
// Fuentes: CPCE CABA, Estudio Piacentini, Blog del Contador, RG API 30/2025 (Santa Fe).
// Las jurisdicciones con 0 no tienen un régimen confirmado: revisar la norma vigente de cada ARCA provincial.
const SIN_REGIMEN = "Sin régimen de percepción confirmado para servicios digitales del exterior."

export const PROVINCES: Province[] = [
  { id: "caba", name: "Ciudad de Buenos Aires", iibb: 0.02 },
  { id: "buenos-aires", name: "Buenos Aires", iibb: 0.02 },
  { id: "catamarca", name: "Catamarca", iibb: 0, note: SIN_REGIMEN },
  { id: "chaco", name: "Chaco", iibb: 0.055 },
  { id: "chubut", name: "Chubut", iibb: 0, note: SIN_REGIMEN },
  { id: "cordoba", name: "Córdoba", iibb: 0.03 },
  { id: "corrientes", name: "Corrientes", iibb: 0, note: SIN_REGIMEN },
  { id: "entre-rios", name: "Entre Ríos", iibb: 0, note: SIN_REGIMEN },
  { id: "formosa", name: "Formosa", iibb: 0, note: SIN_REGIMEN },
  { id: "jujuy", name: "Jujuy", iibb: 0, note: SIN_REGIMEN },
  { id: "la-pampa", name: "La Pampa", iibb: 0.01 },
  { id: "la-rioja", name: "La Rioja", iibb: 0, note: SIN_REGIMEN },
  { id: "mendoza", name: "Mendoza", iibb: 0, note: SIN_REGIMEN },
  { id: "misiones", name: "Misiones", iibb: 0, note: SIN_REGIMEN },
  { id: "neuquen", name: "Neuquén", iibb: 0.04 },
  { id: "rio-negro", name: "Río Negro", iibb: 0.05 },
  { id: "salta", name: "Salta", iibb: 0.036 },
  { id: "san-juan", name: "San Juan", iibb: 0.03 },
  { id: "san-luis", name: "San Luis", iibb: 0, note: SIN_REGIMEN },
  { id: "santa-cruz", name: "Santa Cruz", iibb: 0, note: SIN_REGIMEN },
  { id: "santa-fe", name: "Santa Fe", iibb: 0.03, note: "3% en suscripciones audiovisuales (Netflix, Spotify). Otros servicios digitales pagan 4,5%." },
  { id: "santiago-del-estero", name: "Santiago del Estero", iibb: 0, note: SIN_REGIMEN },
  { id: "tierra-del-fuego", name: "Tierra del Fuego", iibb: 0.03 },
  { id: "tucuman", name: "Tucumán", iibb: 0, note: SIN_REGIMEN },
]

export type TaxSettings = {
  iva: boolean
  iibb: boolean
  percepcion: boolean
  province: string
}

// Por defecto está todo tildado: cada modo de pago decide qué impuestos le corresponden
// y el usuario solo puede destildar los que sí le corresponden (ver TaxApplicability).
export const DEFAULT_TAX_SETTINGS: TaxSettings = {
  iva: true,
  iibb: true,
  percepcion: true,
  province: "",
}

export function getProvince(id: string): Province | undefined {
  return PROVINCES.find(p => p.id === id)
}

export type TaxBreakdown = {
  base: number
  iva: number
  iibb: number
  percepcion: number
  total: number
}

export type TaxApplicability = { iva: boolean; iibb: boolean; percepcion: boolean }

/** Compra con tarjeta en pesos de un servicio digital (suscripciones): corresponden todos los impuestos. */
export const CARD_APPLIES: TaxApplicability = { iva: true, iibb: true, percepcion: true }

// `base` es el monto en pesos sin impuestos. `applies` excluye impuestos que no corresponden al medio de pago o rubro
// (ej.: videojuegos y pagos con dólares propios no pagan percepción de Ganancias).
export function calcTaxes(base: number, settings: TaxSettings, applies: TaxApplicability = CARD_APPLIES): TaxBreakdown {
  const province = getProvince(settings.province)
  const iva = settings.iva && applies.iva ? Math.round(base * IVA_RATE) : 0
  const iibb = settings.iibb && applies.iibb && province ? Math.round(base * province.iibb) : 0
  const percepcion = settings.percepcion && applies.percepcion ? Math.round(base * PERCEPCION_RATE) : 0
  const rounded = Math.round(base)
  return { base: rounded, iva, iibb, percepcion, total: rounded + iva + iibb + percepcion }
}
