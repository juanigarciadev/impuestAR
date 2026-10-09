"use client"
import { useState } from "react"

// Si el logo remoto no carga, se muestra la inicial del servicio en lugar de la imagen rota
export default function ServiceLogo({ name, src, className = "h-6 w-6" }: { name: string; src: string; className?: string }) {
    const [failed, setFailed] = useState(false)

    if (failed) {
        return (
            <span aria-hidden="true" className={`${className} inline-flex shrink-0 items-center justify-center rounded bg-neutral-200 text-xs font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300`}>
                {name.charAt(0).toUpperCase()}
            </span>
        )
    }
    return <img src={src} alt="" onError={() => setFailed(true)} className={`${className} shrink-0 rounded object-contain`} />
}
