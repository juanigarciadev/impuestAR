import Link from "next/link"

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 w-full py-16 text-center">
      <h1 className="text-xl font-bold dark:text-white">Página no encontrada</h1>
      <p className="text-sm text-neutral-500">La página que buscás no existe o fue movida.</p>
      <Link href="/" className="border border-neutral-300 rounded-lg px-6 py-3 text-sm text-neutral-500 hover:bg-neutral-100 duration-200 dark:border-neutral-700 dark:hover:bg-neutral-800">
        Volver al inicio
      </Link>
    </section>
  )
}
