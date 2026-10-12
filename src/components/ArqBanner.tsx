import Link from "next/link";
import { Gamepad2, Gift } from "lucide-react";
import ArqReferralButton from "./ArqReferralButton";
import ReferralNotice from "./ReferralNotice";
import { ARQ_REWARD } from "@/lib/site";

// Cartel de ARQ del modo Videojuegos: ARQ no cobra IVA ni IIBB en compras de Steam y, para usuarios
// nuevos, suma el beneficio de bienvenida (ARQ_REWARD). En escritorio va como aside junto a la calculadora.
export default function ArqBanner() {
    const steps = ARQ_REWARD && [
        "Registrate con el botón de abajo",
        `Gastá ${ARQ_REWARD.minSpendUsd} USD en los primeros ${ARQ_REWARD.validDays} días`,
        `Recibís ${ARQ_REWARD.usd} USD en ${ARQ_REWARD.creditDays} días, en tu cuenta de ARQ`,
    ]

    return (
        <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(60deg,_rgb(22,_101,_52),_rgb(21,_128,_61),_rgb(16,_152,_173))] p-5 text-white shadow-sm animate-fade-up">
            <Gamepad2 aria-hidden size={96} className="absolute -right-3 -top-3 rotate-12 opacity-15" />
            <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">Mejor precio para tus juegos</span>
            <div className="flex flex-col gap-1">
                <span className="text-xl font-bold leading-tight text-balance">Pagá Steam con ARQ y no pagues impuestos</span>
                <span className="text-sm text-white/90">Tarjeta local gratis, sin IVA ni Ingresos Brutos.</span>
            </div>

            {ARQ_REWARD && steps && (
                <div className="flex flex-col gap-2 rounded-xl bg-black/20 p-3">
                    <span className="inline-flex items-center gap-2 text-sm font-bold">
                        <Gift size={16} aria-hidden /> +{ARQ_REWARD.usd} USD de regalo si sos usuario nuevo
                    </span>
                    <ol className="flex flex-col gap-1.5 text-sm text-white/90">
                        {steps.map((step, index) => (
                            <li key={step} className="flex items-start gap-2">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">{index + 1}</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <ArqReferralButton variant="light" />
                <Link href="/arq" className="text-sm font-medium underline underline-offset-2 hover:opacity-80">Cómo funciona y cómo activarla</Link>
            </div>

            <div className="flex flex-col gap-1">
                <ReferralNotice className="text-white/80" />
                {ARQ_REWARD && (
                    <span className="text-xs text-white/70">
                        Solo para usuarios nuevos registrados con este link. El monto, el gasto mínimo y los plazos los define ARQ y pueden cambiar.
                    </span>
                )}
            </div>
        </div>
    )
}
