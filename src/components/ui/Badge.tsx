import type { HTMLAttributes, ReactNode } from 'react'

export type BadgeColor = 'default' | 'dark' | 'red' | 'green' | 'yellow' | 'purple'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
    color?: BadgeColor
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
}

const outline: Record<BadgeColor, string> = {
    default: 'border border-blue-900 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-neutral-700 dark:text-blue-400',
    dark: 'border border-neutral-900 bg-neutral-100 text-neutral-900 dark:border-neutral-500 dark:bg-neutral-700 dark:text-neutral-400',
    red: 'border border-red-900 bg-red-100 text-red-900 dark:border-red-400 dark:bg-neutral-700 dark:text-red-400',
    green: 'border border-green-900 bg-green-100 text-green-900 dark:border-green-400 dark:bg-neutral-700 dark:text-green-400',
    yellow: 'border border-yellow-900 bg-yellow-100 text-yellow-900 dark:border-yellow-400 dark:bg-neutral-700 dark:text-yellow-400',
    purple: 'border border-purple-900 bg-purple-100 text-purple-900 dark:border-purple-400 dark:bg-neutral-700 dark:text-purple-400',
}

export const Badge = ({ color = 'default', outlined = false, rounded = false, icon, onDismiss, className = '', children, ...props }: BadgeProps) => {
    const iconOnly = icon && !children
    return (
        <span
            className={`flex h-fit w-fit cursor-default items-center gap-1 text-xs font-medium ${iconOnly ? 'p-2' : 'px-2.5 py-1'} ${rounded || iconOnly ? 'rounded-full' : 'rounded-xl'} ${outlined ? outline[color] : filled[color]} ${className}`}
            {...props}
        >
            {icon}
            {children}
            {onDismiss && (
                <button
                    type='button'
                    aria-label='Dismiss'
                    onClick={onDismiss}
                    className='-mr-1 ml-1 rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10'
                >
                    <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'><path d='M6 6l12 12M18 6 6 18' /></svg>
                </button>
            )}
        </span>
    )
}
