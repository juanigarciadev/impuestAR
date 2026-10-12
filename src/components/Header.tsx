"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkMode from "./DarkMode";
import { Navbar } from "./ui/Navbar";
import SoftLinks from "./SoftLinks";

const LINKS = [
    { label: "Calculadora", href: "/" },
    { label: "Suscripciones", href: "/servicios" },
    { label: "Pagar con ARQ", href: "/arq" },
    { label: "Metodología", href: "/metodologia" },
]

export default function Header() {
    const pathname = usePathname()
    // El Navbar mide la ventana recién en el cliente: en el HTML del servidor pinta los links en línea.
    // Se ocultan hasta montar para que no se vea ese diseño ancho antes de pasar al menú.
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    return (
        <SoftLinks className={`pt-6 ${mounted ? "" : "[&_nav]:hidden"}`}>
            <Navbar
                sticky
                // El contenido es angosto (440px): los links siempre van dentro del menú, sin importar el ancho de la ventana
                breakpoint={100000}
                labels={{ navigation: "Principal", openMenu: "Abrir menú", closeMenu: "Cerrar menú" }}
                brand={
                    <Link href="/" aria-label="impuestAR, ir al inicio">
                        <img src="/logo.svg" className="w-[110px] dark:hidden" alt="impuestAR logo" />
                        <img src="/logo-white.svg" className="w-[110px] hidden dark:block" alt="impuestAR logo" />
                    </Link>
                }
                links={LINKS.map(link => ({ ...link, active: link.href === "/" ? pathname === "/" : pathname.startsWith(link.href) }))}
                alwaysVisibleActions={<DarkMode />}
            />
        </SoftLinks>
    )
}
