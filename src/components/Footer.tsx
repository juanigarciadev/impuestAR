import { Coffee, Send } from "lucide-react";
import GithubIcon from "@/icons/GithubIcon";

const LINKS = [
    { href: "https://github.com/juanigarciadev/", label: "GitHub", Icon: GithubIcon },
    { href: "https://cafecito.app/juanigarciadev", label: "Cafecito", Icon: Coffee },
    { href: "mailto:juanigarciadev@gmail.com", label: "Email", Icon: Send },
]

export default function Footer() {
    return(
        <footer className="flex flex-col items-center gap-3 w-full pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-2">
                {LINKS.map(({ href, label, Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="p-2 border border-neutral-200 rounded-full text-neutral-700 duration-200 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-white">
                        <Icon size={20} />
                    </a>
                ))}
            </div>
            <p className="text-xs text-neutral-500">Código abierto · Cotizaciones de DolarApi</p>
        </footer>
    )
}
