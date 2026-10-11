'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

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

const ACCENT_VAR = 'var(--blossom-accent,#f472b6)'

export type ButtonColor = 'primary' | 'secondary' | 'default' | 'red' | 'green' | 'yellow' | 'purple' | 'pink'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    /** Visual style of the button: a preset, `accent` for the brand color (`--blossom-accent`) or any CSS color such as `#7c3aed`. */
    color?: ButtonColor | (string & {})
    /** Use fully rounded (pill) corners. */
    rounded?: boolean
    /** Shows a spinner and disables the button. */
    loading?: boolean
    size?: 'sm' | 'md' | 'lg'
    /** Optional icon placed before the label. */
    icon?: ReactNode
}

const colors: Record<ButtonColor, string> = {
    primary: 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200',
    secondary: 'border border-neutral-300 bg-transparent hover:bg-neutral-200 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-800',
    default: 'bg-blue-700 text-white hover:bg-blue-800',
    red: 'bg-red-700 text-white hover:bg-red-800',
    green: 'bg-green-700 text-white hover:bg-green-800',
    yellow: 'bg-yellow-400 text-neutral-900 hover:bg-yellow-500',
    purple: 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800',
    pink: 'bg-pink-700 text-white hover:bg-pink-800',
}

const isPreset = (color: string): color is ButtonColor => color in colors

const buttonSizes = { sm: 'px-3 py-2 text-xs', md: 'px-4 py-3 text-sm', lg: 'px-6 py-3.5 text-base' }

const spinners: Record<ButtonColor, string> = {
    primary: 'border-neutral-200 border-l-neutral-500 dark:border-neutral-400 dark:border-l-neutral-600',
    secondary: 'border-neutral-400 border-l-neutral-700 dark:border-white dark:border-l-neutral-400',
    default: 'border-blue-300 border-l-white',
    red: 'border-red-300 border-l-white',
    green: 'border-green-300 border-l-white',
    yellow: 'border-yellow-200 border-l-white',
    purple: 'border-purple-300 border-l-white',
    pink: 'border-pink-300 border-l-white',
}

export const Button = ({ color: colorProp = 'primary', size = 'md', rounded = false, loading = false, icon, disabled, className = '', children, type = 'button', style, ...props }: ButtonProps) => {
    const color = colorProp === 'accent' ? ACCENT_VAR : colorProp
    const custom = !isPreset(color)
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={`flex w-fit select-none items-center justify-center gap-2 ${buttonSizes[size]} font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blossom-accent,#f472b6)] disabled:cursor-not-allowed disabled:opacity-60 ${loading ? 'cursor-progress' : ''} ${rounded ? 'rounded-full' : 'rounded-xl'} ${isPreset(color) ? colors[color] : 'hover:brightness-90'} ${className}`}
            style={custom ? { backgroundColor: color, color: readableOn(color), ...style } : style}
            {...props}
        >
            {loading ? <span className={`h-4 w-4 animate-spin rounded-full border-2 ${isPreset(color) ? spinners[color] : 'border-current border-l-transparent'}`} /> : icon}
            {children}
        </button>
    )
}

export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'children'> {
    /** Any element: an icon from the library you prefer or your own SVG. */
    icon: ReactNode
    /** What the button does. It is the accessible name, because the button has no text. */
    label: string
    /** A preset or any CSS color. */
    color?: ButtonColor | (string & {})
    size?: IconButtonSize
    /** Use a circle instead of rounded corners. */
    rounded?: boolean
    /** Shows a spinner and disables the button. */
    loading?: boolean
}

const iconSizes: Record<IconButtonSize, string> = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
}

/** A square button that only shows an icon of your choice. */
export const IconButton = ({ icon, label, color: colorProp = 'secondary', size = 'md', rounded = false, loading = false, disabled, className = '', type = 'button', style, ...props }: IconButtonProps) => {
    const color = colorProp === 'accent' ? ACCENT_VAR : colorProp
    return (
    <button
        type={type}
        aria-label={label}
        title={label}
        disabled={disabled || loading}
        aria-busy={loading}
        className={`flex shrink-0 select-none items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blossom-accent,#f472b6)] disabled:cursor-not-allowed disabled:opacity-60 ${loading ? 'cursor-progress' : ''} ${rounded ? 'rounded-full' : 'rounded-xl'} ${iconSizes[size]} ${isPreset(color) ? colors[color] : 'hover:brightness-90'} ${className}`}
        style={isPreset(color) ? style : { backgroundColor: color, color: readableOn(color), ...style }}
        {...props}
    >
        {loading ? <span className={`h-4 w-4 animate-spin rounded-full border-2 ${isPreset(color) ? spinners[color] : 'border-current border-l-transparent'}`} /> : icon}
    </button>
    )
}

export type SocialProvider = 'facebook' | 'x' | 'github' | 'google' | 'apple'

export interface SocialButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    provider: SocialProvider
    /** Text of the button, for example to translate it. Without it the text is "Sign in with" and the name of the provider. */
    label?: string
    /** Render only the icon. */
    iconOnly?: boolean
    rounded?: boolean
}

const providers: Record<SocialProvider, { label: string; style: string; icon: ReactNode }> = {
    facebook: {
        label: 'Sign in with Facebook',
        style: 'bg-[#3b5998] hover:bg-[#3b5998]/90',
        icon: <svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 8 19'><path fillRule='evenodd' d='M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z' clipRule='evenodd' /></svg>,
    },
    x: {
        label: 'Sign in with X',
        style: 'bg-black hover:bg-neutral-800',
        icon: <svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 512 512'><path d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z' /></svg>,
    },
    github: {
        label: 'Sign in with Github',
        style: 'bg-[#24292F] hover:bg-[#24292F]/90 dark:hover:bg-[#050708]/30',
        icon: <svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z' clipRule='evenodd' /></svg>,
    },
    google: {
        label: 'Sign in with Google',
        style: 'bg-[#4285F4] hover:bg-[#4285F4]/90',
        icon: <svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 18 19'><path fillRule='evenodd' d='M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z' clipRule='evenodd' /></svg>,
    },
    apple: {
        label: 'Sign in with Apple',
        style: 'bg-[#050708] hover:bg-[#050708]/90 dark:hover:bg-[#050708]/30',
        icon: <svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 384 512'><path d='M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z' /></svg>,
    },
}

export const SocialButton = ({ provider, label: customLabel, iconOnly = false, rounded = false, className = '', type = 'button', ...props }: SocialButtonProps) => {
    const { label: defaultLabel, style, icon } = providers[provider]
    const label = customLabel ?? defaultLabel
    return (
        <button
            type={type}
            aria-label={iconOnly ? label : undefined}
            className={`inline-flex w-fit select-none items-center justify-center gap-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blossom-accent,#f472b6)] ${iconOnly ? 'p-3' : 'px-5 py-3'} ${rounded ? 'rounded-full' : 'rounded-xl'} ${style} ${className}`}
            {...props}
        >
            {icon}
            {!iconOnly && label}
        </button>
    )
}
