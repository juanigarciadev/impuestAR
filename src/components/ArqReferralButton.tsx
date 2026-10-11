import { ArrowRight } from "lucide-react";
import { ARQ_REFERRAL_URL } from "@/lib/site";

const base = "inline-flex w-fit items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold active:scale-[.99] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

type Props = {
    /** `light` va sobre fondos de color; `solid` sobre fondo neutro. */
    variant?: "light" | "solid"
    className?: string
}

// Botón de registro en ARQ con el link de referido. Si ARQ_REFERRAL_URL está vacío se muestra
// igual, pero sin destino (queda inerte) hasta que se cargue el link en src/lib/site.ts.
export default function ArqReferralButton({ variant = "solid", className = "" }: Props) {
    const style = `${base} ${variant === "light" ? "bg-white text-green-900" : "bg-green-700 text-white"} ${className}`
    const label = <>Pedir mi tarjeta ARQ <ArrowRight size={16} /></>

    if (!ARQ_REFERRAL_URL) {
        return <button type="button" className={style}>{label}</button>
    }
    return <a href={ARQ_REFERRAL_URL} target="_blank" rel="noopener noreferrer sponsored" className={style}>{label}</a>
}
