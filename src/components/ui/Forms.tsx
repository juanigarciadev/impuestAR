'use client'

import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type RefObject, type TextareaHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { accentStyle } from './accent'

type State = 'default' | 'success' | 'error'

export interface FieldProps {
    /** Marks the field as required: an asterisk is shown next to the label. */
    required?: boolean
    /** Accent color of this field: any CSS color. Without it the field uses `--blossom-accent`, which is pink by default. */
    color?: string
    label?: string
    /** Helper text shown under the field. */
    hint?: string
    /** Error message. Turns the field red. */
    error?: string
    /** Success message. Turns the field green. */
    success?: string
}

const stateOf = (error?: string, success?: string): State => (error ? 'error' : success ? 'success' : 'default')

const control: Record<State, string> = {
    default: 'border-neutral-300 text-neutral-900 focus:border-[var(--blossom-accent,#f472b6)] focus:ring-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_30%,transparent)] dark:border-neutral-700 dark:text-white',
    success: 'border-green-500 bg-green-50 text-green-900 focus:ring-green-500/30 dark:bg-green-900/20 dark:text-green-200',
    error: 'border-red-500 bg-red-50 text-red-900 focus:ring-red-500/30 dark:bg-red-900/20 dark:text-red-200',
}

const message: Record<State, string> = {
    default: 'text-neutral-500',
    success: 'text-green-700 dark:text-green-400',
    error: 'text-red-700 dark:text-red-400',
}

const base = 'w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60'

/** Label, control and message of every field. */
const Field = ({ id, label, hint, error, success, color, required, children }: FieldProps & { id: string; children: ReactNode }) => {
    const state = stateOf(error, success)
    const text = error ?? success ?? hint
    return (
        <div className='flex w-full flex-col gap-1' style={accentStyle(color)}>
            {label && <label htmlFor={id} className='text-sm font-medium text-neutral-800 dark:text-white'>{label}{required && <span aria-hidden='true' className='ml-0.5 text-red-600 dark:text-red-400'>*</span>}</label>}
            {children}
            {text && <span id={`${id}-message`} className={`text-xs ${message[state]}`}>{text}</span>}
        </div>
    )
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldProps {
    /** Icon shown inside the field, on the left. */
    icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, hint, error, success, color, icon, className = '', ...props }, ref) => {
    const id = useId()
    const state = stateOf(error, success)
    return (
        <Field id={id} label={label} hint={hint} error={error} success={success} color={color} required={props.required}>
            <div className='relative'>
                {icon && <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400'>{icon}</span>}
                <input
                    ref={ref}
                    id={id}
                    aria-invalid={state === 'error'}
                    aria-describedby={error ?? success ?? hint ? `${id}-message` : undefined}
                    className={`${base} ${control[state]} ${icon ? 'pl-10' : ''} ${className}`}
                    {...props}
                />
            </div>
        </Field>
    )
})
Input.displayName = 'Input'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, hint, error, success, color, className = '', rows = 4, ...props }, ref) => {
    const id = useId()
    const state = stateOf(error, success)
    return (
        <Field id={id} label={label} hint={hint} error={error} success={success} color={color} required={props.required}>
            <textarea ref={ref} id={id} rows={rows} aria-invalid={state === 'error'} aria-describedby={error ?? success ?? hint ? `${id}-message` : undefined} className={`${base} resize-none ${control[state]} ${className}`} {...props} />
        </Field>
    )
})
Textarea.displayName = 'Textarea'

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
    /** Image shown before the label, for example a flag. It is decorative: the label names the option. */
    image?: string
}

/** Small round image of an option. */
const optionImage = (src?: string) =>
    src ? <img src={src} alt='' aria-hidden='true' className='h-5 w-5 shrink-0 rounded-full bg-neutral-200 object-cover dark:bg-neutral-700' /> : null

interface Position {
    top: number
    left: number
    width: number
    /** Open upwards when there is not enough room below. */
    up: boolean
}

/**
 * Places a list under (or above) its anchor and closes it when the user clicks outside.
 * The list is `position: fixed`, so no parent with overflow can clip it.
 */
