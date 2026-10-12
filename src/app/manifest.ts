import type { MetadataRoute } from "next"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"

// Permite instalar la app en el celular o la compu ("Agregar a pantalla de inicio")
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: precio final con impuestos`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: "es-AR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#171717",
    theme_color: "#1d4ed8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
