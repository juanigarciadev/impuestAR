"use client"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { IconButton } from "./ui/Button"
import { Toaster, useToasts } from "./ui/Toast"

export default function CopyButton({ valueToCopy }: { valueToCopy: string | number }) {
    const [copied, setCopied] = useState(false)
    const { toasts, toast, dismiss } = useToasts()

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(String(valueToCopy))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast("Total copiado al portapapeles", { color: "green", duration: 2000 })
        } catch {
            toast("No pudimos copiar el total", { color: "red", duration: 3000 })
        }
    }

    return (
        <>
            <IconButton color="secondary" rounded size="sm" label={copied ? "Total copiado" : "Copiar total"} onClick={copyToClipboard} icon={copied ? <Check size={16} /> : <Copy size={16} />} />
            <Toaster toasts={toasts} onDismiss={dismiss} position="bottom-center" dismissLabel="Cerrar" />
        </>
    )
}
