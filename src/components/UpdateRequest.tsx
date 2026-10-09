import { Send } from "lucide-react";

export default function UpdateRequest() {
    return(
        <a href="mailto:juanigarciadev@gmail.com" className="text-white inline-flex gap-2 items-center justify-center w-full rounded-xl py-4 bg-blue-600 hover:bg-blue-700 duration-200 active:scale-[.99]">
            <Send size={18} />
            <span className="text-sm font-medium">Solicitar una revisión</span>
        </a>
    )
}
