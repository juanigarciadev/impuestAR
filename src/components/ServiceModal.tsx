"use client"
import { calcTaxes, getProvince, IVA_RATE, PERCEPCION_RATE } from "@/lib/taxes"
import { useTaxSettings } from "@/app/context/TaxProvider"
import { Modal } from "./ui/Modal"
import { Button } from "./ui/Button"
import ServiceLogo from "./ServiceLogo"

export type Service = {
    name: string
    price: number
    logo: string
    duration: string
}

const pct = (n: number) => (n * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "%"
const ars = (n: number) => "$" + n.toLocaleString("es-AR")

export default function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
    const { settings } = useTaxSettings()
    const taxes = calcTaxes(service.price, settings)
    const province = getProvince(settings.province)
    const lines = [
        { label: `IVA ${pct(IVA_RATE)}`, amount: taxes.iva, show: settings.iva },
        { label: `IIBB${province ? ` ${province.name} ${pct(province.iibb)}` : ""}`, amount: taxes.iibb, show: settings.iibb && !!province && province.iibb > 0 },
        { label: `Percepción ${pct(PERCEPCION_RATE)}`, amount: taxes.percepcion, show: settings.percepcion },
    ].filter(l => l.show)

    return (
        <Modal open onClose={onClose} title={service.name} size="sm" footer={<Button color="secondary" onClick={onClose}>Cerrar</Button>}>
            <div className="flex flex-col gap-2 text-base dark:text-white">
                <div className="flex items-center gap-3 pb-2">
                    <ServiceLogo name={service.name} src={service.logo} className="h-8 w-8" />
                    <span className="text-sm text-neutral-500">Precio {service.duration === "/m" ? "mensual" : service.duration}</span>
                </div>
                <div className="flex justify-between">
                    <span>Sin impuestos</span>
                    <span className="font-medium tabular-nums">{ars(taxes.base)}</span>
                </div>
                {lines.map(line => (
                    <div key={line.label} className="flex justify-between">
                        <span>{line.label}</span>
                        <span className="font-medium tabular-nums">{ars(line.amount)}</span>
                    </div>
                ))}
                <div className="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-700">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold tabular-nums">{ars(taxes.total)}</span>
                </div>
                <span className="mt-2 text-xs text-neutral-500">Los impuestos se configuran en la calculadora (IVA, provincia y percepción). Los precios pueden variar unos centavos por redondeo.</span>
            </div>
        </Modal>
    )
}
