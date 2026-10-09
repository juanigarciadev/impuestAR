"use client"
import { calcTaxes } from "@/lib/taxes"
import { useTaxSettings } from "@/app/context/TaxProvider"
import type { Service } from "./ServiceModal"
import ServiceLogo from "./ServiceLogo"

export default function ServiceCard({ service, onSelect }: { service: Service; onSelect: (service: Service) => void }) {
    const { settings } = useTaxSettings()
    const { total } = calcTaxes(service.price, settings)

    return (
        <button onClick={() => onSelect(service)} className="flex items-center gap-4 w-full text-left border border-neutral-200 rounded-xl px-5 py-4 select-none cursor-pointer hover:bg-neutral-100 hover:border-neutral-300 duration-200 active:scale-[.99] dark:bg-neutral-800/60 dark:border-neutral-700 dark:hover:bg-neutral-800">
            <ServiceLogo name={service.name} src={service.logo} />
            <span className="font-medium flex-1 dark:text-white">{service.name}</span>
            <span className="inline-flex items-baseline">
                <span className="font-semibold text-neutral-800 tabular-nums dark:text-neutral-200">${total.toLocaleString('es-AR')}</span>
                <span className="text-sm text-neutral-500">{service.duration}</span>
            </span>
        </button>
    )
}
