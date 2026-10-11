'use client'

import { useState, type ReactNode } from 'react'

const ACCENT_VAR = 'var(--blossom-accent,#f472b6)'

export type AlertColor = 'default' | 'dark' | 'red' | 'green' | 'yellow'

export interface AlertProps {
    /** Accessible name of the dismiss button. */
    dismissLabel?: string
    /** A preset, `accent` for the brand color or any CSS color, for example `#7c3aed`. A custom color is used for the border, the icon and a soft tint of the background. */
    color?: AlertColor | (string & {})
    /** `accent` adds a thick border on the left side. */
    variant?: 'filled' | 'outlined' | 'accent'
    /** Show an icon that matches the color. */
    showIcon?: boolean
    /** Items rendered as a list below the message. */
    list?: string[]
    /** Buttons or links rendered below the message. */
    actions?: ReactNode
    /** Adds a close button; the alert hides itself when it is pressed. */
    dismissible?: boolean
    onDismiss?: () => void
    children: ReactNode
}

const box: Record<AlertColor, string> = {
    default: 'bg-blue-100 dark:bg-blue-900',
    dark: 'bg-neutral-200 dark:bg-neutral-900',
    red: 'bg-red-100 dark:bg-red-900',
    green: 'bg-green-100 dark:bg-green-900',
    yellow: 'bg-yellow-100 dark:bg-yellow-600',
}

const text: Record<AlertColor, string> = {
    default: 'text-blue-900 dark:text-blue-300',
    dark: 'text-neutral-900 dark:text-white',
    red: 'text-red-900 dark:text-red-300',
    green: 'text-green-900 dark:text-green-300',
    yellow: 'text-yellow-900 dark:text-yellow-100',
}

const outline: Record<AlertColor, string> = {
    default: 'border border-blue-900 dark:border-blue-500',
    dark: 'border border-neutral-900 dark:border-neutral-500',
    red: 'border border-red-900 dark:border-red-500',
    green: 'border border-green-900 dark:border-green-500',
    yellow: 'border border-yellow-600 dark:border-yellow-300',
}

const accent: Record<AlertColor, string> = {
    default: 'border-l-4 border-blue-900 dark:border-blue-300',
    dark: 'border-l-4 border-neutral-900 dark:border-white',
    red: 'border-l-4 border-red-900 dark:border-red-300',
    green: 'border-l-4 border-green-900 dark:border-green-300',
    yellow: 'border-l-4 border-yellow-600 dark:border-yellow-200',
}

const icons: Record<AlertColor, string> = {
    default: 'M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8zM11 11h2v6h-2zm0-4h2v2h-2z',
    dark: 'M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8zM11 11h2v6h-2zm0-4h2v2h-2z',
    red: 'M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8zM11 7h2v7h-2zm0 8h2v2h-2z',
    green: 'M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8zm-1-5.414l-3.293-3.293l1.414-1.414L11 11.758l4.293-4.293l1.414 1.414z',
    yellow: 'M12 2L1 21h22L12 2zm0 4.5L19.5 19h-15L12 6.5zM11 10h2v4h-2zm0 5h2v2h-2z',
}

const isPreset = (color: string): color is AlertColor => color in box

const actionButton = 'rounded-lg px-4 py-1 text-sm font-medium select-none'

export const Alert = ({ dismissLabel = 'Dismiss alert', color: colorProp = 'default', variant = 'filled', showIcon = false, list, actions, dismissible = false, onDismiss, children }: AlertProps) => {
    const color = colorProp === 'accent' ? ACCENT_VAR : colorProp
    const [visible, setVisible] = useState(true)
    if (!visible) return null

    const dismiss = () => {
        setVisible(false)
        onDismiss?.()
    }

    const preset = isPreset(color)
    const customStyle = preset
        ? undefined
        : {
            backgroundColor: `color-mix(in srgb, ${color} ${variant === 'filled' ? 16 : 10}%, transparent)`,
            ...(variant === 'outlined' ? { border: `1px solid ${color}` } : {}),
            ...(variant === 'accent' ? { borderLeft: `4px solid ${color}` } : {}),
        }

    return (
        <div
            role='alert'
            className={`h-fit w-full px-4 py-4 ${preset ? `${box[color]} ${text[color]}` : 'text-neutral-900 dark:text-white'} ${variant === 'outlined' ? `rounded-xl ${preset ? outline[color] : ''}` : variant === 'accent' ? `rounded-r-xl ${preset ? accent[color] : ''}` : 'rounded-xl'}`}
            style={customStyle}
        >
            <div className='flex items-start gap-2'>
                {showIcon && (
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' className='shrink-0' style={preset ? undefined : { color }} aria-hidden='true'>
                        <path fill='currentColor' d={icons[preset ? color : 'default']} />
                    </svg>
                )}
                <div className='flex flex-1 flex-col gap-3'>
                    <span className={showIcon ? 'pt-0.5' : ''}>{children}</span>
                    {list && (
                        <ul className='list-disc pl-5'>
                            {list.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                        </ul>
                    )}
                    {actions && <div className='flex flex-wrap gap-2'>{actions}</div>}
                </div>
                {dismissible && (
                    <button type='button' aria-label={dismissLabel} onClick={dismiss} className='-m-1 shrink-0 rounded-lg p-1 hover:bg-black/10 dark:hover:bg-white/10'>
                        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'><path d='M6 6l12 12M18 6 6 18' /></svg>
                    </button>
                )}
            </div>
        </div>
    )
}

/** Convenience buttons to use inside the `actions` prop. */
export const AlertAction = ({ children, onClick, primary = false }: { children: ReactNode; onClick?: () => void; primary?: boolean }) => (
    <button
        type='button'
        onClick={onClick}
        className={`${actionButton} ${primary ? 'bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200' : 'border border-current hover:bg-black/10 dark:hover:bg-white/10'}`}
    >
        {children}
    </button>
)
