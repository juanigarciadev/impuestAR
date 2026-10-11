import Link from "next/link";
import { ArrowLeft, CircleHelp } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { Alert } from "@/components/ui/Alert";
import { Accordion } from "@/components/ui/Accordion";
import { Stepper } from "@/components/ui/Stepper";
import ArqReferralButton from "@/components/ArqReferralButton";
import ArqRewardBanner from "@/components/ArqRewardBanner";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";

const STEPS = [
    { title: "Descargá ARQ", description: "Instalá la app desde App Store o Google Play y registrate." },
    { title: "Activá la tarjeta local", description: "Desde la app activás la tarjeta local (la azul). La virtual es gratuita y se activa al instante; si querés, también podés pedir una física." },
    { title: "Cargá saldo", description: "Poné fondos en tu cuenta de ARQ desde la app. Los medios de carga y los límites los ves ahí, porque pueden cambiar." },
    { title: "Pagá en Steam", description: "En Steam elegí tarjeta de crédito o débito como medio de pago y cargá los datos de tu tarjeta local de ARQ (número, vencimiento y código de seguridad, que ves en la app)." },
]

const FAQ = [
    { id: "barato", title: "¿Por qué sale más barato?", content: "Con una tarjeta local común, la compra en Steam llega con el IVA de 21% de servicios digitales y, según tu provincia, Ingresos Brutos. Según la ayuda oficial de ARQ, las compras en Steam con su tarjeta local no tienen cargos extra: se convierten a la cotización del momento, sin comisiones ni recargos." },
    { id: "local-global", title: "¿Tarjeta local o global?", content: "Para Steam usá la tarjeta local (azul). La global (verde) es para otros pagos en moneda extranjera o en el exterior, como PlayStation." },
    { id: "rechazo", title: "Steam me rechazó el pago", content: "Puede pasar: la aprobación depende de cómo Steam procese el pago. No es un problema de tu cuenta ni de tu tarjeta; volvé a intentar con la tarjeta local de ARQ." },
    { id: "costo", title: "¿Cuánto cuesta la tarjeta?", content: "La tarjeta virtual local es gratuita. Revisá en la app las condiciones vigentes de la tarjeta física y de la carga de saldo." },
]

const JSON_LD = [
    breadcrumbLd([["Calculadora", "/"], ["Pagar con ARQ", "/arq"]]),
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map(item => ({
            "@type": "Question",
            name: item.title,
            acceptedAnswer: { "@type": "Answer", text: item.content },
        })),
    },
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Cómo pagar en Steam con la tarjeta local de ARQ",
        inLanguage: "es-AR",
        url: absoluteUrl("/arq"),
        step: STEPS.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.title,
            text: step.description,
        })),
    },
]

export default function Arq() {
    return (
        <article className="flex flex-col gap-6 w-full animate-fade-up">
            <JsonLd data={JSON_LD} />
            <div className="flex items-center justify-between gap-3">
                <h1 className="font-bold text-lg dark:text-white">Pagá Steam con ARQ</h1>
                <ButtonLink href="/" color="secondary" icon={<ArrowLeft size={16} />}>Calculadora</ButtonLink>
            </div>

            <section className="flex flex-col gap-3">
                <h2 className="font-semibold dark:text-white">Cómo funciona</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    ARQ es una app con cuenta en dólares que te da una tarjeta Mastercard. Su tarjeta local sirve para pagar en Steam sin el 21% de IVA que suman las tarjetas locales comunes, y sin cargar saldo previamente en la billetera de Steam.
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    ARQ convierte con su propia cotización, que queda un poco por encima de la oficial. Aun así el precio final es menor que con una tarjeta común. Podés ver la diferencia en la <Link href="/" className="underline underline-offset-2">calculadora</Link>, eligiendo Videojuegos.
                </p>
            </section>

            <ArqRewardBanner showMore={false} />

            <section className="flex flex-col gap-4">
                <h2 className="font-semibold dark:text-white">Instalación y primer uso</h2>
                <Stepper steps={STEPS} current={0} orientation="vertical" numbered />
                <ArqReferralButton className="!w-full !py-3.5" />
                <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700">
                    <img src="/arq-qr.png" width={180} height={180} className="w-44 h-auto" alt="Código QR para registrarte en ARQ con el link de referido de impuestAR" />
                    <span className="text-xs text-neutral-500 text-center">¿Lo abrís desde la compu? Escaneá el QR con tu celular.</span>
                </div>
            </section>

            <Alert color="yellow" showIcon>
                <strong>Si Steam rechaza el pago, reintentá.</strong> A veces hace falta más de un intento con la misma tarjeta.
            </Alert>

            <section className="flex flex-col gap-3">
                <h2 className="inline-flex items-center gap-2 font-semibold dark:text-white"><CircleHelp size={18} /> Preguntas frecuentes</h2>
                <Accordion items={FAQ} variant="separated" />
            </section>

            <span className="text-xs text-neutral-500">
                Información basada en la ayuda oficial de ARQ. Las condiciones, comisiones y cotizaciones pueden cambiar: confirmalas en la app. impuestAR no está afiliado a ARQ y puede recibir una compensación por los registros hechos con el botón de arriba.
            </span>
        </article>
    )
}
