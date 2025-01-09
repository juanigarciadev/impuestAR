import SendIcon from "@/icons/SendIcon";

export default function UpdateRequest() {
    return(
        <a href="mailto:juanigarciadev@gmail.com" target="_blank" className="inline-flex gap-1 items-center justify-center w-full rounded-lg py-4 cursor-pointer bg-blue-600 hover:bg-blue-700 duration-200">
            <SendIcon/>
            <h3 className="text-white text-sm">Solicitar una revisión</h3>
        </a>
    )
}