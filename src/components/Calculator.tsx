"use client"
import { ReactNode, useEffect, useState } from "react"
import { Bitcoin, CreditCard, Gamepad2, Landmark } from "lucide-react";
import CopyButton from "./CopyButton";
import AnimatedNumber from "./AnimatedNumber";
import { Button } from "./ui/Button";
import { Alert } from "./ui/Alert";
import { Checkbox, Input, Select } from "./ui/Forms";
import { Skeleton } from "./ui/Skeleton";
import { useTaxSettings } from "@/app/context/TaxProvider";
import { calcTaxes, CARD_APPLIES, getProvince, TaxApplicability, IVA_RATE, PERCEPCION_RATE, PROVINCES } from "@/lib/taxes";

type DollarName = 'Dólar Tarjeta' | 'Videojuegos' | 'Dólar MEP' | 'Dólar Cripto'
type DollarSource = 'oficial' | 'bolsa' | 'cripto'

// Cada modo define la cotización y qué impuestos le corresponden (el usuario solo puede destildar los que aplican):
// - Tarjeta: compra en pesos con tarjeta, cotización oficial. IVA, IIBB y percepción de Ganancias del 30%.
// - Videojuegos: igual que tarjeta, pero las plataformas de juegos quedaron en 0% de percepción desde abril de 2025.
// - MEP y Cripto: se paga con dólares propios. El IVA y el IIBB los cobra igual la plataforma, y no se genera percepción.
const NO_PERCEPCION: TaxApplicability = { iva: true, iibb: true, percepcion: false }

const DOLLARS: { name: DollarName; icon: ReactNode; source: DollarSource; applies: TaxApplicability; percepcionHint?: string }[] = [
    { name: 'Dólar Tarjeta', icon: <CreditCard size={18} />, source: 'oficial', applies: CARD_APPLIES },
    { name: 'Videojuegos', icon: <Gamepad2 size={18} />, source: 'oficial', applies: NO_PERCEPCION, percepcionHint: 'No aplica a plataformas de videojuegos (0% desde abril 2025)' },
    { name: 'Dólar MEP', icon: <Landmark size={18} />, source: 'bolsa', applies: NO_PERCEPCION, percepcionHint: 'No aplica si pagás con dólares propios' },
    { name: 'Dólar Cripto', icon: <Bitcoin size={18} />, source: 'cripto', applies: NO_PERCEPCION, percepcionHint: 'No aplica si pagás con dólares propios' },
]

const CURRENCIES = [
    { code: 'USD', label: 'USD · Dólar' },
    { code: 'EUR', label: 'EUR · Euro' },
    { code: 'BRL', label: 'BRL · Real' },
    { code: 'CLP', label: 'CLP · Peso chileno' },
    { code: 'UYU', label: 'UYU · Peso uruguayo' },
] as const
type CurrencyCode = typeof CURRENCIES[number]['code']

const ars = (n: number) => '$' + n.toLocaleString('es-AR')
const pct = (n: number) => (n * 100).toLocaleString('es-AR', { maximumFractionDigits: 1 }) + '%'

type Rates = { dollars: Partial<Record<DollarSource, number>>; currencies: Partial<Record<CurrencyCode, number>> }

