import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import { ARQ_REFERRAL_URL, ARQ_REWARD } from "@/lib/site";
import ReferralNotice from "./ReferralNotice";

// Beneficio de bienvenida de ARQ: se muestra debajo de la calculadora en Videojuegos y en /arq.
// `showMore` muestra el link a /arq; se oculta en la propia página de ARQ.
export default function ArqRewardBanner({ showMore = true }: { showMore?: boolean }) {
    if (!ARQ_REWARD) return null
    const { usd, minSpendUsd, creditDays, validDays } = ARQ_REWARD

    const steps = [
        { title: "Registrate", text: "con el botón de abajo" },
        { title: `Gastá ${minSpendUsd} USD`, text: `en los primeros ${validDays} días` },
        { title: `Recibí ${usd} USD`, text: `en ${creditDays} días, en tu cuenta` },
    ]

    const cta = "inline-flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-[.99] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-400"
    const label = <>Quiero mis {usd} USD <ArrowRight size={16} /></>

    return (
        <aside
            aria-label="Beneficio de bienvenida de ARQ"
            className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-neutral-900 shadow-sm animate-fade-up dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-blue-700 text-white dark:bg-blue-600">
                    <span className="text-2xl font-extrabold leading-none">+{usd}</span>
                    <span className="text-[11px] font-semibold leading-tight">USD</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                        <Gift size={14} aria-hidden /> Beneficio para usuarios nuevos
                    </span>
                    <span className="text-lg font-bold leading-tight text-neutral-900 dark:text-white">
                        Registrate en ARQ y llevate {usd} USD
                    </span>
                </div>
            </div>

            <ol className="grid grid-cols-3 gap-2">
                {steps.map((step, index) => (
                    <li key={step.title} className="flex flex-col gap-1 rounded-xl border border-blue-100 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">{index + 1}</span>
                        <span className="text-sm font-semibold leading-tight text-neutral-900 dark:text-white">{step.title}</span>
                        <span className="text-xs leading-snug text-neutral-600 dark:text-slate-300">{step.text}</span>
                    </li>
                ))}
            </ol>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {ARQ_REFERRAL_URL
                    ? <a href={ARQ_REFERRAL_URL} target="_blank" rel="noopener noreferrer sponsored" className={cta}>{label}</a>
                    : <button type="button" className={cta}>{label}</button>}
                {showMore && <Link href="/arq" className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:opacity-80 dark:text-blue-300">Cómo se activa</Link>}
            </div>

            <ReferralNotice className="text-neutral-600 dark:text-slate-400" />
            <p className="text-xs text-neutral-600 dark:text-slate-400">
                Solo para usuarios nuevos registrados con este link. El monto, el gasto mínimo y los plazos los define ARQ y pueden cambiar. La tarjeta local es gratuita.
            </p>
        </aside>
    )
}
