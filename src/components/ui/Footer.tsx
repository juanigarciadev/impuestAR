'use client'

import type { ReactNode } from 'react'

export interface FooterLink {
    label: string
    href: string
}

export interface FooterColumn {
    title: string
    links: FooterLink[]
}

export interface FooterProps {
    /** Texts of the component. Pass only the ones you want to change, for example to translate it. */
    labels?: { rights?: string; navigation?: string }
    /** Name of the project shown in the footer. */
    brand: string
    /** Logo shown instead of the brand name (local patch). The brand is still used in the copyright. */
    logo?: ReactNode
    description?: string
    /** Groups of links. With two or more groups the footer becomes a grid. */
    columns?: FooterColumn[]
    /** A single row of links, used when there are no columns. */
    links?: FooterLink[]
    /** Social icons or any element shown next to the copyright. */
    social?: ReactNode
    /** Copyright year. Defaults to the current year. */
    year?: number
    align?: 'left' | 'center'
}

const link = 'text-neutral-600 hover:text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_85%,black)] dark:text-neutral-300'

export const Footer = ({ labels, brand, logo, description, columns, links, social, year = new Date().getFullYear(), align = 'left' }: FooterProps) => {
    const copyright = `© ${year} ${brand}. ${labels?.rights ?? 'All rights reserved.'}`

    if (columns?.length) {
        return (
            <footer className='w-full rounded-xl border border-neutral-300 bg-neutral-200 bg-opacity-40 p-6 dark:border-neutral-700 dark:bg-neutral-800'>
                <div className='grid gap-8' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))' }}>
                    <div className='flex flex-col gap-2'>
                        {logo ?? <span className='text-xl font-bold text-neutral-900 dark:text-white'>{brand}</span>}
                        {description && <p className='max-w-xs text-sm text-neutral-600 dark:text-neutral-300'>{description}</p>}
                    </div>
                    {columns.map((column) => (
                        <nav key={column.title} aria-label={column.title} className='flex flex-col gap-2 text-sm'>
                            <h4 className='font-medium text-neutral-900 dark:text-white'>{column.title}</h4>
                            {column.links.map((item) => <a key={item.label} href={item.href} className={link}>{item.label}</a>)}
                        </nav>
                    ))}
                </div>
                <div className='mt-6 flex items-center justify-between gap-4 border-t border-neutral-300 pt-4 text-sm text-neutral-500 dark:border-neutral-700 sm:flex-col'>
                    <p>{copyright}</p>
                    {social && <div className='flex gap-3'>{social}</div>}
                </div>
            </footer>
        )
    }

    const centered = align === 'center'
    return (
        <footer className={`flex w-full gap-4 rounded-xl border border-neutral-300 bg-neutral-200 bg-opacity-40 px-6 py-5 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 ${centered ? 'flex-col items-center py-8 text-center' : 'items-center justify-between sm:flex-col'}`}>
            {centered && (logo ?? <span className='text-xl font-bold text-neutral-900 dark:text-white'>{brand}</span>)}
            {!centered && <p>{copyright}</p>}
            {links && (
                <nav aria-label={labels?.navigation ?? 'Footer'} className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2'>
                    {links.map((item) => <a key={item.label} href={item.href} className='hover:text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_85%,black)]'>{item.label}</a>)}
                </nav>
            )}
            {social && <div className='flex gap-3'>{social}</div>}
            {centered && <p className='text-neutral-500'>{copyright}</p>}
        </footer>
    )
}
