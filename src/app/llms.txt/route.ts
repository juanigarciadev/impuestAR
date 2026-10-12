import { ARQ_RATE_PREMIUM, IVA_RATE, PERCEPCION_RATE, PROVINCES } from "@/lib/taxes"
import { formatReviewedDate, REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

const pct = (n: number) => (n * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "%"

// Se genera desde las mismas constantes que usa la calculadora, así no se desfasa de taxes.ts.
export function GET() {
  const provinces = [...PROVINCES].sort((a, b) => a.name.localeCompare(b.name, "es"))
  const withRegime = provinces.filter(p => p.iibb > 0).map(p => `${p.name} ${pct(p.iibb)}`).join(", ")
  const withoutRegime = provinces.filter(p => p.iibb === 0).map(p => p.name).join(", ")

  const body = `# ${SITE_NAME}

> Calculadora gratuita y de código abierto para conocer el precio final en pesos argentinos de compras en dólares (tarjeta, MEP, cripto, videojuegos) y de suscripciones digitales, con IVA ${pct(IVA_RATE)} incluido.

Última revisión de alícuotas y reglas: ${formatReviewedDate()}.

## Páginas
- [Calculadora](${SITE_URL}/): convierte un monto en USD u otra moneda a ARS según la cotización elegida e impuestos.
- [Suscripciones](${SITE_URL}/servicios): precios finales con impuestos de plataformas de streaming, música y más.
- [Pagar Steam con ARQ](${SITE_URL}/arq): cómo funciona la tarjeta local de ARQ, cómo activarla y por qué evita el IVA en compras de Steam.
- [Metodología y fuentes](${SITE_URL}/metodologia): cotizaciones, alícuotas, fórmula, IIBB por provincia y limitaciones.
- [Novedades](${SITE_URL}/novedades): historial de cambios del sitio (precios, planes, funciones y ajustes).

## Impuestos considerados
- IVA ${pct(IVA_RATE)} sobre servicios digitales del exterior.
- Percepción ${pct(PERCEPCION_RATE)} a cuenta de Ganancias/Bienes Personales en compras con tarjeta en pesos (recuperable). No aplica a videojuegos (0% desde abril de 2025) ni a pagos con dólares propios (MEP/cripto).
- Ingresos Brutos de percepción sobre servicios digitales del exterior, según provincia: ${withRegime}. Sin régimen confirmado (0%): ${withoutRegime}.
- El impuesto PAIS fue derogado el 23/12/2024.

## Fórmula
precio sin impuestos = USD × cotización; total = precio + IVA + IIBB + percepción, con cada impuesto calculado sobre el precio sin impuestos y redondeado al peso.

## Datos
- Cotizaciones en tiempo real de https://dolarapi.com: oficial (tarjeta y videojuegos), bolsa (MEP) y cripto. Monedas: USD, EUR, BRL, CLP y UYU.
- Tarjeta de ARQ: estimación de dólar oficial + ${pct(ARQ_RATE_PREMIUM)} sin IVA, IIBB ni percepción. ARQ no publica su cotización en una API pública.
- Los valores son orientativos y pueden variar unos pocos pesos.
- Código fuente: ${REPO_URL}
`

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