export default function Calculator() {
    const { settings, update } = useTaxSettings()
    const [rates, setRates] = useState<Rates>({ dollars: {}, currencies: {} })
    const [error, setError] = useState(false)
    const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('USD')
    const [selected, setSelected] = useState<DollarName>('Dólar Tarjeta')
    const [value, setValue] = useState(0)

    useEffect(() => {
        fetch('https://dolarapi.com/v1/dolares')
            .then(response => response.json())
            .then((data: { casa: string; venta: number }[]) => {
                const venta = (casa: string) => data.find(d => d.casa === casa)?.venta
                setRates(prev => ({ ...prev, dollars: { oficial: venta('oficial'), bolsa: venta('bolsa'), cripto: venta('cripto') } }))
            })
            .catch(() => setError(true))

        fetch('https://dolarapi.com/v1/cotizaciones')
            .then(response => response.json())
            .then((data: { moneda: string; venta: number }[]) => {
                const currencies: Rates['currencies'] = {}
                for (const c of CURRENCIES) currencies[c.code] = data.find(d => d.moneda === c.code)?.venta
                setRates(prev => ({ ...prev, currencies }))
            })
            .catch(() => setError(true))
    }, [])

    const isUSD = currencyCode === 'USD'
    const dollar = DOLLARS.find(d => d.name === selected)!
    // Otras monedas: cotización oficial del día; el IVA aplica igual que en tarjeta
    const rate = (isUSD ? rates.dollars[dollar.source] : rates.currencies[currencyCode]) ?? 0
    // Otras monedas se pagan con tarjeta en pesos
    const applies = isUSD ? dollar.applies : CARD_APPLIES
    const taxes = calcTaxes(value * rate, settings, applies)
    const province = getProvince(settings.province)

    const rows: { key: 'iva' | 'iibb' | 'percepcion'; label: string; amount: number; hint?: string }[] = [
        { key: 'iva', label: `IVA ${pct(IVA_RATE)}`, amount: taxes.iva },
        { key: 'iibb', label: `IIBB${province && province.iibb ? ' ' + pct(province.iibb) : ''}`, amount: taxes.iibb },
        { key: 'percepcion', label: `Percepción ${pct(PERCEPCION_RATE)}`, amount: taxes.percepcion, hint: applies.percepcion ? 'Anticipo de Ganancias/Bienes Personales (RG 5617), recuperable si no pagás esos impuestos' : dollar.percepcionHint },
    ]

    const currencyOptions = CURRENCIES.map(c => ({ value: c.code, label: c.label }))
    const provinceOptions = PROVINCES.map(p => ({ value: p.id, label: `${p.name}${p.iibb ? ` · ${pct(p.iibb)}` : ''}` }))

    return (
        <section className="flex flex-col gap-5 w-full animate-fade-up">
            {isUSD ? (
                <div role="radiogroup" aria-label="Tipo de dólar" className="grid grid-cols-2 gap-2">
                    {DOLLARS.map(d => (
                        <Button key={d.name} role="radio" aria-checked={d.name === selected} color={d.name === selected ? 'default' : 'secondary'}
                            className="!w-full !justify-start" icon={d.icon} onClick={() => setSelected(d.name)}>
                            {d.name}
                        </Button>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-neutral-500 rounded-xl border border-neutral-300 px-4 py-3 dark:border-neutral-700">
                    Para {currencyCode} se usa la cotización oficial del día.
                </p>
            )}

            <div className="relative">
                <Input aria-label={`Monto en ${currencyCode}`} type="number" inputMode="decimal" min={0} placeholder="0.00" maxLength={17} className="!pr-24 !py-3.5 text-lg font-semibold"
                    onChange={(e) => setValue(Number(e.target.value))}
                    onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        if (input.value.length > 17) {
                            input.value = input.value.slice(0, 17);
                        }
                    }} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Select compact options={currencyOptions} value={currencyCode} onChange={(v) => setCurrencyCode(v as CurrencyCode)} />
                </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-300 bg-neutral-200 bg-opacity-40 p-5 shadow-sm dark:bg-neutral-800 dark:border-neutral-600 dark:text-white">
                <div className="flex items-center justify-between text-sm text-neutral-500">
                    <span>Cotización</span>
                    {rate
                        ? <span className="font-medium text-neutral-700 dark:text-neutral-300"><AnimatedNumber value={rate} decimals={2} format={ars} /> por {currencyCode}</span>
                        : <Skeleton className="h-4 w-28" />}
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-300">Sin impuestos</span>
                    <span className="font-medium tabular-nums"><AnimatedNumber value={taxes.base} format={ars} /></span>
                </div>

                {rows.map(row => (
                    <div key={row.key} className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                            <Checkbox label={row.label} description={row.key === 'iibb' ? undefined : row.hint} checked={settings[row.key] && applies[row.key]} disabled={!applies[row.key]} onChange={(e) => update({ [row.key]: e.target.checked })} />
                            <span className={`font-medium tabular-nums ${settings[row.key] && applies[row.key] ? '' : 'text-neutral-400 line-through dark:text-neutral-600'}`}>
                                <AnimatedNumber value={row.amount} format={ars} />
                            </span>
                        </div>
                        {row.key === 'iibb' && settings.iibb && applies.iibb && (
                            <Select options={provinceOptions} value={settings.province} onChange={(v) => update({ province: v })} placeholder="Elegí tu provincia" hint={province?.note} />
                        )}
                    </div>
                ))}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-300 dark:border-neutral-600">
                    <span className="font-semibold">Total</span>
                    <div className="flex items-center gap-3">
                        <span aria-live="polite" className="font-bold text-2xl tabular-nums"><AnimatedNumber value={taxes.total} format={ars} /></span>
                        <CopyButton valueToCopy={taxes.total} />
                    </div>
                </div>
            </div>

            {error && <Alert color="red" showIcon dismissible>No pudimos obtener la cotización actual. Revisá tu conexión e intentá de nuevo.</Alert>}
            <span className="text-xs text-neutral-500">Los precios pueden variar unos centavos debido al redondeo de decimales. Las alícuotas de IIBB son de percepción sobre servicios digitales del exterior y pueden cambiar según la norma provincial vigente.</span>
        </section>
    )
}