const useFloatingList = (open: boolean, close: () => void, anchor: RefObject<HTMLElement | null>, list: RefObject<HTMLElement | null>) => {
    const [position, setPosition] = useState<Position | null>(null)
    const closeRef = useRef(close)
    useEffect(() => {
        closeRef.current = close
    })

    useLayoutEffect(() => {
        if (!open) return
        const place = () => {
            const rect = anchor.current?.getBoundingClientRect()
            if (!rect) return
            const height = Math.min(list.current?.scrollHeight ?? 240, 240)
            const up = window.innerHeight - rect.bottom < height + 8 && rect.top > height + 8
            setPosition({ top: up ? rect.top - 4 : rect.bottom + 4, left: rect.left, width: rect.width, up })
        }
        place()
        window.addEventListener('resize', place)
        window.addEventListener('scroll', place, true)
        return () => {
            window.removeEventListener('resize', place)
            window.removeEventListener('scroll', place, true)
        }
    }, [open, anchor, list])

    useEffect(() => {
        if (!open) return
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node
            if (!anchor.current?.contains(target) && !list.current?.contains(target)) closeRef.current()
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [open, anchor, list])

    return position
}

/** A compact select keeps a readable list: at least `compactListWidth` wide and aligned to the right edge of its trigger. */
const compactListWidth = 224

// Local change: `compact` is not part of the library.
const listStyle = (position: Position, compact = false): CSSProperties => {
    const width = compact ? Math.max(position.width, compactListWidth) : position.width
    const left = compact ? Math.max(8, position.left + position.width - width) : position.left
    return { left, width, ...(position.up ? { bottom: window.innerHeight - position.top } : { top: position.top }) }
}

const listBox = 'fixed z-[80] max-h-60 overflow-auto rounded-xl border border-neutral-200 bg-white p-1 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900'

const chevron = (open: boolean, small = false) => (
    <svg className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'} shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
        <path strokeLinecap='round' strokeLinejoin='round' d='m6 9 6 6 6-6' />
    </svg>
)

const checkMark = (
    <svg className='h-4 w-4 text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_85%,black)]' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='3'>
        <path strokeLinecap='round' strokeLinejoin='round' d='m5 12 5 5L20 7' />
    </svg>
)

/** Index of the next enabled option starting after `from` in the direction of `step`. */
const nextEnabled = (options: SelectOption[], from: number, step: 1 | -1) => {
    for (let index = from + step; index >= 0 && index < options.length; index += step) {
        if (!options[index].disabled) return index
    }
    return from
}

export interface SelectProps extends FieldProps {
    options: SelectOption[]
    /** Controlled value. Use together with `onChange`. */
    value?: string
    /** Initial value when the select is uncontrolled. */
    defaultValue?: string
    onChange?: (value: string) => void
    placeholder?: string
    /** Adds a hidden input with this name so the value is sent with native forms. */
    name?: string
    disabled?: boolean
    className?: string
    /** Small pill-shaped trigger that is only as wide as its text. It shows the option value instead of its label. */
    compact?: boolean
}

/** A fully custom select: keyboard navigation, type to jump to an option and a list rendered in a portal. */
export const Select = ({ required, color, label, hint, error, success, options, value, defaultValue = '', onChange, placeholder = 'Select an option', name, disabled = false, className = '', compact = false }: SelectProps) => {
    const id = useId()
    const state = stateOf(error, success)
    const text = error ?? success ?? hint

    const [internal, setInternal] = useState(defaultValue)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(-1)

    const trigger = useRef<HTMLButtonElement>(null)
    const list = useRef<HTMLUListElement>(null)
    const typed = useRef({ text: '', timer: 0 })
    useEffect(() => () => window.clearTimeout(typed.current.timer), [])

    const close = useCallback(() => setOpen(false), [])
    const position = useFloatingList(open, close, trigger, list)

    const current = value ?? internal
    const selected = options.find((option) => option.value === current)

    const select = (option: SelectOption) => {
        if (option.disabled) return
        if (value === undefined) setInternal(option.value)
        onChange?.(option.value)
        setOpen(false)
        trigger.current?.focus()
    }

    const openList = (index?: number) => {
        if (disabled) return
        const selectedIndex = options.findIndex((option) => option.value === current)
        setActive(index ?? (selectedIndex >= 0 ? selectedIndex : nextEnabled(options, -1, 1)))
        setOpen(true)
    }

    // Keep the active option visible while moving with the keyboard.
    useEffect(() => {
        if (open && active >= 0) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' })
    }, [open, active, id])

    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        // While a name is being typed, the space belongs to it and does not choose the option.
        if (event.key === ' ' && typed.current.text) {
            event.preventDefault()
            window.clearTimeout(typed.current.timer)
            typed.current.text += ' '
            typed.current.timer = window.setTimeout(() => (typed.current.text = ''), 600)
            const match = options.findIndex((option) => !option.disabled && option.label.toLowerCase().startsWith(typed.current.text))
            if (match >= 0) {
                if (!open) openList(match)
                else setActive(match)
            }
            return
        }
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault()
                if (!open) return openList()
                setActive((index) => nextEnabled(options, index, event.key === 'ArrowDown' ? 1 : -1))
                break
            case 'Home':
            case 'End':
                if (open) {
                    event.preventDefault()
                    setActive(event.key === 'Home' ? nextEnabled(options, -1, 1) : nextEnabled(options, options.length, -1))
                }
                break
            case 'Enter':
            case ' ':
                event.preventDefault()
                if (!open) openList()
                else if (active >= 0) select(options[active])
                break
            case 'Escape':
                if (open) {
                    event.preventDefault()
                    setOpen(false)
                }
                break
            case 'Tab':
                setOpen(false)
                break
            default:
                // Type the first letters of an option to jump to it
                if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
                    window.clearTimeout(typed.current.timer)
                    typed.current.text += event.key.toLowerCase()
                    typed.current.timer = window.setTimeout(() => (typed.current.text = ''), 600)
                    const match = options.findIndex((option) => !option.disabled && option.label.toLowerCase().startsWith(typed.current.text))
                    if (match >= 0) {
                        if (!open) openList(match)
                        else setActive(match)
                    }
                }
        }
    }

    return (
        <div className={compact ? 'inline-flex' : 'flex w-full flex-col gap-1'} style={accentStyle(color)}>
            {label && <span id={`${id}-label`} onClick={() => trigger.current?.focus()} className='text-sm font-medium text-neutral-800 dark:text-white'>{label}{required && <span aria-hidden='true' className='ml-0.5 text-red-600 dark:text-red-400'>*</span>}</span>}
            <button
                ref={trigger}
                id={id}
                type='button'
                role='combobox'
                disabled={disabled}
                aria-haspopup='listbox'
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-labelledby={label ? `${id}-label ${id}` : undefined}
                aria-activedescendant={open && active >= 0 ? `${id}-option-${active}` : undefined}
                aria-invalid={state === 'error'}
                aria-required={required || undefined}
                aria-describedby={text ? `${id}-message` : undefined}
                onClick={() => (open ? setOpen(false) : openList())}
                onKeyDown={onKeyDown}
                className={compact
                    ? `flex w-fit items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-[var(--blossom-accent,#f472b6)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 ${className}`
                    : `${base} flex items-center justify-between gap-2 text-left focus:ring-2 ${open ? 'ring-2' : ''} ${control[state]} ${className}`}
            >
                <span className={`flex min-w-0 items-center gap-2 ${selected ? (compact ? '' : 'text-neutral-900 dark:text-white') : 'text-neutral-400'}`}>
                    {optionImage(selected?.image)}
                    <span className='truncate'>{selected ? (compact ? selected.value : selected.label) : placeholder}</span>
                </span>
                {chevron(open, compact)}
            </button>
            {name && <input type='hidden' name={name} value={current} />}
            {text && <span id={`${id}-message`} className={`text-xs ${message[state]}`}>{text}</span>}
            {open && position && createPortal(
                <ul ref={list} id={`${id}-list`} role='listbox' aria-labelledby={label ? `${id}-label` : undefined} className={listBox} style={accentStyle(color, listStyle(position, compact))}>
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            id={`${id}-option-${index}`}
                            role='option'
                            aria-selected={option.value === current}
                            aria-disabled={option.disabled}
                            onPointerEnter={() => !option.disabled && setActive(index)}
                            onClick={() => select(option)}
                            className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 ${option.disabled ? 'cursor-not-allowed opacity-40' : ''} ${index === active ? 'bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_18%,transparent)] text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,black)] dark:bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_20%,transparent)] dark:text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,white)]' : 'text-neutral-800 dark:text-neutral-200'}`}
                        >
                            <span className='flex min-w-0 items-center gap-2'>
                                {optionImage(option.image)}
                                <span className='truncate'>{option.label}</span>
                            </span>
                            {option.value === current && checkMark}
                        </li>
                    ))}
                </ul>,
                document.body
            )}
        </div>
    )
}

export interface MultiSelectProps extends FieldProps {
    /** Text shown when the search does not match any option. */
    noResultsLabel?: string
    options: SelectOption[]
    /** Controlled list of selected values. Use together with `onChange`. */
    value?: string[]
    defaultValue?: string[]
    onChange?: (value: string[]) => void
    placeholder?: string
    /** Adds one hidden input per selected value so they are sent with native forms. */
    name?: string
    /** Maximum number of values that can be selected. */
    max?: number
    disabled?: boolean
    className?: string
}

/** Select several options. Selected values are shown as chips and the text field filters the list. */
export const MultiSelect = ({ required, noResultsLabel = 'No results', color, label, hint, error, success, options, value, defaultValue = [], onChange, placeholder = 'Select options', name, max, disabled = false, className = '' }: MultiSelectProps) => {
    const id = useId()
    const state = stateOf(error, success)
    const text = error ?? success ?? hint

    const [internal, setInternal] = useState<string[]>(defaultValue)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(0)
    const [query, setQuery] = useState('')

    const field = useRef<HTMLDivElement>(null)
    const input = useRef<HTMLInputElement>(null)
    const list = useRef<HTMLUListElement>(null)

    const close = useCallback(() => {
        setOpen(false)
        setQuery('')
    }, [])
    const position = useFloatingList(open, close, field, list)

    const current = value ?? internal
    const filtered = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))
    const limitReached = max !== undefined && current.length >= max

    const update = (next: string[]) => {
        if (value === undefined) setInternal(next)
        onChange?.(next)
    }

    const toggle = (option: SelectOption) => {
        if (option.disabled) return
        if (current.includes(option.value)) update(current.filter((item) => item !== option.value))
        else if (!limitReached) update([...current, option.value])
        setQuery('')
        input.current?.focus()
    }

    useEffect(() => {
        if (open && filtered[active]) document.getElementById(`${id}-option-${filtered[active].value}`)?.scrollIntoView({ block: 'nearest' })
    }, [open, active, filtered, id])

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault()
                if (!open) setOpen(true)
                else setActive((index) => nextEnabled(filtered, index, event.key === 'ArrowDown' ? 1 : -1))
                break
            case 'Enter':
                event.preventDefault()
                if (open && filtered[active]) toggle(filtered[active])
                else setOpen(true)
                break
            case 'Backspace':
                if (!query && current.length) update(current.slice(0, -1))
                break
            case 'Escape':
                if (open) {
                    event.preventDefault()
                    close()
                }
                break
            case 'Tab':
                close()
                break
        }
    }

    return (
        <div className='flex w-full flex-col gap-1' style={accentStyle(color)}>
            {label && <label id={`${id}-label`} htmlFor={id} className='text-sm font-medium text-neutral-800 dark:text-white'>{label}{required && <span aria-hidden='true' className='ml-0.5 text-red-600 dark:text-red-400'>*</span>}</label>}
            <div
                ref={field}
                onClick={() => {
                    if (disabled) return
                    input.current?.focus()
                    setOpen((prev) => !prev)
                }}
                className={`${base} flex min-h-[44px] cursor-text flex-wrap items-center gap-1.5 py-1.5 ${disabled ? 'cursor-not-allowed opacity-60' : ''} focus-within:ring-2 ${open ? 'ring-2' : ''} ${control[state]} ${className}`}
            >
                {current.map((item) => {
                    const option = options.find((candidate) => candidate.value === item)
                    return (
                        <span key={item} className='flex items-center gap-1 rounded-lg bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_18%,transparent)] py-1 pl-2 pr-1 text-xs font-medium text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,black)] dark:bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_20%,transparent)] dark:text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,white)]'>
                            {option?.label ?? item}
                            <button
                                type='button'
                                disabled={disabled}
                                aria-label={`Remove ${option?.label ?? item}`}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    update(current.filter((candidate) => candidate !== item))
                                }}
                                className='rounded-lg p-0.5 hover:bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_28%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_30%,transparent)]'
                            >
                                <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' aria-hidden='true'><path d='M6 6l12 12M18 6 6 18' /></svg>
                            </button>
                        </span>
                    )
                })}
                <input
                    ref={input}
                    id={id}
                    role='combobox'
                    aria-describedby={text || max !== undefined ? `${id}-message` : undefined}
                    aria-expanded={open}
                    aria-controls={`${id}-list`}
                    aria-autocomplete='list'
                    aria-activedescendant={open && filtered[active] ? `${id}-option-${filtered[active].value}` : undefined}
                    aria-invalid={state === 'error'}
                    autoComplete='off'
                    disabled={disabled}
                    value={query}
                    placeholder={current.length ? '' : placeholder}
                    onChange={(event) => {
                        setQuery(event.target.value)
                        setActive(0)
                        setOpen(true)
                    }}
                    onKeyDown={onKeyDown}
                    className='min-w-[80px] flex-1 bg-transparent py-0.5 text-sm text-neutral-900 outline-none dark:text-white placeholder:text-neutral-400'
                />
                {chevron(open)}
            </div>
            {name && current.map((item) => <input key={item} type='hidden' name={name} value={item} />)}
            {(text || max !== undefined) && (
                <span id={`${id}-message`} className={`flex justify-between text-xs ${message[state]}`}>
                    <span>{text}</span>
                    {max !== undefined && <span>{current.length}/{max}</span>}
                </span>
            )}
            {open && position && createPortal(
                <ul ref={list} id={`${id}-list`} role='listbox' aria-multiselectable='true' aria-labelledby={label ? `${id}-label` : undefined} className={listBox} style={accentStyle(color, listStyle(position))}>
                    {filtered.length === 0 && <li className='px-3 py-2 text-neutral-500'>{noResultsLabel}</li>}
                    {filtered.map((option, index) => {
                        const checked = current.includes(option.value)
                        const blocked = option.disabled || (!checked && limitReached)
                        return (
                            <li
                                key={option.value}
                                id={`${id}-option-${option.value}`}
                                role='option'
                                aria-selected={checked}
                                aria-disabled={blocked}
                                onPointerEnter={() => !blocked && setActive(index)}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => !blocked && toggle(option)}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${blocked ? 'cursor-not-allowed opacity-40' : ''} ${index === active ? 'bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_18%,transparent)] text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,black)] dark:bg-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_20%,transparent)] dark:text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_45%,white)]' : 'text-neutral-800 dark:text-neutral-200'}`}
                            >
                                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border-2 ${checked ? 'border-[var(--blossom-accent,#f472b6)] bg-[var(--blossom-accent,#f472b6)] text-[var(--blossom-accent-contrast,#fff)]' : 'border-neutral-300 dark:border-neutral-600'}`}>
                                    {checked && (
                                        <svg className='h-2.5 w-2.5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='4'><path strokeLinecap='round' strokeLinejoin='round' d='m5 12 5 5L20 7' /></svg>
                                    )}
                                </span>
                                {option.label}
                            </li>
                        )
                    })}
                </ul>,
                document.body
            )}
        </div>
    )
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string
    /** Smaller text under the label. */
    description?: string
    /** Shows a dash instead of the check, for "some selected" states. */
    indeterminate?: boolean
    /** Error message. It is shown in red under the label and marks the checkbox as invalid. */
    error?: string
}

/** The native input is hidden but still receives focus, keyboard and form events. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, description, indeterminate = false, error, color, className = '', ...props }, ref) => {
    const inner = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (inner.current) inner.current.indeterminate = indeterminate
    }, [indeterminate])

    return (
        <label className='group inline-flex cursor-pointer items-start gap-3 text-sm [&:has(:disabled)]:cursor-not-allowed [&:has(:disabled)]:opacity-60' style={accentStyle(color)}>
            <input
                ref={(node) => {
                    inner.current = node
                    if (typeof ref === 'function') ref(node)
                    else if (ref) ref.current = node
                }}
                type='checkbox'
                aria-invalid={Boolean(error) || undefined}
                className={`peer sr-only ${className}`}
                {...props}
            />
            <span data-error={Boolean(error)} className='data-[error=true]:!border-red-500 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-neutral-300 bg-white text-transparent transition-colors group-hover:border-[var(--blossom-accent,#f472b6)] peer-checked:border-[var(--blossom-accent,#f472b6)] peer-checked:bg-[var(--blossom-accent,#f472b6)] peer-checked:text-white peer-indeterminate:border-[var(--blossom-accent,#f472b6)] peer-indeterminate:bg-[var(--blossom-accent,#f472b6)] peer-indeterminate:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_50%,transparent)] dark:border-neutral-600 dark:bg-neutral-900'>
                {indeterminate ? (
                    <svg className='h-3 w-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='4'><path strokeLinecap='round' d='M6 12h12' /></svg>
                ) : (
                    <svg className='h-3 w-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='4'><path strokeLinecap='round' strokeLinejoin='round' d='m5 12 5 5L20 7' /></svg>
                )}
            </span>
            <span className='flex flex-col'>
                <span className='text-neutral-800 dark:text-white'>{label}{props.required && <span aria-hidden='true' className='ml-0.5 text-red-600 dark:text-red-400'>*</span>}</span>
                {description && <span className='text-xs text-neutral-500'>{description}</span>}
                {error && <span role='alert' className='text-xs text-red-700 dark:text-red-400'>{error}</span>}
            </span>
        </label>
    )
})
Checkbox.displayName = 'Checkbox'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string
    description?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ label, description, color, className = '', ...props }, ref) => (
    <label className='group inline-flex cursor-pointer items-start gap-3 text-sm [&:has(:disabled)]:cursor-not-allowed [&:has(:disabled)]:opacity-60' style={accentStyle(color)}>
        <input ref={ref} type='radio' className={`peer sr-only ${className}`} {...props} />
        <span className="relative mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-neutral-300 bg-white transition-colors after:absolute after:left-1/2 after:top-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-0 after:rounded-full after:bg-[var(--blossom-accent,#f472b6)] after:transition-transform after:content-[''] group-hover:border-[var(--blossom-accent,#f472b6)] peer-checked:border-[var(--blossom-accent,#f472b6)] peer-checked:after:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_50%,transparent)] dark:border-neutral-600 dark:bg-neutral-900" />
        <span className='flex flex-col'>
            <span className='text-neutral-800 dark:text-white'>{label}</span>
            {description && <span className='text-xs text-neutral-500'>{description}</span>}
        </span>
    </label>
))
Radio.displayName = 'Radio'

export interface RadioGroupOption {
    value: string
    label: string
    description?: string
    disabled?: boolean
}

export interface RadioGroupProps extends FieldProps {
    name: string
    options: RadioGroupOption[]
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    direction?: 'vertical' | 'horizontal'
}

/** A set of radios that share a name and report the chosen value. */
export const RadioGroup = ({ required, color, name, label, hint, error, success, options, value, defaultValue = '', onChange, direction = 'vertical' }: RadioGroupProps) => {
    const id = useId()
    const [internal, setInternal] = useState(defaultValue)
    const current = value ?? internal
    const state = stateOf(error, success)
    const text = error ?? success ?? hint

    return (
        <div role='radiogroup' aria-required={required || undefined} aria-labelledby={label ? `${id}-label` : undefined} aria-describedby={text ? `${id}-message` : undefined} className='flex flex-col gap-2' style={accentStyle(color)}>
            {label && <span id={`${id}-label`} className='text-sm font-medium text-neutral-800 dark:text-white'>{label}{required && <span aria-hidden='true' className='ml-0.5 text-red-600 dark:text-red-400'>*</span>}</span>}
            <div className={`flex gap-3 ${direction === 'vertical' ? 'flex-col' : 'flex-wrap gap-6'}`}>
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        name={name}
                        value={option.value}
                        label={option.label}
                        description={option.description}
                        disabled={option.disabled}
                        checked={current === option.value}
                        onChange={() => {
                            if (value === undefined) setInternal(option.value)
                            onChange?.(option.value)
                        }}
                    />
                ))}
            </div>
            {text && <span id={`${id}-message`} className={`text-xs ${message[state]}`}>{text}</span>}
        </div>
    )
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> {
    label: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ label, color, className = '', ...props }, ref) => (
    <label className='inline-flex cursor-pointer items-center gap-3 text-sm text-neutral-800 dark:text-white' style={accentStyle(color)}>
        <input ref={ref} type='checkbox' role='switch' className={`peer sr-only ${className}`} {...props} />
        <span className="relative h-6 w-11 rounded-full bg-neutral-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-[var(--blossom-accent,#f472b6)] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_50%,transparent)] peer-disabled:opacity-60 dark:bg-neutral-700" />
        {label}
    </label>
))
Switch.displayName = 'Switch'
