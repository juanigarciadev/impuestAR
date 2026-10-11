import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_URL, REPO_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { SOCIAL_IMAGE } from "@/lib/seo";
import "./globals.css";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "./context/ThemeProvider";
import { TaxProvider } from "./context/TaxProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportBanner from "@/components/Support";
import UpdateRequest from "@/components/UpdateRequest";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "impuestAR | Calculá el precio del dólar con impuestos",
    template: "%s | impuestAR",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: SITE_NAME,
    images: [SOCIAL_IMAGE],
    title: "impuestAR | Calculá el precio del dólar con impuestos",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    images: [SOCIAL_IMAGE.url],
    title: "impuestAR | Calculá el precio del dólar con impuestos",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "es-AR",
    publisher: { "@id": `${SITE_URL}/#author` },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#app`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: "es-AR",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
    author: { "@id": `${SITE_URL}/#author` },
    isBasedOn: REPO_URL,
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#author`,
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    sameAs: [AUTHOR_URL, REPO_URL],
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overflow-x-hidden" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-900 dark:text-white`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div aria-hidden="true" className="bg-glow" />
        <JsonLd data={jsonLd} />
        <ThemeProvider>
          <TaxProvider>
              <div className="w-full flex justify-center">
                <main className="w-full max-w-[440px] min-h-screen pb-6 mx-4 flex flex-col gap-6">
                  <Header/>
                  {children}
                  <div className="flex flex-col w-full gap-2">
                    <SupportBanner/>
                    <UpdateRequest/>
                  </div>
                  <Footer/>
                </main>
              </div>
          </TaxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
