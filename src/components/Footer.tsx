import { Coffee, Send } from "lucide-react";
import GithubIcon from "@/icons/GithubIcon";
import { Footer as BlossomFooter } from "./ui/Footer";
import SoftLinks from "./SoftLinks";

const SOCIAL = [
    { href: "https://github.com/juanigarciadev/", label: "GitHub", Icon: GithubIcon },
    { href: "https://cafecito.app/juanigarciadev", label: "Cafecito", Icon: Coffee },
    { href: "mailto:juanigarciadev@gmail.com", label: "Email", Icon: Send },
]

const LINKS = [
    { label: "Calculadora", href: "/" },
    { label: "Suscripciones", href: "/servicios" },
    { label: "Pagar con ARQ", href: "/arq" },
    { label: "Metodología", href: "/metodologia" },
    { label: "Novedades", href: "/novedades" },
    { label: "Legal y privacidad", href: "/legal" },
]

export default function Footer() {
    return (
        <SoftLinks>
        <BlossomFooter
            align="center"
            brand="impuestAR"
            logo={
                <a href="/" aria-label="impuestAR, ir al inicio">
                    <img src="/logo.svg" className="w-[130px] dark:hidden" alt="impuestAR" />
                    <img src="/logo-white.svg" className="w-[130px] hidden dark:block" alt="impuestAR" />
                </a>
            }
            labels={{ rights: "Código abierto · Cotizaciones de DolarApi", navigation: "Pie de página" }}
            links={LINKS}
            social={SOCIAL.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="p-2 border border-neutral-200 rounded-full text-neutral-700 duration-200 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white">
                    <Icon size={20} />
                </a>
            ))}
        />
        </SoftLinks>
    )
}
