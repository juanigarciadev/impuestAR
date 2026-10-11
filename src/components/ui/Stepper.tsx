'use client'

import type { ReactNode } from 'react'
import { accentStyle } from './accent'

export interface Step {
    title: string
    /** Short text under the title (vertical orientation only). */
    description?: ReactNode
    /** Extra content shown under the step, such as a code block or a form (vertical orientation only). */
    content?: ReactNode
}

export interface StepperProps {
    /** Accent color of this component: any CSS color. Without it the component uses `--blossom-accent`, which is pink by default. */
    color?: string
    steps: Step[]
    /** Index of the current step, starting at 0. Previous steps are shown as completed. */
    current: number
    orientation?: 'horizontal' | 'vertical'
    /** Shows every step numbered and highlighted without tracking progress. Useful for instructions. */
    numbered?: boolean
    /** Makes the completed steps clickable so the user can go back. */
    onStepClick?: (index: number) => void
}

const check = (
    <svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='3'>
        <path strokeLinecap='round' strokeLinejoin='round' d='m5 12 5 5L20 7' />
    </svg>
)

export const Stepper = ({ color, steps, current, orientation = 'horizontal', numbered = false, onStepClick }: StepperProps) => {
    const vertical = orientation === 'vertical'

    return (
        <ol className={`flex w-full text-sm ${vertical ? 'flex-col' : 'items-center'}`} style={accentStyle(color)}>
            {steps.map((step, index) => {
                const done = !numbered && index < current
                const active = numbered || index === current
                const last = index === steps.length - 1
                const clickable = done && onStepClick

                const circle = (
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium ${done
                            ? 'bg-[var(--blossom-accent,#f472b6)] text-[var(--blossom-accent-contrast,#fff)]'
                            : active
                                ? 'border-2 border-[var(--blossom-accent,#f472b6)] bg-white text-[color-mix(in_srgb,var(--blossom-accent,#f472b6)_85%,black)] dark:bg-[#222222]'
                                : 'border-2 border-neutral-300 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-[#222222]'}`}
                    >
                        {done ? check : index + 1}
                    </span>
                )

                const text = (
                    <span className='flex flex-col text-left'>
                        <span className={`font-medium ${done || active ? 'dark:text-white' : 'text-neutral-500'} ${vertical ? '' : 'max-[640px]:hidden'}`}>{step.title}</span>
                        {vertical && step.description && <span className='text-neutral-500'>{step.description}</span>}
                    </span>
                )

                const content = clickable ? (
                    <button type='button' onClick={() => onStepClick(index)} className={`flex gap-3 rounded-xl ${vertical ? 'items-start' : 'items-center'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--blossom-accent,#f472b6)]`}>
                        {circle}
                        {text}
                    </button>
                ) : (
                    <div className={`flex gap-3 ${vertical ? 'items-start' : 'items-center'}`}>
                        {circle}
                        {text}
                    </div>
                )

                return (
                    <li
                        key={`${step.title}-${index}`}
                        aria-current={active && !numbered ? 'step' : undefined}
                        className={vertical ? `relative flex flex-col ${last ? '' : 'pb-8'}` : `flex items-center ${last ? '' : 'w-full'}`}
                    >
                        {content}
                        {vertical && step.content && <div className='min-w-0 pl-11 pt-2'>{step.content}</div>}
                        {!last && (
                            <span
                                aria-hidden='true'
                                className={`${vertical ? 'absolute left-4 top-8 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2' : 'mx-3 h-0.5 flex-1'} ${done ? 'bg-[var(--blossom-accent,#f472b6)]' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                            />
                        )}
                    </li>
                )
            })}
        </ol>
    )
}

export interface StepperProgressProps {
    /** Texts of the component. Pass only the ones you want to change, for example to translate it. */
    labels?: { step?: (current: number, total: number) => string }
    /** Accent color of this component: any CSS color. Without it the component uses `--blossom-accent`, which is pink by default. */
    color?: string
    total: number
    current: number
    label?: string
}

/** A compact stepper made of segments. */
export const StepperProgress = ({ labels, color, total, current, label }: StepperProgressProps) => (
    <div className='w-full' style={accentStyle(color)}>
        <div className='mb-2 flex justify-between text-sm'>
            <span className='font-medium dark:text-white'>{labels?.step ? labels.step(current + 1, total) : `Step ${current + 1} of ${total}`}</span>
            {label && <span className='text-neutral-500'>{label}</span>}
        </div>
        <ol className='grid gap-2' style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
            {Array.from({ length: total }, (_, index) => (
                <li key={index} aria-current={index === current ? 'step' : undefined} className={`h-2 rounded-full ${index <= current ? 'bg-[var(--blossom-accent,#f472b6)]' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
            ))}
        </ol>
    </div>
)
