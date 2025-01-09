import CoffeeIcon from "@/icons/CoffeeIcon";

export default function SupportBanner() {
    return(
        <a href="https://cafecito.app/juanigarciadev" target="_blank" className="inline-flex gap-1 items-center justify-center w-full rounded-lg py-4 cursor-pointer bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] hover:bg-[linear-gradient(150deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))]">
            <CoffeeIcon/>
            <h3 className="text-white text-sm">Apoyá el proyecto</h3>
        </a>
    )
}