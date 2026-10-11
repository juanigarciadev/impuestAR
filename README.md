# impuestAR 💵

Calculadora gratuita y de código abierto para conocer el **precio final en pesos argentinos** de tus compras online en dólares (y otras monedas), con los impuestos que realmente te corresponden según cómo pagás y en qué provincia vivís. Incluye además los precios finales de suscripciones de streaming, música y cultura general.

De acceso libre, gratis y de código abierto.

## Qué hace

- **Cuatro modos de cálculo**, cada uno ya configurado con los impuestos que le corresponden:

  | Modo | Cotización | IVA 21% | IIBB | Percepción 30% |
  |---|---|---|---|---|
  | Dólar Tarjeta | oficial | ✔ | ✔ | ✔ |
  | Videojuegos | oficial | ✔ | ✔ | no aplica (0% desde abril 2025) |
  | Dólar MEP | bolsa | ✔ | ✔ | no aplica (dólares propios) |
  | Dólar Cripto | cripto | ✔ | ✔ | no aplica (dólares propios) |

  Los impuestos que no corresponden a un modo no se pueden activar. Los que sí corresponden se pueden desmarcar (por ejemplo, la percepción si la recuperás).
- **Otras monedas:** USD, EUR, BRL, CLP y UYU (estas últimas se calculan como compra con tarjeta, con la cotización oficial).
- **Ingresos Brutos por provincia:** elegí tu provincia y se aplica la alícuota de percepción sobre servicios digitales del exterior. Las provincias sin régimen confirmado figuran en 0%.
- **Suscripciones con impuestos:** los precios finales usan la misma configuración que la calculadora (IVA, provincia y percepción) y muestran un detalle por servicio.
- Números animados, modo claro/oscuro sin parpadeo y diseño pensado para celular.

## Impuestos considerados

- **IVA 21%** sobre servicios digitales del exterior.
- **Percepción del 30%** a cuenta de Ganancias/Bienes Personales (RG 5617) en compras con tarjeta en pesos. Es recuperable si no pagás esos impuestos.
- **Ingresos Brutos** de percepción según la provincia: CABA 2%, Buenos Aires 2%, Chaco 5,5%, Córdoba 3%, La Pampa 1%, Neuquén 4%, Río Negro 5%, Salta 3,6%, San Juan 3%, Santa Fe 3% (4,5% en otros servicios digitales) y Tierra del Fuego 3%.
- El **impuesto PAIS** ya no existe.

> Los valores son orientativos. La normativa y las alícuotas pueden cambiar; revisá tu resumen de tarjeta ante cualquier duda. Se verifican periódicamente siguiendo [docs/VERIFICACION.md](docs/VERIFICACION.md).

## Información general

Cotizaciones constantemente actualizadas mediante [DolarApi](https://dolarapi.com/docs/).

## Tecnologías

- [Next.js](https://nextjs.org/) 15 (App Router), React 19 y TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 3
- Componentes de [BlossomUI](https://blossomui.vercel.app/) (`Select`, `Checkbox`, `Input`, `Button`, `Modal`, `Badge`, `Alert` y `Skeleton`, adaptados a la paleta azul del proyecto)
- [Lucide](https://lucide.dev/) para los íconos
- SEO y GEO: metadata y Open Graph por página con imagen para compartir (`public/og.png`), JSON-LD (WebSite, WebApplication, FAQPage, HowTo, BreadcrumbList), contenido explicativo estático en la home, página de metodología con fuentes, `sitemap.xml`, `robots.txt` y un `llms.txt` generado desde las mismas constantes de impuestos

## Estructura

```
src/
  app/            Páginas, layout, mocks de suscripciones y contextos (tema e impuestos)
  components/     Calculadora, suscripciones, modal y demás componentes
  components/ui/  Componentes de BlossomUI
  lib/taxes.ts    Alícuotas, provincias y cálculo de impuestos
  lib/site.ts     Dominio, descripción, link de referido de ARQ y fecha de última revisión
  lib/seo.ts      Helpers de datos estructurados e imagen para compartir
  app/api/revision  Formulario "Solicitar una revisión" (envía un mail con Resend)
  app/llms.txt    llms.txt generado desde lib/taxes.ts
scripts/          Chequeo automático (verificar.mjs)
docs/             Guía de verificación periódica
```

## Desarrollo

Requiere Node 24.x.

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:3000
npm run verificar  # chequea cotizaciones, logos y muestra precios e impuestos cargados
```

Variables de entorno:

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | (opcional) dominio público: sitemap, canonical y Open Graph |
| `RESEND_API_KEY` | clave de [Resend](https://resend.com) para enviar los pedidos de revisión por mail |
| `REVIEW_TO_EMAIL` / `REVIEW_FROM_EMAIL` | (opcionales) destino y remitente del mail de revisión |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | (opcionales) contador compartido para el límite por IP del formulario |

## Mantenimiento

Cada fin de semana se revisan cotizaciones, impuestos, Ingresos Brutos y precios de las suscripciones. El paso a paso está en [docs/VERIFICACION.md](docs/VERIFICACION.md).

## Contacto y apoyo

- [GitHub](https://github.com/juanigarciadev/)
- [Cafecito](https://cafecito.app/juanigarciadev)
- juanigarciadev@gmail.com
