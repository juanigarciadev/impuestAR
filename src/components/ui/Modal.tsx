'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    /** Buttons shown at the bottom, for example Cancel and Accept. */
    footer?: ReactNode
    size?: 'sm' | 'md' | 'lg'
    /** Close when the user clicks outside the modal. */
    closeOnBackdrop?: boolean
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

export const Modal = ({ open, onClose, title, children, footer, size = 'md', closeOnBackdrop = true }: ModalProps) => {
    const titleId = useId()
    const panel = useRef<HTMLDivElement>(null)
    // Keep the latest onClose without re-running the open/close effect on every render
    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onCloseRef.current = onClose
    })

    useEffect(() => {
        if (!open) return

        const previouslyFocused = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        panel.current?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onCloseRef.current()
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = previousOverflow
            previouslyFocused?.focus()
        }
    }, [open])

    if (!open) return null

    return createPortal(
        <div
            className='fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'
            onMouseDown={(event) => {
                if (closeOnBackdrop && event.target === event.currentTarget) onClose()
            }}
        >
            <div
                ref={panel}
                role='dialog'
                aria-modal='true'
                aria-labelledby={titleId}
                tabIndex={-1}
                className={`w-full rounded-2xl border border-neutral-200 bg-white text-neutral-800 shadow-xl outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white ${sizes[size]}`}
            >
                <div className='flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700'>
                    <h3 id={titleId} className='text-lg font-medium'>{title}</h3>
                    <button type='button' aria-label='Close' onClick={onClose} className='rounded-xl p-1 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'>
                        <svg className='h-5 w-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M6 6l12 12M18 6 6 18' /></svg>
                    </button>
                </div>
                <div className='p-4 text-sm text-neutral-600 dark:text-neutral-300'>{children}</div>
                {footer && <div className='flex justify-end gap-2 border-t border-neutral-200 p-4 dark:border-neutral-700'>{footer}</div>}
            </div>
        </div>,
        document.body
    )
}
