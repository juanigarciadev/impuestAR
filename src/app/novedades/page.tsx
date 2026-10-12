import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { CHANGELOG } from "@/lib/changelog";
import { formatVerifiedAt } from "@/lib/services";

export default function Novedades() {
    return (
        <section className="flex flex-col gap-6 w-full animate-fade-up">
            <div className="flex items-center justify-between gap-3">
                <h1 className="font-bold text-lg dark:text-white">Novedades</h1>
                <ButtonLink href="/" color="secondary" icon={<ArrowLeft size={16} />}>Calculadora</ButtonLink>
            </div>

            <ol className="flex flex-col gap-6">
                {CHANGELOG.map(entry => (
                    <li key={entry.date} className="flex flex-col gap-2">
                        <time dateTime={entry.date} className="text-xs font-medium text-neutral-500">{formatVerifiedAt(entry.date)}</time>
                        <h2 className="font-semibold text-neutral-900 dark:text-white">{entry.title}</h2>
                        <ul className="flex flex-col gap-1.5 list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-300">
                            {entry.changes.map(change => <li key={change}>{change}</li>)}
                        </ul>
                    </li>
                ))}
            </ol>
        </section>
    )
}
