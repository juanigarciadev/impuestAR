import { useEffect, useRef, type RefObject } from 'react'

/**
 * Shared behavior of the overlays (Modal, Drawer, Command palette and the photo viewer):
 * - only the one on top reacts to Escape, so closing a dialog opened from another dialog is one at a time
 * - Tab and Shift + Tab stay inside the panel
 * - the page scroll is locked until the last overlay closes
 * - the focus goes back to the element that opened it
 */

// Overlays that are open, the last one is on top.
const stack: symbol[] = []
let locked = 0
let previousOverflow = ''

const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const useOverlay = (open: boolean, onClose: () => void, panel: RefObject<HTMLElement | null>) => {
    // Keep the latest onClose without running the effect again on every render
    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onCloseRef.current = onClose
    })

    useEffect(() => {
        if (!open) return

        const id = Symbol('overlay')
        stack.push(id)
        const previouslyFocused = document.activeElement as HTMLElement | null
        if (locked++ === 0) {
            previousOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
        }
        panel.current?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (stack[stack.length - 1] !== id) return

            // A select or a picker inside the overlay closes first and marks the event as handled.
            if (event.key === 'Escape' && !event.defaultPrevented) {
                event.preventDefault()
                onCloseRef.current()
                return
            }

            if (event.key !== 'Tab' || !panel.current) return
            const items = Array.from(panel.current.querySelectorAll<HTMLElement>(focusable)).filter((element) => element.getClientRects().length > 0)
            if (items.length === 0) {
                event.preventDefault()
                panel.current.focus()
                return
            }
            const first = items[0]
            const last = items[items.length - 1]
            const current = document.activeElement
            const outside = !panel.current.contains(current)
            if (event.shiftKey && (current === first || current === panel.current || outside)) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && (current === last || outside)) {
                event.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            stack.splice(stack.indexOf(id), 1)
            if (--locked === 0) document.body.style.overflow = previousOverflow
            previouslyFocused?.focus()
        }
    }, [open, panel])
}
