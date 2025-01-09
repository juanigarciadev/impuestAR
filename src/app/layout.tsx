import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "./context/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportBanner from "@/components/Support";
import UpdateRequest from "@/components/UpdateRequest";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', 
  },
  title: "impuestAR",
  description: "Herramienta para calcular el precio del dólar en Argentina para compras internacionales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body className={inter.className}>
        <ThemeProvider>
              <div className="w-screen flex justify-center items-center dark:bg-neutral-900">
                <main className="w-[440px] min-h-screen pb-4 mx-4 flex flex-col gap-4 items-center sm:items-start">
                  <Header/>
                  {children}
                  <div className="flex flex-col w-full gap-2">
                    <SupportBanner/>
                    <UpdateRequest/>
                  </div>
                  <Footer/>
                </main>
              </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
