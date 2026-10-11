"use client"
import { useRouter } from "next/navigation"
import type { MouseEvent, ReactNode } from "react"

// Los componentes de BlossomUI (Navbar, Footer) usan <a href>, que recarga toda la página.
// Este wrapper convierte los clicks en enlaces internos en navegación del router de Next,
// así el layout, el tema y el estado se conservan entre páginas.
export default function SoftLinks({ children, className }: { children: ReactNode; className?: string }) {
    const router = useRouter()

    const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const anchor = (event.target as HTMLElement).closest("a")
        const href = anchor?.getAttribute("href")
        if (!anchor || !href || !href.startsWith("/") || anchor.target === "_blank") return
        event.preventDefault()
        router.push(href)
    }

    return <div className={className} onClickCapture={onClickCapture}>{children}</div>
}
