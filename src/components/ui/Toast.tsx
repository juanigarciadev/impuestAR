'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

const ACCENT_VAR = 'var(--blossom-accent,#f472b6)'

export type ToastColor = 'default' | 'green' | 'red' | 'yellow' | 'dark'

export interface ToastProps {
    /** Accessible name of the dismiss button. */
    dismissLabel?: string
    /** A preset, `accent` for the brand color or any CSS color. A custom color fills the toast and the text switches between black and white to stay readable. */
    color?: ToastColor | (string & {})
    children: ReactNode
    /** Text of the action button, for example "Undo". */
    actionLabel?: string
    onAction?: () => void
    onDismiss?: () => void
}

const styles: Record<ToastColor, { box: string; icon: string; action: string }> = {
    default: { box: 'bg-blue-600', icon: 'bg-blue-500 text-blue-100', action: 'border-blue-500 hover:border-blue-700 hover:bg-blue-700' },
    green: { box: 'bg-green-600', icon: 'bg-green-500 text-green-100', action: 'border-green-500 hover:border-green-700 hover:bg-green-700' },
    red: { box: 'bg-red-600', icon: 'bg-red-500 text-red-100', action: 'border-red-500 hover:border-red-700 hover:bg-red-700' },
    yellow: { box: 'bg-yellow-400', icon: 'bg-yellow-400 text-yellow-100', action: 'border-yellow-400 hover:border-yellow-600 hover:bg-yellow-600' },
    dark: { box: 'bg-neutral-800 dark:bg-neutral-700', icon: 'bg-neutral-700 text-neutral-200 dark:bg-neutral-600', action: 'border-neutral-600 hover:border-neutral-900 hover:bg-neutral-900' },
}

const icons: Record<ToastColor, string> = {
    default: 'M11 7h2v2h-2zm0 4h2v6h-2z',
    green: 'm10 15.586l-3.293-3.293l-1.414 1.414L10 18.414l9.707-9.707l-1.414-1.414z',
    red: 'm16.192 6.344l-4.243 4.242l-4.242-4.242l-1.414 1.414L10.535 12l-4.242 4.242l1.414 1.414l4.242-4.242l4.243 4.242l1.414-1.414L13.364 12l4.242-4.242z',
    yellow: 'M11 7h2v7h-2zm0 8h2v2h-2z',
    dark: 'M11 7h2v2h-2zm0 4h2v6h-2z',
}

/** Black or white, whichever reads better over a hex or rgb() color. Other CSS colors get white. */
const readableOn = (color: string) => {
    // A CSS variable cannot be measured: the text on top of it uses the contrast variable of the accent.
    if (color.trim().startsWith('var(')) return 'var(--blossom-accent-contrast,#ffffff)'
    const hex = color.trim().replace('#', '')
    const full = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex
    const rgb = /^[0-9a-f]{6}$/i.test(full) ? [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16)) : color.match(/\d+/g)?.slice(0, 3).map(Number)
    if (!rgb || rgb.length < 3) return '#ffffff'
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 150 ? '#171717' : '#ffffff'
}

const isPreset = (color: string): color is ToastColor => color in styles

export const Toast = ({ dismissLabel = 'Dismiss', color: colorProp = 'default', children, actionLabel, onAction, onDismiss }: ToastProps) => {
    const color = colorProp === 'accent' ? ACCENT_VAR : colorProp
    const preset = isPreset(color)
    const style = preset ? styles[color] : { box: '', icon: 'bg-black/15', action: 'border-current hover:bg-black/10' }
    // On a custom color the text is black or white depending on the contrast.
    const ink = preset ? (color === 'yellow' ? 'text-neutral-900' : 'text-white') : ''
    return (
        <div role='status' className={`inline-flex h-fit w-fit items-center gap-4 rounded-xl px-4 py-4 shadow-lg ${style.box}`} style={preset ? undefined : { backgroundColor: color, color: readableOn(color) }}>
            <span className={`rounded-lg p-1 ${style.icon}`}>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d={icons[preset ? color : 'default']} /></svg>
            </span>
            <span className={ink}>{children}</span>
            {(actionLabel || onDismiss) && (
                <div className='inline-flex items-center gap-2'>
                    {actionLabel && (
                        <button type='button' onClick={onAction} className={`select-none rounded-full border bg-transparent px-4 py-[7px] text-sm font-medium ${ink} ${style.action}`}>
                            {actionLabel}
                        </button>
                    )}
                    {actionLabel && onDismiss && <div className='h-6 w-px bg-current opacity-60' />}
                    {onDismiss && (
                        <button type='button' aria-label={dismissLabel} onClick={onDismiss} className={`rounded-lg p-2 hover:bg-black/20 ${ink}`}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='m16.192 6.344l-4.243 4.242l-4.242-4.242l-1.414 1.414L10.535 12l-4.242 4.242l1.414 1.414l4.242-4.242l4.243 4.242l1.414-1.414L13.364 12l4.242-4.242z' /></svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export interface ToastItem extends Omit<ToastProps, 'onDismiss' | 'children'> {
    id: number
    message: string
    /** Milliseconds before it closes by itself. Use 0 to keep it until dismissed. */
    duration: number
}

/** State for a stack of toasts. Call `toast()` from anywhere in your component. */
export const useToasts = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const nextId = useRef(0)
    const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

    const dismiss = useCallback((id: number) => {
        clearTimeout(timers.current.get(id))
        timers.current.delete(id)
        setToasts((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const toast = useCallback((message: string, options: Partial<Omit<ToastItem, 'id' | 'message'>> = {}) => {
        const id = nextId.current++
        const duration = options.duration ?? 4000
        setToasts((prev) => [...prev, { ...options, id, message, duration }])
        if (duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), duration))
        return id
    }, [dismiss])

    useEffect(() => {
        const pending = timers.current
        return () => pending.forEach(clearTimeout)
    }, [])

    return { toasts, toast, dismiss }
}

export interface ToasterProps {
    toasts: ToastItem[]
    onDismiss: (id: number) => void
    /** Accessible name of the close button of every toast. */
    dismissLabel?: string
    /** Corner of the screen. Use a top one if the toasts hide the buttons at the bottom of a dialog. */
    position?: ToasterPosition
    /** Classes for the container. They replace the ones of `position`. */
    className?: string
}

export type ToasterPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

const positions: Record<ToasterPosition, string> = {
    'top-left': 'left-4 top-4 items-start',
    'top-center': 'left-1/2 top-4 -translate-x-1/2 items-center',
    'top-right': 'right-4 top-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
}

export const Toaster = ({ toasts, onDismiss, dismissLabel, position = 'bottom-right', className }: ToasterProps) => (
    <div aria-live='polite' className={className ?? `fixed z-[90] flex flex-col gap-2 ${positions[position]}`}>
        {toasts.map(({ id, message, color, actionLabel, onAction }) => (
            <Toast key={id} color={color} dismissLabel={dismissLabel} actionLabel={actionLabel} onAction={onAction} onDismiss={() => onDismiss(id)}>{message}</Toast>
        ))}
    </div>
)
