"use client"
import CheckIcon from "@/icons/CheckIcon"
import CopyIcon from "@/icons/CopyIcon"
import { useState } from "react"

export default function CopyButton({ valueToCopy }: { valueToCopy: any }) {

    // Funciones necesarias para el boton de copiar valor total
    const [copied, setCopied] = useState(false)
    const copyToClipboard = (value: any) => {
        const text = typeof value === "object" ? JSON.stringify(value, null, 2) : value.toString()
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Resetear el estado después de 2 segundos
    }


    return(
        
        <button className="inline-flex items-center justify-center h-full w-10 border border-neutral-300 rounded-full hover:bg-neutral-100 cursor-pointer duration-200" onClick={()=>copyToClipboard(valueToCopy)}>{
            copied ? <CheckIcon/> : <CopyIcon/>
        }</button>
    )
}