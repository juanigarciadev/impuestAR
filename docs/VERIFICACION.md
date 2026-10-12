# Verificación semanal de impuestAR

Guía para Claude: se ejecuta **todos los fines de semana** para detectar cambios en cotizaciones, impuestos, IIBB y precios de suscripciones. Si el usuario dice "hacé la verificación semanal", seguí estos pasos en orden.

## Reglas

- **No correr `npm run build` ni `next build`**: pisa `.next` y rompe el dev server del usuario. Para validar tipos usar `npx tsc --noEmit`.
- **No cambiar valores sin fuente confiable.** Si una fuente no alcanza, no modifiques: dejá el valor y reportá la duda al usuario.
- **Jerarquía de fuentes:** (1) normativa y sitios oficiales (ARCA, Boletín Oficial, agencias provinciales: ARBA, AGIP, API Santa Fe, DGR Córdoba, etc.); (2) medios de prensa económicos serios con fecha reciente; (3) blogs de contadores; (4) calculadoras y comparadores comerciales (**solo para contrastar, nunca como única fuente**).
- **Desconfiar de notas sin respaldo oficial.** Antecedente: una nota que anunciaba "desde enero 2026 ya no rige el 30%" era una broma del Día de los Inocentes (la propia nota lo aclaraba) y el proyecto había llegado a sacar la percepción por eso. Abrir siempre la fuente completa, leer la nota del editor y comprobar la fecha.
- **Cruzar siempre dos fuentes independientes** antes de cambiar una alícuota o una regla.
- Al terminar, **no commitear ni pushear sin que el usuario lo pida**. Mostrar un resumen de lo que cambió.

## Paso 1. Chequeo automático

```bash
npm run verificar
```

El script (`scripts/verificar.mjs`) no modifica archivos y revisa:

- DolarApi responde y trae `oficial`, `bolsa`, `cripto`, `tarjeta`, `EUR`, `BRL`, `CLP` y `UYU`, con fecha de actualización razonable (aviso si pasaron más de 72 h).
- `tarjeta / oficial` ≈ 1,30. Si cambia, DolarApi modificó su cálculo o cambió la percepción de Ganancias: ir al paso 3.
- Todos los logos de `servicesMock.ts` cargan como imagen (si uno falla, buscar otra URL estable; las miniaturas de Wikimedia solo aceptan tamaños estándar como `250px`).
- Imprime la tabla de precios de las suscripciones y las constantes de `taxes.ts` para tenerlas a la vista.

Cualquier **FALLA** o **AVISO** se resuelve antes de seguir.

## Paso 2. Cotizaciones y mapeo de modos

Los modos de `src/components/Calculator.tsx` dependen de estas cotizaciones de DolarApi (`https://dolarapi.com/v1/dolares` y `/cotizaciones`):

| Modo | Cotización usada | Campo |
|---|---|---|
| Tarjeta y Videojuegos | oficial | `casa: "oficial"` |
| MEP | bolsa | `casa: "bolsa"` |
| Cripto | cripto | `casa: "cripto"` |
| EUR, BRL, CLP, UYU | oficial de cada moneda | `moneda` en `/cotizaciones` |

Verificar que:

1. El MEP siga siendo `bolsa` (en DolarApi `contadoconliqui` es el CCL, no el MEP).
2. Los campos `casa` y `moneda` no hayan cambiado de nombre.
3. La documentación de DolarApi (`https://dolarapi.com/docs/argentina/`) no anuncie endpoints nuevos o cambios.

## Paso 3. Impuestos nacionales (`src/lib/taxes.ts`)

Buscar novedades de las últimas semanas (usar WebSearch con el mes actual) sobre cada punto. Registrar la fuente y la fecha.

| Impuesto | Valor actual | Qué buscar |
|---|---|---|
| IVA servicios digitales del exterior | 21% (`IVA_RATE`) | Cambios de alícuota o de régimen (Ley 27.430, RG ARCA 4240) |
| Percepción Ganancias/Bienes Personales | 30% (`PERCEPCION_RATE`) | Cambios de la RG 5617; ver si se elimina, se reduce o cambia su base |
| Impuesto PAIS | Derogado (23/12/2024) | Que no vuelva a crearse ningún recargo equivalente |
| Videojuegos | Sin percepción (0% desde abril de 2025) | Que no se reponga para plataformas de juegos |
| Pago con dólares propios (MEP/cripto) | Sin percepción, con IVA e IIBB | Cambios en cómo se cobra el IVA según el medio de pago |

Si algo cambia, actualizar en este orden:

1. `PERCEPCION_RATE` / `IVA_RATE` y el comentario del encabezado de `taxes.ts`.
2. `CARD_APPLIES` y los `applies` de `DOLLARS` en `Calculator.tsx` (qué impuestos corresponden a cada modo, y los `percepcionHint`).
3. `README.md` (sección Impuestos) y `DATA_REVIEWED_ISO` en `src/lib/site.ts` (fecha de última revisión que muestran las páginas). `llms.txt` y `/metodologia` se generan solos desde `taxes.ts`.
4. La clave `STORAGE_KEY` de `src/app/context/TaxProvider.tsx` (subir de versión, por ejemplo `tax-settings-v3`) si cambian los valores por defecto, para descartar preferencias guardadas.

**Dudas abiertas que conviene seguir intentando confirmar:**

- La percepción del 30%, ¿se calcula sobre el precio sin IVA o con IVA incluido? Hoy se calcula **sin IVA** (+51% con IVA y percepción).
- Pago con dólares propios: ¿corresponde IVA siempre? Hoy se asume que sí.

## Paso 4. Ingresos Brutos por provincia (`PROVINCES` en `taxes.ts`)

Régimen de **percepción de IIBB sobre servicios digitales prestados por sujetos del exterior** (base: monto neto de IVA, pago único y definitivo).

Alícuotas cargadas hoy: CABA 2%, Buenos Aires 2%, Chaco 5,5%, Córdoba 3%, La Pampa 1%, Neuquén 4%, Río Negro 5%, Salta 3,6%, San Juan 3%, Santa Fe 3% (suscripciones audiovisuales; otros servicios digitales 4,5%), Tierra del Fuego 3%. El resto está en 0% con la nota "Sin régimen de percepción confirmado".

Procedimiento:

1. Revisar si cada una de las 11 provincias con régimen cambió la alícuota en su ley impositiva o resolución general del año en curso. Fuentes oficiales: ARBA, AGIP, API (Santa Fe), DGR Córdoba, DGR Salta, DGR La Pampa, DGR San Juan, y las agencias de Chaco, Neuquén, Río Negro y Tierra del Fuego.
2. Buscar si alguna de las 13 jurisdicciones en 0% implementó un régimen nuevo (en especial Mendoza, Tucumán, Entre Ríos, Chubut, Jujuy y Misiones). Buscar "percepción Ingresos Brutos servicios digitales exterior [provincia] [año]".
3. Si una provincia nueva aparece, cargar `iibb` y quitar su `note`.
4. Notas sobre estos valores: las alícuotas de CABA, Buenos Aires, Chaco, Córdoba, La Pampa, Neuquén, Río Negro, Salta, Santa Fe y Tierra del Fuego están respaldadas por al menos dos fuentes; **San Juan (3%) viene de una sola fuente** y conviene confirmarla con la norma (RG DGR 755/2025).

## Paso 5. Precios de las suscripciones (`src/app/mocks/servicesMock.ts`)

Los precios del mock son en **pesos argentinos, sin impuestos**, por mes (`duration: "/m"`). La app suma los impuestos encima.

Para cada servicio:

1. Buscar el precio vigente del plan más usado en Argentina en la página oficial del servicio (ejemplos de búsqueda: `precio Netflix Argentina plan estándar [mes año]`). Priorizar la página oficial; usar notas de prensa solo para contrastar.
2. **Determinar si el precio publicado ya incluye impuestos.** Si incluye IVA, IIBB o percepción, dividir para llegar al precio sin impuestos: `precio_sin_impuestos = precio_publicado / (1 + IVA + otros_incluidos)`. Si el servicio publica en dólares, convertir con la cotización oficial del día. Dejar anotado qué se asumió.
3. Si el precio cambió, actualizar `price` en el mock. Si el servicio dejó de existir o cambió de nombre, actualizar `name`. Si no se consigue el precio de un servicio de forma confiable, es válido sacarlo de la lista (se hizo con max en octubre de 2026).
4. Verificar que el plan sea el mismo que ya estaba (estándar, individual, etc.). No cambiar de plan sin avisar al usuario.
5. Si hay servicios nuevos populares para sumar, proponérselos al usuario, no agregarlos solo.

Servicios cargados hoy: YouTube Premium, Spotify, Crunchyroll, Netflix, Disney+, Amazon Prime Video, Apple TV, Hulu y Paramount. Cada servicio tiene una lista de `plans` (de menor a mayor precio): la app los muestra todos en el modal y usa el más barato (sin requisitos) para el "desde" de la tarjeta.

