import Link from "next/link";
import { CreditCard, Wallet } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import ArqReferralButton from "./ArqReferralButton";
import { Badge } from "./ui/Badge";
import { ARQ_RATE_PREMIUM } from "@/lib/taxes";

const ars = (n: number) => '$' + n.toLocaleString('es-AR')

type Props = {
    /** Total en pesos pagando con tarjeta local (con los impuestos tildados). */
    cardTotal: number
    /** Total en pesos pagando con la tarjeta local de ARQ. */
    arqTotal: number
}

// Comparación para el modo Videojuegos: muestra cuánto se ahorra pagando con ARQ,
// que no cobra los impuestos que sí suman las tarjetas locales (IVA e IIBB).
export default function ArqComparison({ cardTotal, arqTotal }: Props) {
    const saving = cardTotal - arqTotal
    const cheaper = saving > 0
    const percent = cardTotal > 0 ? (saving / cardTotal) * 100 : 0

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-green-900/30 bg-green-100/60 p-5 dark:border-green-400/30 dark:bg-green-900/20">
            <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">¿Con qué te conviene pagar?</span>
                {cheaper && <Badge color="green" rounded>-{percent.toLocaleString('es-AR', { maximumFractionDigits: 0 })}%</Badge>}
            </div>

            <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-neutral-700 dark:text-neutral-300"><CreditCard size={16} /> Tarjeta local</span>
                <span className="font-medium tabular-nums"><AnimatedNumber value={cardTotal} format={ars} /></span>
            </div>
            <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-medium text-green-900 dark:text-green-300"><Wallet size={16} /> Tarjeta de ARQ</span>
                <span className="text-lg font-bold tabular-nums text-green-900 dark:text-green-300"><AnimatedNumber value={arqTotal} format={ars} /></span>
            </div>

            {cheaper && cardTotal > 0 && (
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                    Pagando con ARQ te ahorrás <AnimatedNumber value={saving} format={ars} /> porque no paga IVA ni Ingresos Brutos.
                </p>
            )}

            <ArqReferralButton />
            <Link href="/arq" className="text-sm font-medium underline underline-offset-2 text-green-900 dark:text-green-300">Cómo funciona y cómo activarla</Link>

            <span className="text-xs text-neutral-500">
                ARQ usa su propia cotización, estimada en {(ARQ_RATE_PREMIUM * 100).toLocaleString('es-AR', { maximumFractionDigits: 1 })}% sobre la oficial, y puede variar. La tarjeta local suma los impuestos que tengas tildados arriba.
            </span>
        </div>
    )
}
