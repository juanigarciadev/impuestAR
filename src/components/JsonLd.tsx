// Datos estructurados (schema.org). Se escapa "<" para que el contenido no pueda cerrar el <script>.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
    const json = JSON.stringify(data).replace(/</g, "\u003c")
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
