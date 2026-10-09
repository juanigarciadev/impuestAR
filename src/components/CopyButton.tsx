"use client"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/Button"

export default function CopyButton({ valueToCopy }: { valueToCopy: string | number }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(String(valueToCopy))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Portapapeles no disponible (contexto inseguro o permiso denegado)
        }
    }

    return (
        <Button color="secondary" rounded className="!p-2.5" aria-label={copied ? "Total copiado" : "Copiar total"} onClick={copyToClipboard} icon={copied ? <Check size={16} /> : <Copy size={16} />} />
    )
}
