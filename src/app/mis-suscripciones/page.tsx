"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Download, Link2, Minus, Plus, Trash2, Upload, Users } from "lucide-react"
import { ButtonLink } from "@/components/ButtonLink"
import ServiceLogo from "@/components/ServiceLogo"
import ServiceModal from "@/components/ServiceModal"
import TaxBadges from "@/components/TaxBadges"
import { Button, IconButton } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Forms"
import { Modal } from "@/components/ui/Modal"
import { Toaster, useToasts } from "@/components/ui/Toast"
import { Skeleton } from "@/components/ui/Skeleton"
import { useSubscriptions } from "@/app/context/SubscriptionsProvider"
import { useTaxSettings } from "@/app/context/TaxProvider"
import SERVICES from "@/app/mocks/servicesMock"
import { planBase, planDuration, type Service } from "@/lib/services"
import { useOfficialRate } from "@/lib/useOfficialRate"
import { calcTaxes } from "@/lib/taxes"
import { exportCode, exportJson, parseSubscriptions, type SubscriptionsData } from "@/lib/subscriptionsIO"

const ars = (n: number) => "$" + n.toLocaleString("es-AR")

/** Solo las suscripciones que existen en el catálogo actual (nombre de servicio y de plan). */
const knownItems = (data: SubscriptionsData) =>
    data.items.filter(item => (SERVICES as Service[]).some(s => s.name === item.service && s.plans.some(p => p.name === item.plan)))

