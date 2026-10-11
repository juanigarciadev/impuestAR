'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { accentStyle } from './accent'

export interface NavbarLink {
    label: string
    href: string
    /** Marks the link of the page that is open. */
    active?: boolean
}

export interface NavbarProps {
    /** Extra classes for the bar, for example to change the offset when it is sticky. */
    className?: string
    /** Texts of the component. Pass only the ones you want to change, for example to translate it. */
    labels?: { navigation?: string; openMenu?: string; closeMenu?: string }
    /** Accent color of this component: any CSS color. Without it the component uses `--blossom-accent`, which is pink by default. */
    color?: string
    brand: ReactNode
    links: NavbarLink[]
    /** Buttons shown at the right on a wide screen. On a narrow one they move inside the menu. */
    actions?: ReactNode
    /** Buttons that stay in the bar at every width, for example the cart. */
    alwaysVisibleActions?: ReactNode
    /** Width in pixels under which the links and `actions` collapse into the menu button. */
    breakpoint?: number
    /** Keep the bar at the top while the page scrolls. */
    sticky?: boolean
}

/** True while the window is narrower than `width`. */
const useNarrow = (width: number) => {
    const query = `(max-width: ${width - 1}px)`
    const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

    useEffect(() => {
        const media = window.matchMedia(query)
        const update = () => setNarrow(media.matches)
        update()
        media.addEventListener('change', update)
        return () => media.removeEventListener('change', update)
    }, [query])

    return narrow
}

export const Navbar = ({ labels, color, className = '', brand, links, actions, alwaysVisibleActions, breakpoint = 640, sticky = false }: NavbarProps) => {
    const [open, setOpen] = useState(false)
    const narrow = useNarrow(breakpoint)

    // The menu is only for narrow screens: close it when the window grows.
    useEffect(() => {
        if (!narrow) setOpen(false)
    }, [narrow])

    return (
        <header className={`z-30 w-full rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/80 ${sticky ? 'sticky top-4' : ''} ${className}`} style={accentStyle(color)}>
            <div className='flex items-center justify-between gap-4 px-4 py-3'>
                <div className='flex items-center gap-8'>
                    <div className='text-lg font-bold text-neutral-900 dark:text-white'>{brand}</div>
                    {!narrow && (
                        <nav aria-label={labels?.navigation ?? 'Main'} className='flex items-center gap-1'>
                            {links.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    aria-current={link.active ? 'page' : undefined}
                                    className={`rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--blossom-accent,#f472b6)] ${link.active ? 'bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_10%,transparent)] text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_85%,black)] dark:text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,white)]' : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white'}`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    {!narrow && actions && <div className='flex items-center gap-2'>{actions}</div>}
                    {alwaysVisibleActions && <div className='flex items-center gap-2'>{alwaysVisibleActions}</div>}
                    {narrow && (
                        <button
                            type='button'
                            aria-label={open ? labels?.closeMenu ?? 'Close menu' : labels?.openMenu ?? 'Open menu'}
                            aria-expanded={open}
                            onClick={() => setOpen((current) => !current)}
                            className='rounded-xl p-2 text-neutral-700 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-[var(--blossom-accent,#f472b6)] dark:text-white dark:hover:bg-neutral-800'
                        >
                            <svg className='h-5 w-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                <path strokeLinecap='round' strokeLinejoin='round' d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            {narrow && open && (
                <div className='flex flex-col gap-1 border-t border-neutral-200 p-3 dark:border-neutral-700'>
                    <nav aria-label={labels?.navigation ?? 'Main'} className='flex flex-col gap-1'>
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                aria-current={link.active ? 'page' : undefined}
                                onClick={() => setOpen(false)}
                                className={`rounded-xl px-3 py-2 text-sm font-medium ${link.active ? 'bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_10%,transparent)] text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_85%,black)] dark:text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,white)]' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    {actions && <div className='flex flex-wrap gap-2 pt-2'>{actions}</div>}
                </div>
            )}
        </header>
    )
}
