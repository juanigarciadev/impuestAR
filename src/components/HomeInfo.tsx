import Link from "next/link";
import JsonLd from "./JsonLd";
import { calcTaxes, IVA_RATE, PERCEPCION_RATE } from "@/lib/taxes";
import { formatReviewedDate } from "@/lib/site";

const ars = (n: number) => "$" + n.toLocaleString("es-AR")

// Ejemplo ilustrativo: 10 USD a un dólar de $1.000 pagados con tarjeta desde CABA (IIBB 2%).
const EXAMPLE_USD = 10
const EXAMPLE_RATE = 1000
const example = calcTaxes(EXAMPLE_USD * EXAMPLE_RATE, { iva: true, iibb: true, percepcion: true, province: "caba" })

const FAQ = [
    {
        q: "¿Qué impuestos se pagan al comprar en dólares con tarjeta en Argentina?",
        a: "En compras de servicios digitales del exterior con tarjeta en pesos se suman el IVA del 21%, la percepción del 30% a cuenta de Ganancias/Bienes Personales (recuperable si no pagás esos impuestos) y, según tu provincia, la percepción de Ingresos Brutos. El impuesto PAIS ya no existe.",
    },
    {
        q: "¿Los videojuegos pagan percepción del 30%?",
        a: "No. Desde abril de 2025 las plataformas de videojuegos tienen percepción de 0%, por eso en el modo Videojuegos solo se suman IVA e Ingresos Brutos.",
    },
    {
        q: "¿Qué pasa si pago con dólar MEP o cripto?",
        a: "Si pagás con dólares propios no se genera la percepción del 30%. En el cálculo se mantienen el IVA y los Ingresos Brutos que cobra la plataforma.",
    },
    {
        q: "¿De dónde salen las cotizaciones?",
        a: "Del servicio abierto DolarApi (dolarapi.com), en tiempo real: dólar oficial, MEP (bolsa) y cripto, más EUR, BRL, CLP y UYU.",
    },
    {
        q: "¿El total que muestra es exacto?",
        a: "Es una estimación: el total puede variar unos pocos pesos y las alícuotas pueden cambiar según la normativa vigente, por eso recomendamos sumar siempre un poco más de lo calculado.",
    },
]

const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
}

// Contenido estático de la home: explica cómo se calcula el precio final para lectores y buscadores
// (la calculadora es interactiva y se carga en el cliente).
export default function HomeInfo() {
    return (
        <section className="flex flex-col gap-6 w-full pt-2 text-sm text-neutral-600 dark:text-neutral-300">
            <JsonLd data={JSON_LD} />

            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-lg text-neutral-900 dark:text-white">Cómo se calcula el precio final</h2>
                <p>
                    El precio en dólares se convierte a pesos con la cotización que elijas (oficial, MEP o cripto) y sobre ese monto se suman los impuestos que corresponden a tu forma de pago:
                </p>
                <ul className="flex flex-col gap-1 list-disc pl-5">
                    <li><strong>IVA {IVA_RATE * 100}%</strong> sobre servicios digitales del exterior.</li>
                    <li><strong>Percepción {PERCEPCION_RATE * 100}%</strong> a cuenta de Ganancias/Bienes Personales, solo en compras con tarjeta en pesos (no aplica a videojuegos ni a pagos con dólares propios).</li>
                    <li><strong>Ingresos Brutos</strong> según tu provincia, sobre servicios digitales del exterior.</li>
                </ul>
                <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                        Ejemplo: {EXAMPLE_USD} USD con un dólar de {ars(EXAMPLE_RATE)}, pagado con tarjeta desde CABA
                    </p>
                    <ul className="mt-2 flex flex-col gap-1">
                        <li>Precio sin impuestos: {ars(example.base)}</li>
                        <li>IVA 21%: {ars(example.iva)}</li>
                        <li>IIBB CABA 2%: {ars(example.iibb)}</li>
                        <li>Percepción 30%: {ars(example.percepcion)}</li>
                        <li className="font-semibold text-neutral-900 dark:text-white">Total: {ars(example.total)}</li>
                    </ul>
                </div>
                <p>
                    Los valores se revisaron por última vez el {formatReviewedDate()}. Mirá la <Link href="/metodologia" className="underline underline-offset-2">metodología y las fuentes</Link> para ver las alícuotas por provincia y los supuestos del cálculo.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-lg text-neutral-900 dark:text-white">Preguntas frecuentes</h2>
                {FAQ.map(item => (
                    <div key={item.q} className="flex flex-col gap-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{item.q}</h3>
                        <p>{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
