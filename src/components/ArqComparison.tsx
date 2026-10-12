import Link from "next/link";
import { Wallet } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import { Badge } from "./ui/Badge";
import { ARQ_RATE_PREMIUM } from "@/lib/taxes";

const ars = (n: number) => '$' + n.toLocaleString('es-AR')

type Props = {
    /** Total en pesos pagando con tarjeta local (con los impuestos tildados). */
    cardTotal: number
    /** Total en pesos pagando con la tarjeta local de ARQ. */
    arqTotal: number
}

// Bloque que va dentro de la tarjeta del total (modo Videojuegos): cuánto sale pagando con ARQ
// y cuánto se ahorra, porque ARQ no cobra los impuestos que sí suman las tarjetas locales (IVA e IIBB).
export default function ArqComparison({ cardTotal, arqTotal }: Props) {
    const saving = cardTotal - arqTotal
    const cheaper = saving > 0
    const percent = cardTotal > 0 ? (saving / cardTotal) * 100 : 0

    return (
        <div className="flex flex-col gap-2 pt-3 border-t border-neutral-300 dark:border-neutral-600">
            <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-medium text-green-800 dark:text-green-300">
                    <Wallet size={16} /> Con la tarjeta de ARQ
                    {cheaper && <Badge color="green" rounded>-{percent.toLocaleString('es-AR', { maximumFractionDigits: 0 })}%</Badge>}
                </span>
                <span aria-live="polite" className="text-xl font-bold tabular-nums text-green-800 dark:text-green-300"><AnimatedNumber value={arqTotal} format={ars} /></span>
            </div>

            {cheaper && (
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Te ahorrás <AnimatedNumber value={saving} format={ars} /> porque ARQ no cobra IVA ni Ingresos Brutos.
                </p>
            )}

            <span className="text-xs text-neutral-500">
                ARQ usa su propia cotización, estimada en {(ARQ_RATE_PREMIUM * 100).toLocaleString('es-AR', { maximumFractionDigits: 1 })}% sobre la oficial, y puede variar.{" "}
                <Link href="/arq" className="underline underline-offset-2">Cómo funciona y cómo activarla</Link>
            </span>
        </div>
    )
}
