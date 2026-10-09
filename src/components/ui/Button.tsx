import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonColor = 'primary' | 'secondary' | 'default' | 'red' | 'green' | 'yellow' | 'purple'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    /** Visual style of the button. */
    color?: ButtonColor
    /** Use fully rounded (pill) corners. */
    rounded?: boolean
    /** Shows a spinner and disables the button. */
    loading?: boolean
    /** Optional icon placed before the label. */
    icon?: ReactNode
}

const colors: Record<ButtonColor, string> = {
    primary: 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200',
    secondary: 'border border-neutral-300 bg-transparent hover:bg-neutral-200 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-800',
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    red: 'bg-red-700 text-white hover:bg-red-800',
    green: 'bg-green-700 text-white hover:bg-green-800',
    yellow: 'bg-yellow-400 text-white hover:bg-yellow-500',
    purple: 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800',
}

const spinners: Record<ButtonColor, string> = {
    primary: 'border-neutral-200 border-l-neutral-500 dark:border-neutral-400 dark:border-l-neutral-600',
    secondary: 'border-neutral-400 border-l-neutral-700 dark:border-white dark:border-l-neutral-400',
    default: 'border-blue-300 border-l-white',
    red: 'border-red-300 border-l-white',
    green: 'border-green-300 border-l-white',
    yellow: 'border-yellow-200 border-l-white',
    purple: 'border-purple-300 border-l-white',
}

export const Button = ({ color = 'primary', rounded = false, loading = false, icon, disabled, className = '', children, type = 'button', ...props }: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={`flex w-fit select-none items-center justify-center gap-2 px-4 py-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 ${loading ? 'cursor-progress' : ''} ${rounded ? 'rounded-full' : 'rounded-xl'} ${colors[color]} ${className}`}
            {...props}
        >
            {loading ? <span className={`h-4 w-4 animate-spin rounded-full border-2 ${spinners[color]}`} /> : icon}
            {children}
        </button>
    )
}

export interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    href: string
    color?: ButtonColor
    rounded?: boolean
    icon?: ReactNode
}

/** A link that looks like a Button, for navigation. */
export const ButtonLink = ({ href, color = 'primary', rounded = false, icon, className = '', children, ...props }: ButtonLinkProps) => (
    <Link
        href={href}
        className={`flex w-fit select-none items-center justify-center gap-2 px-4 py-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${rounded ? 'rounded-full' : 'rounded-xl'} ${colors[color]} ${className}`}
        {...props}
    >
        {icon}
        {children}
    </Link>
)
