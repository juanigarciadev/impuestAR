"use client"
import { calcTaxes } from "@/lib/taxes"
import { defaultPlans, hasUsdPlans, planBase, type Service } from "@/lib/services"
import { useOfficialRate } from "@/lib/useOfficialRate"
import { useTaxSettings } from "@/app/context/TaxProvider"
import { Skeleton } from "./ui/Skeleton"
import ServiceLogo from "./ServiceLogo"

export default function ServiceCard({ service, onSelect }: { service: Service; onSelect: (service: Service) => void }) {
    const { settings } = useTaxSettings()
    const usd = hasUsdPlans(service)
    const rate = useOfficialRate(usd)

    // Se muestra el plan más barato con el período por defecto: "desde $X" si hay más de un plan
    const plans = defaultPlans(service)
    const totals = plans
        .map(plan => planBase(plan, rate))
        .filter((base): base is number => base !== null)
        .map(base => calcTaxes(base, settings).total)
    const from = totals.length ? Math.min(...totals) : null
    const loading = usd && from === null

    return (
        <button onClick={() => onSelect(service)} className="flex items-center gap-4 w-full text-left border border-neutral-200 rounded-xl px-5 py-4 select-none cursor-pointer hover:bg-neutral-100 hover:border-neutral-300 duration-200 active:scale-[.99] dark:bg-neutral-800/60 dark:border-neutral-700 dark:hover:bg-neutral-800">
            <ServiceLogo name={service.name} src={service.logo} />
            <span className="font-medium flex-1 dark:text-white">{service.name}</span>
            {loading ? (
                <Skeleton className="h-5 w-20" />
            ) : (
                <span className="inline-flex items-baseline gap-1">
                    {plans.length > 1 && <span className="text-xs text-neutral-500">desde</span>}
                    <span className="font-semibold text-neutral-800 tabular-nums dark:text-neutral-200">${(from ?? 0).toLocaleString('es-AR')}</span>
                    <span className="text-sm text-neutral-500">{service.duration}</span>
                </span>
            )}
        </button>
    )
}
