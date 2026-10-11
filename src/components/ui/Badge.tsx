'use client'

import type { HTMLAttributes, ReactNode } from 'react'

const ACCENT_VAR = 'var(--blossom-accent,#f472b6)'

export type BadgeColor = 'default' | 'dark' | 'red' | 'green' | 'yellow' | 'purple' | 'pink'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
    /** Accessible name of the dismiss button. */
    dismissLabel?: string
    /** A preset, `accent` for the brand color or any CSS color, for example `#7c3aed`. */
    color?: BadgeColor | (string & {})
    /** Border instead of the soft filled style. */
    outlined?: boolean
    /** Fully rounded corners. */
    rounded?: boolean
    /** Icon shown before the text. Without children it renders a compact icon-only badge. */
    icon?: ReactNode
    /** When set, a close button is shown and this is called when it is pressed. */
    onDismiss?: () => void
}

const filled: Record<BadgeColor, string> = {
    default: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-300',
    dark: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-300',
    red: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-300',
    green: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-300',
    pink: 'bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-pink-300',
}

const outline: Record<BadgeColor, string> = {
    default: 'border border-blue-900 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-neutral-700 dark:text-blue-400',
    dark: 'border border-neutral-900 bg-neutral-100 text-neutral-900 dark:border-neutral-500 dark:bg-neutral-700 dark:text-neutral-400',
    red: 'border border-red-900 bg-red-100 text-red-900 dark:border-red-400 dark:bg-neutral-700 dark:text-red-400',
    green: 'border border-green-900 bg-green-100 text-green-900 dark:border-green-400 dark:bg-neutral-700 dark:text-green-400',
    yellow: 'border border-yellow-900 bg-yellow-100 text-yellow-900 dark:border-yellow-400 dark:bg-neutral-700 dark:text-yellow-400',
    purple: 'border border-purple-900 bg-purple-100 text-purple-900 dark:border-purple-400 dark:bg-neutral-700 dark:text-purple-400',
    pink: 'border border-pink-900 bg-pink-100 text-pink-900 dark:border-pink-400 dark:bg-neutral-700 dark:text-pink-400',
}

const isPreset = (color: string): color is BadgeColor => color in filled

export const Badge = ({ dismissLabel = 'Dismiss', color: colorProp = 'default', outlined = false, rounded = false, icon, onDismiss, className = '', children, style, ...props }: BadgeProps) => {
    const color = colorProp === 'accent' ? ACCENT_VAR : colorProp
    const iconOnly = icon && !children
    // A custom color is used for the text and the border, with a soft tint of it as background.
    const customStyle = isPreset(color)
        ? style
        : { color, backgroundColor: `color-mix(in srgb, ${color} ${outlined ? 8 : 18}%, transparent)`, ...(outlined ? { border: `1px solid ${color}` } : {}), ...style }
    return (
        <span
            className={`flex h-fit w-fit cursor-default items-center gap-1 text-xs font-medium ${iconOnly ? 'p-2' : 'px-2.5 py-1'} ${rounded || iconOnly ? 'rounded-full' : 'rounded-xl'} ${isPreset(color) ? (outlined ? outline[color] : filled[color]) : ''} ${className}`}
            style={customStyle}
            {...props}
        >
            {icon}
            {children}
            {onDismiss && (
                <button
                    type='button'
                    aria-label={dismissLabel}
                    onClick={onDismiss}
                    className='-mr-1 ml-1 rounded-lg p-0.5 hover:bg-black/10 dark:hover:bg-white/10'
                >
                    <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'><path d='M6 6l12 12M18 6 6 18' /></svg>
                </button>
            )}
        </span>
    )
}
