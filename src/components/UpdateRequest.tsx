"use client"
import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Send } from "lucide-react"
import { Button } from "./ui/Button"
import { Checkbox, Input, Textarea } from "./ui/Forms"
import { Modal } from "./ui/Modal"
import { Toaster, useToasts } from "./ui/Toast"

const MIN_LENGTH = 10
const MAX_LENGTH = 1500

export default function UpdateRequest() {
    const pathname = usePathname()
    const { toasts, toast, dismiss } = useToasts()
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")
    const [website, setWebsite] = useState("") // campo trampa para bots
    const [consent, setConsent] = useState(false)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")

    // Otros componentes (por ejemplo el modal de una suscripción) pueden abrir el formulario con un mensaje prearmado
    useEffect(() => {
        const onOpen = (event: Event) => {
            const detail = (event as CustomEvent<{ message?: string }>).detail
            if (detail?.message) setMessage(detail.message)
            setOpen(true)
        }
        window.addEventListener("impuestar:revision", onOpen)
        return () => window.removeEventListener("impuestar:revision", onOpen)
    }, [])

    const close = () => {
        if (sending) return
        setOpen(false)
        setError("")
    }

    const submit = async (event: FormEvent) => {
        event.preventDefault()
        if (message.trim().length < MIN_LENGTH) {
            setError(`Escribí al menos ${MIN_LENGTH} caracteres.`)
            return
        }
        if (!consent) {
            setError("Para enviar el mensaje tenés que aceptar el tratamiento de tus datos.")
            return
        }
        setSending(true)
        setError("")
        try {
            const response = await fetch("/api/revision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, email, website, consent, page: pathname }),
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                setError(data.error ?? "No pudimos enviar el mensaje. Probá de nuevo más tarde.")
                return
            }
            setMessage("")
            setEmail("")
            setConsent(false)
            setOpen(false)
            toast("¡Gracias! Recibimos tu mensaje", { color: "green", duration: 4000 })
        } catch {
            setError("No pudimos enviar el mensaje. Revisá tu conexión e intentá de nuevo.")
        } finally {
            setSending(false)
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-white inline-flex gap-2 items-center justify-center w-full rounded-xl py-4 bg-blue-600 hover:bg-blue-700 duration-200 active:scale-[.99]"
            >
                <Send size={18} />
                <span className="text-sm font-medium">Solicitar una revisión</span>
            </button>

            <Modal open={open} onClose={close} title="Solicitar una revisión" closeLabel="Cerrar">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Contanos qué precio, impuesto o cotización creés que está mal, o qué servicio falta. Lo leemos y lo revisamos.
                    </p>
                    <Textarea
                        label="Tu mensaje"
                        rows={5}
                        required
                        maxLength={MAX_LENGTH}
                        value={message}
                        onChange={event => setMessage(event.target.value)}
                        placeholder="Ej.: El precio de Netflix Premium no coincide con lo que me cobran."
                        hint={`${message.length}/${MAX_LENGTH}`}
                    />
                    <Input
                        label="Tu mail (opcional)"
                        type="email"
                        autoComplete="email"
                        maxLength={200}
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="Para responderte"
                    />
                    <div className="flex flex-col gap-1">
                        <Checkbox
                            required
                            checked={consent}
                            onChange={event => setConsent(event.target.checked)}
                            label="Acepto que mi mensaje y mi mail se usen para responderme y se envíen a Resend (EE.UU.) para su entrega."
                        />
                        <span className="pl-8 text-xs text-neutral-500">
                            Más información en el <Link href="/legal" className="underline underline-offset-2" onClick={close}>aviso de privacidad</Link>. Podés pedir acceso o eliminación de tus datos escribiendo a juanigarciadev@gmail.com.
                        </span>
                    </div>
                    {/* Campo trampa: oculto para personas */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                        <label>
                            Sitio web
                            <input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} />
                        </label>
                    </div>
                    {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                    <div className="flex justify-end gap-2">
                        <Button color="secondary" onClick={close} disabled={sending}>Cancelar</Button>
                        <Button type="submit" loading={sending} icon={<Send size={16} />}>Enviar</Button>
                    </div>
                </form>
            </Modal>

            <Toaster toasts={toasts} onDismiss={dismiss} position="bottom-center" dismissLabel="Cerrar" />
        </>
    )
}
