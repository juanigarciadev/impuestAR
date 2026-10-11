'use client'

import { useId, useState, type ReactNode } from 'react'

export interface AccordionItem {
    id: string
    title: string
    content: ReactNode
    disabled?: boolean
}

export interface AccordionProps {
    items: AccordionItem[]
    /** Allow several items to be open at the same time. */
    multiple?: boolean
    /** Ids of the items that start open. */
    defaultOpen?: string[]
    /** `flush` only draws lines between items, `bordered` wraps all of them and `separated` makes each one a card. */
    variant?: 'flush' | 'bordered' | 'separated'
}

const wrapper = {
    flush: 'bg-white divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900',
    bordered: 'bg-white divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900',
    separated: 'flex flex-col gap-3',
}

export const Accordion = ({ items, multiple = false, defaultOpen = [], variant = 'bordered' }: AccordionProps) => {
    const id = useId()
    const [open, setOpen] = useState<string[]>(defaultOpen)

    const toggle = (itemId: string) =>
        setOpen((current) => {
            if (current.includes(itemId)) return current.filter((value) => value !== itemId)
            return multiple ? [...current, itemId] : [itemId]
        })

    return (
        <div className={`w-full ${wrapper[variant]}`}>
            {items.map((item) => {
                const isOpen = open.includes(item.id)
                return (
                    <div key={item.id} className={variant === 'separated' ? 'overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900' : ''}>
                        <h3>
                            <button
                                id={`${id}-header-${item.id}`}
                                type='button'
                                aria-expanded={isOpen}
                                aria-controls={`${id}-panel-${item.id}`}
                                disabled={item.disabled}
                                onClick={() => toggle(item.id)}
                                className='flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium text-neutral-900 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--blossom-accent,#f472b6)] disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-neutral-800'
                            >
                                {item.title}
                                <svg className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='m6 9 6 6 6-6' />
                                </svg>
                            </button>
                        </h3>
                        <div
                            id={`${id}-panel-${item.id}`}
                            role='region'
                            aria-labelledby={`${id}-header-${item.id}`}
                            className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                        >
                            <div className='overflow-hidden'>
                                <div className={`px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-300 ${isOpen ? '' : 'invisible'}`}>{item.content}</div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
