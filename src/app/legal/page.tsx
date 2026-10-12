import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { AUTHOR_NAME, CONTACT_EMAIL, REPO_URL, SITE_NAME } from "@/lib/site";

const h2 = "font-semibold text-neutral-900 dark:text-white"
const link = "underline underline-offset-2"
const list = "flex flex-col gap-1 list-disc pl-5"

export default function Legal() {
    return (
        <article className="flex flex-col gap-6 w-full text-sm text-neutral-600 dark:text-neutral-300 animate-fade-up">
            <div className="flex items-center justify-between gap-3">
                <h1 className="font-bold text-lg dark:text-white">Aviso legal y privacidad</h1>
                <ButtonLink href="/" color="secondary" icon={<ArrowLeft size={16} />}>Calculadora</ButtonLink>
            </div>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Quién está detrás</h2>
                <p>
                    {SITE_NAME} es un proyecto personal, gratuito y de código abierto ({" "}
                    <a href={REPO_URL} className={link} target="_blank" rel="noopener noreferrer">GitHub</a>
                    ), a cargo de <strong>{AUTHOR_NAME}</strong>. Contacto: <a href={`mailto:${CONTACT_EMAIL}`} className={link}>{CONTACT_EMAIL}</a>.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Alcance de la información</h2>
                <ul className={list}>
                    <li>Los cálculos son <strong>orientativos</strong>. No constituyen asesoramiento fiscal, contable, legal ni financiero.</li>
                    <li>Las cotizaciones provienen de un tercero (DolarApi) y las alícuotas se revisan periódicamente, pero pueden cambiar o contener errores. El total real que cobre tu banco o la plataforma puede ser distinto.</li>
                    <li>No hay garantía de exactitud ni de disponibilidad del servicio. Verificá siempre tu resumen de tarjeta y la normativa vigente antes de tomar una decisión.</li>
                    <li>{SITE_NAME} no está afiliado, patrocinado ni avalado por ARCA, por el BCRA, por ninguna provincia ni por las plataformas que se mencionan.</li>
                </ul>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Enlaces de referido</h2>
                <p>
                    Algunos botones, como los de la <Link href="/arq" className={link}>tarjeta de ARQ</Link>, usan un enlace de referido. Si te registrás con él, {SITE_NAME} puede recibir una compensación, sin costo adicional para vos. La comparación con ARQ es una estimación y no es una oferta de ARQ: las condiciones, comisiones y beneficios los define y puede cambiarlos ARQ, y se confirman en su app. Los enlaces de referido llevan el atributo <code>sponsored</code>.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className={h2}>Marcas y contenidos de terceros</h2>
                <p>
                    Los nombres y logos de servicios y plataformas (por ejemplo Netflix, Spotify, Steam o ARQ) pertenecen a sus respectivos titulares y se usan solo para identificarlos. Si sos titular de una marca y querés que se retire o se corrija, escribinos.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className={h2}>Política de privacidad</h2>
                <p>
                    Esta política explica qué datos trata {SITE_NAME}, en línea con la Ley 25.326 de Protección de los Datos Personales de la República Argentina.
                </p>

                <h3 className="font-medium text-neutral-900 dark:text-white">Qué datos se tratan y para qué</h3>
                <ul className={list}>
                    <li>
                        <strong>Formulario &ldquo;Solicitar una revisión&rdquo;:</strong> el mensaje que escribas y, si lo querés, tu mail. Se usan solo para leer tu pedido y, si dejaste mail, responderte. No se guardan en una base propia: llegan por correo al responsable.
                    </li>
                    <li>
                        <strong>Dirección IP:</strong> se usa de forma temporal para limitar los envíos y evitar abusos del formulario. Además, el hosting registra datos técnicos de las visitas.
                    </li>
                    <li>
                        <strong>Preferencias en tu navegador:</strong> el tema (claro/oscuro) y tus ajustes de impuestos se guardan en el almacenamiento local de tu navegador. No salen de tu dispositivo, no se usan para identificarte y no se usan cookies de seguimiento ni herramientas de analítica.
                    </li>
                </ul>

                <h3 className="font-medium text-neutral-900 dark:text-white">Con quién se comparten</h3>
                <ul className={list}>
                    <li>
                        <strong>Resend</strong> (servicio de envío de correo, con servidores en Estados Unidos) recibe el mensaje y el mail para entregarlo al responsable. Al enviar el formulario aceptás esta transferencia internacional de datos.
                    </li>
                    <li>
                        <strong>Vercel</strong> aloja el sitio y procesa las solicitudes.
                    </li>
                    <li>
                        <strong>Terceros que reciben tu IP al cargar la página:</strong> DolarApi (cotizaciones) y los servicios que alojan las imágenes y logos (por ejemplo Cloudinary, Wikimedia, Google y otros CDN).
                    </li>
                </ul>

                <h3 className="font-medium text-neutral-900 dark:text-white">Tus derechos</h3>
                <p>
                    Podés pedir acceso, rectificación o supresión de tus datos escribiendo a <a href={`mailto:${CONTACT_EMAIL}`} className={link}>{CONTACT_EMAIL}</a>. Tené en cuenta que, como los mensajes no se almacenan en una base propia, la supresión se limita a lo que conste en la casilla de correo del responsable.
                </p>
                <p className="text-xs text-neutral-500">
                    El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
                </p>
            </section>
        </article>
    )
}
