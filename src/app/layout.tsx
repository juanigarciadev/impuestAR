import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
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
    siteName: SITE_NAME,
    title: "impuestAR | Calculá el precio del dólar con impuestos",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "impuestAR | Calculá el precio del dólar con impuestos",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  inLanguage: "es-AR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
};

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
