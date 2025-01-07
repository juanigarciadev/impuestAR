import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "impuestAR",
  description: "Herramienta para calcular el precio del dólar en Argentina para compras internacionales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={openSans.className}
      >
        {children}
      </body>
    </html>
  );
}
