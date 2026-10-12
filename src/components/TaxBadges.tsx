"use client"
import { getProvince, IVA_RATE, PERCEPCION_RATE } from "@/lib/taxes"
import { useTaxSettings } from "@/app/context/TaxProvider"
import { Badge } from "./ui/Badge"

const pct = (n: number) => (n * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "%"

// Muestra qué impuestos están incluidos en los precios de las suscripciones
export default function TaxBadges() {
    const { settings } = useTaxSettings()
    const province = getProvince(settings.province)
    const badges = [
        settings.iva && { label: `IVA ${pct(IVA_RATE)}`, color: "default" as const },
        // Siempre se muestra si IIBB está tildado: sin provincia o en una provincia sin régimen figura en 0%
        settings.iibb && (province
            ? { label: `IIBB ${province.name} ${pct(province.iibb)}`, color: province.iibb > 0 ? "green" as const : "default" as const }
            : { label: `IIBB ${pct(0)}`, color: "default" as const }),
        settings.percepcion && { label: `Percepción ${pct(PERCEPCION_RATE)}`, color: "yellow" as const },
    ].filter(Boolean) as { label: string; color: "default" | "green" | "yellow" }[]

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500">Incluye:</span>
            {badges.length ? badges.map(b => <Badge key={b.label} color={b.color} rounded>{b.label}</Badge>) : <Badge color="dark" rounded>Sin impuestos</Badge>}
        </div>
    )
}