Cada servicio lleva `verifiedAt` (AAAA-MM-DD): la fecha en que se contrastó con su página oficial. **Actualizala en cada verificación**: el modal la muestra ("Precios verificados el…") y `npm run verificar` avisa si pasaron más de 30 días o si falta. Los servicios sin fecha se muestran como "sin verificar". El modal también tiene el botón "¿Cambió el precio? Avisanos", que abre el formulario de revisión con el mensaje prearmado.

Formato de un plan en `servicesMock.ts`: `{ name, price, currency?: "USD", duration?: "/año", note?, restricted? }`. `restricted` marca planes con requisitos (por ejemplo estudiantes): se listan, pero no cuentan para el "desde". Los planes en `USD` se convierten con el dólar oficial en la app.

Planes cargados el 12/10/2026 (precio sin impuestos, salvo que se aclare):

| Servicio | Planes | Fuente |
|---|---|---|
| Netflix | Básico $8.999, Estándar $14.999, Premium $19.999 | help.netflix.com/es/node/24926 (el precio no incluye impuestos). No se cargaron los miembros extra ($5.399) |
| Spotify | Estudiantes $2.299 (restringido), Individual $4.499, Duo $5.999, Familiar $7.599 | spotify.com/ar/premium (precio + impuestos; no se usa la oferta de 2 meses) |
| Crunchyroll | Fan $5.199, Mega Fan $6.099 | crunchyroll.com/es (+ impuestos aplicables) |
| Disney+ | Estándar con anuncios $9.916,53; Estándar $12.891,74; Premium $19.833,88; anuales Estándar $107.437,19 y Premium $165.288,43 | help.disneyplus.com/es-AR/article/disneyplus-price (valores "sin impuestos nacionales") |
| Paramount | Estándar $5.578,51 y Premium $7.768,60 | paramountplus.com/ar. El precio mostrado es neto de IVA (finales: 6.750 y 9.400) |
| Apple TV | US$ 14,99; con Peacock Premium US$ 17,99 (desde); con Peacock Premium Plus US$ 22,99 | tv.apple.com, tienda de EE. UU. en dólares (no es el precio en pesos de Argentina) |
| Hulu | 11 planes en US$ (Hulu y bundles con Disney+, ESPN y HBO Max, más el anual) | help.hulu.com/article/hulu-how-much-does-hulu-cost. Sin Live TV, add-ons ni planes legacy |
| YouTube Premium, Amazon Prime Video | Sin cambios | Sin contrastar |

## Paso 6. Verificaciones de código

1. `npx tsc --noEmit` debe dar 0 errores.
2. Que `README.md`, los textos de `Calculator.tsx`, las preguntas frecuentes de `HomeInfo.tsx` y la página `/metodologia` digan lo mismo que `taxes.ts`. `llms.txt` se genera desde `taxes.ts`.
3. Que `NEXT_PUBLIC_SITE_URL` o `SITE_URL` en `src/lib/site.ts` apunten al dominio real, (`llms.txt` y el sitemap lo toman de ahí).

## Paso 7. Reporte al usuario

Entregar un resumen corto con:

- **Cambios aplicados:** valor anterior, valor nuevo, archivo y fuente (con link y fecha).
- **Dudas sin resolver:** qué no se pudo confirmar y por qué no se tocó.
- **Fallas automáticas:** logos rotos, endpoints caídos, etc.
- Si no hubo nada nuevo, decirlo en una línea.

## Registro de verificaciones

Agregar una fila por verificación (la más reciente arriba).

| Fecha | Qué se revisó | Cambios | Pendientes |
|---|---|---|---|
| 2026-10-12 | Precios y todos los planes de Netflix, Spotify, Crunchyroll, Disney+, Paramount, Apple TV y Hulu según sus páginas oficiales (pasados por el usuario); se quitó max por falta de una fuente confiable; el mock pasó a tener `plans` | `servicesMock.ts`, `lib/services.ts`, tarjeta y modal | YouTube Premium y Amazon Prime Video sin contrastar; Apple TV y Hulu en USD (tienda de EE. UU.) |
| 2026-10-09 | Alta inicial de la guía. Modos de cálculo definidos, percepción 30% reincorporada (la nota que la daba por eliminada era una broma del Día de los Inocentes), IIBB cargado para 11 jurisdicciones, logos de max y Apple TV corregidos | Ver commits | Base de la percepción (con o sin IVA), IVA en pagos con dólares propios, San Juan con una sola fuente, precios de suscripciones sin contrastar con páginas oficiales |
