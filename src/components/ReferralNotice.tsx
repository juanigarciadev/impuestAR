import Link from "next/link";

// Aviso de enlace de referido: se muestra junto a cada botón que lleva al registro en ARQ.
export default function ReferralNotice({ className = "text-neutral-500" }: { className?: string }) {
    return (
        <span className={`text-xs ${className}`}>
            Enlace de referido: si te registrás con él, impuestAR puede recibir una compensación, sin costo extra para vos.{" "}
            <Link href="/legal" className="underline underline-offset-2">Más información</Link>
        </span>
    )
}
