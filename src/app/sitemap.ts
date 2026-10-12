import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  // Se genera en el build: lastModified refleja la fecha del último deploy
  const lastModified = new Date()
  return [
    { url: SITE_URL, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/servicios`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/metodologia`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/legal`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/arq`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ]
}
