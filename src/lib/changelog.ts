// Novedades visibles para quien usa la web (la página /novedades). Más nuevas primero.
// Al cambiar algo que se vea en la web, sumá una entrada acá (o agregá un punto a la del día).
export type ChangelogEntry = {
  /** AAAA-MM-DD */
  date: string
  title: string
  changes: string[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-10-12",
    title: "Suscripciones con todos los planes y Mis suscripciones",
    changes: [
      "Cada suscripción muestra todos sus planes con impuestos: Netflix, Spotify, Crunchyroll, Disney+, Paramount, Apple TV y Hulu, con precios actualizados. Se quitó max por falta de una fuente confiable.",
      "Los planes en dólares (Apple TV y Hulu) se convierten con el dólar oficial; los anuales de Crunchyroll y Paramount figuran como sin verificar.",
      "Cada servicio indica cuándo se verificaron sus precios y tiene el botón \"¿Cambió el precio? Avisanos\".",
      "Mis suscripciones: armá tu lista, mirá cuánto pagás por mes y por año con impuestos, dividilo entre personas y llevalo a otro dispositivo con un link, un código o un archivo.",
      "Videojuegos: hora de la cotización, atajos de precio (US$ 20, 40, 70 y 80) y el total con ARQ dentro de la tarjeta del resultado.",
      "Nuevo logo en el header y el footer, y la app se puede instalar en el celular o la compu.",
      "ARQ: se quitó el beneficio de 3 USD, porque es una promoción exclusiva de Steamcito x ARQ y no aplica a nuestro link.",
      "La FAQ de ARQ aclara que cada tienda decide qué tarjetas acepta, con las fuentes oficiales de PlayStation y Nintendo.",
    ],
  },
  {
    date: "2026-10-11",
    title: "Sección de ARQ, metodología y aviso legal",
    changes: [
      "Nueva sección sobre la tarjeta de ARQ: cómo funciona, cómo activarla y cuánto ahorrás pagando Steam con ella.",
      "Metodología y fuentes: cotizaciones, impuestos, fórmula, IIBB por provincia y limitaciones.",
      "Aviso legal y privacidad, con avisos de referido donde corresponde.",
      "Preguntas frecuentes en la home, incluida la explicación de cómo se calcula el precio final.",
      "\"Solicitar una revisión\" ahora es un formulario dentro de la app: el mensaje te llega al mail del proyecto.",
      "Las provincias figuran en orden alfabético y con 0% cuando no tienen régimen de IIBB.",
      "El modo oscuro se mantiene al cambiar de página y el header ya no parpadea.",
    ],
  },
  {
    date: "2026-10-09",
    title: "Rediseño y nuevos modos de cálculo",
    changes: [
      "Rediseño completo con componentes de BlossomUI.",
      "Cuatro modos de cálculo: Dólar Tarjeta, Videojuegos, Dólar MEP y Dólar Cripto, cada uno con los impuestos que le corresponden.",
      "Ingresos Brutos por provincia y soporte para EUR, BRL, CLP y UYU.",
    ],
  },
]

export const LATEST_CHANGE_DATE = CHANGELOG[0].date
