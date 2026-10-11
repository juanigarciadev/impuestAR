import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { ARQ_RATE_PREMIUM, IVA_RATE, PERCEPCION_RATE, PROVINCES } from "@/lib/taxes";
import { formatReviewedDate, REPO_URL } from "@/lib/site";

const pct = (n: number) => (n * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "%"
const provinces = [...PROVINCES].sort((a, b) => a.name.localeCompare(b.name, "es"))

const h2 = "font-semibold text-neutral-900 dark:text-white"
const link = "underline underline-offset-2"

export default function Metodologia() {
    return (
        <article className="flex flex-col gap-6 w-full text-sm text-neutral-600 dark:text-neutral-300 animate-fade-up">
            <div className="flex items-center justify-between gap-3">
                <h1 className="font-bold text-lg dark:text-white">Metodología y fuentes</h1>
                <ButtonLink href="/" color="secondary" icon={<ArrowLeft size={16} />}>Calculadora</ButtonLink>
            </div>
            <p>
                Última revisión de alícuotas y reglas: <strong>{formatReviewedDate()}</strong>. El código es abierto y se puede auditar en{" "}
                <a href={REPO_URL} className={link} target="_blank" rel="noopener noreferrer">GitHub</a>.
            </p>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Cotizaciones</h2>
                <p>
                    Se obtienen en tiempo real de <a href="https://dolarapi.com/docs/" className={link} target="_blank" rel="noopener noreferrer">DolarApi</a> al abrir la página:
                </p>
                <ul className="flex flex-col gap-1 list-disc pl-5">
                    <li><strong>Dólar Tarjeta y Videojuegos:</strong> dólar oficial (venta).</li>
                    <li><strong>Dólar MEP:</strong> dólar bolsa (venta).</li>
                    <li><strong>Dólar Cripto:</strong> dólar cripto (venta).</li>
                    <li><strong>EUR, BRL, CLP y UYU:</strong> cotización oficial de cada moneda, calculada como compra con tarjeta.</li>
                </ul>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Impuestos nacionales</h2>
                <ul className="flex flex-col gap-1 list-disc pl-5">
                    <li><strong>IVA {pct(IVA_RATE)}</strong> sobre servicios digitales del exterior (Ley 27.430, RG ARCA 4240).</li>
                    <li><strong>Percepción {pct(PERCEPCION_RATE)}</strong> a cuenta de Ganancias/Bienes Personales (RG 5617) en compras con tarjeta en pesos. Es recuperable si no pagás esos impuestos. Se calcula sobre el precio sin IVA.</li>
                    <li><strong>Videojuegos:</strong> la percepción es 0% desde abril de 2025.</li>
                    <li><strong>Pagos con dólares propios (MEP y cripto):</strong> no se genera percepción; se mantienen IVA e Ingresos Brutos.</li>
                    <li><strong>Impuesto PAIS:</strong> derogado el 23/12/2024, ya no se suma.</li>
                </ul>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Fórmula</h2>
                <p>
                    <code>precio sin impuestos = USD × cotización</code> y{" "}
                    <code>total = precio + IVA + IIBB + percepción</code>, donde cada impuesto se calcula sobre el precio sin impuestos y se redondea al peso.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Ingresos Brutos por provincia</h2>
                <p>
                    Alícuota de percepción sobre servicios digitales prestados por sujetos del exterior (base: monto neto de IVA). Las provincias en 0% no tienen un régimen confirmado.
                </p>
                <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-200 text-neutral-900 dark:border-neutral-700 dark:text-white">
                                <th scope="col" className="px-3 py-2 font-semibold">Provincia</th>
                                <th scope="col" className="px-3 py-2 font-semibold">IIBB</th>
                            </tr>
                        </thead>
                        <tbody>
                            {provinces.map(province => (
                                <tr key={province.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                                    <th scope="row" className="px-3 py-2 font-normal">{province.name}</th>
                                    <td className="px-3 py-2">
                                        {pct(province.iibb)}
                                        {province.note && province.iibb > 0 && <span className="block text-xs text-neutral-500">{province.note}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Tarjeta de ARQ (Videojuegos)</h2>
                <p>
                    La comparación con la tarjeta local de ARQ es una <strong>estimación</strong>: se calcula como el dólar oficial más un {pct(ARQ_RATE_PREMIUM)} y sin IVA, IIBB ni percepción. ARQ no publica su cotización en una API pública. Más datos en{" "}
                    <Link href="/arq" className={link}>cómo pagar Steam con ARQ</Link>.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Limitaciones</h2>
                <ul className="flex flex-col gap-1 list-disc pl-5">
                    <li>Los valores son orientativos: la normativa y las alícuotas cambian y cada provincia tiene su propia norma.</li>
                    <li>No se pudo confirmar que el IVA corresponda siempre en pagos con dólares propios; el cálculo lo asume así.</li>
                    <li>Algunas alícuotas provinciales (por ejemplo San Juan) se apoyan en una sola fuente y se revisan periódicamente.</li>
                    <li>Los precios de suscripciones son de referencia y pueden diferir del que cobra cada plataforma.</li>
                    <li>Recomendamos sumar siempre un poco más de lo calculado: el total puede variar unos pocos pesos.</li>
                </ul>
            </section>
        </article>
    )
}
