"use client"
import { useState } from "react"
import { calcPlanTaxes, getProvince, IVA_RATE, PERCEPCION_RATE } from "@/lib/taxes"
import { defaultPlans, durationLabel, formatVerifiedAt, planBase, planDuration, type Plan, type Service } from "@/lib/services"
import { useOfficialRate } from "@/lib/useOfficialRate"
import { useTaxSettings } from "@/app/context/TaxProvider"
import { useSubscriptions } from "@/app/context/SubscriptionsProvider"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Modal } from "./ui/Modal"
import { Button } from "./ui/Button"
import { Skeleton } from "./ui/Skeleton"
import ServiceLogo from "./ServiceLogo"

export type { Service } from "@/lib/services"

const pct = (n: number) => (n * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "%"
const ars = (n: number) => "$" + n.toLocaleString("es-AR")

export default function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
    const { settings } = useTaxSettings()
    const { has, toggle } = useSubscriptions()
    const rate = useOfficialRate(service.plans.some(plan => plan.currency === "USD"))
    const province = getProvince(settings.province)

    // Plan elegido: arranca en el primero del período por defecto y sin requisitos (los planes van de menor a mayor precio)
    const [selected, setSelected] = useState(() => Math.max(0, service.plans.indexOf(defaultPlans(service)[0])))
    const plan: Plan = service.plans[selected]
    const base = planBase(plan, rate)
    const taxes = base === null ? null : calcPlanTaxes(base, settings, plan)
    const totalOf = (p: Plan) => {
        const b = planBase(p, rate)
        return b === null ? null : calcPlanTaxes(b, settings, p).total
    }

    // Abre el formulario de revisión con el mensaje prearmado (lo escucha UpdateRequest)
    const reportChange = () => {
        const message = `El precio de ${service.name}${service.plans.length > 1 ? ` (plan ${plan.name})` : ""} cambió. Ahora cuesta: `
        onClose()
        window.dispatchEvent(new CustomEvent("impuestar:revision", { detail: { message } }))
    }

    const lines = taxes && [
        { label: `IVA ${pct(IVA_RATE)}`, amount: taxes.iva, show: settings.iva && !plan.ivaIncluded },
        { label: `IIBB${province ? ` ${province.name} ${pct(province.iibb)}` : ""}`, amount: taxes.iibb, show: settings.iibb && !!province && province.iibb > 0 },
        { label: `Percepción ${pct(PERCEPCION_RATE)}`, amount: taxes.percepcion, show: settings.percepcion },
    ].filter(l => l.show)

    return (
        <Modal open onClose={onClose} title={service.name} icon={<ServiceLogo name={service.name} src={service.logo} className="h-7 w-7" />} size={service.plans.length > 1 ? "lg" : "sm"} footer={<Button color="secondary" onClick={onClose}>Cerrar</Button>}>
            <div className="flex flex-col gap-3 text-base dark:text-white">
                <span className="text-sm text-neutral-500">{service.plans.length > 1 ? "Elegí un plan" : `Precio ${durationLabel(planDuration(plan, service))}`}</span>

                {/* Dos columnas en pantallas anchas; en celular (sm = hasta 639px en este proyecto) una sola */}
                {service.plans.length > 1 && (
                    <div role="radiogroup" aria-label="Plan" className="grid max-h-[42vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-1">
                        {service.plans.map((p, index) => {
                            const total = totalOf(p)
                            const active = index === selected
                            return (
                                <button
                                    key={p.name}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setSelected(index)}
                                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm duration-200 active:scale-[.99] ${active ? "border-blue-700 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40" : "border-neutral-200 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"}`}
                                >
                                    <span className="flex flex-col">
                                        <span className="font-medium">{p.name}</span>
                                        {p.note && <span className="text-xs text-neutral-500">{p.note}</span>}
                                    </span>
                                    <span className="shrink-0 font-semibold tabular-nums">
                                        {total === null ? <Skeleton className="h-4 w-16" /> : <>{ars(total)}<span className="text-xs font-normal text-neutral-500">{planDuration(p, service)}</span></>}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                )}

                <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
                    {service.plans.length > 1 && <span className="text-sm text-neutral-500">{plan.name} · {durationLabel(planDuration(plan, service))}</span>}
                    {plan.ivaIncluded && (
                        <span className="text-xs text-neutral-500">El precio de este plan ya incluye el IVA (así lo cobra el comercio), por eso no se suma de nuevo.</span>
                    )}
                    {plan.unverified && (
                        <span className="text-xs text-amber-600 dark:text-amber-400">Precio de una fuente no oficial: todavía no lo contrastamos con la página del servicio.</span>
                    )}
                    {plan.currency === "USD" && (
                        <div className="flex justify-between text-sm text-neutral-500">
                            <span>Precio en dólares</span>
                            <span className="tabular-nums">US$ {plan.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}{rate ? ` × ${ars(rate)}` : ""}</span>
                        </div>
                    )}
                    {taxes && lines ? (
                        <>
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
                        </>
                    ) : (
                        <Skeleton className="h-16 w-full" />
                    )}
                </div>

                <Button
                    color={has(service.name, plan.name) ? "secondary" : "primary"}
                    className="!w-full"
                    icon={has(service.name, plan.name) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    onClick={() => toggle(service.name, plan.name)}
                >
                    {has(service.name, plan.name) ? "Guardado en mis suscripciones (quitar)" : "Agregar a mis suscripciones"}
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-neutral-500">
                        {service.verifiedAt ? `Precios verificados el ${formatVerifiedAt(service.verifiedAt)}` : "Precios sin verificar recientemente: pueden estar desactualizados"}
                    </span>
                    <Button color="secondary" size="sm" onClick={reportChange}>¿Cambió el precio? Avisanos</Button>
                </div>

                <span className="text-xs text-neutral-500">
                    Los impuestos se configuran en la calculadora (IVA, provincia y percepción). Los precios pueden variar unos pocos pesos.
                    {plan.currency === "USD" && " Los planes en dólares se convierten con el dólar oficial y se calculan como compra con tarjeta; el precio que cobre cada plataforma en Argentina puede ser distinto."}
                </span>
            </div>
        </Modal>
    )
}