export default function MisSuscripciones() {
    const { items, people, ready, remove, setPeople, importData } = useSubscriptions()
    const { toasts, toast, dismiss } = useToasts()
    const [importOpen, setImportOpen] = useState(false)
    const [importText, setImportText] = useState("")
    const [importError, setImportError] = useState("")
    // Datos que llegaron por link (#codigo=...) y esperan confirmación
    const [incoming, setIncoming] = useState<SubscriptionsData | null>(null)
    const fileInput = useRef<HTMLInputElement>(null)
    const { settings } = useTaxSettings()
    const [selected, setSelected] = useState<Service | null>(null)

    // Se cruza lo guardado (por nombre) con el catálogo actual; si un servicio o plan ya no existe, se ignora
    const rows = useMemo(() => {
        return items.flatMap(item => {
            const service = (SERVICES as Service[]).find(s => s.name === item.service)
            const plan = service?.plans.find(p => p.name === item.plan)
            return service && plan ? [{ service, plan }] : []
        })
    }, [items])

    // Si se abre desde el link de otro dispositivo, se pide confirmar antes de importar.
    // El código va en el hash, que el navegador no envía al servidor.
    useEffect(() => {
        const match = window.location.hash.match(/^#codigo=(.+)$/)
        if (!match) return
        let data: SubscriptionsData | null = null
        try {
            data = parseSubscriptions(decodeURIComponent(match[1]))
        } catch {
            data = null
        }
        history.replaceState(null, "", window.location.pathname)
        if (data && knownItems(data).length) setIncoming(data)
        else toast("El link no tiene suscripciones válidas", { color: "red", duration: 4000 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const usesUsd = rows.some(row => row.plan.currency === "USD")
    const rate = useOfficialRate(usesUsd)

    // Total mensual con impuestos; los planes anuales se prorratean en 12 meses
    const priced = rows.map(({ service, plan }) => {
        const base = planBase(plan, rate)
        const annual = planDuration(plan, service) === "/año"
        const monthlyBase = base === null ? null : annual ? base / 12 : base
        const monthly = monthlyBase === null ? null : calcTaxes(monthlyBase, settings).total
        const full = base === null ? null : calcTaxes(base, settings).total
        return { service, plan, annual, monthly, full }
    })
    const pending = priced.some(row => row.monthly === null)
    const monthlyTotal = priced.reduce((sum, row) => sum + (row.monthly ?? 0), 0)
    const perPerson = Math.ceil(monthlyTotal / people)

    const current: SubscriptionsData = { items, people }

    const copy = async (text: string, okMessage: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast(okMessage, { color: "green", duration: 2500 })
        } catch {
            toast("No pudimos copiar al portapapeles", { color: "red", duration: 3500 })
        }
    }

    const download = () => {
        const url = URL.createObjectURL(new Blob([exportJson(current)], { type: "application/json" }))
        const link = document.createElement("a")
        link.href = url
        link.download = "mis-suscripciones-impuestar.json"
        link.click()
        URL.revokeObjectURL(url)
    }

    const applyImport = (data: SubscriptionsData) => {
        const valid = { ...data, items: knownItems(data) }
        if (!valid.items.length) {
            setImportError("No encontramos suscripciones válidas en ese contenido.")
            return false
        }
        importData(valid)
        toast(`Importamos ${valid.items.length} ${valid.items.length === 1 ? "suscripción" : "suscripciones"}`, { color: "green", duration: 3500 })
        return true
    }

    const submitImport = () => {
        const data = parseSubscriptions(importText)
        if (!data) {
            setImportError("El código o el archivo no tiene el formato esperado.")
            return
        }
        if (applyImport(data)) {
            setImportOpen(false)
            setImportText("")
            setImportError("")
        }
    }

    const readFile = async (file: File | undefined) => {
        if (!file) return
        if (file.size > 50_000) {
            setImportError("El archivo es demasiado grande.")
            return
        }
        setImportText(await file.text())
        setImportError("")
    }

    return (
        <section className="flex flex-col gap-4 w-full animate-fade-up">
            <div className="flex items-center justify-between gap-3">
                <h1 className="font-bold text-lg dark:text-white">Mis suscripciones</h1>
                <ButtonLink href="/servicios" color="secondary" icon={<ArrowLeft size={16} />}>Suscripciones</ButtonLink>
            </div>

            {!ready ? (
                <Skeleton className="h-40 w-full" />
            ) : rows.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-300 p-8 text-center dark:border-neutral-700">
                    <p className="font-medium dark:text-white">Todavía no guardaste ninguna suscripción</p>
                    <p className="text-sm text-neutral-500">
                        Entrá a una suscripción, elegí tu plan y tocá &ldquo;Agregar a mis suscripciones&rdquo; para ver cuánto pagás por mes con impuestos.
                    </p>
                    <ButtonLink href="/servicios" color="primary">Ver suscripciones</ButtonLink>
                </div>
            ) : (
                <>
                    <TaxBadges />

                    <div className="flex flex-col gap-2">
                        {priced.map(({ service, plan, annual, monthly, full }) => (
                            <div key={service.name} className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/60">
                                <button type="button" onClick={() => setSelected(service)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Ver detalle de ${service.name}`}>
                                    <ServiceLogo name={service.name} src={service.logo} />
                                    <span className="flex min-w-0 flex-col">
                                        <span className="truncate font-medium dark:text-white">{service.name}</span>
                                        <span className="truncate text-xs text-neutral-500">
                                            {plan.name}{annual && full !== null ? ` · ${ars(full)} por año` : ""}
                                        </span>
                                    </span>
                                </button>
                                <span className="shrink-0 font-semibold tabular-nums dark:text-white">
                                    {monthly === null ? <Skeleton className="h-4 w-16" /> : <>{ars(Math.ceil(monthly))}<span className="text-sm font-normal text-neutral-500">/m</span></>}
                                </span>
                                <IconButton color="secondary" size="sm" rounded label={`Quitar ${service.name}`} icon={<Trash2 size={14} />} onClick={() => remove(service.name)} />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-300 bg-neutral-200 bg-opacity-40 p-5 shadow-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white">
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-600 dark:text-neutral-300">Por mes</span>
                            <span aria-live="polite" className="text-2xl font-bold tabular-nums">{pending ? <Skeleton className="h-7 w-28" /> : ars(Math.ceil(monthlyTotal))}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-300">Por año</span>
                            <span className="font-medium tabular-nums">{pending ? <Skeleton className="h-4 w-24" /> : ars(Math.ceil(monthlyTotal) * 12)}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-neutral-300 pt-3 dark:border-neutral-600">
                            <span className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300"><Users size={16} /> Dividir entre</span>
                            <span className="inline-flex items-center gap-2">
                                <IconButton color="secondary" size="sm" rounded label="Menos personas" icon={<Minus size={14} />} disabled={people <= 1} onClick={() => setPeople(people - 1)} />
                                <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{people}</span>
                                <IconButton color="secondary" size="sm" rounded label="Más personas" icon={<Plus size={14} />} onClick={() => setPeople(people + 1)} />
                            </span>
                        </div>
                        {people > 1 && (
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Cada uno paga por mes</span>
                                <span className="text-xl font-bold tabular-nums">{pending ? <Skeleton className="h-6 w-24" /> : ars(perPerson)}</span>
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-300 p-4 dark:border-neutral-700">
                <div className="flex flex-col gap-1">
                    <span className="font-medium dark:text-white">Llevá tu lista a otro dispositivo</span>
                    <span className="text-xs text-neutral-500">
                        Tu lista vive solo en este navegador. Copiá el link y abrilo en el otro dispositivo (por ejemplo, mandátelo por WhatsApp), o usá el código o el archivo.
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" icon={<Link2 size={14} />} disabled={!rows.length}
                        onClick={() => copy(`${window.location.origin}/mis-suscripciones#codigo=${encodeURIComponent(exportCode(current))}`, "Link copiado")}>
                        Copiar link
                    </Button>
                    <Button size="sm" color="secondary" icon={<Copy size={14} />} disabled={!rows.length}
                        onClick={() => copy(exportCode(current), "Código copiado")}>
                        Copiar código
                    </Button>
                    <Button size="sm" color="secondary" icon={<Download size={14} />} disabled={!rows.length} onClick={download}>Descargar archivo</Button>
                    <Button size="sm" color="secondary" icon={<Upload size={14} />} onClick={() => { setImportError(""); setImportOpen(true) }}>Importar</Button>
                </div>
            </div>

            <span className="text-xs text-neutral-500">
                Tu lista se guarda solo en este navegador. Los planes anuales se prorratean en 12 meses y los impuestos son los que configuraste en la calculadora.{" "}
                <Link href="/legal" className="underline underline-offset-2">Más información</Link>.
            </span>
            {selected && <ServiceModal service={selected} onClose={() => setSelected(null)} />}
            <Toaster toasts={toasts} onDismiss={dismiss} position="bottom-center" dismissLabel="Cerrar" />

            <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Importar suscripciones" closeLabel="Cerrar" size="md"
                footer={<><Button color="secondary" onClick={() => setImportOpen(false)}>Cancelar</Button><Button onClick={submitImport} disabled={!importText.trim()}>Importar</Button></>}>
                <div className="flex flex-col gap-3">
                    <p>Pegá el código que copiaste en el otro dispositivo, o cargá el archivo descargado. Se suman a tu lista y, si un servicio ya estaba, se reemplaza.</p>
                    <Textarea label="Código o contenido del archivo" rows={4} value={importText} onChange={e => { setImportText(e.target.value); setImportError("") }} placeholder="iAR1:..." />
                    <div>
                        <input ref={fileInput} type="file" accept=".json,.txt,application/json,text/plain" className="sr-only" aria-label="Archivo de suscripciones" onChange={e => readFile(e.target.files?.[0])} />
                        <Button size="sm" color="secondary" icon={<Upload size={14} />} onClick={() => fileInput.current?.click()}>Cargar archivo</Button>
                    </div>
                    {importError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{importError}</p>}
                </div>
            </Modal>

            <Modal open={!!incoming} onClose={() => setIncoming(null)} title="Importar desde un link" closeLabel="Cerrar" size="md"
                footer={<><Button color="secondary" onClick={() => setIncoming(null)}>No importar</Button><Button onClick={() => { if (incoming && applyImport(incoming)) setIncoming(null) }}>Importar</Button></>}>
                {incoming && (
                    <div className="flex flex-col gap-2">
                        <p>Este link trae {knownItems(incoming).length} {knownItems(incoming).length === 1 ? "suscripción" : "suscripciones"}. Se van a sumar a tu lista:</p>
                        <ul className="list-disc pl-5">
                            {knownItems(incoming).map(item => <li key={item.service}><strong>{item.service}</strong> · {item.plan}</li>)}
                        </ul>
                    </div>
                )}
            </Modal>
        </section>
    )
}
