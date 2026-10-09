"use client"
import { useEffect, useRef, useState } from "react"

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

// Anima el valor mostrado desde el anterior hasta el nuevo. Respeta prefers-reduced-motion.
export default function AnimatedNumber({ value, duration = 500, decimals = 0, format }: { value: number; duration?: number; decimals?: number; format: (n: number) => string }) {
    const [display, setDisplay] = useState(value)
    const current = useRef(value)

    useEffect(() => {
        const from = current.current
        if (from === value) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            current.current = value
            setDisplay(value)
            return
        }
        let frame: number
        const start = performance.now()
        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const factor = 10 ** decimals
            const next = Math.round((from + (value - from) * easeOutCubic(progress)) * factor) / factor
            current.current = next
            setDisplay(next)
            if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [value, duration, decimals])

    return <>{format(display)}</>
}
