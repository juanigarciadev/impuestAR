import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import ArqReferralButton from "./ArqReferralButton";

// Banner que se muestra al entrar al modo Videojuegos: ARQ no cobra IVA ni IIBB en compras de Steam.
export default function ArqBanner() {
    return (
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(60deg,_rgb(22,_101,_52),_rgb(21,_128,_61),_rgb(16,_152,_173))] p-5 text-white shadow-sm animate-fade-up">
            <Gamepad2 aria-hidden size={96} className="absolute -right-3 -top-3 rotate-12 opacity-15" />
            <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">Mejor precio para tus juegos</span>
            <div className="flex flex-col gap-1">
                <span className="text-xl font-bold leading-tight">Pagá Steam con ARQ y no pagues impuestos</span>
                <span className="text-sm text-white/90">La tarjeta local de ARQ sale gratis y no suma IVA ni Ingresos Brutos a tus compras.</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <ArqReferralButton variant="light" />
                <Link href="/arq" className="text-sm font-medium underline underline-offset-2 hover:opacity-80">Cómo funciona y cómo activarla</Link>
            </div>
        </div>
    )
}
