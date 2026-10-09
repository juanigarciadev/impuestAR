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
        settings.iibb && province && province.iibb > 0 && { label: `IIBB ${province.name} ${pct(province.iibb)}`, color: "green" as const },
        settings.percepcion && { label: `Percepción ${pct(PERCEPCION_RATE)}`, color: "yellow" as const },
    ].filter(Boolean) as { label: string; color: "default" | "green" | "yellow" }[]

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500">Incluye:</span>
            {badges.length ? badges.map(b => <Badge key={b.label} color={b.color} rounded>{b.label}</Badge>) : <Badge color="dark" rounded>Sin impuestos</Badge>}
        </div>
    )
}
