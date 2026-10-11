import type { CSSProperties } from 'react'

/**
 * Brand color of the library.
 *
 * Every accent (selected tab, active page, focus rings, checked controls...) reads the CSS variable
 * `--blossom-accent`, which falls back to pink. Set it once for the whole site:
 *
 *   :root { --blossom-accent: #0f766e; --blossom-accent-contrast: #ffffff; }
 *
 * or on any parent element to change the accent of the components inside it. Components that
 * have a `color` prop set the variables for you, so you can also change one instance.
 */

/** Black or white, whichever reads better over a hex or rgb() color. Other CSS colors get white. */
export const readableOn = (color: string) => {
    // A CSS variable cannot be measured: the text on top of it uses the contrast variable of the accent.
    if (color.trim().startsWith('var(')) return 'var(--blossom-accent-contrast,#ffffff)'
    const hex = color.trim().replace('#', '')
    const full = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex
    const rgb = /^[0-9a-f]{6}$/i.test(full) ? [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16)) : color.match(/\d+/g)?.slice(0, 3).map(Number)
    if (!rgb || rgb.length < 3) return '#ffffff'
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 150 ? '#171717' : '#ffffff'
}

/** Style that makes an element, and everything inside it, use `color` as its accent. */
export const accentStyle = (color?: string, style?: CSSProperties): CSSProperties | undefined =>
    color && color !== 'accent'
        ? ({ '--blossom-accent': color, '--blossom-accent-contrast': readableOn(color), ...style } as CSSProperties)
        : style
