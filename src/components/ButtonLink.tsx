import Link from "next/link"
import type { AnchorHTMLAttributes, ReactNode } from "react"

// Enlace con la apariencia de los botones de BlossomUI (la librería no incluye un ButtonLink).
const colors = {
    primary: "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
    secondary: "border border-neutral-300 bg-transparent hover:bg-neutral-200 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-800",
    default: "bg-blue-700 text-white hover:bg-blue-800",
}

interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> {
    href: string
    color?: keyof typeof colors
    icon?: ReactNode
}

export const ButtonLink = ({ href, color = "primary", icon, className = "", children, ...props }: ButtonLinkProps) => (
    <Link
        href={href}
        className={`flex w-fit select-none items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blossom-accent,#1d4ed8)] ${colors[color]} ${className}`}
        {...props}
    >
        {icon}
        {children}
    </Link>
)
