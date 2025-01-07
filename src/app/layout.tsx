import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'

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
    <html lang="es">
      <body
        className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
