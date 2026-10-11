import { SITE_URL } from "./site"

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`

/** BreadcrumbList de schema.org a partir de una lista [nombre, ruta]. */
export function breadcrumbLd(items: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

/** Imagen para compartir (1200x630, en /public). Se resuelve contra metadataBase. */
export const SOCIAL_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "impuestAR: precio final en pesos de tus compras en dólares, con impuestos",
}
