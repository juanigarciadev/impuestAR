export interface SkeletonProps {
    className?: string
}

/** A pulsing block. Give it a size with Tailwind classes, e.g. `h-4 w-40`. */
export const Skeleton = ({ className = '' }: SkeletonProps) => (
    <div aria-hidden='true' className={`animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-700 ${className}`} />
)

const lineWidths = ['w-60', 'w-72', 'w-52', 'w-64', 'w-80', 'w-48']

export interface SkeletonTextProps {
    /** Number of text lines under the title. */
    lines?: number
}

export const SkeletonText = ({ lines = 4 }: SkeletonTextProps) => (
    <div role='status' className='flex flex-col gap-2'>
        <Skeleton className='mb-2 h-4 w-40' />
        {Array.from({ length: lines }, (_, index) => (
            <Skeleton key={index} className={`h-3 ${lineWidths[index % lineWidths.length]}`} />
        ))}
        <span className='sr-only'>Loading...</span>
    </div>
)

export const SkeletonImage = () => (
    <div role='status' className='flex w-full animate-pulse items-center gap-4'>
        <div className='flex h-64 w-64 shrink-0 items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700'>
            <svg className='h-10 w-10 text-neutral-400 dark:text-neutral-600' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 18'>
                <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
            </svg>
        </div>
        <div className='flex flex-1 flex-col gap-2'>
            <Skeleton className='mb-2 h-4 w-40' />
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-4/5' />
            <Skeleton className='h-3 w-3/5' />
        </div>
        <span className='sr-only'>Loading...</span>
    </div>
)
