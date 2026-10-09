import { Coffee } from "lucide-react";

export default function SupportBanner() {
    return(
        <a href="https://cafecito.app/juanigarciadev" target="_blank" rel="noopener noreferrer" className="text-white inline-flex gap-2 items-center justify-center w-full rounded-xl py-4 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] bg-[length:140%_100%] bg-left hover:bg-right transition-[background-position] duration-500 active:scale-[.99]">
            <Coffee size={18} />
            <span className="text-sm font-medium">Apoyá el proyecto</span>
        </a>
    )
}
